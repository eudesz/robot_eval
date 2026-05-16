"""Shared MLX hand-mention evaluation (text-only). Used by CLI and local HTTP server."""

from __future__ import annotations

import json
import re
from typing import Any

MLX_HAND_SYSTEM = """You are a semantic QA reviewer for Zion video phase captions in English.

You ONLY see JSON with per-phase `caption` and optional `visual_evidence` strings. Judge TEXT ONLY — do not infer what happened in the video beyond what is written.

## Goal (per phase)
For each phase that has any non-empty text (`caption` or `visual_evidence`), decide whether the text semantically accounts for both hands being involved in that phase.

Zion requires that both hands are accounted for in the wording. Use semantic judgment, not simple keyword matching.

## PASS
Mark `mentions_both_hands_semantically` true when the text reasonably communicates that both hands are involved. This includes explicit left/right wording and natural generic wording:
- Explicit sides: "left hand" and "right hand" in any order; minor typos or hyphenation are fine.
- Nonstandard plural sides ("left hands", "right hands") are grammar/style errors, but for this semantic eval they still count as the left/right hand side.
- Clear shorthand is allowed only when the omitted word is clearly "hand" in the same local clause, e.g. "the right hand holds the cup while the left steadies it" means right hand + left hand.
- Generic plural/both wording: "hands", "both hands", "with both hands", "each hand", "the left and right hands".
- Bare "both" can PASS only when the nearest local subject is clearly hands, e.g. "both close the lid" after "the hands" or "left/right hands" have just been introduced in the same phase.
- Idle/resting hands count as accounted for when explicitly tied to a side, e.g. "the right hand works while the left hand is idle" or "the left remains idle" after a hand context.
- One phrase or several clauses inside the same phase may establish the meaning. If the local context clearly points to both hands doing the same action, PASS even without separate left/right details.

## FAIL (mentions_both_hands_semantically = false)
- Only left OR only right (even if repeated): e.g. "the left hand ... while the left hand ..." -> mentions_left true, mentions_right false -> FAIL.
- Singular / one-sided generic wording: "one hand", "the hand", "a hand" when it does not also mention another hand or both hands.
- Direction or side wording does NOT count as a hand: "turns to the left", "moves to the right", "right side", "left compartment", "right sleeve", "right corner", "right door", "left door".
- Body/arm/posture wording does NOT count as hands: "walks", "turns", "body", "arms", "both arms", "hangs idle" unless the text explicitly ties it to a hand.
- Bare "both" does NOT pass when it could refer to arms, objects, doors, sides, pieces, or anything other than hands.
- Empty caption AND empty visual_evidence → skip: set mentions_both_hands_semantically false, mentions_left false, mentions_right false, reason "empty_phase".

## Do NOT
- Invent hands not in the text.
- PASS a phase because hands appear somewhere else in the task; judge each phase on its own text.
- Treat duplicate mentions of the SAME side as satisfying both sides.
- Give only video-level feedback. The useful feedback must be attached to each phase/segment.

## Important examples
- FAIL: "Right hand reaches ... as the body turns to the left." The word "left" is direction/body movement, not left hand.
- FAIL: "The right hand folds the right sleeve." The second "right" describes the sleeve, not the left hand.
- FAIL: "Both arms hang above the box." Arms are not hands.
- PASS: "The right hand holds the cup while the left steadies it." Here "the left" clearly abbreviates "the left hand".
- PASS: "The right hand places the cup while the left hand is idle." The idle hand is still explicitly accounted for.
- PASS: "The right hand places the cup while the left remains idle." Here "the left" abbreviates "left hand" because the local clause is about hands.
- PASS: "The left hands hold the cup while the right hand steadies it." Treat "left hands" as a grammar/style issue, not as missing the left side.
- PASS: "Hands approach the window frame." Plural "hands" means both hands unless the text says otherwise.

## Evidence
For every phase, `reason` must briefly explain that phase's decision and quote or paraphrase the exact text evidence when possible. For failures, explicitly state what is missing, e.g. "Only 'left hand' is mentioned; no right hand, hands, both, or each-hand wording." Do not write generic video-level reasons like "hands are mentioned throughout the video".

## Task-level rollup
- `all_nonempty_phases_mention_both_hands`: true only if EVERY phase/segment with any text passes (mentions_both_hands_semantically true). Phases with no text do not count as failures.
- `rationale` must be a short rollup of the per-phase decisions, mentioning failed `phase_index` / `segment_id` values when any phase fails.

## Output
Return ONE JSON object only (no markdown fences), exactly these keys:
{
  "all_nonempty_phases_mention_both_hands": bool,
  "confidence": "high" | "medium" | "low",
  "phases": [
    {
      "phase_index": number,
      "segment_id": string | null,
      "mentions_left": bool,
      "mentions_right": bool,
      "mentions_both_hands_semantically": bool,
      "reason": string
    }
  ],
  "rationale": string
}
"""


def build_user_text_from_final_annotation(fa: dict[str, Any]) -> str:
    phases_in = fa.get("phase_captions") or []
    phases_out: list[dict[str, Any]] = []
    for i, p in enumerate(phases_in):
        if not isinstance(p, dict):
            continue
        phases_out.append(
            {
                "phase_index": p.get("phase_index", i),
                "segment_id": p.get("segment_id"),
                "caption": (p.get("caption") or "").strip(),
                "visual_evidence": (p.get("visual_evidence") or "").strip(),
            }
        )
    payload = {
        "task_name": fa.get("task_name"),
        "uuid": fa.get("uuid"),
        "phases": phases_out,
    }
    return json.dumps(payload, ensure_ascii=False, indent=2)


def extract_json_object(text: str) -> dict[str, Any]:
    t = text.strip()
    if t.startswith("```"):
        t = re.sub(r"^```[a-zA-Z0-9]*\s*\n?", "", t)
        t = re.sub(r"\n?```\s*$", "", t).strip()
    s = t.find("{")
    e = t.rfind("}")
    if s < 0 or e <= s:
        raise ValueError(f"No JSON object in model output:\n---\n{text[:2000]}\n---")
    candidate = t[s : e + 1]
    try:
        return json.loads(candidate)
    except json.JSONDecodeError:
        # Small local models often omit commas between pretty-printed JSON fields/objects.
        repaired = re.sub(r'([}\]"0-9e])\s*\n\s*(")', r"\1,\n\2", candidate)
        repaired = re.sub(r"(})\s*\n\s*({)", r"\1,\n\2", repaired)
        return json.loads(repaired)


def run_hand_mention_mlx(
    model: Any,
    tokenizer: Any,
    final_annotation: dict[str, Any],
    *,
    max_tokens: int = 512,
    temp: float = 0.0,
) -> dict[str, Any]:
    from mlx_lm import generate
    from mlx_lm.sample_utils import make_sampler

    user_text = build_user_text_from_final_annotation(final_annotation)
    messages = [
        {"role": "system", "content": MLX_HAND_SYSTEM},
        {"role": "user", "content": user_text},
    ]
    if getattr(tokenizer, "chat_template", None):
        prompt = tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True,
        )
    else:
        prompt = MLX_HAND_SYSTEM + "\n\n" + user_text + "\n\nAssistant:\n"

    out_text = generate(
        model,
        tokenizer,
        prompt=prompt,
        max_tokens=max_tokens,
        sampler=make_sampler(temp),
        verbose=False,
    )
    return extract_json_object(out_text)
