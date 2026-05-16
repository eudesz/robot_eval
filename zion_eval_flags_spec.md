# Zion Eval Flags Specification

This document defines the current deterministic and LLM-assisted eval flags used by the Zion final annotation QA app.

The evals are text/timeline checks over exported annotation data. They do not watch the video and should be interpreted as review-prioritization signals, not final visual truth.

## Inputs

Primary input is the CSV export containing `final_annotations`. The app parses:

- Task-level metadata: `task_id`, `client_folder_name`, trainer/reviewer fields, durations, dates.
- Final timeline segments from `final_annotations.phase_captions`.
- Segment text fields: `caption` and optional `visual_evidence`.
- Segment timing fields: `start`, `end`, parsed into seconds.

All caption-language checks assume English captions.

## Output Concepts

Each deterministic flag becomes one issue row with:

- `eval_name`
- `severity`
- `issue_message`
- `evidence`
- `segment_id` when segment-specific
- `suggested_action`

MLX results are exported as task-level columns:

- `deterministic_missing_hand_flag`
- `deterministic_missing_hand_segment_ids`
- `deterministic_missing_hand_messages`
- `deterministic_missing_hand_evidence`
- `final_missing_hand_flag`
- `final_missing_hand_source`
- `final_missing_hand_evidence`
- `mlx_hand_eval_ran`
- `mlx_ok`
- `mlx_mentions_both_hands_all_phases`
- `mlx_false_evidence`
- `mlx_error`

## Deterministic Evals

### `segment_group_cover_eval`

Flags a long final segment that fully contains one or more other final segments in its time range.

Rule:

- If segment A starts before/equal segment B and ends after/equal segment B, A covers B.
- Used to detect macro segments that may duplicate child segments.

Severity:

- `critical` / `high` depending on containment impact in the app.

### `timestamp_gap_eval`

Flags large gaps between consecutive valid final segments.

Rule:

- Sort valid final segments by start time.
- If the next segment starts after the previous maximum end time, compute the gap.
- Flag if gap is `>= 3s`.

Severity:

- `high` if gap is `>= 8s`.
- `medium` if gap is `>= 3s` and `< 8s`.

### `timestamp_validity_eval`

Flags invalid or unusable segment timestamps.

Rule:

- Missing start and/or end timestamp.
- Unparseable timestamp.
- Negative timestamp.
- `start_sec >= end_sec`.
- `end_sec` exceeds video duration.

Severity:

- `critical`.

### `object_reference_eval`

Flags likely object-reference mismatches between captions/notes and the object inventory.

Rule:

- Captions and object consistency notes should use stable object names that match inventory entries.
- Flags text that appears to reference objects not represented by the expected inventory naming.

Severity:

- `high` / `medium`.

### `object_label_consistency_eval`

Flags inconsistent or non-English object labels.

Rule:

- Object labels should be stable and in English.
- Mixed labels for the same concept, translated terms, or inconsistent object names can be flagged.

Severity:

- `high` / `medium`.

### `zion_language_policy_eval`

Flags caption wording outside Zion hand-action policy.

Rule:

- Captions should focus on observable hand actions.
- Flags body/head/viewpoint/internal-state wording such as `walk`, `legs`, `head`, `tries to`, or `seems to`.

Severity:

- `high` / `medium`.

### `no_action_segment_eval`

Flags contradictory no-action captions.

Rule:

- If a segment says `No relevant actions` but also contains action verbs, flag it.

Severity:

- `high`.

### `missing_hand_annotations_eval`

Deterministically identifies final segments whose text does not adequately account for hands.

Important: for the missing-hand workflow, this deterministic result is treated as a candidate signal. The exported final missing-hand flag can be updated by the MLX semantic check after MLX runs.

Rule:

- Runs per final segment.
- Skips exact `no caption`.
- Skips segments where both `caption` and `visual_evidence` are empty.
- Passes when the segment clearly contains one of:
  - `both hands`, `two hands`, `both empty hands`, `each hand`
  - `both the hands`
  - `Both ...` as a subject at the start of the caption/evidence
  - both left and right hand references
  - coordinated wording such as `right and left hands`, `left and right hands`, `both right and left hands`
  - minor English hand typos/variants such as `left-hand`, `lefthand`, `leftt hand`, `right-hand`, `righthand`

Flags:

- No hand reference: `Caption does not mention any hand`.
- Only left hand: `Caption mentions only the left hand`.
- Only right hand: `Caption mentions only the right hand`.
- Generic `hand` / `hands` without accepted both-hand wording: `Caption uses generic hand wording without left/right/both`.
- Bare `both` without explicit hand context: `Caption mentions 'both' without specifying left/right hands`.

Severity:

- Usually `medium`.
- Bare `both` warning is `low`.

Exported deterministic candidate columns:

- `deterministic_missing_hand_flag`: `true` if one or more deterministic missing-hand candidate issues exist for the task.
- `deterministic_missing_hand_segment_ids`: semicolon-separated segment ids for deterministic candidates.
- `deterministic_missing_hand_messages`: distinct deterministic messages.
- `deterministic_missing_hand_evidence`: per-segment deterministic evidence.

### `caption_grammar_eval`

Flags obvious grammar or typo issues in final captions.

Rule:

- `left/right handhold`: missing space between `hand` and `hold`.
- `left hands` / `right hands`: noncanonical side plural; semantic hand coverage can still be valid.
- Possible missing third-person verb ending after `left/right hand`, such as `left hand turn`, `right hand open`, `right hand reach`.
- Repeated whitespace.

Severity:

- `low`.

Note:

