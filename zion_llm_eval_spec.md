# Zion LLM Eval Spec: Final Annotation Internal Consistency Judge

## 1. Purpose

This document specifies how to implement the LLM-based evaluation layer for Zion final annotations.

The current app already runs deterministic EVALs over `final_annotations`, such as overlaps, gaps, timestamp format, schema integrity, object reference checks, and Zion language-policy keyword checks. The LLM eval is the next layer, but it must run **only after deterministic gating**. Tasks that fail deterministic EVALs should not be sent to the LLM by default. The LLM should inspect only tasks that pass deterministic checks and should focus on semantic incoherences that deterministic rules cannot reliably catch.

The LLM must evaluate **only the data in the final annotation**. It must **not watch the video**, must **not infer visual truth beyond the text**, and must **not decide whether the annotation is visually correct**. Its role is to detect whether the final annotation contradicts itself, has illogical action flow, violates Zion captioning conventions, or contains suspicious semantic inconsistencies.

## 2. Core Principle

The LLM judge answers this question:

> Given only the final annotation JSON, is the annotation internally coherent and consistent enough to be trusted for review prioritization?

It must not answer:

> Did this action actually happen in the video?

That distinction is critical. The LLM judge can flag likely issues, but every issue should be framed as **needs review**, not as definitive ground truth.

## 3. Existing Project Context

### Dataset

Input CSV:

```text
/Users/eudesz/Documents/Micro1/Zion_pilot/Evals/juno_zion_tasks_export_2026-05-01_to_2026-05-11.csv
```

Important columns:

- `task_id`
- `client_folder_name`
- `status`
- `client_annotations`
- `segment_verdicts`
- `video_flags`
- `error_categories`
- `final_annotations`
- `actual_video_duration`
- `trainer_user_id`
- `reviewer_user_id`
- `review_score`
- `review_comments`
- `date_created`
- `date_updated`

### Final Annotation Shape

`final_annotations` is a JSON string in the CSV. Parsed shape:

```json
{
  "duration_secs": 146.84,
  "object_consistency_notes": [],
  "object_inventory": [
    {
      "canonical_name": "yellow napkin",
      "first_appearance": "00:00.000",
      "visual_description": "yellow square fabric napkin"
    }
  ],
  "pipeline": "v42_31_batch_2",
  "short": "f7d9b126",
  "task_name": "fold and place table napkins",
  "uuid": "f7d9b126-1357-4d84-a3c4-e47dab35becf",
  "phase_captions": [
    {
      "caption": "Both hands reach for and pick up a yellow napkin...",
      "covered_markers": ["segment:0", "segment:1"],
      "end": "00:27.933",
      "phase_index": 0,
      "start": "00:00.000",
      "visual_evidence": "Both hands reach for and pick up a yellow napkin..."
    }
  ]
}
```

### Zion Instruction Principles Relevant To LLM Eval

The project instructions emphasize:

- Correctness: no hallucinations or inferred details.
- Completeness: all relevant hand actions and segments should be captured.
- Consistency: object descriptions and action labels should remain uniform.
- Chronological sequencing: captions should follow the visual timeline.
- Annotation logic and action flow: actions should form a coherent real-world sequence.
- Object lifecycle: object interactions should be traceable, such as pick -> use -> place.
- Do not annotate body movement, head movement, viewpoint change, hesitation, frustration, or internal states.
- Focus on left hand, right hand, and both hands actions.
- Use objects as references for hand actions, not as standalone mentions.
- Use consistent standalone object descriptions across actions.
- Use `No relevant actions` for no-action periods.

## 4. Deterministic-First Gating Policy

The pipeline must run in this order:

```text
CSV -> deterministic EVALs -> deterministic gate -> LLM semantic EVAL -> final report/app
```

The deterministic layer is the first filter. The LLM layer should evaluate only tasks that **pass** the deterministic gate.

### 4.1 Why This Gate Exists

The LLM should not spend tokens judging problems that can be detected exactly with code. If a task has overlaps, invalid timestamps, missing captions, schema errors, or other deterministic failures, it should be routed directly to human/data review with those deterministic findings.

The LLM is reserved for cases where the data is structurally clean but may still be semantically incoherent.

### 4.2 Deterministic Checks That Block LLM

By default, a task should **not** be sent to LLM if it has any issue from these deterministic evals:

