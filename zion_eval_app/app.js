const state = {
  summary: null,
  tasks: [],
  originalSegments: [],
  finalSegments: [],
  issues: [],
  overlaps: [],
  coveringSegments: [],
  modelSegments: [],
  modelSummary: null,
  selectedTaskId: null,
  selectedSegmentId: null,
  modelFilters: {
    episode: "all",
    model: "all",
  },
  evalInfoCollapsed: false,
  filters: {
    search: "",
    issueType: "all",
    severity: "all",
    trainer: "all",
    sort: "risk",
    dateQuickRange: "all",
    createdFrom: "",
    createdTo: "",
    updatedFrom: "",
    updatedTo: "",
    modelEvalOnly: false,
    overlapOnly: false,
    groupCoverOnly: false,
    criticalOnly: false,
    noFlagsOnly: false,
    issuesOnlyTimeline: false,
    zoom: 1,
  },
};

const els = {};

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
    checks: "Possible cases where one hand is labeled but the caption suggests coordinated two-hand interaction.",
    why: "Zion captions should accurately describe left, right, or both-hand participation.",
    limitation: "Without video this is only a possible issue, because both hands may not actually be visible.",
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

function severityClass(severity) {
  return ["critical", "high", "medium", "low"].includes(severity) ? severity : "";
}