- This eval intentionally catches only obvious patterns. It should not be treated as a full grammar checker.

### `segment_granularity_eval`

Flags unusually long or unusually short final segments.

Rule:

- Segment duration is compared against app thresholds.
- Very long segments may hide multiple actions.
- Very short segments may indicate over-splitting or timestamp noise.

Severity:

- `high` / `low`.

### `over_segmentation_eval`

Flags overloaded short segments.

Rule:

- Count action/sub-action verbs in a segment.
- If a very short segment contains too many action verbs, flag it as likely over-segmented or temporally implausible.

Severity:

- `high` / `medium`.

### `caption_visual_evidence_eval`

Flags mismatch between `caption` and `visual_evidence`.

Rule:

- If both fields exist and diverge meaningfully, flag it.

Severity:

- `low`.

### `segment_gap_analysis_eval`

Advanced gap analysis over consecutive final segments.

Rule:

- Detects temporal gaps and classifies them by duration.
- Small gaps are potentially auto-correctable.
- Larger gaps likely require regeneration or manual review.

Severity:

- `high` / `medium` / `low`.

### `segment_overlap_analysis_eval`

Advanced overlap analysis over final segments.

Rule:

- Detects overlaps and classifies severity by overlap duration.
- Small overlaps may be auto-correctable.
- Larger overlaps require review/regeneration.

Severity:

- `critical` / `high` / `medium`.

### `video_end_consistency_eval`

Flags mismatch between the final segment end and the video duration.

Rule:

- The final timeline should end exactly at the task video duration.
- Small mismatches may be auto-correctable.
- Large mismatches indicate structural timeline problems.

Severity:

- `critical` / `medium` / `low`.

## MLX LLM Eval: Both-Hands Semantic Check

### Purpose

The MLX eval is a local LLM check for the missing-hand problem. It evaluates whether each final segment semantically accounts for both hands.

It is text-only. It does not watch the video.

### Scope

The app currently runs MLX only on tasks that have at least one deterministic `missing_hand_annotations_eval` issue and pass the active UI filters.

The LLM receives one task at a time, with all final phases. The required evaluation is per phase/segment.

### Main Rule

For every non-empty phase/segment, decide whether the text accounts for both hands.

`mlx_mentions_both_hands_all_phases = true` means every non-empty phase in the task passed the both-hands semantic check.

`mlx_mentions_both_hands_all_phases = false` means at least one non-empty phase failed.

### Valid Both-Hand Coverage

A phase passes when the text reasonably communicates both hands are accounted for, including:

- Explicit `left hand` and `right hand`.
- Minor typo/hyphen variants.
- Nonstandard plural sides (`left hands`, `right hands`) as semantic side references; grammar is handled separately.
- Clear shorthand: `the right hand holds the cup while the left steadies it`.
- Generic plural/both wording: `hands`, `both hands`, `with both hands`, `each hand`, `the left and right hands`.
- Bare `both` only when the nearest local subject is clearly hands.
- Idle/resting hands when explicitly tied to a side: `the right hand works while the left hand is idle`.

### Invalid / Failing Cases

A phase fails when:

- Only one side is mentioned, even repeatedly.
- The same hand is repeated: `left hand ... left hand ...`.
- It says only `one hand`, `a hand`, or `the hand`.
- `left` / `right` refers to direction or object side: `turns to the left`, `right side`, `left compartment`, `right sleeve`, `right door`.
- Body, arms, walking, posture, or camera movement are used instead of hand wording: `walks`, `body`, `both arms`.
- Bare `both` could refer to objects, arms, doors, sides, pieces, or anything other than hands.
- The phase is empty; empty phases are skipped in the task-level rollup.

### MLX Output Columns

- `final_missing_hand_flag`: final missing-hand decision after applying MLX if available.
- `final_missing_hand_source`: `deterministic`, `mlx`, or `deterministic_fallback_mlx_error`.
- `final_missing_hand_evidence`: evidence used for the final missing-hand decision.
- `mlx_hand_eval_ran`: `yes` when there is an MLX result for the task.
- `mlx_ok`: `yes` if the MLX request succeeded and returned parseable JSON; `no` if the request failed.
- `mlx_mentions_both_hands_all_phases`: `true` / `false` LLM semantic result.
- `mlx_false_evidence`: per-segment evidence when the LLM marks the task false.
- `mlx_error`: server/model/parse error if `mlx_ok = no`.

### Interpreting MLX vs Deterministic Flags

The deterministic `missing_hand_annotations_eval` is strict and rule-based. It can over-flag generic phrasing such as `hands`.

The MLX eval is semantic and can clear or confirm those deterministic flags:

- Deterministic flag + no MLX result: `final_missing_hand_flag` follows the deterministic candidate.
- Deterministic flag + MLX `true`: `final_missing_hand_flag = false`; MLX cleared the deterministic candidate.
- Deterministic flag + MLX `false`: `final_missing_hand_flag = true`; MLX confirmed a semantic missing-hand issue.
- Deterministic flag + `mlx_ok = no`: `final_missing_hand_flag` falls back to deterministic and `final_missing_hand_source = deterministic_fallback_mlx_error`.
- No deterministic flag: `final_missing_hand_flag = false` unless a future flow explicitly runs MLX on non-candidate tasks.

## Reset and Persistence

MLX results are stored in browser localStorage and in memory while the app is open.

Use `Reset MLX evals` when:

- The prompt changed.
- The model changed.
- The same data needs to be re-evaluated from scratch.

Reloading the app restores saved MLX results from browser storage, but in-flight requests can be cancelled by the browser.