- `segment_overlap_eval`: final segments overlap in time.
- `segment_group_cover_eval`: a long final segment appears to cover a group of smaller final segments within its time range.
- `timestamp_gap_eval`: large gaps between final segments.
- `object_reference_eval`: exact object name mismatch or notes pointing to missing inventory.
- `zion_language_policy_eval`: obvious keyword violations.
- `no_action_segment_eval`: no-action captions with action verbs.
- `segment_granularity_eval`: very long or very short segments.
- `caption_visual_evidence_eval`: caption/evidence divergence.

### 4.3 Recommended Gate Strictness

Start with a strict gate:

```text
send_to_llm = deterministic_issue_count == 0
```

This means only tasks with no deterministic findings are evaluated by the LLM.

After calibration, the team may relax the gate. For example:

```text
send_to_llm = no critical/high deterministic issues
```

But the first implementation should use the strict version to avoid duplicate review noise.

### 4.4 Output For Blocked Tasks

For every task, store whether it was eligible for LLM:

```json
{
  "task_id": "019e...",
  "deterministic_issue_count": 7,
  "llm_eligible": false,
  "llm_skip_reason": "failed_deterministic_gate",
  "blocking_eval_names": [
    "segment_overlap_eval",
    "segment_group_cover_eval"
  ]
}
```

### 4.5 Output For Passing Tasks

For tasks that pass deterministic checks:

```json
{
  "task_id": "019e...",
  "deterministic_issue_count": 0,
  "llm_eligible": true,
  "llm_skip_reason": null,
  "blocking_eval_names": []
}
```

The LLM layer should focus only on semantic issues that require reasoning across captions and are not already deterministic.

## 5. LLM Eval Scope

### In Scope

The LLM should detect:

1. **Contradictory object states**
   - An object is described as already placed, then later still being folded or picked up as if it had not been placed.
   - A napkin is placed onto a stack, then the same caption sequence continues as if the same napkin is still flat on the table.

2. **Object identity drift**
   - Same object changes name suspiciously without an object consistency note.
   - Example: `flat black mat` becomes `flat black chart`.
   - Example: `black extension cord` becomes `black cable`, then `black object`, then `cord` in unclear ways.

3. **Illogical action flow**
   - The action sequence does not follow natural order.
   - Example: placing an object before it is picked up.
   - Example: closing a box before an object is inserted.
   - Example: returning to idle before completing the action, then continuing the same object manipulation without re-engagement.

4. **Semantic duplicate sequence without timestamp failure**
   - Adjacent or nearby segments describe the same action/object lifecycle in a semantically duplicated way, even when timestamps do not overlap.
   - Example: two consecutive captions both claim the same object was picked up, folded, and placed, without a clear new object or repeated cycle.

5. **Caption contains too many actions**
   - A segment caption is semantically overloaded and likely combines multiple phases.
   - Example: pick up object, open it, fold it, place it, withdraw in one caption.

6. **Semantic split/merge suspicion not based on duration**
   - Split: one caption includes multiple distinct object-state transitions even though deterministic duration thresholds did not flag it.
   - Merge: adjacent captions repeat the same semantic action with no meaningful progression.

7. **Object lifecycle missing closure**
   - Object is picked up and used, but never placed, released, put down, returned, or otherwise resolved.
   - Must be flagged carefully because video could end before closure; the issue should say `needs_review`.

8. **Unclear hand actor**
   - The caption switches from both hands to left/right hand in a confusing way.
   - Example: both hands grasp an object, then right hand places it while left hand rests, but the object state implies both were needed.

9. **Zion convention issues not caught by keywords**
   - Describes non-hand movement in a more subtle way.
   - Describes body positioning as the main action.
   - Uses subjective or inferred language not matched by simple keyword rules.

10. **Standalone object description violations**
    - Object is referred to using previous action context instead of stable standalone description.
    - Example: `the cup currently placed on the table` instead of `blue plastic cup`.

11. **Internal inconsistency between object inventory and captions**
    - Captions repeatedly mention an object that is not in inventory using a name that is not a simple synonym.
    - Object inventory first appearance conflicts with caption usage in a semantically meaningful way.

12. **Suspicious repeated loops without deterministic timeline failure**
    - Same object and same action pattern repeats in a way that may be duplicate generated captions, even though timing is structurally valid.
    - Example: repeated folding cycles that use the same object identity and same end state without explaining a new item or new cycle.

### Out Of Scope

The LLM must not:

