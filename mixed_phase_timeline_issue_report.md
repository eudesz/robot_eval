# Mixed Phase Timeline Issue Report

Source CSV: `data/juno_zion_tasks_export_2026-05-14_to_2026-05-14.csv`

This report checks whether added phases using `description` / `idx` / `hand` are creating timeline gaps or overlaps.

## Summary

- mixed_tasks: `121`
- consecutive_gap_total: `6`
- consecutive_gap_with_added: `6`
- consecutive_overlap_total: `62`
- consecutive_overlap_with_added: `58`
- all_pair_overlap_total: `71`
- all_pair_overlap_with_added: `67`
- all_pair_overlap_added_added: `16`
- all_pair_overlap_standard_standard: `4`

## Interpretation

- In mixed tasks, most detected timeline issues involve added phases.
- Consecutive overlaps involving added phases: `58 / 62`.
- Consecutive gaps involving added phases: `6 / 6`.
- All-pair overlaps involving added phases: `67 / 71`.
- Only `4` all-pair overlaps are between standard phases only.

This supports the hypothesis that appended phases are responsible for most gap/overlap flags in mixed-structure tasks.

## Consecutive Overlap Examples Involving Added Phases

### align and place folders
- Task ID: `019e24cb-688b-731d-bfc8-d19d4f5224c5`
- From: `phase pos 6 / id 6 (standard)` `00:37.417 - 00:46.167`
- To: `phase pos 7 / id 7 (added)` `00:00.000 - 00:00.667`
- Overlap: `46.167s`

### rinse and drain glass cups
- Task ID: `019e22ff-459e-7940-94fa-eef819e651ec`
- From: `phase pos 10 / id 10 (standard)` `01:18.667 - 01:23.067`
- To: `phase pos 11 / id 11 (added)` `00:00.000 - 00:00.333`
- Overlap: `83.067s`

### turn off power strip
- Task ID: `019e24cb-6894-75d7-844e-e6e30a639a39`
- From: `phase pos 11 / id 11 (standard)` `01:29.750 - 01:35.612`
- To: `phase pos 12 / id 12 (added)` `00:00.000 - 00:01.000`
- Overlap: `95.612s`

### organize bedside table clutter
- Task ID: `019e22ff-45b5-7637-ae06-cadf259904c3`
- From: `phase pos 9 / id 9 (standard)` `01:26.500 - 01:31.467`
- To: `phase pos 10 / id 10 (added)` `00:00.000 - 00:05.667`
- Overlap: `91.467s`

### tighten seasoning bottle cap
- Task ID: `019e201b-a6fb-7033-af0d-a1a2ad60366d`
- From: `phase pos 7 / id 7 (standard)` `00:58.500 - 01:01.333`
- To: `phase pos 8 / id 8 (added)` `00:06.983 - 00:09.083`
- Overlap: `54.350s`

### tighten seasoning bottle cap
- Task ID: `019e201b-a6fb-7033-af0d-a1a2ad60366d`
- From: `phase pos 8 / id 8 (added)` `00:06.983 - 00:09.083`
- To: `phase pos 9 / id 9 (added)` `00:06.983 - 00:09.083`
- Overlap: `2.100s`

### sort blocks on table
- Task ID: `019e201b-a6f9-7f57-9b67-9177bff006a9`
- From: `phase pos 7 / id 7 (standard)` `00:48.950 - 01:03.360`
- To: `phase pos 8 / id 8 (added)` `01:03.233 - 01:06.333`
- Overlap: `0.127s`

### sort blocks on table
- Task ID: `019e201b-a6f9-7f57-9b67-9177bff006a9`
- From: `phase pos 8 / id 8 (added)` `01:03.233 - 01:06.333`
- To: `phase pos 9 / id 9 (added)` `01:03.233 - 01:06.333`
- Overlap: `3.100s`

### put lid on pot
- Task ID: `019e270c-ce9a-759a-a747-44775ccdb8da`
- From: `phase pos 1 / id 1 (added)` `00:03.800 - 00:04.000`
- To: `phase pos 2 / id 2 (added)` `00:03.800 - 00:04.000`
- Overlap: `0.200s`

### organize the extension cord
- Task ID: `019e270c-ce94-771e-a680-8f8bf9662579`
- From: `phase pos 5 / id 5 (added)` `00:39.700 - 00:40.000`
- To: `phase pos 6 / id 6 (added)` `00:00.000 - 00:00.667`
- Overlap: `40.000s`

### wipe stain remover fridge door
- Task ID: `019e270c-ce91-740c-ab31-b293cce7a8f2`
- From: `phase pos 3 / id 3 (standard)` `00:22.666 - 00:28.676`
- To: `phase pos 4 / id 4 (added)` `00:28.434 - 00:28.667`
- Overlap: `0.242s`

### move plate to counter
- Task ID: `019e270c-ce92-7b08-aa17-84d6b8f1c11d`
- From: `phase pos 1 / id 1 (standard)` `00:03.333 - 00:09.667`
- To: `phase pos 2 / id 2 (added)` `00:09.467 - 00:09.667`
- Overlap: `0.200s`

## Consecutive Gap Examples Involving Added Phases

### rinse and drain glass cups
- Task ID: `019e22ff-459e-7940-94fa-eef819e651ec`
- From: `phase pos 11 / id 11 (added)` `00:00.000 - 00:00.333`
- To: `phase pos 12 / id 12 (added)` `00:10.000 - 00:13.000`
- Gap: `9.667s`

### put dirty clothes into laundry basket
- Task ID: `019e277b-4391-74ca-b016-2831e04143e2`
- From: `phase pos 2 / id 2 (standard)` `00:10.333 - 00:18.333`
- To: `phase pos 3 / id 3 (added)` `00:18.467 - 00:18.667`
- Gap: `0.134s`

