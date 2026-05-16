# Phase Captions Structure Examples

This document shows examples of different `phase_captions` structures found in:

`data/juno_zion_tasks_export_2026-05-14_to_2026-05-14.csv`

The goal is to document why normalization is required before running deterministic evals, MLX evals, dashboard rendering, or CSV exports.

## Problem

`phase_captions` does not always use one stable schema.

Some phases use:

- `caption` for the text
- `phase_index` for the phase number
- `start` / `end` as timestamp strings

Other phases can use:

- `description` for the text
- `idx` for the phase number
- `hand` metadata
- `start` / `end` as numbers

In some rows, both formats appear inside the same task.

## Example 1: Standard Structure

Task ID:

`019e22ff-459e-74b4-8720-c024e7a2894a`

Task name:

`sweep the floors`

Example phase:

```json
{
  "caption": "The left hand reaches down and picks up the small white box from the floor, and the right hand grasps and lifts the blue pouch from the floor.",
  "covered_markers": ["segment:0", "segment:1", "segment:2"],
  "end": "00:06.000",
  "phase_index": 0,
  "start": "00:00.000",
  "visual_evidence": "The left hand reaches down and picks up the small white box from the floor, and the right hand grasps and lifts the blue pouch from the floor."
}
```

Structure:

- Text field: `caption`
- Index field: `phase_index`
- Time fields: string timestamps

## Example 2: Mixed Structure

Task ID:

`019e24cb-688b-731d-bfc8-d19d4f5224c5`

Task name:

`align and place folders`

This task contains both the standard format and an alternate format.

Standard phase:

```json
{
  "caption": "The right hand unzips the pink pencil case and picks up the highlighters from the desk while the left hand holds the case steady.",
  "covered_markers": ["segment:0", "segment:1"],
  "end": "00:04.667",
  "phase_index": 0,
  "start": "00:00.667",
  "visual_evidence": "The right hand unzips the pink pencil case and picks up the highlighters from the desk while the left hand holds the case steady."
}
```

Alternate phase in the same task:

```json
{
  "idx": 7,
  "start": 0,
  "end": 0.667,
  "description": "Both hands reach down and grasps pink pencil case",
  "visual_evidence": "Both hands reach down and grasps pink pencil case",
  "hand": "both"
}
```

Structure difference:

- Phase `0` uses `caption` + `phase_index`
- Phase `7` uses `description` + `idx` + `hand`
- Phase `0` uses timestamp strings
- Phase `7` uses numeric seconds

## Normalization Rule

Before evaluation or export, each phase should be normalized into a common shape.

Recommended field mapping:

- Text: `caption`, fallback to `description`, fallback to `visual_evidence`
- Phase index: `phase_index`, fallback to `idx`
- Start time: parse either timestamp string or numeric seconds
- End time: parse either timestamp string or numeric seconds
- Hand metadata: preserve `hand` when present

This prevents false flags caused by missing expected keys, especially when a valid caption is stored under `description` instead of `caption`.