- Claim an object is visually wrong.
- Claim a hand label is visually wrong.
- Decide if a timestamp tightly bounds the real action.
- Re-evaluate overlaps, gaps, timestamp formatting, schema validity, phase index order, coverage, or duration thresholds.
- Re-evaluate macro segments that temporally cover child segment groups; those are handled by `segment_group_cover_eval`.
- Produce issues whose only evidence is a deterministic failure already handled upstream.
- Judge visual hallucination unless the contradiction is internal to the text.
- Use `client_annotations` to decide whether the final is correct unless explicitly running a separate comparison mode.
- Assume hidden facts about the video.

## 6. Eval Modes

Implement two modes.

### Mode A: Final-Only Judge

This is the primary mode.

Input:

- `task_id`
- `task_name`
- `duration_secs`
- `object_inventory`
- `object_consistency_notes`
- `phase_captions`
- optional deterministic issues for context

The judge only evaluates the final annotation.

### Mode B: Original-vs-Final Diff Judge

This is optional and should be implemented after Mode A.

Input:

- everything in Mode A
- original `client_annotations.phase_captions`
- `segment_verdicts`
- `error_categories`

Purpose:

- Not to say original is right.
- To detect suspicious final edits, such as final introduced a new contradiction or final did not fix the type of error it claimed to fix.

Example:

- `error_categories.timestamp_fix = true`, but final annotation still has heavy overlaps or out-of-order phases.
- `object_fix = true`, but final captions use inconsistent object names.

## 7. Output Contract

The LLM must return strict JSON. No markdown. No prose outside JSON.

Top-level schema:

```json
{
  "task_id": "string",
  "judge_version": "string",
  "overall_risk": "none|low|medium|high|critical",
  "summary": "string",
  "issues": [
    {
      "eval_name": "llm_internal_consistency_eval",
      "issue_type": "string",
      "severity": "low|medium|high|critical",
      "confidence": "low|medium|high",
      "phase_indices": [0, 1],
      "time_ranges": [
        {
          "start": "00:00.000",
          "end": "00:27.933"
        }
      ],
      "objects_involved": ["yellow napkin"],
      "evidence": "string",
      "reasoning": "string",
      "suggested_action": "string",
      "needs_video": false
    }
  ]
}
```

### Required Fields

Every issue must include:

- `eval_name`
- `issue_type`
- `severity`
- `confidence`
- `phase_indices`
- `evidence`
- `reasoning`
- `suggested_action`
- `needs_video`

### `needs_video`

Use `needs_video: true` when the issue cannot be decided from text alone but is suspicious enough for human review.

Use `needs_video: false` when the internal contradiction is visible from the final annotation text itself.

### Issue Type Enum

Use these exact values:

- `object_identity_drift`
- `object_state_contradiction`
- `illogical_action_flow`
- `macro_segment_duplicates_subsegments`
- `overloaded_caption`
- `likely_should_split`
- `likely_should_merge`
- `missing_object_lifecycle_closure`
- `unclear_hand_actor_flow`
- `zion_convention_violation`
- `non_standalone_object_description`
- `inventory_caption_mismatch`
- `repeated_loop_or_duplicate_sequence`
- `ambiguous_or_unverifiable_language`
- `other_internal_inconsistency`

### Severity Definitions

Use these definitions consistently:

- `critical`: the final annotation is structurally or semantically unusable without correction. Example: repeated macro/subsegment duplication across much of the timeline, or impossible action order across many phases.
- `high`: likely materially affects annotation quality or training data. Example: object identity drift, major duplicated sequence, object placed before being picked up.
- `medium`: likely review-worthy but localized or partly ambiguous. Example: one overloaded caption, one unclear object lifecycle.
- `low`: style or clarity issue with limited downstream impact.

### Confidence Definitions

- `high`: issue is clear from text alone.
- `medium`: issue is likely but may have a valid explanation.
- `low`: weak signal; include only if useful for reviewer triage.

## 8. LLM Prompt

### System Prompt

```text
You are a strict QA judge for Zion final annotations.

You evaluate only the provided final annotation JSON. You cannot see the video. You must not claim whether the visual content is correct. You must identify semantic internal inconsistencies that can be inferred from the text alone.

This task has already passed deterministic EVALs before reaching you. Do not re-evaluate deterministic issues such as overlaps, gaps, timestamp formatting, invalid time ranges, missing fields, phase index order, covered marker format, coverage, or duration thresholds. If your only evidence is a deterministic issue, do not output it.

Zion annotations describe observable left-hand, right-hand, or both-hand actions. They should avoid body/head/viewpoint movement and internal mental states. Objects should be described consistently using standalone descriptions. Action flow should be chronological and logically traceable: pick or reach -> grasp -> manipulate/use -> place/release/return where applicable.

Return strict JSON only. Do not include markdown. Do not include explanations outside JSON. If there are no issues, return an empty issues array and overall_risk "none".
```