### clear tabletop trash
- Task ID: `019e27b9-fc95-7f78-a21e-8a0ddba4a30d`
- From: `phase pos 4 / id 4 (added)` `00:00.000 - 00:06.667`
- To: `phase pos 5 / id 5 (added)` `00:22.167 - 00:22.333`
- Gap: `15.500s`

### arrange pillows
- Task ID: `019e27bd-b2cb-7657-8ae8-fd9086cc727e`
- From: `phase pos 5 / id 5 (added)` `00:00.000 - 00:02.000`
- To: `phase pos 6 / id 6 (added)` `00:36.367 - 00:36.667`
- Gap: `34.367s`

### pick up floor debris
- Task ID: `019e284b-c509-74ec-8720-e212f04ea486`
- From: `phase pos 5 / id 5 (added)` `00:00.000 - 00:20.439`
- To: `phase pos 6 / id 6 (added)` `00:25.533 - 00:25.667`
- Gap: `5.094s`

### crush empty plastic bottle for recycling
- Task ID: `019e2878-e2b5-767e-95c2-f3309127c858`
- From: `phase pos 2 / id 2 (added)` `00:00.000 - 00:00.640`
- To: `phase pos 3 / id 3 (added)` `00:15.480 - 00:16.333`
- Gap: `14.840s`

## Any-Pair Overlap Examples Involving Added Phases

### rinse and drain glass cups
- Task ID: `019e22ff-459e-7940-94fa-eef819e651ec`
- Phase A: `phase pos 0 / id 0 (standard)` `00:00.000 - 00:05.750`
- Phase B: `phase pos 11 / id 11 (added)` `00:00.000 - 00:00.333`
- Overlap: `0.333s`

### rinse and drain glass cups
- Task ID: `019e22ff-459e-7940-94fa-eef819e651ec`
- Phase A: `phase pos 1 / id 1 (standard)` `00:05.750 - 00:17.250`
- Phase B: `phase pos 12 / id 12 (added)` `00:10.000 - 00:13.000`
- Overlap: `3.000s`

### organize bedside table clutter
- Task ID: `019e22ff-45b5-7637-ae06-cadf259904c3`
- Phase A: `phase pos 0 / id 0 (standard)` `00:00.000 - 00:05.667`
- Phase B: `phase pos 10 / id 10 (added)` `00:00.000 - 00:05.667`
- Overlap: `5.667s`

### tighten seasoning bottle cap
- Task ID: `019e201b-a6fb-7033-af0d-a1a2ad60366d`
- Phase A: `phase pos 0 / id 0 (standard)` `00:00.000 - 00:07.083`
- Phase B: `phase pos 8 / id 8 (added)` `00:06.983 - 00:09.083`
- Overlap: `0.100s`

### tighten seasoning bottle cap
- Task ID: `019e201b-a6fb-7033-af0d-a1a2ad60366d`
- Phase A: `phase pos 0 / id 0 (standard)` `00:00.000 - 00:07.083`
- Phase B: `phase pos 9 / id 9 (added)` `00:06.983 - 00:09.083`
- Overlap: `0.100s`

### tighten seasoning bottle cap
- Task ID: `019e201b-a6fb-7033-af0d-a1a2ad60366d`
- Phase A: `phase pos 1 / id 1 (standard)` `00:07.083 - 00:15.217`
- Phase B: `phase pos 8 / id 8 (added)` `00:06.983 - 00:09.083`
- Overlap: `2.000s`

### tighten seasoning bottle cap
- Task ID: `019e201b-a6fb-7033-af0d-a1a2ad60366d`
- Phase A: `phase pos 1 / id 1 (standard)` `00:07.083 - 00:15.217`
- Phase B: `phase pos 9 / id 9 (added)` `00:06.983 - 00:09.083`
- Overlap: `2.000s`

### tighten seasoning bottle cap
- Task ID: `019e201b-a6fb-7033-af0d-a1a2ad60366d`
- Phase A: `phase pos 8 / id 8 (added)` `00:06.983 - 00:09.083`
- Phase B: `phase pos 9 / id 9 (added)` `00:06.983 - 00:09.083`
- Overlap: `2.100s`

### sort blocks on table
- Task ID: `019e201b-a6f9-7f57-9b67-9177bff006a9`
- Phase A: `phase pos 7 / id 7 (standard)` `00:48.950 - 01:03.360`
- Phase B: `phase pos 8 / id 8 (added)` `01:03.233 - 01:06.333`
- Overlap: `0.127s`

### sort blocks on table
- Task ID: `019e201b-a6f9-7f57-9b67-9177bff006a9`
- Phase A: `phase pos 7 / id 7 (standard)` `00:48.950 - 01:03.360`
- Phase B: `phase pos 9 / id 9 (added)` `01:03.233 - 01:06.333`
- Overlap: `0.127s`

### sort blocks on table
- Task ID: `019e201b-a6f9-7f57-9b67-9177bff006a9`
- Phase A: `phase pos 8 / id 8 (added)` `01:03.233 - 01:06.333`
- Phase B: `phase pos 9 / id 9 (added)` `01:03.233 - 01:06.333`
- Overlap: `3.100s`

### put lid on pot
- Task ID: `019e270c-ce9a-759a-a747-44775ccdb8da`
- Phase A: `phase pos 1 / id 1 (added)` `00:03.800 - 00:04.000`
- Phase B: `phase pos 2 / id 2 (added)` `00:03.800 - 00:04.000`
- Overlap: `0.200s`
