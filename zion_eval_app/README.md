# Zion Final Annotation EVALs App

Static local app for reviewing Zion final annotation issues without watching videos.

## Run

```bash
cd /Users/eudesz/Documents/Micro1/Zion_pilot/Evals/zion_eval_app
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## What It Shows

- Filterable task list by issue type, severity, trainer, risk, overlaps, and group-cover macro segments.
- Dashboard metrics for filtered tasks.
- Original vs final timeline comparison.
- Final segment overlap highlights.
- Final gap highlights.
- Macro segment group-cover highlights.
- Detected issue list, overlap pairs, and group-cover segment groups.
- Export of filtered tasks as CSV.

## Data Files

The app reads generated JSON files from `data/`:

- `tasks.json`
- `segments_original.json`
- `segments_final.json`
- `issues.json`
- `overlaps.json`
- `covering_segments.json`
- `summary.json`