### User Prompt Template

```text
Evaluate this Zion final annotation for internal consistency only.

Do NOT judge visual correctness. Do NOT assume facts not present in the data.

Focus on:
- object identity drift
- contradictory object states
- illogical action flow
- semantic duplicate sequences that do not depend on timestamp overlap
- overloaded captions that are semantically too broad, not merely long
- semantic split/merge problems that do not depend on duration thresholds
- missing object lifecycle closure
- unclear left/right/both-hand flow
- Zion convention violations not already caught by deterministic keyword rules
- non-standalone object descriptions
- inventory vs caption semantic mismatch
- repeated duplicate loops when timing is otherwise structurally valid

Do NOT evaluate:
- segment overlaps
- timestamp gaps
- timestamp format
- start/end consistency
- out-of-duration segments
- missing captions or schema errors
- phase_index order
- covered_marker format
- first/last coverage
- very long or very short segment duration

Task metadata:
{task_metadata_json}

Object inventory:
{object_inventory_json}

Object consistency notes:
{object_consistency_notes_json}

Final phase captions:
{phase_captions_json}

Return JSON matching this schema:
{output_schema_json}
```

## 9. Recommended Input Preprocessing

Before sending to LLM:

1. Parse `final_annotations`.
2. Normalize timestamps into both raw string and seconds.
3. Include phase index and array index.
4. Include only necessary fields:
   - `phase_index`
   - `start`
   - `end`
   - `caption`
   - `covered_markers`
   - `visual_evidence` only if useful; if it duplicates caption, omit or mention it is identical.
5. Include `object_inventory`.
6. Include `object_consistency_notes`.
7. Do not include deterministic issues in the LLM prompt for the first implementation. They are used only as a gate before the LLM call.
8. Truncate extremely long captions only if token budget requires it. Prefer keeping full captions.

### Compact Phase Format

Recommended LLM input format:

```json
[
  {
    "phase_index": 0,
    "start": "00:00.000",
    "end": "00:27.933",
    "caption": "Both hands reach for and pick up a yellow napkin...",
    "covered_markers": ["segment:0", "segment:1"]
  }
]
```

## 10. Batching Strategy

Run one LLM call per deterministic-passing task.

Why:

- Semantic issues often require reasoning across the whole timeline.
- Cross-task batching makes output parsing harder.
- One task per call simplifies retry, caching, and debugging.

Before scheduling a task for LLM, enforce:

```python
if task.deterministic_issue_count > 0:
    skip_llm(task_id, reason="failed_deterministic_gate")
else:
    enqueue_llm(task_id)
```

Recommended batch controls:

- Max concurrent calls: configurable, start with `3`.
- Retry transient API failures up to `3` times.
- Cache by hash of:
  - `task_id`
  - normalized `final_annotations`
  - judge prompt version
  - model name

Cache output path:

```text
zion_eval_app/data/llm_cache/{task_id}_{hash}.json
```

Aggregated output path:

```text
zion_eval_app/data/llm_issues.json
```

## 11. Integration With Existing App

The app currently reads:

- `data/tasks.json`
- `data/segments_original.json`
- `data/segments_final.json`
- `data/issues.json`
- `data/overlaps.json`
- `data/summary.json`

LLM integration should add:

```text
data/llm_issues.json
```

Then either:

1. Merge LLM issues into `issues.json` during data generation, or
2. Load `llm_issues.json` separately and combine in the frontend.

Recommended: merge into `issues.json` with `eval_name = "llm_internal_consistency_eval"` and keep raw LLM response separately.

### UI Changes

Add:

- Filter option for `llm_internal_consistency_eval`.
- Badge for `LLM` issues.
- Section in task detail: `LLM Judge Summary`.
- Issue cards showing:
  - issue type
  - confidence
  - needs video
  - reasoning
  - suggested action

### Data Shape For Merged Issues

Convert each LLM issue to the existing app issue format:

```json
{
  "issue_id": "LLM-000001",
  "task_id": "019e...",
  "segment_id": "019e...:final:13",
  "source": "final",
  "eval_name": "llm_internal_consistency_eval",
  "severity": "high",
  "message": "Macro segment duplicates subsegments",
  "evidence": "Phase 13 summarizes a full yellow napkin lifecycle while phases 14-19 describe nested green napkin actions inside the same time window.",
  "start_sec": 59.567,
  "end_sec": 91.533,
  "suggested_action": "Review whether the macro segment should be removed or split into the actual subsegments.",
  "llm": {
    "issue_type": "macro_segment_duplicates_subsegments",
    "confidence": "high",
    "needs_video": false,
    "reasoning": "..."
  }
}
```