function severityRank(severity) {
  return { critical: 4, high: 3, medium: 2, low: 1 }[severity] || 0;
}

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Failed to load ${path}`);
  return response.json();
}

async function init() {
  [
    els.searchInput,
    els.issueTypeSelect,
    els.severitySelect,
    els.trainerSelect,
    els.sortSelect,
    els.dateQuickRangeSelect,
    els.createdFromInput,
    els.createdToInput,
    els.updatedFromInput,
    els.updatedToInput,
    els.modelEvalOnly,
    els.overlapOnly,
    els.groupCoverOnly,
    els.criticalOnly,
    els.noFlagsOnly,
    els.zoomRange,
    els.issuesOnlyTimeline,
    els.resetFiltersBtn,
    els.exportFilteredBtn,
    els.exportTypeSelect,
    els.toggleEvalInfoBtn,
    els.modelEpisodeSelect,
    els.modelNameSelect,
  ] = [
    $("searchInput"),
    $("issueTypeSelect"),
    $("severitySelect"),
    $("trainerSelect"),
    $("sortSelect"),
    $("dateQuickRangeSelect"),
    $("createdFromInput"),
    $("createdToInput"),
    $("updatedFromInput"),
    $("updatedToInput"),
    $("modelEvalOnly"),
    $("overlapOnly"),
    $("groupCoverOnly"),
    $("criticalOnly"),
    $("noFlagsOnly"),
    $("zoomRange"),
    $("issuesOnlyTimeline"),
    $("resetFiltersBtn"),
    $("exportFilteredBtn"),
    $("exportTypeSelect"),
    $("toggleEvalInfoBtn"),
    $("modelEpisodeSelect"),
    $("modelNameSelect"),
  ];

  const [summary, tasks, originalSegments, finalSegments, issues, overlaps, coveringSegments, modelSegments, modelSummary] = await Promise.all([
    loadJson("./data/summary.json"),
    loadJson("./data/tasks.json"),
    loadJson("./data/segments_original.json"),
    loadJson("./data/segments_final.json"),
    loadJson("./data/issues.json"),
    loadJson("./data/overlaps.json"),
    loadJson("./data/covering_segments.json"),
    loadJson("./data/model_eval_segments.json"),
    loadJson("./data/model_eval_summary.json"),
  ]);

  Object.assign(state, { summary, tasks, originalSegments, finalSegments, issues, overlaps, coveringSegments, modelSegments, modelSummary });
  state.selectedTaskId = [...tasks].sort((a, b) => b.risk_score - a.risk_score)[0]?.task_id || null;

  hydrateFilters();
  bindEvents();
  renderAll();
}

function hydrateFilters() {
  const issueTypes = [...new Set(state.issues.map((issue) => issue.eval_name))].sort();
  els.issueTypeSelect.insertAdjacentHTML(
    "beforeend",
    issueTypes.map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join("")
  );

  const trainers = [...new Set(state.tasks.map((task) => task.trainer_user_id).filter(Boolean))].sort();
  els.trainerSelect.insertAdjacentHTML(
    "beforeend",
    trainers.map((trainer) => `<option value="${escapeHtml(trainer)}">${escapeHtml(trainer)}</option>`).join("")
  );

  const modelEpisodes = [...new Map(
    state.modelSegments.map((row) => [row.episode_id, `${row.episode_id} · ${row.task_name}`])
  ).entries()].sort((a, b) => a[1].localeCompare(b[1]));
  els.modelEpisodeSelect.insertAdjacentHTML(
    "beforeend",
    modelEpisodes.map(([id, label]) => `<option value="${escapeHtml(id)}">${escapeHtml(label)}</option>`).join("")
  );

  const modelNames = [...new Set(state.modelSegments.map((row) => row.model).filter(Boolean))].sort();
  els.modelNameSelect.insertAdjacentHTML(
    "beforeend",
    modelNames.map((model) => `<option value="${escapeHtml(model)}">${escapeHtml(model)}</option>`).join("")
  );
}

function bindEvents() {
  els.searchInput.addEventListener("input", () => {
    state.filters.search = els.searchInput.value.trim().toLowerCase();
    renderAll();
  });
  els.issueTypeSelect.addEventListener("change", () => {
    state.filters.issueType = els.issueTypeSelect.value;
    renderAll();
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
  els.modelEvalOnly.addEventListener("change", () => {
    state.filters.modelEvalOnly = els.modelEvalOnly.checked;
    if (state.filters.modelEvalOnly && state.modelFilters.episode === "all") {
      state.modelFilters.episode = state.modelSummary?.episodes?.[0]?.episode_id || "all";
      els.modelEpisodeSelect.value = state.modelFilters.episode;
    }
    renderAll();
  });
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
  els.toggleEvalInfoBtn.addEventListener("click", () => {
    state.evalInfoCollapsed = !state.evalInfoCollapsed;
    renderEvalInfo();
  });
  els.modelEpisodeSelect.addEventListener("change", () => {
    state.modelFilters.episode = els.modelEpisodeSelect.value;
    renderModelDataset();
  });
  els.modelNameSelect.addEventListener("change", () => {
    state.modelFilters.model = els.modelNameSelect.value;
    renderModelDataset();
  });
}

function resetFilters() {
  Object.assign(state.filters, {
    search: "",
    issueType: "all",
    severity: "all",
    trainer: "all",
    sort: "risk",
    dateQuickRange: "all",
    createdFrom: "",
    createdTo: "",
    updatedFrom: "",
    updatedTo: "",
    modelEvalOnly: false,
    overlapOnly: false,
    groupCoverOnly: false,
    criticalOnly: false,
    noFlagsOnly: false,
    issuesOnlyTimeline: false,
    zoom: 1,
  });
  els.searchInput.value = "";
  els.issueTypeSelect.value = "all";
  els.severitySelect.value = "all";
  els.trainerSelect.value = "all";
  els.sortSelect.value = "risk";
  els.dateQuickRangeSelect.value = "all";
  els.createdFromInput.value = "";
  els.createdToInput.value = "";
  els.updatedFromInput.value = "";
  els.updatedToInput.value = "";
  els.modelEvalOnly.checked = false;
  els.overlapOnly.checked = false;
  els.groupCoverOnly.checked = false;
  els.criticalOnly.checked = false;
  els.noFlagsOnly.checked = false;
  els.issuesOnlyTimeline.checked = false;
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

function overlapsForTask(taskId) {
  return state.overlaps.filter((overlap) => overlap.task_id === taskId);
}

function groupCoversForTask(taskId) {
  return state.coveringSegments.filter((cover) => cover.task_id === taskId);
}

function modelEvalEpisodeIds() {
  return new Set((state.modelSummary?.episodes || []).flatMap((episode) => [
    episode.episode_id,
    episode.episode_uuid,
  ]));
}

function isModelEvalTask(task, episodeIds = modelEvalEpisodeIds()) {
  const fields = [
    task.task_id,
    task.client_folder_name,
    task.source_uuid,
    task.uuid,
    task.short,
  ].filter(Boolean);
  return fields.some((value) => {
    const text = String(value);
    return episodeIds.has(text) || episodeIds.has(text.slice(0, 8));
  });
}

function filteredTasks() {
  const modelEpisodeIds = modelEvalEpisodeIds();
  const filtered = state.tasks.filter((task) => {
    const taskIssues = issuesForTask(task.task_id);
    const haystack = `${task.task_id} ${task.task_name} ${task.client_folder_name} ${task.trainer_user_id}`.toLowerCase();
    if (state.filters.modelEvalOnly && !isModelEvalTask(task, modelEpisodeIds)) return false;
    if (state.filters.search && !haystack.includes(state.filters.search)) return false;
    if (state.filters.trainer !== "all" && task.trainer_user_id !== state.filters.trainer) return false;
    if (state.filters.overlapOnly && !task.overlap_count) return false;
    if (state.filters.groupCoverOnly && !task.group_cover_count) return false;
    if (state.filters.criticalOnly && !task.critical_count) return false;
    if (state.filters.noFlagsOnly && task.issue_count !== 0) return false;
    if (!isWithinDateRange(task.date_created, state.filters.createdFrom, state.filters.createdTo)) return false;
    if (!isWithinDateRange(task.date_updated, state.filters.updatedFrom, state.filters.updatedTo)) return false;
    if (state.filters.issueType !== "all" && !taskIssues.some((issue) => issue.eval_name === state.filters.issueType)) return false;
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
  if (!state.filters.modelEvalOnly && !tasks.some((task) => task.task_id === state.selectedTaskId)) {
    state.selectedTaskId = tasks[0]?.task_id || state.tasks[0]?.task_id || null;
  }
  renderStats(tasks);
  renderModelDataset();
  renderEvalInfo();
  renderTaskList(tasks);
  renderSelectedTask();
}

function filteredModelSegments() {
  return state.modelSegments.filter((row) => {
    if (state.modelFilters.episode !== "all" && row.episode_id !== state.modelFilters.episode) return false;
    if (state.modelFilters.model !== "all" && row.model !== state.modelFilters.model) return false;
    return true;
  });
}

function renderModelDataset() {
  const rows = filteredModelSegments();
  const segmentRows = rows.filter((row) => row.caption);
  const runKeys = new Set(rows.map((row) => `${row.episode_id}::${row.model}`));
  const episodeKeys = new Set(rows.map((row) => row.episode_id));
  const modelKeys = new Set(rows.map((row) => row.model));
  const costs = rows
    .map((row) => Number(row.model_cost))
    .filter((cost) => Number.isFinite(cost));
  const uniqueCostByRun = new Map();
  for (const row of rows) {
    const cost = Number(row.model_cost);
    if (Number.isFinite(cost)) uniqueCostByRun.set(`${row.episode_id}::${row.model}`, cost);
  }
  const totalCost = [...uniqueCostByRun.values()].reduce((sum, cost) => sum + cost, 0);

  $("modelSummaryGrid").innerHTML = [
    statCard("Episodes", episodeKeys.size),
    statCard("Model runs", runKeys.size),
    statCard("Segments", segmentRows.length),
    statCard("Total cost", costs.length ? `$${totalCost.toFixed(4)}` : "-"),
  ].join("");

  const grouped = new Map();
  for (const row of rows) {
    const key = `${row.episode_id}::${row.model}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(row);
  }
  const runCards = [...grouped.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([, runRows]) => renderModelRunCard(runRows))
    .join("");
  $("modelRunsList").innerHTML = runCards || `<div class="empty-state">No model outputs match the selected filters.</div>`;
}

