const state = {
  summary: null,
  tasks: [],
  originalSegments: [],
  finalSegments: [],
  issues: [],
  overlaps: [],
  coveringSegments: [],
  selectedTaskId: null,
  selectedSegmentId: null,
  decisions: {},
  currentVersion: {
    name: "",
    source_file: "",
    created_at: "",
  },
  csvLoader: {
    newRows: [],
    previousRows: [],
    newOnlyRows: [],
    duplicateRows: [],
    newFileName: "",
    previousFileName: "",
  },
  evalInfoCollapsed: true,
  filters: {
    search: "",
    issueTypes: [],
    severity: "all",
    trainer: "all",
    sort: "risk",
    dateQuickRange: "all",
    createdFrom: "",
    createdTo: "",
    updatedFrom: "",
    updatedTo: "",
    overlapOnly: false,
    groupCoverOnly: false,
    criticalOnly: false,
    noFlagsOnly: false,
    perfectTimelineOnly: false,
    autoCorrectableOnly: false,
    needsRegenerationOnly: false,
    issuesOnlyTimeline: false,
    segmentIssueTypes: [],
    zoom: 1,
  },
};

const els = {};
const DECISION_STORAGE_KEY = "zion_eval_task_decisions_v1";
const VERSION_STORAGE_KEY = "zion_eval_current_version_v1";

const EVAL_INFO = [
  {
    name: "segment_overlap_eval",
    severity: "critical/high",
    checks: "Final timeline segments that overlap each other in time.",
    why: "Two final captions should not normally claim the same time window unless the schema explicitly supports parallel actions.",
    limitation: "Flags internal timeline conflict only; it does not know which segment is visually correct.",
  },
  {
    name: "segment_group_cover_eval",
    severity: "critical/high",
    checks: "A long final segment that contains multiple smaller final segments inside its time range.",
    why: "This often means a macro segment was added to unify several phases, but the child segments were not removed.",
    limitation: "It is based on temporal containment; human review decides whether the macro or child segments should remain.",
  },
  {
    name: "timestamp_gap_eval",
    severity: "high/medium",
    checks: "Large gaps between consecutive final segments.",
    why: "A gap may indicate a missing phase or a missing `No relevant actions` segment.",
    limitation: "Some gaps can be valid if nothing relevant happens.",
  },
  {
    name: "timestamp_validity_eval",
    severity: "critical",
    checks: "Invalid timestamp ranges: start must be before end, and segment bounds must fit within video duration.",
    why: "Invalid timing makes the final annotation unusable for timeline review or training alignment.",
    limitation: "It checks validity, not whether the timestamp tightly matches the real visual action.",
  },
  {
    name: "object_reference_eval",
    severity: "high/medium",
    checks: "Captions that do not exactly reference inventory objects, or consistency notes pointing to missing inventory names.",
    why: "Zion asks for consistent standalone object descriptions across the annotation.",
    limitation: "This can produce false positives when captions use valid synonyms or shortened object names.",
  },
  {
    name: "object_label_consistency_eval",
    severity: "high/medium",
    checks: "Untranslated or mixed object labels, such as `tapa` mixed with `lid` or `cap`.",
    why: "Object labels should be consistently written in English and stable across inventory, notes, and captions.",
    limitation: "Dictionary-based detection can miss uncommon terms or flag terms that are valid proper names.",
  },
  {
    name: "zion_language_policy_eval",
    severity: "high/medium",
    checks: "Body/head/viewpoint movement terms and internal-state language like `walk`, `legs`, `head`, `tries to`, or `seems to`.",
    why: "Instructions say Zion should focus on observable left/right/both-hand actions.",
    limitation: "Keyword-based detection can flag phrases that are acceptable in context.",
  },
  {
    name: "no_action_segment_eval",
    severity: "high",
    checks: "`No relevant actions` captions that also contain action verbs.",
    why: "A no-action segment should not simultaneously describe a relevant action.",
    limitation: "Only triggers when both patterns appear in the same caption.",
  },
  {
    name: "missing_hand_annotations_eval",
    severity: "medium",
    checks: "Final captions that do not mention any hand, or mention only left hand or only right hand.",
    why: "Zion captions should accurately describe left, right, or both-hand participation.",
    limitation: "This is text-only and strict; some true one-hand actions may still be valid after video review.",
  },
  {
    name: "segment_granularity_eval",
    severity: "high/low",
    checks: "Very long or very short final segments.",
    why: "Long segments often hide merged actions; tiny segments can indicate over-splitting or timestamp noise.",
    limitation: "Duration alone cannot prove a segment should be split or merged.",
  },
  {
    name: "over_segmentation_eval",
    severity: "high/medium",
    checks: "More than three action verbs/sub-actions inside a segment shorter than two seconds.",
    why: "A very short segment with many sub-actions is likely overloaded or temporally implausible.",
    limitation: "Verb counting is heuristic and should be calibrated with reviewer examples.",
  },
  {
    name: "caption_visual_evidence_eval",
    severity: "low",
    checks: "`caption` and `visual_evidence` diverge when both fields exist.",
    why: "If both fields are expected to align, drift can indicate inconsistent final data.",
    limitation: "In this export, `visual_evidence` may be redundant or intentionally different.",
  },
  // NEW ADVANCED TIMELINE ANALYSIS EVALUATIONS
  {
    name: "segment_gap_analysis_eval",
    severity: "high/medium/low",
    checks: "Temporal gaps between consecutive segments, classified by duration (<1s correctable vs ≥1s requires regeneration).",
    why: "Gaps may indicate missing actions or timing issues that need correction or regeneration.",
    limitation: "Only detects timing gaps; cannot determine if gap represents missing content or valid pause.",
  },
  {
    name: "segment_overlap_analysis_eval", 
    severity: "critical/high/medium",
    checks: "Enhanced overlap detection with duration classification and correction suggestions (<1s auto-correctable vs ≥1s problematic).",
    why: "Different overlap severities require different correction strategies - small overlaps can be auto-corrected, large ones need regeneration.",
    limitation: "Duration-based classification may not account for action complexity within overlapped time.",
  },
  {
    name: "video_end_consistency_eval",
    severity: "critical/medium/low", 
    checks: "Validates that final segment ends exactly at video duration, with classification by mismatch severity.",
    why: "Timeline must match video bounds exactly - small mismatches can be auto-corrected, large ones indicate structural problems.",
    limitation: "Only checks temporal alignment, not whether final action actually completes at video end.",
  },
];