If multiple `phase_indices` are involved, choose the most relevant segment as `segment_id`, and store all indices under `llm.phase_indices`.

### LLM Eligibility Metadata

Add a metadata file so the UI and downstream analysis can distinguish deterministic failures from LLM-reviewed tasks:

```text
data/llm_eligibility.json
```

Shape:

```json
[
  {
    "task_id": "019e...",
    "llm_eligible": false,
    "llm_status": "skipped",
    "llm_skip_reason": "failed_deterministic_gate",
    "deterministic_issue_count": 12,
    "blocking_eval_names": ["segment_overlap_eval", "timestamp_gap_eval"]
  },
  {
    "task_id": "019e...",
    "llm_eligible": true,
    "llm_status": "completed",
    "llm_skip_reason": null,
    "deterministic_issue_count": 0,
    "blocking_eval_names": []
  }
]
```

Allowed `llm_status` values:

- `not_started`
- `skipped`
- `queued`
- `completed`
- `failed`

## 12. Example: Expected LLM Behavior

### Input Pattern

Important: this example should only be sent to LLM if deterministic EVALs did not already flag overlap/timestamp issues. If deterministic overlap exists, the task should be skipped by LLM and handled by the deterministic report.

A task has:

- Phase 0: `00:00.000 -> 00:08.000`, caption says a yellow napkin is picked up, folded, placed on the stack, and the hand withdraws.
- Phase 1: `00:08.000 -> 00:14.000`, caption again says the same yellow napkin is folded and placed on the same stack, without indicating a new yellow napkin or a repeated cycle.

### Expected Issue

```json
{
  "eval_name": "llm_internal_consistency_eval",
  "issue_type": "repeated_loop_or_duplicate_sequence",
  "severity": "high",
  "confidence": "high",
  "phase_indices": [0, 1],
  "time_ranges": [
    { "start": "00:00.000", "end": "00:08.000" },
    { "start": "00:08.000", "end": "00:14.000" }
  ],
  "objects_involved": ["yellow napkin"],
  "evidence": "Phase 0 completes the yellow napkin lifecycle by placing it on the stack, and phase 1 repeats folding and placing the same yellow napkin without introducing a new one.",
  "reasoning": "The sequence appears semantically duplicated even though the timestamps are structurally valid.",
  "suggested_action": "Review whether phase 1 refers to a new napkin or is a duplicate caption.",
  "needs_video": false
}
```

## 13. Implementation Plan

### Step 1: Create LLM Runner Script

Suggested file:

```text
zion_eval_app/run_llm_eval.py
```

Responsibilities:

1. Load CSV or existing normalized JSON.
2. Load deterministic `issues.json`.
3. Compute LLM eligibility per task.
4. Skip every task with deterministic issues.
5. Build one prompt only for deterministic-passing tasks.
6. Call selected LLM provider.
7. Validate JSON response.
8. Reject outputs that duplicate deterministic eval categories.
9. Retry or repair invalid JSON responses.
10. Save raw responses in cache.
11. Emit `data/llm_issues.json`.
12. Emit `data/llm_eligibility.json`.
13. Optionally merge LLM findings into `data/issues.json`.

### Step 2: Add Prompt Versioning

Suggested files:

```text
zion_eval_app/prompts/llm_internal_consistency_v1.system.txt
zion_eval_app/prompts/llm_internal_consistency_v1.user.txt
```

Each output should include:

```json
{
  "judge_version": "llm_internal_consistency_v1"
}
```

### Step 3: Add JSON Schema Validation

Use a JSON schema or equivalent validation.

Validation should enforce:

- top-level object
- `task_id` matches input task id
- `issues` is a list
- every issue has valid severity and confidence
- `phase_indices` are integers and exist in input
- no unknown issue type unless `other_internal_inconsistency`

### Step 4: Merge Into App

Update data generation so LLM issues appear in:

- task issue counts
- risk score
- issue filters
- task detail
- issue list

Recommended risk weighting:

- critical: +10
- high: +5
- medium: +2
- low: +1

If confidence is low, reduce by half or mark as lower priority.

### Step 5: Add Reviewer Feedback