function renderModelRunCard(runRows) {
  const first = runRows[0];
  const segments = runRows.filter((row) => row.caption);
  const cost = Number(first.model_cost);
  const phaseText = `${first.parsed_phase_count}/${first.model_phase_count} phases`;
  const captionRows = segments.slice(0, 3).map((row) => `
    <li><strong>${escapeHtml(row.start)}-${escapeHtml(row.end)}</strong> ${escapeHtml(row.caption)}</li>
  `).join("");
  const more = segments.length > 3 ? `<li class="muted">+ ${segments.length - 3} more segments in CSV/JSON</li>` : "";
  return `
    <article class="model-run-card">
      <div class="model-run-header">
        <div>
          <h4>${escapeHtml(first.episode_id)} · ${escapeHtml(first.task_name)}</h4>
          <p>${escapeHtml(first.model)} · ${phaseText} · ${Number.isFinite(cost) ? `$${cost.toFixed(4)}` : "no cost"}</p>
        </div>
        <span>${escapeHtml(String(first.duration_secs))}s</span>
      </div>
      <ul>${captionRows || `<li class="muted">No phases generated by this model.</li>`}${more}</ul>
    </article>
  `;
}

function statCard(label, value, sub = "") {
  return `
    <div class="stat">
      <div class="stat-value">${escapeHtml(String(value))}</div>
      <div class="stat-label">${escapeHtml(label)}</div>
      ${sub ? `<div class="stat-label">${escapeHtml(sub)}</div>` : ""}
    </div>
  `;
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
  if (state.filters.modelEvalOnly) {
    renderModelEpisodeList();
    return;
  }
  $("taskCount").textContent = fmt(tasks.length);
  $("taskList").innerHTML = tasks
    .slice(0, 250)
    .map((task) => {
      const active = task.task_id === state.selectedTaskId ? "active" : "";
      const maxSeverity = task.critical_count ? "critical" : task.high_count ? "high" : task.medium_count ? "medium" : task.low_count ? "low" : "";
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

function renderModelEpisodeList() {
  const episodes = (state.modelSummary?.episodes || []).filter((episode) => {
    const haystack = `${episode.episode_id} ${episode.episode_uuid} ${episode.task_name}`.toLowerCase();
    return !state.filters.search || haystack.includes(state.filters.search);
  });
  $("taskCount").textContent = fmt(episodes.length);
  $("taskList").innerHTML = episodes
    .map((episode) => {
      const runs = state.modelSummary.model_runs.filter((run) => run.episode_id === episode.episode_id);
      const active = state.modelFilters.episode === episode.episode_id ? "active" : "";
      const segmentCount = state.modelSegments.filter((row) => row.episode_id === episode.episode_id && row.caption).length;
      return `
        <article class="task-card ${active}" data-model-episode-id="${escapeHtml(episode.episode_id)}">
          <div class="task-card-title">
            <span>${escapeHtml(episode.task_name || "Untitled episode")}</span>
            <span>${fmt(runs.length)}</span>
          </div>
          <div class="task-meta">${escapeHtml(episode.episode_id)} · ${escapeHtml(episode.episode_uuid)} · ${fmt(episode.duration_secs, 1)}s</div>
          <div class="badge-row">
            <span class="badge">${fmt(runs.length)} model runs</span>
            <span class="badge medium">${fmt(segmentCount)} segments</span>
          </div>
        </article>`;
    })
    .join("");

  document.querySelectorAll("[data-model-episode-id]").forEach((card) => {
    card.addEventListener("click", () => {
      state.modelFilters.episode = card.dataset.modelEpisodeId;
      els.modelEpisodeSelect.value = state.modelFilters.episode;
      renderAll();
    });
  });
}

function selectedTask() {
  return state.tasks.find((task) => task.task_id === state.selectedTaskId);
}

function renderSelectedTask() {
  const task = selectedTask();
  if (!task) return;
  $("selectedTitle").textContent = task.task_name || "Untitled task";
  $("selectedSubtitle").textContent = `${task.task_id} · ${task.final_segment_count} final segments · ${task.issue_count} issues`;
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
    const visible = state.filters.issuesOnlyTimeline && source === "final"
      ? segments.filter((segment) => segmentIssues.has(segment.segment_id))
      : segments;
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
  $("selectedSegmentBadge").textContent = segment.source;
  $("selectedSegmentBadge").className = `badge ${segment.source === "final" ? "high" : "low"}`;
  $("selectedSegmentDetail").innerHTML = `
    <div class="kv"><span>Source</span><strong>${escapeHtml(segment.source)}</strong></div>
    <div class="kv"><span>Index</span><strong>${escapeHtml(segment.array_index)} / phase ${escapeHtml(segment.phase_index)}</strong></div>
    <div class="kv"><span>Time</span><strong>${fmtTime(segment.start_sec)} - ${fmtTime(segment.end_sec)} (${fmt(segment.duration_sec, 3)}s)</strong></div>
    <div class="caption-reader">
      <div class="caption-label">Caption</div>
      <p>${escapeHtml(segment.caption || "No caption")}</p>
    </div>
    ${segment.visual_evidence ? `
      <div class="caption-reader">
        <div class="caption-label">Visual Evidence</div>
        <p>${escapeHtml(segment.visual_evidence)}</p>
      </div>` : ""}
    <div class="caption-reader">
      <div class="caption-label">Covered Markers</div>
      <p>${escapeHtml(Array.isArray(segment.covered_markers) ? segment.covered_markers.join(", ") : segment.covered_markers)}</p>
    </div>
    ${taskIssues.length ? `
      <div class="object-list">${taskIssues.map((issue) => `<span class="badge ${severityClass(issue.severity)}">${escapeHtml(issue.eval_name)}</span>`).join("")}</div>
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
  const classes = [
    "segment",
    segment.source,
    issues.length ? "has-issue" : "",
    state.selectedSegmentId === segment.segment_id ? "selected" : "",
  ].join(" ");
  const title = `${fmtTime(segment.start_sec)} - ${fmtTime(segment.end_sec)}\\n${segment.caption}`;
  return `
    <div class="${classes}" data-segment-id="${escapeHtml(segment.segment_id)}" title="${escapeHtml(title)}" style="left:${left}%;width:${width}%">
      ${highest ? `<span class="badge ${highest}">${highest}</span> ` : ""}${escapeHtml(segment.caption)}
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
  return `
    <article class="issue-card" ${issue.segment_id ? `data-jump-segment="${escapeHtml(issue.segment_id)}"` : ""}>
      <div class="issue-title">
        <span>${escapeHtml(issue.eval_name)}</span>
        <span class="badge ${severityClass(issue.severity)}">${escapeHtml(issue.severity)}</span>
      </div>
      <div class="issue-message">${escapeHtml(issue.message)}</div>
      ${issue.evidence ? `<div class="issue-evidence">${escapeHtml(issue.evidence)}</div>` : ""}
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
  link.download = filename;
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

function exportFilteredCsv() {
  const exportType = els.exportTypeSelect.value;
  const tasks = filteredTasks();
  const taskIds = new Set(tasks.map((task) => task.task_id));

  if (exportType === "tasks_csv") {
    const header = ["task_id", "task_name", "trainer_user_id", "risk_score", "issue_count", "critical_count", "high_count", "overlap_count", "group_cover_count"];
    downloadFile("zion_filtered_tasks.csv", toCsv(tasks, header), "text/csv;charset=utf-8");
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

  const bundle = {
    exported_at: new Date().toISOString(),
    filters: state.filters,
    tasks,
    issues: state.issues.filter((issue) => taskIds.has(issue.task_id)),
    overlaps: state.overlaps.filter((overlap) => taskIds.has(overlap.task_id)),
    group_covers: state.coveringSegments.filter((cover) => taskIds.has(cover.task_id)),
    original_segments: state.originalSegments.filter((segment) => taskIds.has(segment.task_id)),
    final_segments: state.finalSegments.filter((segment) => taskIds.has(segment.task_id)),
  };
  downloadFile("zion_filtered_bundle.json", JSON.stringify(bundle, null, 2), "application/json;charset=utf-8");
}

init().catch((error) => {
  document.body.innerHTML = `<pre style="color:#fff;padding:24px">${escapeHtml(error.stack || error.message)}</pre>`;
});