function $(id) {
  return document.getElementById(id);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function fmt(value, digits = 0) {
  if (value === null || value === undefined || value === "") return "0";
  return Number(value).toLocaleString(undefined, { maximumFractionDigits: digits });
}

function fmtTime(seconds) {
  if (seconds === null || seconds === undefined || Number.isNaN(Number(seconds))) return "";
  const n = Number(seconds);
  const minutes = Math.floor(n / 60);
  const rem = n - minutes * 60;
  return `${String(minutes).padStart(2, "0")}:${rem.toFixed(3).padStart(6, "0")}`;
}

function parseTimeToSeconds(value) {
  if (value === null || value === undefined || value === "") return null;
  const text = String(value).trim();
  if (/^\d+(\.\d+)?$/.test(text)) return Number(text);
  const match = text.match(/^(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?$/);
  if (!match) return null;
  const millis = Number((match[3] || "0").padEnd(3, "0"));
  return Number(match[1]) * 60 + Number(match[2]) + millis / 1000;
}

function severityClass(severity) {
  return ["critical", "high", "medium", "low"].includes(severity) ? severity : "";
}

function severityRank(severity) {
  return { critical: 4, high: 3, medium: 2, low: 1 }[severity] || 0;
}

function loadDecisions() {
  try {
    state.decisions = JSON.parse(localStorage.getItem(DECISION_STORAGE_KEY) || "{}");
  } catch {
    state.decisions = {};
  }
}

function saveDecisions() {
  localStorage.setItem(DECISION_STORAGE_KEY, JSON.stringify(state.decisions));
}

function loadCurrentVersion() {
  try {
    state.currentVersion = {
      ...state.currentVersion,
      ...JSON.parse(localStorage.getItem(VERSION_STORAGE_KEY) || "{}"),
    };
  } catch {
    state.currentVersion = { name: "", source_file: "", created_at: "" };
  }
}

function saveCurrentVersion() {
  localStorage.setItem(VERSION_STORAGE_KEY, JSON.stringify(state.currentVersion));
}

function slugifyFilenamePart(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 90) || "unversioned";
}

function todayStamp() {
  return new Date().toISOString().slice(0, 10);
}

function versionedFilename(baseFilename) {
  const parts = baseFilename.split(".");
  const ext = parts.length > 1 ? parts.pop() : "";
  const stem = parts.join(".") || baseFilename;
  const versionSlug = slugifyFilenamePart(state.currentVersion.name || "unversioned");
  return ext ? `${stem}_${versionSlug}.${ext}` : `${stem}_${versionSlug}`;
}

function setCurrentVersionFromFile(fileName) {
  const createdAt = new Date().toISOString();
  state.currentVersion = {
    name: `${todayStamp()}_${slugifyFilenamePart(fileName)}`,
    source_file: fileName,
    created_at: createdAt,
  };
  saveCurrentVersion();
  renderCurrentVersion();
}

function updateCurrentVersionName(name) {
  state.currentVersion = {
    ...state.currentVersion,
    name: name.trim(),
    created_at: state.currentVersion.created_at || new Date().toISOString(),
  };
  saveCurrentVersion();
  renderCurrentVersion();
}

function renderCurrentVersion() {
  if (!els.evalVersionInput || !els.evalVersionMeta) return;
  els.evalVersionInput.value = state.currentVersion.name || "";
  els.evalVersionMeta.innerHTML = state.currentVersion.name
    ? `
      <strong>Current evaluation version:</strong> ${escapeHtml(state.currentVersion.name)}
      ${state.currentVersion.source_file ? ` · Source CSV: ${escapeHtml(state.currentVersion.source_file)}` : ""}
    `
    : "No evaluation version selected yet.";
}

function decisionForTask(taskId) {
  return state.decisions[taskId] || { status: "unreviewed", notes: "", reviewed_at: "" };
}

function decisionClass(status) {
  if (status === "approved") return "approved";
  if (status === "rejected") return "rejected";
  return "";
}

function decisionLabel(status) {
  if (status === "approved") return "Approved";
  if (status === "rejected") return "Rejected";
  return "Not reviewed";
}

function setTaskDecision(status) {
  if (!state.selectedTaskId) return;
  state.decisions[state.selectedTaskId] = {
    status,
    notes: els.reviewNotesInput.value.trim(),
    reviewed_at: new Date().toISOString(),
  };
  saveDecisions();
  renderAll();
}

function clearTaskDecision() {
  if (!state.selectedTaskId) return;
  delete state.decisions[state.selectedTaskId];
  saveDecisions();
  renderAll();
}

function issueTagName(evalName) {
  return String(evalName || "")
    .replace(/_eval$/, "")
    .replace(/_/g, " ");
}

const LANGUAGE_POLICY_PATTERNS = [
  /\bwalks?\b/gi,
  /\bwalking\b/gi,
  /\bturns?\b/gi,
  /\btorso\b/gi,
  /\bhead\b/gi,
  /\blegs?\b/gi,
  /\bfeet\b/gi,
  /\bfoot\b/gi,
  /\bbody\b/gi,
  /\btries?\s+to\b/gi,
  /\bseems?\s+to\b/gi,
  /\bappears?\s+to\b/gi,
];

function highlightLanguagePolicyTerms(text, shouldHighlight) {
  let html = escapeHtml(text || "");
  if (!shouldHighlight) return html;
  for (const pattern of LANGUAGE_POLICY_PATTERNS) {
    html = html.replace(pattern, (match) => `<mark class="policy-term">${match}</mark>`);
  }
  return html;
}

function timestampValidityDetail(issue) {
  const type = issue.timestamp_error_type || "";
  const map = {
    outside_duration: "End timestamp is after the video duration.",
    unparseable: "Start or end timestamp cannot be parsed.",
    invalid_order: "Start timestamp is greater than or equal to end timestamp.",
    negative_time: "Start or end timestamp is negative.",
    missing_timestamp: "Start or end timestamp is missing.",
  };
  return map[type] || issue.message || "Timestamp range is invalid.";
}

function objectReferenceAnalysis(issue, task) {
  const canonicalNames = (task?.object_inventory || [])
    .map((object) => object.canonical_name)
    .filter(Boolean);
  const evidenceText = String(issue.evidence || issue.message || "").toLowerCase();
  const exactMatches = canonicalNames.filter((name) => evidenceText.includes(String(name).toLowerCase()));
  return {
    problem: issue.message || "Caption does not exactly mention an inventory object.",
    exactMatches,
    canonicalNames,
    suggestion: issue.suggested_action || "Rewrite the caption using the canonical object names from the inventory.",
  };
}

function renderObjectReferenceProblem(issue, task) {
  const analysis = objectReferenceAnalysis(issue, task);
  const shownNames = analysis.canonicalNames.slice(0, 12);
  const moreCount = Math.max(0, analysis.canonicalNames.length - shownNames.length);
  return `
    <div class="caption-reader object-reference-problem">
      <div class="caption-label">Object Reference Problem</div>
      <p><strong>Problem:</strong> ${escapeHtml(analysis.problem)}</p>
      ${analysis.exactMatches.length
        ? `<p><strong>Exact inventory names found:</strong> ${escapeHtml(analysis.exactMatches.join(", "))}</p>`
        : `<p><strong>Exact inventory names found:</strong> none in this segment text.</p>`}
      ${shownNames.length ? `
        <div class="caption-label">Use one of these inventory names</div>
        <div class="object-list">
          ${shownNames.map((name) => `<span class="badge">${escapeHtml(name)}</span>`).join("")}
          ${moreCount ? `<span class="badge">+${moreCount} more</span>` : ""}
        </div>
      ` : ""}
      <p><strong>Suggested fix:</strong> ${escapeHtml(analysis.suggestion)}</p>
    </div>`;
}

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Failed to load ${path}`);
  return response.json();
}

async function init() {
  [
    els.searchInput,
    els.issueTypeToggleBtn,
    els.issueTypeSummary,
    els.issueTypeMenu,
    els.segmentIssueTypeToggleBtn,
    els.segmentIssueTypeSummary,
    els.segmentIssueTypeMenu,
    els.severitySelect,
    els.trainerSelect,
    els.sortSelect,
    els.dateQuickRangeSelect,
    els.createdFromInput,
    els.createdToInput,
    els.updatedFromInput,
    els.updatedToInput,
    els.overlapOnly,
    els.groupCoverOnly,
    els.criticalOnly,
    els.noFlagsOnly,
    els.perfectTimelineOnly,
    els.autoCorrectableOnly,
    els.needsRegenerationOnly,
    els.zoomRange,
    els.issuesOnlyTimeline,
    els.resetFiltersBtn,
    els.exportFilteredBtn,
    els.exportTypeSelect,
    els.approveTaskBtn,
    els.rejectTaskBtn,
    els.clearTaskDecisionBtn,
    els.reviewNotesInput,
    els.reviewDecisionStatus,
    els.toggleEvalInfoBtn,
    els.newCsvInput,
    els.previousCsvInput,
    els.evalVersionInput,
    els.evalVersionMeta,
    els.dedupeKeySelect,
    els.loadNewTasksBtn,
    els.downloadNewOnlyCsvBtn,
    els.downloadDuplicateCsvBtn,
  ] = [
    $("searchInput"),
    $("issueTypeToggleBtn"),
    $("issueTypeSummary"),
    $("issueTypeMenu"),
    $("segmentIssueTypeToggleBtn"),
    $("segmentIssueTypeSummary"),
    $("segmentIssueTypeMenu"),
    $("severitySelect"),
    $("trainerSelect"),
    $("sortSelect"),
    $("dateQuickRangeSelect"),
    $("createdFromInput"),
    $("createdToInput"),
    $("updatedFromInput"),
    $("updatedToInput"),
    $("overlapOnly"),
    $("groupCoverOnly"),
    $("criticalOnly"),
    $("noFlagsOnly"),
    $("perfectTimelineOnly"),
    $("autoCorrectableOnly"),
    $("needsRegenerationOnly"),
    $("zoomRange"),
    $("issuesOnlyTimeline"),
    $("resetFiltersBtn"),
    $("exportFilteredBtn"),
    $("exportTypeSelect"),
    $("approveTaskBtn"),
    $("rejectTaskBtn"),
    $("clearTaskDecisionBtn"),
    $("reviewNotesInput"),
    $("reviewDecisionStatus"),
    $("toggleEvalInfoBtn"),
    $("newCsvInput"),
    $("previousCsvInput"),
    $("evalVersionInput"),
    $("evalVersionMeta"),
    $("dedupeKeySelect"),
    $("loadNewTasksBtn"),
    $("downloadNewOnlyCsvBtn"),
    $("downloadDuplicateCsvBtn"),
  ];

  const [summary, tasks, originalSegments, finalSegments, issues, overlaps, coveringSegments] = await Promise.all([
    loadJson("./data/summary.json"),
    loadJson("./data/tasks.json"),
    loadJson("./data/segments_original.json"),
    loadJson("./data/segments_final.json"),
    loadJson("./data/issues.json"),
    loadJson("./data/overlaps.json"),
    loadJson("./data/covering_segments.json"),
  ]);

  Object.assign(state, { summary, tasks, originalSegments, finalSegments, issues, overlaps, coveringSegments });
  loadDecisions();
  loadCurrentVersion();
  applyStrictMissingHandEval();
  applyAdvancedTimelineEvals(); // NEW: Apply advanced timeline analysis
  state.selectedTaskId = [...tasks].sort((a, b) => b.risk_score - a.risk_score)[0]?.task_id || null;

  hydrateFilters();
  bindEvents();
  renderCurrentVersion();
  renderAll();
}

function hydrateFilters() {
  hydrateDynamicFilters();
}

function hydrateDynamicFilters() {
  const issueTypes = [...new Set(state.issues.map((issue) => issue.eval_name))].sort();
  const currentIssueTypes = new Set(state.filters.issueTypes || []);
  els.issueTypeMenu.innerHTML = [
    `<button class="multi-select-action" type="button" data-issue-action="select-all">Select all issue types</button>`,
    `<button class="multi-select-action" type="button" data-issue-action="clear">Clear selection</button>`,
    ...issueTypes.map((type) => `
      <label class="multi-select-option">
        <input type="checkbox" value="${escapeHtml(type)}" ${currentIssueTypes.has(type) ? "checked" : ""} />
        <span>${escapeHtml(type)}</span>
      </label>
    `),
  ].join("");
  renderIssueTypeSummary();
  hydrateSegmentIssueTypeMenu(issueTypes);

  const trainers = [...new Set(state.tasks.map((task) => task.trainer_user_id).filter(Boolean))].sort();
  const currentTrainer = els.trainerSelect.value || "all";
  els.trainerSelect.innerHTML = `<option value="all">All trainers</option>${trainers.map((trainer) => `<option value="${escapeHtml(trainer)}">${escapeHtml(trainer)}</option>`).join("")}`;
  els.trainerSelect.value = trainers.includes(currentTrainer) ? currentTrainer : "all";
}

function hydrateSegmentIssueTypeMenu(issueTypes) {
  const currentSegmentIssueTypes = new Set(state.filters.segmentIssueTypes || []);
  els.segmentIssueTypeMenu.innerHTML = [
    `<button class="multi-select-action" type="button" data-segment-issue-action="select-all">Select all segment issues</button>`,
    `<button class="multi-select-action" type="button" data-segment-issue-action="clear">Clear selection</button>`,
    ...issueTypes.map((type) => `
      <label class="multi-select-option">
        <input type="checkbox" value="${escapeHtml(type)}" ${currentSegmentIssueTypes.has(type) ? "checked" : ""} />
        <span>${escapeHtml(type)}</span>
      </label>
    `),
  ].join("");
  renderSegmentIssueTypeSummary();
}

function renderIssueTypeSummary() {
  const count = state.filters.issueTypes.length;
  if (!count) {
    els.issueTypeSummary.textContent = "All issue types";
  } else if (count === 1) {
    els.issueTypeSummary.textContent = state.filters.issueTypes[0];
  } else {
    els.issueTypeSummary.textContent = `${count} issue types selected`;
  }
}

function renderSegmentIssueTypeSummary() {
  const count = state.filters.segmentIssueTypes.length;
  if (!count) {
    els.segmentIssueTypeSummary.textContent = "All segment issues";
  } else if (count === 1) {
    els.segmentIssueTypeSummary.textContent = state.filters.segmentIssueTypes[0];
  } else {
    els.segmentIssueTypeSummary.textContent = `${count} segment issue types`;
  }
}

function bindEvents() {
  els.searchInput.addEventListener("input", () => {
    state.filters.search = els.searchInput.value.trim().toLowerCase();
    renderAll();
  });
  els.issueTypeToggleBtn.addEventListener("click", () => {
    els.issueTypeMenu.hidden = !els.issueTypeMenu.hidden;
  });
  els.segmentIssueTypeToggleBtn.addEventListener("click", () => {
    els.segmentIssueTypeMenu.hidden = !els.segmentIssueTypeMenu.hidden;
  });
  els.issueTypeMenu.addEventListener("change", () => {
    state.filters.issueTypes = [...els.issueTypeMenu.querySelectorAll("input:checked")].map((input) => input.value);
    renderIssueTypeSummary();
    renderAll();
  });
  els.issueTypeMenu.addEventListener("click", (event) => {
    if (event.target.dataset.issueAction === "select-all") {
      els.issueTypeMenu.querySelectorAll("input").forEach((input) => {
        input.checked = true;
      });
      state.filters.issueTypes = [...els.issueTypeMenu.querySelectorAll("input")].map((input) => input.value);
      renderIssueTypeSummary();
      renderAll();
    }
    if (event.target.dataset.issueAction === "clear") {
      state.filters.issueTypes = [];
      els.issueTypeMenu.querySelectorAll("input").forEach((input) => {
        input.checked = false;
      });
      renderIssueTypeSummary();
      renderAll();
    }
  });
  els.segmentIssueTypeMenu.addEventListener("change", () => {
    state.filters.segmentIssueTypes = [...els.segmentIssueTypeMenu.querySelectorAll("input:checked")].map((input) => input.value);
    renderSegmentIssueTypeSummary();
    els.segmentIssueTypeMenu.hidden = true;
    renderTimeline();
  });
  els.segmentIssueTypeMenu.addEventListener("click", (event) => {
    if (event.target.dataset.segmentIssueAction === "select-all") {
      els.segmentIssueTypeMenu.querySelectorAll("input").forEach((input) => {
        input.checked = true;
      });
      state.filters.segmentIssueTypes = [...els.segmentIssueTypeMenu.querySelectorAll("input")].map((input) => input.value);
      renderSegmentIssueTypeSummary();
      els.segmentIssueTypeMenu.hidden = true;
      renderTimeline();
    }
    if (event.target.dataset.segmentIssueAction === "clear") {
      state.filters.segmentIssueTypes = [];
      els.segmentIssueTypeMenu.querySelectorAll("input").forEach((input) => {
        input.checked = false;
      });
      renderSegmentIssueTypeSummary();
      els.segmentIssueTypeMenu.hidden = true;
      renderTimeline();
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".issue-type-filter:not(.segment-issue-filter)")) {
      els.issueTypeMenu.hidden = true;
    }
    if (!event.target.closest(".segment-issue-filter")) {
      els.segmentIssueTypeMenu.hidden = true;
    }
  });
  els.severitySelect.addEventListener("change", () => {
    state.filters.severity = els.severitySelect.value;
    renderAll();
  });
  els.trainerSelect.addEventListener("change", () => {
    state.filters.trainer = els.trainerSelect.value;
    renderAll();
  });
  els.sortSelect.addEventListener("change", () => {
    state.filters.sort = els.sortSelect.value;
    renderAll();
  });
  els.dateQuickRangeSelect.addEventListener("change", () => {
    applyQuickDateRange(els.dateQuickRangeSelect.value);
    renderAll();
  });
  for (const [input, key] of [
    [els.createdFromInput, "createdFrom"],
    [els.createdToInput, "createdTo"],
    [els.updatedFromInput, "updatedFrom"],
    [els.updatedToInput, "updatedTo"],
  ]) {
    input.addEventListener("change", () => {
      state.filters[key] = input.value;
      state.filters.dateQuickRange = "custom";
      els.dateQuickRangeSelect.value = "all";
      renderAll();
    });
  }
  els.overlapOnly.addEventListener("change", () => {
    state.filters.overlapOnly = els.overlapOnly.checked;
    renderAll();
  });
  els.groupCoverOnly.addEventListener("change", () => {
    state.filters.groupCoverOnly = els.groupCoverOnly.checked;
    renderAll();
  });
  els.criticalOnly.addEventListener("change", () => {
    state.filters.criticalOnly = els.criticalOnly.checked;
    renderAll();
  });
  els.noFlagsOnly.addEventListener("change", () => {
    state.filters.noFlagsOnly = els.noFlagsOnly.checked;
    renderAll();
  });
  els.perfectTimelineOnly.addEventListener("change", () => {
    state.filters.perfectTimelineOnly = els.perfectTimelineOnly.checked;
    renderAll();
  });
  els.autoCorrectableOnly.addEventListener("change", () => {
    state.filters.autoCorrectableOnly = els.autoCorrectableOnly.checked;
    renderAll();
  });
  els.needsRegenerationOnly.addEventListener("change", () => {
    state.filters.needsRegenerationOnly = els.needsRegenerationOnly.checked;
    renderAll();
  });
  els.zoomRange.addEventListener("input", () => {
    state.filters.zoom = Number(els.zoomRange.value);
    renderTimeline();
  });
  els.issuesOnlyTimeline.addEventListener("change", () => {
    state.filters.issuesOnlyTimeline = els.issuesOnlyTimeline.checked;
    renderTimeline();
  });
  els.resetFiltersBtn.addEventListener("click", resetFilters);
  els.exportFilteredBtn.addEventListener("click", exportFilteredCsv);
  els.approveTaskBtn.addEventListener("click", () => setTaskDecision("approved"));
  els.rejectTaskBtn.addEventListener("click", () => setTaskDecision("rejected"));
  els.clearTaskDecisionBtn.addEventListener("click", clearTaskDecision);
  els.reviewNotesInput.addEventListener("change", () => {
    if (!state.selectedTaskId || !state.decisions[state.selectedTaskId]) return;
    state.decisions[state.selectedTaskId] = {
      ...state.decisions[state.selectedTaskId],
      notes: els.reviewNotesInput.value.trim(),
      reviewed_at: new Date().toISOString(),
    };
    saveDecisions();
    renderTaskDecision();
  });
  els.toggleEvalInfoBtn.addEventListener("click", () => {
    state.evalInfoCollapsed = !state.evalInfoCollapsed;
    renderEvalInfo();
  });
  els.newCsvInput.addEventListener("change", () => loadCsvFile("new", els.newCsvInput.files?.[0]));
  els.previousCsvInput.addEventListener("change", () => loadCsvFile("previous", els.previousCsvInput.files?.[0]));
  els.evalVersionInput.addEventListener("change", () => updateCurrentVersionName(els.evalVersionInput.value));
  els.dedupeKeySelect.addEventListener("change", recomputeCsvDiff);
  els.loadNewTasksBtn.addEventListener("click", loadNewTasksIntoDashboard);
  els.downloadNewOnlyCsvBtn.addEventListener("click", () => downloadCsvRows("zion_new_tasks_only.csv", state.csvLoader.newOnlyRows));
  els.downloadDuplicateCsvBtn.addEventListener("click", () => downloadCsvRows("zion_duplicate_tasks.csv", state.csvLoader.duplicateRows));
}

function resetFilters() {
  Object.assign(state.filters, {
    search: "",
    issueTypes: [],
    severity: "all",
    trainer: "all",
    sort: "risk",
    dateQuickRange: "all",
    createdFrom: "",
    createdTo: "",
    updatedFrom: "",
    updatedTo: "",
    overlapOnly: false,
    groupCoverOnly: false,
    criticalOnly: false,
    noFlagsOnly: false,
    perfectTimelineOnly: false,
    autoCorrectableOnly: false,
    needsRegenerationOnly: false,
    issuesOnlyTimeline: false,
    segmentIssueTypes: [],
    zoom: 1,
  });
  els.searchInput.value = "";
  els.issueTypeMenu.querySelectorAll("input").forEach((input) => {
    input.checked = false;
  });
  renderIssueTypeSummary();
  els.severitySelect.value = "all";
  els.trainerSelect.value = "all";
  els.sortSelect.value = "risk";
  els.dateQuickRangeSelect.value = "all";
  els.createdFromInput.value = "";
  els.createdToInput.value = "";
  els.updatedFromInput.value = "";
  els.updatedToInput.value = "";
  els.overlapOnly.checked = false;
  els.groupCoverOnly.checked = false;
  els.criticalOnly.checked = false;
  els.noFlagsOnly.checked = false;
  els.perfectTimelineOnly.checked = false;
  els.autoCorrectableOnly.checked = false;
  els.needsRegenerationOnly.checked = false;
  els.issuesOnlyTimeline.checked = false;
  els.segmentIssueTypeMenu.querySelectorAll("input").forEach((input) => {
    input.checked = false;
  });
  renderSegmentIssueTypeSummary();
  els.zoomRange.value = "1";
  renderAll();
}

function parseTaskDate(value) {
  if (!value) return null;
  const parsed = new Date(String(value).replace(" ", "T"));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function startOfDateInput(value) {
  return value ? new Date(`${value}T00:00:00`) : null;
}

function endOfDateInput(value) {
  return value ? new Date(`${value}T23:59:59.999`) : null;
}

function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function applyQuickDateRange(value) {
  state.filters.dateQuickRange = value;
  if (value === "all") {
    Object.assign(state.filters, { createdFrom: "", createdTo: "", updatedFrom: "", updatedTo: "" });
  } else {
    const now = new Date();
    const start = new Date(now);
    if (value === "today") start.setHours(0, 0, 0, 0);
    if (value === "24h") start.setDate(start.getDate() - 1);
    if (value === "3d") start.setDate(start.getDate() - 3);
    if (value === "7d") start.setDate(start.getDate() - 7);
    state.filters.createdFrom = "";
    state.filters.createdTo = "";
    state.filters.updatedFrom = toDateInputValue(start);
    state.filters.updatedTo = toDateInputValue(now);
  }
  els.createdFromInput.value = state.filters.createdFrom;
  els.createdToInput.value = state.filters.createdTo;
  els.updatedFromInput.value = state.filters.updatedFrom;
  els.updatedToInput.value = state.filters.updatedTo;
}

function isWithinDateRange(dateValue, fromValue, toValue) {
  const date = parseTaskDate(dateValue);
  if (!date && (fromValue || toValue)) return false;
  const from = startOfDateInput(fromValue);
  const to = endOfDateInput(toValue);
  if (from && date < from) return false;
  if (to && date > to) return false;
  return true;
}

function issuesForTask(taskId) {
  return state.issues.filter((issue) => issue.task_id === taskId);
}

/** Final-annotation caption for CSV flags export (always from `final` timeline when possible). */
function finalAnnotationCaptionForTaskSegment(taskId, segmentId) {
  if (!segmentId) return "";
  const finalSeg = state.finalSegments.find((s) => s.task_id === taskId && s.segment_id === segmentId);
  if (finalSeg) return String(finalSeg.caption || "").trim();
  const origSeg = state.originalSegments.find((s) => s.task_id === taskId && s.segment_id === segmentId);
  if (origSeg && origSeg.array_index != null) {
    const aligned = state.finalSegments.find(
      (s) => s.task_id === taskId && s.source === "final" && s.array_index === origSeg.array_index
    );
    if (aligned) return String(aligned.caption || "").trim();
  }
  return "";
}

function overlapsForTask(taskId) {
  return state.overlaps.filter((overlap) => overlap.task_id === taskId);
}

function groupCoversForTask(taskId) {
  return state.coveringSegments.filter((cover) => cover.task_id === taskId);
}

function filteredTasks() {
  const filtered = state.tasks.filter((task) => {
    const taskIssues = issuesForTask(task.task_id);
    const haystack = `${task.task_id} ${task.task_name} ${task.client_folder_name} ${task.trainer_user_id}`.toLowerCase();
    if (state.filters.search && !haystack.includes(state.filters.search)) return false;
    if (state.filters.trainer !== "all" && task.trainer_user_id !== state.filters.trainer) return false;
    if (state.filters.overlapOnly && !task.overlap_count) return false;
    if (state.filters.groupCoverOnly && !task.group_cover_count) return false;
    if (state.filters.criticalOnly && !task.critical_count) return false;
    if (state.filters.noFlagsOnly && task.issue_count !== 0) return false;
    
    // Timeline Quality filters
    const isPerfectTimeline = (task.auto_correctable_count || 0) === 0 && (task.needs_regeneration_count || 0) === 0;
    const hasAutoCorrectableIssues = (task.auto_correctable_count || 0) > 0;
    const hasRegenerationIssues = (task.needs_regeneration_count || 0) > 0;
    
    if (state.filters.perfectTimelineOnly && !isPerfectTimeline) return false;
    if (state.filters.autoCorrectableOnly && !hasAutoCorrectableIssues) return false;
    if (state.filters.needsRegenerationOnly && !hasRegenerationIssues) return false;
    if (!isWithinDateRange(task.date_created, state.filters.createdFrom, state.filters.createdTo)) return false;
    if (!isWithinDateRange(task.date_updated, state.filters.updatedFrom, state.filters.updatedTo)) return false;
    if (state.filters.issueTypes.length && !taskIssues.some((issue) => state.filters.issueTypes.includes(issue.eval_name))) return false;
    if (state.filters.severity !== "all" && !taskIssues.some((issue) => issue.severity === state.filters.severity)) return false;
    return true;
  });

  const sorters = {
    risk: (a, b) => b.risk_score - a.risk_score,
    overlaps: (a, b) => b.overlap_count - a.overlap_count || b.risk_score - a.risk_score,
    issues: (a, b) => b.issue_count - a.issue_count,
    duration: (a, b) => b.final_duration_secs - a.final_duration_secs,
    updated: (a, b) => String(b.date_updated).localeCompare(String(a.date_updated)),
    created: (a, b) => String(b.date_created).localeCompare(String(a.date_created)),
  };
  return filtered.sort(sorters[state.filters.sort] || sorters.risk);
}

function renderAll() {
  const tasks = filteredTasks();
  if (!tasks.some((task) => task.task_id === state.selectedTaskId)) {
    state.selectedTaskId = tasks[0]?.task_id || state.tasks[0]?.task_id || null;
  }
  renderStats(tasks);
  renderTaskDecision();
  renderEvalInfo();
  renderTaskList(tasks);
  renderSelectedTask();
}

function renderTaskDecision() {
  const decision = decisionForTask(state.selectedTaskId);
  els.reviewDecisionStatus.textContent = decisionLabel(decision.status);
  els.reviewDecisionStatus.className = `badge decision-badge ${decisionClass(decision.status)}`;
  els.reviewNotesInput.value = decision.notes || "";
  els.approveTaskBtn.classList.toggle("active", decision.status === "approved");
  els.rejectTaskBtn.classList.toggle("active", decision.status === "rejected");
  const disabled = !state.selectedTaskId;
  els.approveTaskBtn.disabled = disabled;
  els.rejectTaskBtn.disabled = disabled;
  els.clearTaskDecisionBtn.disabled = disabled || decision.status === "unreviewed";
  els.reviewNotesInput.disabled = disabled;
}

function renderEvalInfo() {
  els.toggleEvalInfoBtn.textContent = state.evalInfoCollapsed ? "Expand" : "Collapse";
  $("evalInfoGrid").classList.toggle("collapsed", state.evalInfoCollapsed);
  if (state.evalInfoCollapsed) {
    $("evalInfoGrid").innerHTML = "";
    return;
  }
  $("evalInfoGrid").innerHTML = EVAL_INFO.map((info) => {
    const count = state.summary.eval_counts?.[info.name] || 0;
    return `
      <article class="eval-info-card">
        <div class="eval-info-title">
          <span>${escapeHtml(info.name)}</span>
          <span class="badge">${fmt(count)}</span>
        </div>
        <div class="eval-info-meta">Typical severity: ${escapeHtml(info.severity)}</div>
        <p><strong>Checks:</strong> ${escapeHtml(info.checks)}</p>
        <p><strong>Why it matters:</strong> ${escapeHtml(info.why)}</p>
        <p class="eval-limitation"><strong>Limit:</strong> ${escapeHtml(info.limitation)}</p>
      </article>`;
  }).join("");
}

function renderStats(tasks) {
  const issueIds = new Set();
  const overlapTaskCount = tasks.filter((task) => task.overlap_count > 0).length;
  const groupCoverTaskCount = tasks.filter((task) => task.group_cover_count > 0).length;
  const approvedTaskCount = tasks.filter((task) => decisionForTask(task.task_id).status === "approved").length;
  const rejectedTaskCount = tasks.filter((task) => decisionForTask(task.task_id).status === "rejected").length;
  
  // Timeline Quality metrics
  const perfectTimelineCount = tasks.filter((task) => 
    (task.auto_correctable_count || 0) === 0 && (task.needs_regeneration_count || 0) === 0
  ).length;
  const autoCorrectableCount = tasks.filter((task) => (task.auto_correctable_count || 0) > 0).length;
  const needsRegenerationCount = tasks.filter((task) => (task.needs_regeneration_count || 0) > 0).length;
  let critical = 0;
  let high = 0;
  for (const task of tasks) {
    for (const issue of issuesForTask(task.task_id)) {
      issueIds.add(issue.issue_id);
      if (issue.severity === "critical") critical += 1;
      if (issue.severity === "high") high += 1;
    }
  }
  $("statsGrid").innerHTML = [
    ["Tasks", fmt(tasks.length), "Filtered tasks"],
    ["Issues", fmt(issueIds.size), "Detected final issues"],
    ["Overlap Tasks", fmt(overlapTaskCount), "Tasks with final overlap"],
    ["Group Covers", fmt(groupCoverTaskCount), "Tasks with macro segments"],
    ["Critical", fmt(critical), "Critical issue rows"],
    ["High", fmt(high), "High issue rows"],
    ["Perfect Timeline", fmt(perfectTimelineCount), "No gaps or overlaps"],
    ["Auto-Correctable", fmt(autoCorrectableCount), "Issues <1s fixable"],
    ["Needs Regeneration", fmt(needsRegenerationCount), "Issues ≥1s require regen"],
    ["Approved", fmt(approvedTaskCount), "Reviewed as approved"],
    ["Rejected", fmt(rejectedTaskCount), "Reviewed as rejected"],
  ]
    .map(
      ([label, value, sub]) => `
      <div class="stat">
        <div class="stat-value">${value}</div>
        <div class="stat-label">${label}</div>
        <div class="stat-label">${sub}</div>
      </div>`
    )
    .join("");
}

function renderTaskList(tasks) {
  $("taskCount").textContent = fmt(tasks.length);
  $("taskList").innerHTML = tasks
    .slice(0, 250)
    .map((task) => {
      const active = task.task_id === state.selectedTaskId ? "active" : "";
      const maxSeverity = task.critical_count ? "critical" : task.high_count ? "high" : task.medium_count ? "medium" : task.low_count ? "low" : "";
      const decision = decisionForTask(task.task_id);
      return `
        <article class="task-card ${active}" data-task-id="${escapeHtml(task.task_id)}">
          <div class="task-card-title">
            <span>${escapeHtml(task.task_name || "Untitled task")}</span>
            <span>${fmt(task.risk_score)}</span>
          </div>
          <div class="task-meta">${escapeHtml(task.task_id)} · trainer ${escapeHtml(task.trainer_user_id)} · ${fmt(task.final_duration_secs, 1)}s</div>
          <div class="badge-row">
            <span class="badge ${maxSeverity}">${fmt(task.issue_count)} issues</span>
            <span class="badge critical">${fmt(task.critical_count)} critical</span>
            <span class="badge high">${fmt(task.overlap_count)} overlaps</span>
            <span class="badge medium">${fmt(task.group_cover_count)} covers</span>
            <span class="badge decision-badge ${decisionClass(decision.status)}">${escapeHtml(decisionLabel(decision.status))}</span>
          </div>
        </article>`;
    })
    .join("");

  document.querySelectorAll(".task-card").forEach((card) => {
    card.addEventListener("click", () => {
      state.selectedTaskId = card.dataset.taskId;
      state.selectedSegmentId = null;
      renderAll();
    });
  });
}

function exportSidebarFilteredTasks(tasks = filteredTasks()) {
  const header = [
    "task_id",
    "client_folder_name",
    "task_name",
    "status",
    "trainer_user_id",
    "date_created",
    "date_updated",
    "final_duration_secs",
    "original_segment_count",
    "final_segment_count",
    "risk_score",
    "issue_count",
    "critical_count",
    "high_count",
    "medium_count",
    "low_count",
    "overlap_count",
    "group_cover_count",
    "eval_names",
  ];
  const rows = tasks.map((task) => ({
    ...task,
    eval_names: (task.eval_names || []).join(";"),
  }));
  downloadFile("zion_sidebar_filtered_tasks.csv", toCsv(rows, header), "text/csv;charset=utf-8");
}

function buildReviewExportRows(status, tasks = filteredTasks()) {
  return tasks
    .filter((task) => decisionForTask(task.task_id).status === status)
    .flatMap((task) => {
      const decision = decisionForTask(task.task_id);
      const taskIssues = issuesForTask(task.task_id);
      const base = {
        task_id: task.task_id,
        client_folder_name: task.client_folder_name,
        task_name: task.task_name,
        trainer_user_id: task.trainer_user_id,
        review_decision: decision.status,
        review_notes: decision.notes,
        reviewed_at: decision.reviewed_at,
        risk_score: task.risk_score,
        issue_count: task.issue_count,
        critical_count: task.critical_count,
        high_count: task.high_count,
        medium_count: task.medium_count,
        low_count: task.low_count,
        overlap_count: task.overlap_count,
        group_cover_count: task.group_cover_count,
      };
      if (!taskIssues.length) {
        return [{
          ...base,
          issue_id: "",
          segment_id: "",
          final_annotation_caption: "",
          eval_name: "",
          severity: "",
          issue_message: "",
          evidence: "",
          start_sec: "",
          end_sec: "",
          suggested_action: "",
        }];
      }
      return taskIssues.map((issue) => ({
        ...base,
        issue_id: issue.issue_id,
        segment_id: issue.segment_id,
        final_annotation_caption: finalAnnotationCaptionForTaskSegment(task.task_id, issue.segment_id),
        eval_name: issue.eval_name,
        severity: issue.severity,
        issue_message: issue.message,
        evidence: issue.evidence,
        start_sec: issue.start_sec,
        end_sec: issue.end_sec,
        suggested_action: issue.suggested_action,
      }));
    });
}

function buildTasksWithFlagsExportRows(tasks = filteredTasks()) {
  return tasks.flatMap((task) => {
    const decision = decisionForTask(task.task_id);
    const taskIssues = issuesForTask(task.task_id);
    const base = {
      task_id: task.task_id,
      client_folder_name: task.client_folder_name,
      task_name: task.task_name,
      status: task.status,
      trainer_user_id: task.trainer_user_id,
      reviewer_user_id: task.reviewer_user_id,
      date_created: task.date_created,
      date_updated: task.date_updated,
      final_duration_secs: task.final_duration_secs,
      original_segment_count: task.original_segment_count,
      final_segment_count: task.final_segment_count,
      risk_score: task.risk_score,
      issue_count: task.issue_count,
      critical_count: task.critical_count,
      high_count: task.high_count,
      medium_count: task.medium_count,
      low_count: task.low_count,
      overlap_count: task.overlap_count,
      group_cover_count: task.group_cover_count,
      eval_names: (task.eval_names || []).join(";"),
      review_decision: decision.status,
      review_notes: decision.notes,
      reviewed_at: decision.reviewed_at,
    };
    if (!taskIssues.length) {
      return [{
        ...base,
        issue_id: "",
        segment_id: "",
        final_annotation_caption: "",
        source: "",
        eval_name: "",
        severity: "",
        issue_message: "",
        evidence: "",
        start_sec: "",
        end_sec: "",
        suggested_action: "",
      }];
    }
    return taskIssues.map((issue) => ({
      ...base,
      issue_id: issue.issue_id,
      segment_id: issue.segment_id,
      final_annotation_caption: finalAnnotationCaptionForTaskSegment(task.task_id, issue.segment_id),
      source: issue.source,
      eval_name: issue.eval_name,
      severity: issue.severity,
      issue_message: issue.message,
      evidence: issue.evidence,
      start_sec: issue.start_sec,
      end_sec: issue.end_sec,
      suggested_action: issue.suggested_action,
    }));
  });
}

function exportTasksWithFlags(tasks = filteredTasks()) {
  const header = [
    "task_id",
    "client_folder_name",
    "task_name",
    "status",
    "trainer_user_id",
    "reviewer_user_id",
    "date_created",
    "date_updated",
    "final_duration_secs",
    "original_segment_count",
    "final_segment_count",
    "risk_score",
    "issue_count",
    "critical_count",
    "high_count",
    "medium_count",
    "low_count",
    "overlap_count",
    "group_cover_count",
    "eval_names",
    "review_decision",
    "review_notes",
    "reviewed_at",
    "issue_id",
    "segment_id",
    "final_annotation_caption",
    "source",
    "eval_name",
    "severity",
    "issue_message",
    "evidence",
    "start_sec",
    "end_sec",
    "suggested_action",
  ];
  downloadFile("zion_filtered_tasks_with_flags.csv", toCsv(buildTasksWithFlagsExportRows(tasks), header), "text/csv;charset=utf-8");
}

function exportReviewedTasks(status, tasks = filteredTasks()) {
  const rows = buildReviewExportRows(status, tasks);
  const header = [
    "task_id",
    "client_folder_name",
    "task_name",
    "trainer_user_id",
    "review_decision",
    "review_notes",
    "reviewed_at",
    "risk_score",
    "issue_count",
    "critical_count",
    "high_count",
    "medium_count",
    "low_count",
    "overlap_count",
    "group_cover_count",
    "issue_id",
    "segment_id",
    "final_annotation_caption",
    "eval_name",
    "severity",
    "issue_message",
    "evidence",
    "start_sec",
    "end_sec",
    "suggested_action",
  ];
  const filename = status === "approved" ? "zion_approved_tasks.csv" : "zion_rejected_tasks_with_flags.csv";
  downloadFile(filename, toCsv(rows, header), "text/csv;charset=utf-8");
}

function selectedTask() {
  return state.tasks.find((task) => task.task_id === state.selectedTaskId);
}

function renderSelectedTask() {
  const task = selectedTask();
  if (!task) {
    $("selectedTitle").textContent = "No data loaded";
    $("selectedSubtitle").textContent = "Upload a new CSV export in the Daily CSV Loader to start evaluating tasks.";
    $("riskBadge").className = "badge";
    $("riskBadge").textContent = "No task";
    $("taskDetail").innerHTML = '<div class="empty">No task selected.</div>';
    $("timeline").innerHTML = '<div class="empty">Load a CSV to generate timelines.</div>';
    $("selectedSegmentBadge").textContent = "None";
    $("selectedSegmentBadge").className = "badge";
    $("selectedSegmentDetail").innerHTML = '<div class="empty">No segment selected.</div>';
    $("issueCountForTask").textContent = "0";
    $("overlapCountForTask").textContent = "0";
    $("groupCoverCountForTask").textContent = "0";
    $("issuesList").innerHTML = '<div class="empty">No issues loaded.</div>';
    $("overlapList").innerHTML = '<div class="empty">No overlaps loaded.</div>';
    $("groupCoverList").innerHTML = '<div class="empty">No group covers loaded.</div>';
    return;
  }
  $("selectedTitle").textContent = task.task_name || "Untitled task";
  $("selectedSubtitle").textContent = `${task.task_id} · ${fmtTime(0)} - ${fmtTime(task.final_duration_secs || task.actual_video_duration)} video · ${task.final_segment_count} final segments · ${task.issue_count} issues`;
  $("riskBadge").className = `badge ${task.critical_count ? "critical" : task.high_count ? "high" : "medium"}`;
  $("riskBadge").textContent = `Risk ${task.risk_score}`;
  renderTaskDetail(task);
  renderTimeline();
  renderIssues();
}

function renderTaskDetail(task) {
  const objects = (task.object_inventory || []).slice(0, 18);
  $("taskDetail").innerHTML = `
    <div class="kv"><span>Status</span><strong>${escapeHtml(task.status)}</strong></div>
    <div class="kv"><span>Trainer</span><strong>${escapeHtml(task.trainer_user_id)}</strong></div>
    <div class="kv"><span>Duration</span><strong>${fmt(task.final_duration_secs, 3)}s</strong></div>
    <div class="kv"><span>Segments</span><strong>${fmt(task.original_segment_count)} original / ${fmt(task.final_segment_count)} final</strong></div>
    <div class="kv"><span>Overlaps</span><strong>${fmt(task.overlap_count)}</strong></div>
    <div class="kv"><span>Group Covers</span><strong>${fmt(task.group_cover_count)}</strong></div>
    <div class="kv"><span>Review</span><strong>${escapeHtml(task.review_score || "not reviewed")}</strong></div>
    <div>
      <div class="section-header"><h2>Objects</h2><span>${fmt((task.object_inventory || []).length)}</span></div>
      <div class="object-list">${objects.map((obj) => `<span class="badge">${escapeHtml(obj.canonical_name)}</span>`).join("")}</div>
    </div>
    <div>
      <div class="section-header"><h2>Eval Types</h2><span>${fmt((task.eval_names || []).length)}</span></div>
      <div class="object-list">${(task.eval_names || []).map((name) => `<span class="badge">${escapeHtml(name)}</span>`).join("") || '<span class="empty">No issues</span>'}</div>
    </div>`;
}

function segmentIssuesMap(taskId) {
  const map = new Map();
  for (const issue of issuesForTask(taskId)) {
    if (!issue.segment_id) continue;
    if (!map.has(issue.segment_id)) map.set(issue.segment_id, []);
    map.get(issue.segment_id).push(issue);
  }
  return map;
}

function renderTimeline() {
  const task = selectedTask();
  if (!task) return;
  const original = state.originalSegments.filter((segment) => segment.task_id === task.task_id);
  const final = state.finalSegments.filter((segment) => segment.task_id === task.task_id);
  const segmentIssues = segmentIssuesMap(task.task_id);
  const duration = Math.max(task.final_duration_secs || task.actual_video_duration || 1, 1);
  const width = Math.max(780, duration * 12 * state.filters.zoom);

  const renderLane = (label, source, segments) => {
    const visible = segments.filter((segment) => {
      if (source !== "final") return true;
      const issues = segmentIssues.get(segment.segment_id) || [];
      if (state.filters.issuesOnlyTimeline && !issues.length) return false;
      if (state.filters.segmentIssueTypes.length && !issues.some((issue) => state.filters.segmentIssueTypes.includes(issue.eval_name))) return false;
      return true;
    });
    return `
      <div class="lane" style="width:${width}px">
        <div class="lane-header"><span>${label}</span><span>${visible.length} segments</span></div>
        <div class="track">
          ${source === "final" ? renderGroupCoverBands(task.task_id, duration) : ""}
          ${source === "final" ? renderOverlapBands(task.task_id, duration) : ""}
          ${source === "original" ? renderComputedOverlapBands(segments, duration, "original") : ""}
          ${source === "final" ? renderGapBands(task.task_id, duration) : ""}
          ${visible.map((segment) => renderSegment(segment, duration, segmentIssues)).join("")}
        </div>
      </div>`;
  };

  $("timeline").innerHTML = `
    ${renderAxis(duration, width)}
    ${renderLane("Original annotation", "original", original)}
    ${renderLane("Final annotation", "final", final)}
  `;

  document.querySelectorAll(".segment").forEach((segmentEl) => {
    segmentEl.addEventListener("click", () => {
      state.selectedSegmentId = segmentEl.dataset.segmentId;
      renderTimeline();
      renderSelectedSegmentDetail();
      renderIssues();
    });
  });

  renderSelectedSegmentDetail();
}

function findSelectedSegment() {
  if (!state.selectedSegmentId) return null;
  return [...state.originalSegments, ...state.finalSegments].find((segment) => segment.segment_id === state.selectedSegmentId) || null;
}

function renderSelectedSegmentDetail() {
  const segment = findSelectedSegment();
  if (!segment) {
    $("selectedSegmentBadge").textContent = "None";
    $("selectedSegmentBadge").className = "badge";
    $("selectedSegmentDetail").innerHTML = '<div class="empty">Click any original or final segment to read the full caption.</div>';
    return;
  }
  const taskIssues = issuesForTask(segment.task_id).filter((issue) => issue.segment_id === segment.segment_id);
  const task = state.tasks.find((item) => item.task_id === segment.task_id);
  const hasLanguagePolicyIssue = taskIssues.some((issue) => issue.eval_name === "zion_language_policy_eval");
  $("selectedSegmentBadge").textContent = segment.source;
  $("selectedSegmentBadge").className = `badge ${segment.source === "final" ? "high" : "low"}`;
  $("selectedSegmentDetail").innerHTML = `
    <div class="kv"><span>Source</span><strong>${escapeHtml(segment.source)}</strong></div>
    <div class="kv"><span>Index</span><strong>${escapeHtml(segment.array_index)} / phase ${escapeHtml(segment.phase_index)}</strong></div>
    <div class="kv"><span>Time</span><strong>${fmtTime(segment.start_sec)} - ${fmtTime(segment.end_sec)} (${fmt(segment.duration_sec, 3)}s)</strong></div>
    <div class="caption-reader">
      <div class="caption-label">Caption</div>
      <p>${highlightLanguagePolicyTerms(segment.caption || "No caption", hasLanguagePolicyIssue)}</p>
    </div>
    ${segment.visual_evidence ? `
      <div class="caption-reader">
        <div class="caption-label">Visual Evidence</div>
        <p>${highlightLanguagePolicyTerms(segment.visual_evidence, hasLanguagePolicyIssue)}</p>
      </div>` : ""}
    <div class="caption-reader">
      <div class="caption-label">Covered Markers</div>
      <p>${escapeHtml(Array.isArray(segment.covered_markers) ? segment.covered_markers.join(", ") : segment.covered_markers)}</p>
    </div>
    ${taskIssues.length ? `
      <div class="object-list">${taskIssues.map((issue) => `<span class="badge ${severityClass(issue.severity)}">${escapeHtml(issue.eval_name)}</span>`).join("")}</div>
      ${taskIssues.some((issue) => issue.eval_name === "timestamp_validity_eval") ? `
        <div class="caption-reader">
          <div class="caption-label">Timestamp Validity Problem</div>
          ${taskIssues.filter((issue) => issue.eval_name === "timestamp_validity_eval").map((issue) => `
            <p>${escapeHtml(timestampValidityDetail(issue))} ${issue.evidence ? `Evidence: ${escapeHtml(issue.evidence)}` : ""}</p>
          `).join("")}
        </div>
      ` : ""}
      ${taskIssues
        .filter((issue) => issue.eval_name === "object_reference_eval")
        .map((issue) => renderObjectReferenceProblem(issue, task))
        .join("")}
    ` : ""}
  `;
}

function renderAxis(duration, width) {
  const ticks = [];
  const step = duration > 120 ? 30 : duration > 60 ? 15 : 10;
  for (let t = 0; t <= duration + 0.01; t += step) {
    ticks.push(`<span class="tick" style="left:${(t / duration) * width}px">${fmtTime(t)}</span>`);
  }
  return `<div class="time-axis" style="width:${width}px">${ticks.join("")}</div>`;
}

function renderOverlapBands(taskId, duration) {
  return overlapsForTask(taskId)
    .map((overlap) => {
      const left = (overlap.overlap_start_sec / duration) * 100;
      const width = Math.max(0.25, (overlap.overlap_seconds / duration) * 100);
      return `<div class="overlap-band" title="${escapeHtml(overlap.overlap_seconds)}s overlap" style="left:${left}%;width:${width}%"></div>`;
    })
    .join("");
}

function renderComputedOverlapBands(segments, duration, source) {
  const valid = segments
    .filter((segment) => segment.start_sec !== null && segment.end_sec !== null && segment.end_sec > segment.start_sec)
    .sort((a, b) => a.start_sec - b.start_sec || a.end_sec - b.end_sec);
  const bands = [];
  for (let i = 0; i < valid.length; i += 1) {
    for (let j = i + 1; j < valid.length; j += 1) {
      if (valid[j].start_sec >= valid[i].end_sec) break;
      const overlapStart = Math.max(valid[i].start_sec, valid[j].start_sec);
      const overlapEnd = Math.min(valid[i].end_sec, valid[j].end_sec);
      const overlapSeconds = overlapEnd - overlapStart;
      if (overlapSeconds <= 0) continue;
      const left = (overlapStart / duration) * 100;
      const width = Math.max(0.25, (overlapSeconds / duration) * 100);
      const title = `${source} overlap: segments ${valid[i].array_index} + ${valid[j].array_index}, ${overlapSeconds.toFixed(3)}s`;
      bands.push(`<div class="overlap-band ${source}" title="${escapeHtml(title)}" style="left:${left}%;width:${width}%"></div>`);
    }
  }
  return bands.join("");
}

function renderGroupCoverBands(taskId, duration) {
  return groupCoversForTask(taskId)
    .map((cover) => {
      const left = (cover.macro_start_sec / duration) * 100;
      const width = Math.max(0.25, (cover.macro_duration_sec / duration) * 100);
      const title = `macro segment ${cover.macro_array_index} covers ${cover.child_count} child segments (${Math.round(cover.coverage_ratio * 100)}% coverage)`;
      return `<div class="cover-band" title="${escapeHtml(title)}" style="left:${left}%;width:${width}%"></div>`;
    })
    .join("");
}

function renderGapBands(taskId, duration) {
  return issuesForTask(taskId)
    .filter((issue) => issue.eval_name === "timestamp_gap_eval" && issue.start_sec !== null && issue.end_sec !== null)
    .map((issue) => {
      const gapSeconds = Math.max(0, issue.end_sec - issue.start_sec);
      const left = (issue.start_sec / duration) * 100;
      const width = Math.max(0.25, (gapSeconds / duration) * 100);
      const title = `${gapSeconds.toFixed(3)}s gap (${fmtTime(issue.start_sec)} - ${fmtTime(issue.end_sec)})`;
      return `<div class="gap-band" title="${escapeHtml(title)}" style="left:${left}%;width:${width}%"></div>`;
    })
    .join("");
}

function renderSegment(segment, duration, segmentIssues) {
  if (segment.start_sec === null || segment.end_sec === null) return "";
  const left = Math.max(0, (segment.start_sec / duration) * 100);
  const width = Math.max(0.4, ((segment.end_sec - segment.start_sec) / duration) * 100);
  const issues = segmentIssues.get(segment.segment_id) || [];
  const highest = issues.sort((a, b) => severityRank(b.severity) - severityRank(a.severity))[0]?.severity || "";
  const tags = issues.slice(0, 2).map((issue) => `<span class="segment-tag ${severityClass(issue.severity)}">${escapeHtml(issueTagName(issue.eval_name))}</span>`).join("");
  const moreTag = issues.length > 2 ? `<span class="segment-tag">+${issues.length - 2}</span>` : "";
  
  // Check for advanced timeline analysis issues
  const hasGapAnalysis = issues.some(issue => issue.eval_name === "segment_gap_analysis_eval");
  const hasOverlapAnalysis = issues.some(issue => issue.eval_name === "segment_overlap_analysis_eval");
  const hasVideoEndIssue = issues.some(issue => issue.eval_name === "video_end_consistency_eval");
  const hasAutoCorrectableIssue = issues.some(issue => issue.auto_correctable === true);
  const hasRegenerationIssue = issues.some(issue => issue.auto_correctable === false);
  
  const classes = [
    "segment",
    segment.source,
    issues.length ? "has-issue" : "",
    state.selectedSegmentId === segment.segment_id ? "selected" : "",
    hasGapAnalysis ? "has-gap-analysis" : "",
    hasOverlapAnalysis ? "has-overlap-analysis" : "",
    hasVideoEndIssue ? "has-video-end-issue" : "",
    hasAutoCorrectableIssue ? "auto-correctable" : "",
    hasRegenerationIssue ? "needs-regeneration" : "",
  ].filter(cls => cls).join(" ");
  const title = `${fmtTime(segment.start_sec)} - ${fmtTime(segment.end_sec)}\\n${segment.caption}`;
  return `
    <div class="${classes}" data-segment-id="${escapeHtml(segment.segment_id)}" title="${escapeHtml(title)}" style="left:${left}%;width:${width}%">
      <div class="segment-caption">${highest ? `<span class="badge ${highest}">${highest}</span> ` : ""}${escapeHtml(segment.caption)}</div>
      ${issues.length ? `<div class="segment-tags">${tags}${moreTag}</div>` : ""}
    </div>`;
}

function renderIssues() {
  const task = selectedTask();
  if (!task) return;
  const issues = issuesForTask(task.task_id)
    .filter((issue) => !state.selectedSegmentId || issue.segment_id === state.selectedSegmentId)
    .sort((a, b) => severityRank(b.severity) - severityRank(a.severity));
  const overlaps = overlapsForTask(task.task_id).sort((a, b) => b.overlap_seconds - a.overlap_seconds);
  const groupCovers = groupCoversForTask(task.task_id).sort((a, b) => b.child_count - a.child_count || b.coverage_ratio - a.coverage_ratio);
  $("issueCountForTask").textContent = fmt(issues.length);
  $("overlapCountForTask").textContent = fmt(overlaps.length);
  $("groupCoverCountForTask").textContent = fmt(groupCovers.length);

  $("issuesList").innerHTML = issues.length
    ? issues.map(renderIssueCard).join("")
    : `<div class="empty">No issues for this ${state.selectedSegmentId ? "segment" : "task"}.</div>`;

  $("overlapList").innerHTML = overlaps.length || groupCovers.length
    ? [
        groupCovers.length ? renderGroupedOverlapSummary(groupCovers) : "",
        overlaps.length ? `<div class="subsection-label">Pairwise overlaps</div>${overlaps.map(renderOverlapCard).join("")}` : "",
      ].join("")
    : '<div class="empty">No overlap pairs detected.</div>';

  $("groupCoverList").innerHTML = groupCovers.length
    ? groupCovers.map(renderGroupCoverCard).join("")
    : '<div class="empty">No macro segments covering child groups detected.</div>';

  document.querySelectorAll("[data-jump-segment]").forEach((el) => {
    el.addEventListener("click", () => {
      state.selectedSegmentId = el.dataset.jumpSegment;
      renderTimeline();
      renderIssues();
    });
  });
}

function renderIssueCard(issue) {
  const isLanguagePolicyIssue = issue.eval_name === "zion_language_policy_eval";
  const timestampDetail = issue.eval_name === "timestamp_validity_eval" ? timestampValidityDetail(issue) : "";
  const task = issue.eval_name === "object_reference_eval"
    ? state.tasks.find((item) => item.task_id === issue.task_id)
    : null;
  return `
    <article class="issue-card" ${issue.segment_id ? `data-jump-segment="${escapeHtml(issue.segment_id)}"` : ""}>
      <div class="issue-title">
        <span>${escapeHtml(issue.eval_name)}</span>
        <span class="badge ${severityClass(issue.severity)}">${escapeHtml(issue.severity)}</span>
      </div>
      <div class="issue-message">${escapeHtml(issue.message)}</div>
      ${timestampDetail ? `<div class="issue-evidence"><strong>Problem:</strong> ${escapeHtml(timestampDetail)}</div>` : ""}
      ${issue.eval_name === "object_reference_eval" ? renderObjectReferenceProblem(issue, task) : ""}
      ${issue.evidence ? `<div class="issue-evidence">${highlightLanguagePolicyTerms(issue.evidence, isLanguagePolicyIssue)}</div>` : ""}
      <div class="issue-evidence">${fmtTime(issue.start_sec)} ${issue.end_sec ? `- ${fmtTime(issue.end_sec)}` : ""}</div>
    </article>`;
}

function renderOverlapCard(overlap) {
  return `
    <article class="issue-card" data-jump-segment="${escapeHtml(overlap.segment_b_id)}">
      <div class="issue-title">
        <span>Segments ${overlap.segment_a_index} + ${overlap.segment_b_index}</span>
        <span class="badge ${severityClass(overlap.severity)}">${escapeHtml(overlap.severity)}</span>
      </div>
      <div class="issue-message">${fmt(overlap.overlap_seconds, 3)}s overlap from ${fmtTime(overlap.overlap_start_sec)} to ${fmtTime(overlap.overlap_end_sec)}</div>
      <div class="issue-evidence">${escapeHtml(overlap.segment_a_caption.slice(0, 180))}</div>
      <div class="issue-evidence">${escapeHtml(overlap.segment_b_caption.slice(0, 180))}</div>
    </article>`;
}

function renderGroupedOverlapSummary(groupCovers) {
  return `
    <div class="subsection-label">Macro segments covering child groups</div>
    ${groupCovers.map(renderMacroComparisonCard).join("")}`;
}

function renderMacroComparisonCard(cover) {
  const children = cover.child_array_indices.map((idx, position) => ({
    index: idx,
    caption: cover.child_captions[position] || "",
    id: cover.child_segment_ids[position],
  }));
  return `
    <article class="macro-card" data-jump-segment="${escapeHtml(cover.macro_segment_id)}">
      <div class="issue-title">
        <span>Macro ${cover.macro_array_index} covers ${cover.child_count} child segments</span>
        <span class="badge ${severityClass(cover.severity)}">${escapeHtml(cover.severity)}</span>
      </div>
      <div class="issue-message">
        ${fmtTime(cover.macro_start_sec)} - ${fmtTime(cover.macro_end_sec)}
        · child span ${fmtTime(cover.child_start_sec)} - ${fmtTime(cover.child_end_sec)}
        · ${fmt(cover.coverage_ratio * 100, 0)}% coverage
      </div>
      <div class="macro-comparison">
        <div class="macro-caption">
          <div class="caption-label">Macro caption</div>
          <p>${escapeHtml(cover.macro_caption)}</p>
        </div>
        <div class="child-caption-list">
          <div class="caption-label">Included child captions</div>
          ${children.map((child) => `
            <button class="child-caption" type="button" data-jump-segment="${escapeHtml(child.id)}">
              <span>#${escapeHtml(child.index)}</span>
              <p>${escapeHtml(child.caption)}</p>
            </button>
          `).join("")}
        </div>
      </div>
    </article>`;
}

function renderGroupCoverCard(cover) {
  return `
    <article class="issue-card" data-jump-segment="${escapeHtml(cover.macro_segment_id)}">
      <div class="issue-title">
        <span>Macro ${cover.macro_array_index} covers ${cover.child_count} segments</span>
        <span class="badge ${severityClass(cover.severity)}">${escapeHtml(cover.severity)}</span>
      </div>
      <div class="issue-message">
        ${fmt(cover.macro_duration_sec, 3)}s macro from ${fmtTime(cover.macro_start_sec)} to ${fmtTime(cover.macro_end_sec)}
        covers child indices ${escapeHtml(cover.child_array_indices.join(", "))}.
      </div>
      <div class="issue-evidence">Child span: ${fmtTime(cover.child_start_sec)} - ${fmtTime(cover.child_end_sec)} (${fmt(cover.coverage_ratio * 100, 0)}% of macro)</div>
      <div class="issue-evidence">${escapeHtml(cover.macro_caption.slice(0, 220))}</div>
    </article>`;
}

function csvEscape(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = versionedFilename(filename);
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  window.setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 250);
}

function toCsv(rows, header) {
  return [
    header.join(","),
    ...rows.map((row) => header.map((field) => csvEscape(row[field])).join(",")),
  ].join("\n");
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"' && inQuotes && next === '"') {
      field += '"';
      i += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(field);
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  row.push(field);
  if (row.some((value) => value !== "")) rows.push(row);
  if (!rows.length) return [];
  const header = rows[0].map((value) => value.trim());
  return rows.slice(1).map((values) => Object.fromEntries(header.map((key, index) => [key, values[index] ?? ""])));
}

async function loadCsvFile(kind, file) {
  if (!file) return;
  const text = await file.text();
  const rows = parseCsv(text);
  if (kind === "new") {
    state.csvLoader.newRows = rows;
    state.csvLoader.newFileName = file.name;
    setCurrentVersionFromFile(file.name);
  } else {
    state.csvLoader.previousRows = rows;
    state.csvLoader.previousFileName = file.name;
  }
  recomputeCsvDiff();
}

function dedupeKeysForRow(row) {
  const mode = els.dedupeKeySelect.value;
  const taskId = row.task_id || "";
  const folder = row.client_folder_name || "";
  if (mode === "task_id") return taskId ? [taskId] : [];
  if (mode === "client_folder_name") return folder ? [folder] : [];
  return [taskId && `task:${taskId}`, folder && `folder:${folder}`].filter(Boolean);
}

function fallbackPreviousRows() {
  return state.tasks.map((task) => ({
    task_id: task.task_id,
    client_folder_name: task.client_folder_name,
  }));
}

function recomputeCsvDiff() {
  const previousRows = state.csvLoader.previousRows.length ? state.csvLoader.previousRows : fallbackPreviousRows();
  const previousKeys = new Set(previousRows.flatMap(dedupeKeysForRow));
  const newOnlyRows = [];
  const duplicateRows = [];
  for (const row of state.csvLoader.newRows) {
    const keys = dedupeKeysForRow(row);
    const isDuplicate = keys.length > 0 && keys.some((key) => previousKeys.has(key));
    (isDuplicate ? duplicateRows : newOnlyRows).push(row);
  }
  state.csvLoader.newOnlyRows = newOnlyRows;
  state.csvLoader.duplicateRows = duplicateRows;
  renderCsvLoaderSummary();
}

function renderCsvLoaderSummary() {
  const hasNew = state.csvLoader.newRows.length > 0;
  const previousSource = state.csvLoader.previousRows.length
    ? state.csvLoader.previousFileName
    : "current bundled dataset";
  $("csvLoaderSummary").innerHTML = hasNew
    ? `
      <strong>${fmt(state.csvLoader.newRows.length, 0)}</strong> rows loaded from ${escapeHtml(state.csvLoader.newFileName)}.
      Compared against ${escapeHtml(previousSource)}.
      <strong>${fmt(state.csvLoader.newOnlyRows.length, 0)}</strong> new rows,
      <strong>${fmt(state.csvLoader.duplicateRows.length, 0)}</strong> duplicates excluded.
    `
    : "Load a new CSV to calculate which tasks are new versus already present.";
  els.downloadNewOnlyCsvBtn.disabled = !state.csvLoader.newOnlyRows.length;
  els.downloadDuplicateCsvBtn.disabled = !state.csvLoader.duplicateRows.length;
  els.loadNewTasksBtn.disabled = !state.csvLoader.newOnlyRows.length;
}

function downloadCsvRows(filename, rows) {
  if (!rows.length) return;
  const header = Object.keys(rows[0]);
  downloadFile(filename, toCsv(rows, header), "text/csv;charset=utf-8");
}

function safeJsonParse(value, fallback = {}) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function safeNumber(value, fallback = 0) {
  const num = Number(value);
  return isNaN(num) ? fallback : num;
}

function normalizeSegments(taskId, source, annotation) {
  return (annotation.phase_captions || []).map((segment, index) => {
    const startSec = parseTimeToSeconds(segment.start);
    const endSec = parseTimeToSeconds(segment.end);
    return {
      segment_id: `${taskId}:${source}:${index}`,
      task_id: taskId,
      source,
      array_index: index,
      phase_index: segment.phase_index ?? index,
      start: segment.start ?? "",
      end: segment.end ?? "",
      start_sec: startSec,
      end_sec: endSec,
      duration_sec: startSec !== null && endSec !== null ? Math.max(0, endSec - startSec) : null,
      caption: segment.caption || "",
      visual_evidence: segment.visual_evidence || "",
      covered_markers: segment.covered_markers || [],
      timestamp_start_issue: null,
      timestamp_end_issue: null,
    };
  });
}

function issueSeverityCounts(taskIssues) {
  return {
    critical_count: taskIssues.filter((issue) => issue.severity === "critical").length,
    high_count: taskIssues.filter((issue) => issue.severity === "high").length,
    medium_count: taskIssues.filter((issue) => issue.severity === "medium").length,
    low_count: taskIssues.filter((issue) => issue.severity === "low").length,
  };
}

function strictMissingHandIssueForSegment(segment) {
  if (segment.source !== "final") return null;
  if (String(segment.caption || "").trim().toLowerCase() === "no caption") return null;
  const text = ` ${segment.caption || ""} ${segment.visual_evidence || ""} `.toLowerCase();
  const hasExplicitBothHands = /\bboth\s+hands?\b|\btwo\s+hands?\b/.test(text);
  const hasLeft = /\bleft\s+hand\b/.test(text);
  const hasRight = /\bright\s+hand\b/.test(text);
  const hasSimpleBoth = /\bboth\b/.test(text);
  const hasGenericHands = /\bhands?\b/.test(text);
  if (hasExplicitBothHands || (hasLeft && hasRight)) return null;
  
  // Check for "both" without explicit left/right hands - flag as low severity warning
  if (hasSimpleBoth && !hasExplicitBothHands && !hasLeft && !hasRight) {
    return {
      issue_id: `STRICT-HAND-${segment.segment_id}`,
      task_id: segment.task_id,
      segment_id: segment.segment_id,
      source: "final",
      eval_name: "missing_hand_annotations_eval",
      severity: "low",
      message: "Caption mentions 'both' without specifying left/right hands",
      evidence: "Found 'both' but no explicit left hand, right hand, or both hands reference.",
      start_sec: segment.start_sec,
      end_sec: segment.end_sec,
      suggested_action: "Consider clarifying 'both' as 'both hands' or specify left/right hand roles.",
    };
  }
  
  let message = "";
  let evidence = "";
  if (!hasGenericHands && !hasLeft && !hasRight) {
    message = "Caption does not mention any hand";
    evidence = "No left/right/both hand reference found.";
  } else if (hasLeft && !hasRight) {
    message = "Caption mentions only the left hand";
    evidence = "Only `left hand` found; right/both hand participation is not described.";
  } else if (hasRight && !hasLeft) {
    message = "Caption mentions only the right hand";
    evidence = "Only `right hand` found; left/both hand participation is not described.";
  } else {
    message = "Caption uses generic hand wording without left/right/both";
    evidence = "Generic hand reference found without explicit left/right/both.";
  }
  return {
    issue_id: `STRICT-HAND-${segment.segment_id}`,
    task_id: segment.task_id,
    segment_id: segment.segment_id,
    source: "final",
    eval_name: "missing_hand_annotations_eval",
    severity: "medium",
    message,
    evidence,
    start_sec: segment.start_sec,
    end_sec: segment.end_sec,
    suggested_action: "Rewrite caption to explicitly mention left hand, right hand, or both hands.",
  };
}

function recalculateTaskIssueCounts(taskIds = null) {
  const targetIds = taskIds || new Set(state.tasks.map((task) => task.task_id));
  for (const task of state.tasks) {
    if (!targetIds.has(task.task_id)) continue;
    const taskIssues = state.issues.filter((issue) => issue.task_id === task.task_id);
    const counts = issueSeverityCounts(taskIssues);
    Object.assign(task, counts);
    task.issue_count = taskIssues.length;
    task.eval_names = [...new Set(taskIssues.map((issue) => issue.eval_name))];
    task.max_severity_rank = Math.max(0, ...taskIssues.map((issue) => severityRank(issue.severity)));
    task.risk_score = task.critical_count * 100 + task.high_count * 40 + task.medium_count * 10 + task.low_count * 2;
    
    // Initialize advanced timeline metrics if not already set
    if (task.auto_correctable_count === undefined) task.auto_correctable_count = 0;
    if (task.needs_regeneration_count === undefined) task.needs_regeneration_count = 0;
  }
}

function applyStrictMissingHandEval(taskIds = null) {
  const targetIds = taskIds || new Set(state.tasks.map((task) => task.task_id));
  state.issues = state.issues.filter((issue) => (
    issue.eval_name !== "missing_hand_annotations_eval" || !targetIds.has(issue.task_id)
  ));
  const newIssues = state.finalSegments
    .filter((segment) => targetIds.has(segment.task_id))
    .map(strictMissingHandIssueForSegment)
    .filter(Boolean);
  state.issues.push(...newIssues);
  recalculateTaskIssueCounts(targetIds);
}

function applyAdvancedTimelineEvals(taskIds = null) {
  const targetIds = taskIds || new Set(state.tasks.map((task) => task.task_id));
  
  // Remove existing advanced timeline issues for target tasks
  const advancedEvals = ["segment_gap_analysis_eval", "segment_overlap_analysis_eval", "video_end_consistency_eval"];
  state.issues = state.issues.filter((issue) => (
    !advancedEvals.includes(issue.eval_name) || !targetIds.has(issue.task_id)
  ));

  // Apply new evaluations
  const allNewIssues = [];
  for (const task of state.tasks) {
    if (!targetIds.has(task.task_id)) continue;
    
    const taskFinalSegments = state.finalSegments.filter(seg => seg.task_id === task.task_id);
    
    // Apply the 3 new evaluation functions
    const gapIssues = segmentGapAnalysisEval(task, taskFinalSegments);
    const overlapData = segmentOverlapAnalysisEval(task, taskFinalSegments);
    const videoEndIssues = videoEndConsistencyEval(task, taskFinalSegments);
    
    allNewIssues.push(...gapIssues, ...overlapData.issues, ...videoEndIssues);
    
    // Add auto-correction metrics to task
    const timelineIssues = [...gapIssues, ...overlapData.issues, ...videoEndIssues];
    task.auto_correctable_count = safeNumber(timelineIssues.filter(issue => issue.auto_correctable).length);
    task.needs_regeneration_count = safeNumber(timelineIssues.filter(issue => !issue.auto_correctable).length);
  }
  
  state.issues.push(...allNewIssues);
  recalculateTaskIssueCounts(targetIds);
}

function buildOverlapData(task, finalSegments) {
  const issues = [];
  const overlaps = [];
  const valid = finalSegments
    .filter((segment) => segment.start_sec !== null && segment.end_sec !== null && segment.end_sec > segment.start_sec)
    .sort((a, b) => a.start_sec - b.start_sec || a.end_sec - b.end_sec);
  for (let i = 0; i < valid.length; i += 1) {
    for (let j = i + 1; j < valid.length; j += 1) {
      if (valid[j].start_sec >= valid[i].end_sec) break;
      const start = Math.max(valid[i].start_sec, valid[j].start_sec);
      const end = Math.min(valid[i].end_sec, valid[j].end_sec);
      const seconds = end - start;
      if (seconds <= 0) continue;
      const overlap = {
        task_id: task.task_id,
        segment_a_id: valid[i].segment_id,
        segment_b_id: valid[j].segment_id,
        segment_a_index: valid[i].array_index,
        segment_b_index: valid[j].array_index,
        overlap_start_sec: start,
        overlap_end_sec: end,
        overlap_seconds: seconds,
        segment_a_caption: valid[i].caption,
        segment_b_caption: valid[j].caption,
        severity: seconds >= 2 ? "critical" : "high",
      };
      overlaps.push(overlap);
      issues.push({
        issue_id: `UPLOAD-${task.task_id}-overlap-${i}-${j}`,
        task_id: task.task_id,
        segment_id: valid[j].segment_id,
        source: "final",
        eval_name: "segment_overlap_eval",
        severity: overlap.severity,
        message: "Uploaded CSV final segments overlap in time",
        evidence: `${fmt(seconds, 3)}s overlap between segments ${valid[i].array_index} and ${valid[j].array_index}`,
        start_sec: start,
        end_sec: end,
        suggested_action: "Review whether one segment should be split, merged, or removed.",
      });
    }
  }
  return { issues, overlaps };
}

function buildGapIssues(task, finalSegments, minGapSeconds = 3) {
  const issues = [];
  const valid = finalSegments
    .filter((segment) => segment.start_sec !== null && segment.end_sec !== null && segment.end_sec > segment.start_sec)
    .sort((a, b) => a.start_sec - b.start_sec || a.end_sec - b.end_sec);
  let cursor = null;
  for (const segment of valid) {
    if (cursor && segment.start_sec > cursor.end_sec) {
      const gap = segment.start_sec - cursor.end_sec;
      if (gap >= minGapSeconds) {
        issues.push({
          issue_id: `UPLOAD-${task.task_id}-gap-${cursor.array_index}-${segment.array_index}`,
          task_id: task.task_id,
          segment_id: segment.segment_id,
          source: "final",
          eval_name: "timestamp_gap_eval",
          severity: gap >= 8 ? "high" : "medium",
          message: "Uploaded CSV final timeline has a large gap",
          evidence: `${fmt(gap, 3)}s gap before segment ${segment.array_index}`,
          start_sec: cursor.end_sec,
          end_sec: segment.start_sec,
          suggested_action: "Check whether a segment or no-action phase is missing.",
        });
      }
    }
    if (!cursor || segment.end_sec > cursor.end_sec) cursor = segment;
  }
  return issues;
}

function timestampValidityIssueForSegment(task, segment) {
  const duration = Number(task.final_duration_secs || task.actual_video_duration || 0);
  let type = "";
  let message = "";
  let suggested = "Fix timestamp so start/end are valid and fit the video.";
  if (!segment.start && !segment.end) {
    type = "missing_timestamp";
    message = "Start and end timestamps are missing";
  } else if (!segment.start || !segment.end) {
    type = "missing_timestamp";
    message = "Start or end timestamp is missing";
  } else if (segment.start_sec === null || segment.end_sec === null) {
    type = "unparseable";
    message = "Timestamp is not parseable";
  } else if (segment.start_sec < 0 || segment.end_sec < 0) {
    type = "negative_time";
    message = "Timestamp is negative";
  } else if (segment.start_sec >= segment.end_sec) {
    type = "invalid_order";
    message = "Segment start is not before end";
  } else if (duration && segment.end_sec > duration) {
    type = "outside_duration";
    message = "Segment is outside video duration";
    suggested = "Clamp/correct segment to fit video duration.";
  }
  if (!type) return null;
  return {
    issue_id: `UPLOAD-${task.task_id}-timestamp-validity-${segment.array_index}`,
    task_id: task.task_id,
    segment_id: segment.segment_id,
    source: "final",
    eval_name: "timestamp_validity_eval",
    severity: "critical",
    message,
    evidence: `duration=${duration || ""} start=${segment.start || ""} end=${segment.end || ""}`,
    start_sec: segment.start_sec,
    end_sec: segment.end_sec,
    suggested_action: suggested,
    timestamp_error_type: type,
  };
}

function buildDashboardDataFromRows(rows) {
  const tasks = [];
  const originalSegments = [];
  const finalSegments = [];
  const issues = [];
  const overlaps = [];
  for (const row of rows) {
    const clientAnnotation = safeJsonParse(row.client_annotations, {});
    const finalAnnotation = safeJsonParse(row.final_annotations, {});
    const taskName = finalAnnotation.task_name || clientAnnotation.task_name || row.client_folder_name || row.task_id;
    const task = {
      task_id: row.task_id,
      client_folder_name: row.client_folder_name,
      task_name: taskName,
      status: row.status || "",
      trainer_user_id: row.trainer_user_id || "",
      reviewer_user_id: row.reviewer_user_id || "",
      review_score: row.review_score || "",
      review_comments: row.review_comments || "",
      actual_video_duration: Number(row.actual_video_duration || finalAnnotation.duration_secs || clientAnnotation.duration_secs || 0),
      final_duration_secs: Number(finalAnnotation.duration_secs || row.actual_video_duration || clientAnnotation.duration_secs || 0),
      original_segment_count: (clientAnnotation.phase_captions || []).length,
      final_segment_count: (finalAnnotation.phase_captions || []).length,
      object_inventory: finalAnnotation.object_inventory || [],
      object_consistency_notes: finalAnnotation.object_consistency_notes || [],
      error_categories: safeJsonParse(row.error_categories, {}),
      date_created: row.date_created || "",
      date_updated: row.date_updated || "",
      issue_count: 0,
      critical_count: 0,
      high_count: 0,
      medium_count: 0,
      low_count: 0,
      overlap_count: 0,
      max_severity_rank: 0,
      risk_score: 0,
      eval_names: [],
      group_cover_count: 0,
    };
    const taskOriginalSegments = normalizeSegments(task.task_id, "original", clientAnnotation);
    const taskFinalSegments = normalizeSegments(task.task_id, "final", finalAnnotation);
    const overlapData = buildOverlapData(task, taskFinalSegments);
    const gapIssues = buildGapIssues(task, taskFinalSegments);
    const handIssues = taskFinalSegments.map(strictMissingHandIssueForSegment).filter(Boolean);
    const timestampIssues = taskFinalSegments.map((segment) => timestampValidityIssueForSegment(task, segment)).filter(Boolean);
    const taskIssues = [...overlapData.issues, ...gapIssues, ...handIssues, ...timestampIssues];
    const counts = issueSeverityCounts(taskIssues);
    Object.assign(task, counts);
    task.issue_count = taskIssues.length;
    task.overlap_count = overlapData.overlaps.length;
    task.eval_names = [...new Set(taskIssues.map((issue) => issue.eval_name))];
    task.max_severity_rank = Math.max(0, ...taskIssues.map((issue) => severityRank(issue.severity)));
    task.risk_score = task.critical_count * 100 + task.high_count * 40 + task.medium_count * 10 + task.low_count * 2;
    tasks.push(task);
    originalSegments.push(...taskOriginalSegments);
    finalSegments.push(...taskFinalSegments);
    issues.push(...taskIssues);
    overlaps.push(...overlapData.overlaps);
  }
  return { tasks, originalSegments, finalSegments, issues, overlaps };
}

function loadNewTasksIntoDashboard() {
  const data = buildDashboardDataFromRows(state.csvLoader.newOnlyRows);
  if (!data.tasks.length) return;
  const taskIds = new Set(data.tasks.map((task) => task.task_id));
  state.tasks = [...state.tasks.filter((task) => !taskIds.has(task.task_id)), ...data.tasks];
  state.originalSegments = [...state.originalSegments.filter((segment) => !taskIds.has(segment.task_id)), ...data.originalSegments];
  state.finalSegments = [...state.finalSegments.filter((segment) => !taskIds.has(segment.task_id)), ...data.finalSegments];
  state.issues = [...state.issues.filter((issue) => !taskIds.has(issue.task_id)), ...data.issues];
  state.overlaps = [...state.overlaps.filter((overlap) => !taskIds.has(overlap.task_id)), ...data.overlaps];
  state.coveringSegments = state.coveringSegments.filter((cover) => !taskIds.has(cover.task_id));
  state.summary = {
    ...state.summary,
    task_count: state.tasks.length,
    issue_count: state.issues.length,
    uploaded_task_count: data.tasks.length,
    evaluation_version: state.currentVersion.name,
    evaluation_source_file: state.currentVersion.source_file,
    evaluation_loaded_at: new Date().toISOString(),
  };
  state.selectedTaskId = data.tasks[0].task_id;
  applyStrictMissingHandEval(taskIds); // Apply hand annotations eval to new tasks
  applyAdvancedTimelineEvals(taskIds); // Apply advanced timeline analysis to new tasks
  hydrateDynamicFilters();
  renderAll();
  $("csvLoaderSummary").innerHTML += ` <strong>${fmt(data.tasks.length, 0)}</strong> new tasks loaded into the dashboard.`;
}

function exportFilteredCsv() {
  const exportType = els.exportTypeSelect.value;
  const tasks = filteredTasks();
  const taskIds = new Set(tasks.map((task) => task.task_id));

  if (exportType === "tasks_csv") {
    const header = ["task_id", "task_name", "trainer_user_id", "risk_score", "issue_count", "critical_count", "high_count", "overlap_count", "group_cover_count"];
    downloadFile("zion_filtered_tasks.csv", toCsv(tasks, header), "text/csv;charset=utf-8");
    return;
  }

  if (exportType === "tasks_with_flags_csv") {
    exportTasksWithFlags(tasks);
    return;
  }

  if (exportType === "sidebar_tasks_csv") {
    exportSidebarFilteredTasks(tasks);
    return;
  }

  if (exportType === "issues_csv") {
    const rows = state.issues.filter((issue) => taskIds.has(issue.task_id));
    const header = ["issue_id", "task_id", "segment_id", "source", "eval_name", "severity", "message", "evidence", "start_sec", "end_sec", "suggested_action"];
    downloadFile("zion_filtered_issues.csv", toCsv(rows, header), "text/csv;charset=utf-8");
    return;
  }

  if (exportType === "overlaps_csv") {
    const rows = state.overlaps.filter((overlap) => taskIds.has(overlap.task_id));
    const header = ["overlap_id", "task_id", "segment_a_index", "segment_b_index", "overlap_start_sec", "overlap_end_sec", "overlap_seconds", "severity", "segment_a_caption", "segment_b_caption"];
    downloadFile("zion_filtered_overlaps.csv", toCsv(rows, header), "text/csv;charset=utf-8");
    return;
  }

  if (exportType === "group_covers_csv") {
    const rows = state.coveringSegments
      .filter((cover) => taskIds.has(cover.task_id))
      .map((cover) => ({
        ...cover,
        child_array_indices: cover.child_array_indices.join(","),
        child_phase_indices: cover.child_phase_indices.join(","),
        child_captions: cover.child_captions.join(" || "),
      }));
    const header = ["cover_id", "task_id", "severity", "macro_array_index", "macro_phase_index", "macro_start_sec", "macro_end_sec", "macro_duration_sec", "child_count", "child_array_indices", "child_start_sec", "child_end_sec", "child_span_sec", "coverage_ratio", "macro_caption", "child_captions"];
    downloadFile("zion_filtered_group_covers.csv", toCsv(rows, header), "text/csv;charset=utf-8");
    return;
  }

  if (exportType === "approved_tasks_csv") {
    exportReviewedTasks("approved", tasks);
    return;
  }

  if (exportType === "rejected_tasks_flags_csv") {
    exportReviewedTasks("rejected", tasks);
    return;
  }

  const bundle = {
    exported_at: new Date().toISOString(),
    evaluation_version: state.currentVersion,
    filters: state.filters,
    tasks,
    issues: state.issues.filter((issue) => taskIds.has(issue.task_id)),
    overlaps: state.overlaps.filter((overlap) => taskIds.has(overlap.task_id)),
    group_covers: state.coveringSegments.filter((cover) => taskIds.has(cover.task_id)),
    original_segments: state.originalSegments.filter((segment) => taskIds.has(segment.task_id)),
    final_segments: state.finalSegments.filter((segment) => taskIds.has(segment.task_id)),
    decisions: Object.fromEntries(Object.entries(state.decisions).filter(([taskId]) => taskIds.has(taskId))),
  };
  downloadFile("zion_filtered_bundle.json", JSON.stringify(bundle, null, 2), "application/json;charset=utf-8");
}

// ============================================================================
// NEW ADVANCED TIMELINE ANALYSIS FUNCTIONS
// ============================================================================

function segmentGapAnalysisEval(task, finalSegments) {
  const issues = [];
  const valid = finalSegments
    .filter((segment) => segment.start_sec !== null && segment.end_sec !== null && segment.end_sec > segment.start_sec)
    .sort((a, b) => a.start_sec - b.start_sec || a.end_sec - b.end_sec);
  
  let cursor = null;
  for (const segment of valid) {
    if (cursor && segment.start_sec > cursor.end_sec) {
      const gap = segment.start_sec - cursor.end_sec;
      if (gap > 0.1) { // Gaps larger than 100ms
        let severity, message, action;
        
        if (gap < 1.0) {
          severity = "low";
          message = "Small gap detected - auto-correctable";
          action = "Gap can be auto-corrected by extending previous segment or adjusting next segment start.";
        } else if (gap < 3.0) {
          severity = "medium"; 
          message = "Medium gap detected - requires review";
          action = "Review gap to determine if missing content or valid pause. Consider regeneration if action missing.";
        } else {
          severity = "high";
          message = "Large gap detected - likely missing content";
          action = "Significant gap suggests missing action phase. Regenerate segments for this time range.";
        }

        issues.push({
          issue_id: `GAP-ANALYSIS-${task.task_id}-${cursor.array_index}-${segment.array_index}`,
          task_id: task.task_id,
          segment_id: segment.segment_id,
          source: "final",
          eval_name: "segment_gap_analysis_eval",
          severity,
          message,
          evidence: `${fmt(gap, 3)}s gap between segments ${cursor.array_index} and ${segment.array_index} (${fmtTime(cursor.end_sec)} - ${fmtTime(segment.start_sec)})`,
          start_sec: cursor.end_sec,
          end_sec: segment.start_sec,
          suggested_action: action,
          gap_duration: safeNumber(gap),
          auto_correctable: safeNumber(gap) < 1.0,
        });
      }
    }
    if (!cursor || segment.end_sec > cursor.end_sec) cursor = segment;
  }
  return issues;
}

function segmentOverlapAnalysisEval(task, finalSegments) {
  const issues = [];
  const overlaps = [];
  const valid = finalSegments
    .filter((segment) => segment.start_sec !== null && segment.end_sec !== null && segment.end_sec > segment.start_sec)
    .sort((a, b) => a.start_sec - b.start_sec || a.end_sec - b.end_sec);

  for (let i = 0; i < valid.length - 1; i++) {
    for (let j = i + 1; j < valid.length; j++) {
      const segA = valid[i];
      const segB = valid[j];
      const start = Math.max(segA.start_sec, segB.start_sec);
      const end = Math.min(segA.end_sec, segB.end_sec);
      const overlapDuration = end - start;
      
      if (overlapDuration > 0.05) { // Detect overlaps larger than 50ms
        let severity, message, action;
        
        if (overlapDuration < 1.0) {
          severity = "medium";
          message = "Small overlap detected - auto-correctable"; 
          action = "Overlap can be auto-corrected by proportional compression or boundary adjustment.";
        } else if (overlapDuration < 2.0) {
          severity = "high";
          message = "Medium overlap detected - requires review";
          action = "Significant overlap requires manual review to determine which segment boundaries to adjust.";
        } else {
          severity = "critical";
          message = "Large overlap detected - major timing conflict";
          action = "Major overlap indicates structural timeline problem. Regenerate affected segments.";
        }

        const overlap = {
          task_id: task.task_id,
          segment_a_id: segA.segment_id,
          segment_b_id: segB.segment_id,
          overlap_start_sec: start,
          overlap_end_sec: end,
          overlap_duration_sec: overlapDuration,
          segment_a_caption: segA.caption,
          segment_b_caption: segB.caption,
          severity,
          auto_correctable: overlapDuration < 1.0,
        };
        overlaps.push(overlap);
        
        issues.push({
          issue_id: `OVERLAP-ANALYSIS-${task.task_id}-${i}-${j}`,
          task_id: task.task_id,
          segment_id: segB.segment_id,
          source: "final",
          eval_name: "segment_overlap_analysis_eval",
          severity,
          message,
          evidence: `${fmt(overlapDuration, 3)}s overlap between segments ${segA.array_index} and ${segB.array_index} (${fmtTime(start)} - ${fmtTime(end)})`,
          start_sec: start,
          end_sec: end,
          suggested_action: action,
          overlap_duration: safeNumber(overlapDuration),
          auto_correctable: safeNumber(overlapDuration) < 1.0,
        });
      }
    }
  }
  return { issues, overlaps };
}

function videoEndConsistencyEval(task, finalSegments) {
  const issues = [];
  const videoDuration = Number(task.final_duration_secs || task.actual_video_duration || 0) || 0;
  
  if (videoDuration <= 0) return issues; // Can't evaluate without video duration

  const valid = finalSegments
    .filter((segment) => segment.start_sec !== null && segment.end_sec !== null && segment.end_sec > segment.start_sec)
    .sort((a, b) => b.end_sec - a.end_sec); // Sort by end time, latest first
    
  if (!valid.length) return issues;
  
  const lastSegment = valid[0]; // Segment that ends latest
  const endDifference = Math.abs(lastSegment.end_sec - videoDuration);
  
  if (endDifference > 0.05) { // Detect differences larger than 50ms
    let severity, message, action;
    
    if (endDifference < 1.0) {
      severity = "low";
      message = "Minor video end mismatch - auto-correctable";
      action = "Adjust final segment end time to match video duration exactly.";
    } else if (endDifference < 3.0) {
      severity = "medium"; 
      message = "Moderate video end mismatch - requires review";
      action = "Review final segment timing. May need to extend, trim, or add missing final action.";
    } else {
      severity = "critical";
      message = "Major video end mismatch - structural problem";
      action = "Significant mismatch suggests missing or incorrect final segments. Regenerate end timeline.";
    }

    issues.push({
      issue_id: `VIDEO-END-${task.task_id}-${lastSegment.segment_id}`,
      task_id: task.task_id,
      segment_id: lastSegment.segment_id,
      source: "final",
      eval_name: "video_end_consistency_eval",
      severity,
      message,
      evidence: `Final segment ends at ${fmtTime(lastSegment.end_sec)} but video duration is ${fmtTime(videoDuration)} (${fmt(endDifference, 3)}s difference)`,
      start_sec: lastSegment.end_sec,
      end_sec: videoDuration,
      suggested_action: action,
      end_difference: safeNumber(endDifference),
      auto_correctable: safeNumber(endDifference) < 1.0,
      segment_too_short: lastSegment.end_sec < videoDuration,
    });
  }
  
  return issues;
}

init().catch((error) => {
  document.body.innerHTML = `<pre style="color:#fff;padding:24px">${escapeHtml(error.stack || error.message)}</pre>`;
});