Allow reviewers to mark LLM findings:

- `confirmed`
- `false_positive`
- `needs_video`
- `unclear`

Save as:

```text
zion_eval_app/data/review_decisions.json
```

This is important for calibration.

## 14. Suggested Provider Abstraction

Do not hard-code one provider into core logic.

Create an interface:

```python
class LLMClient:
    def judge_task(self, prompt: str) -> dict:
        ...
```

Possible implementations:

- OpenAI-compatible API
- Anthropic API
- local model endpoint
- mocked client for tests

Configuration:

```text
LLM_PROVIDER=openai
LLM_MODEL=...
LLM_API_KEY=...
LLM_MAX_CONCURRENCY=3
LLM_TEMPERATURE=0
```

Recommended settings:

- temperature: `0`
- JSON mode / structured output if available
- max tokens sized for long tasks

## 15. Quality Gates

Before trusting LLM issues:

1. Run deterministic evals first.
2. Exclude every task that fails the deterministic gate.
3. Run LLM judge only on a sample of deterministic-passing tasks.
4. Human review each LLM issue.
5. Measure:
   - precision by issue type
   - false positive rate
   - average issues per task
   - severe issue acceptance rate
6. Tune prompt.
7. Run on all deterministic-passing tasks.

### Target Quality

Recommended minimum before broad use:

- high/critical LLM findings: at least 70% reviewer-confirmed
- low/medium findings: acceptable lower precision if used only for triage
- false positives must be explainable and not noisy

## 16. Known Risks And Mitigations

### Risk: LLM invents video facts

Mitigation:

- Strong prompt: no video, no visual truth claims.
- Require `needs_video` when uncertain.
- Reject outputs that mention visual claims not in data.

### Risk: LLM over-flags valid repeated actions

Mitigation:

- Ask for evidence of contradiction or suspicious duplication.
- Require phase indices and exact text evidence.
- Human calibration.

### Risk: LLM misses timeline issues

Mitigation:

- Keep deterministic timeline evals as source of truth for overlaps/gaps.
- Do not send deterministic-failing tasks to LLM.
- Treat timeline issues as deterministic-only findings.

### Risk: inconsistent output JSON

Mitigation:

- Use structured output if provider supports it.
- Validate schema.
- Retry with repair prompt.
- Cache raw responses for debugging.

### Risk: token limits on long tasks

Mitigation:

- Omit duplicate `visual_evidence` when identical to `caption`.
- Compact object inventory.
- Include deterministic issue context only when needed.
- If task is still too long, run a two-pass judge:
  1. chunk-level issue candidates
  2. task-level consolidation

## 17. Two-Pass Option For Very Long Tasks

If a task has many phases or huge captions:

### Pass 1: Chunk Judge

Evaluate windows of 8-12 phases with 1-2 phase overlap between chunks.

Output candidate issues.

### Pass 2: Consolidator

Input:

- all candidate issues
- compact task timeline

Output:

- deduplicated final issue list
- overall risk

Use only if token budget requires it. For the current dataset, one task per call should usually be enough.

## 18. Example Developer Checklist

Implementation is complete when:

- LLM runner can process one task by `task_id`.
- LLM runner refuses or skips a task by `task_id` if it fails deterministic gating.
- LLM runner can process all deterministic-passing tasks with caching.
- Invalid JSON responses are retried or recorded as failures.
- `llm_issues.json` is generated.
- `llm_eligibility.json` is generated.
- LLM issues merge into the existing app issue list.
- UI can filter by `llm_internal_consistency_eval`.
- UI shows LLM issue type, confidence, needs-video, reasoning, and suggested action.
- A calibration sample can be exported.
- Prompt version and model name are stored with every result.

## 19. Recommended First Milestone

Start with a small deterministic-gated LLM run:

1. Run deterministic EVALs across the full dataset.
2. Split tasks into `deterministic_failed` and `deterministic_passed`.
3. Do not send `deterministic_failed` tasks to LLM.
4. Select 50 tasks from `deterministic_passed`.
5. Run LLM judge on those 50 passing tasks.
6. Review output manually.
7. Tune prompt based on false positives.
8. Only then run LLM on all deterministic-passing tasks.

This avoids building a full expensive pipeline before proving that the LLM judge is useful.

## 20. Final Notes

The LLM eval is a **review prioritization tool**, not a replacement for human verification. It should produce evidence-rich, conservative, structured findings. The best issues are those where the final annotation contradicts itself clearly enough that a reviewer can understand the problem without opening the video.

