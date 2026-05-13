const REVIEW_VIDEOS = [
  {
    task_name: "align the alarm clock",
    video_url: "./videos/align the alarm clock.mp4",
  },
  {
    task_name: "organize the extension cord",
    video_url: "./videos/organize the extension cord.mp4",
  },
  {
    task_name: "rinse and drain glass cups",
    video_url: "./videos/rinse and drain glass cups.mp4",
  },
];

const REVIEW_LABELS = [
  "hallucination",
  "wrong_action",
  "timestamp",
  "overlap",
  "gap",
  "long_segment",
  "short_segment",
  "wrong_object",
];

const DEFAULT_MODELS = ["gemini-3.1-pro-2.5-flash", "qwen-3-vl-32b"];
const STORAGE_KEY = "zion_video_review_annotations_v1";

const state = {
  summary: null,
  segments: [],
  videos: [],
  selectedTaskName: REVIEW_VIDEOS[0].task_name,
  selectedEpisodeId: null,
  selectedSegmentKey: null,
  activeByModel: {},
  annotations: {},
  segmentFilter: "all",
};

const $ = (id) => document.getElementById(id);

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function fmt(value, digits = 1) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(digits) : "-";
}

function fmtTime(seconds) {
  const value = Number(seconds);
  if (!Number.isFinite(value)) return "--:--";
  const minutes = Math.floor(value / 60);
  const secs = value - minutes * 60;
  return `${String(minutes).padStart(2, "0")}:${secs.toFixed(3).padStart(6, "0")}`;
}

function normalizeName(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Failed to load ${path}`);
  return response.json();
}

async function init() {
  const [segments, summary] = await Promise.all([
    loadJson("./data/model_eval_segments.json"),
    loadJson("./data/model_eval_summary.json"),
  ]);
  state.segments = segments;
  state.summary = summary;
  state.annotations = loadAnnotations();
  state.videos = buildVideoConfig();
  state.selectedTaskName = state.videos[0]?.task_name || REVIEW_VIDEOS[0].task_name;
  state.selectedEpisodeId = state.videos[0]?.episode_id || null;

  hydrateControls();
  bindEvents();
  renderAll();
}

function buildVideoConfig() {
  const byName = new Map();
  for (const episode of state.summary.episodes) {
    const key = normalizeName(episode.task_name);
    if (!byName.has(key)) byName.set(key, []);
    byName.get(key).push(episode);
  }

  return REVIEW_VIDEOS.map((video) => {
    const matches = byName.get(normalizeName(video.task_name)) || [];
    return {
      ...video,
      episode_id: matches.length === 1 ? matches[0].episode_id : null,
      episode_uuid: matches.length === 1 ? matches[0].episode_uuid : null,
      duration_secs: matches.length === 1 ? matches[0].duration_secs : null,
      match_count: matches.length,
      excluded: matches.length !== 1,
    };
  }).filter((video) => !video.excluded);
}

function hydrateControls() {
  $("videoSelect").innerHTML = state.videos.map((video) => (
    `<option value="${escapeHtml(video.task_name)}">${escapeHtml(video.task_name)} · ${escapeHtml(video.episode_id)}</option>`
  )).join("");
  $("labelGrid").innerHTML = REVIEW_LABELS.map((label) => `
    <label class="checkbox review-label">
      <input type="checkbox" value="${escapeHtml(label)}" />
      ${escapeHtml(label.replace(/_/g, " "))}
    </label>
  `).join("");
}

function bindEvents() {
  $("videoSelect").addEventListener("change", () => {
    const video = state.videos.find((item) => item.task_name === $("videoSelect").value);
    state.selectedTaskName = video.task_name;
    state.selectedEpisodeId = video.episode_id;
    state.selectedSegmentKey = null;
    renderAll();
  });
  $("segmentFilterSelect").addEventListener("change", () => {
    state.segmentFilter = $("segmentFilterSelect").value;
    renderSegments();
  });
  $("reviewVideo").addEventListener("timeupdate", syncActiveSegment);
  $("prevSegmentBtn").addEventListener("click", () => moveSegment(-1));
  $("nextSegmentBtn").addEventListener("click", () => moveSegment(1));
  $("replaySegmentBtn").addEventListener("click", replaySegment);
  $("saveAnnotationBtn").addEventListener("click", saveCurrentAnnotation);
  $("markReviewedBtn").addEventListener("click", () => {
    saveCurrentAnnotation({ reviewed: true });
  });
  $("exportReviewBtn").addEventListener("click", exportReview);
  $("clearReviewBtn").addEventListener("click", clearSavedLabels);
}

function renderAll() {
  const video = selectedVideo();
  $("videoSelect").value = state.selectedTaskName;
  $("reviewVideo").src = video?.video_url || "";
  updateActiveByTime($("reviewVideo").currentTime || 0);
  renderSegments();
  renderActiveSegment();
}

function selectedVideo() {
  return state.videos.find((video) => video.task_name === state.selectedTaskName);
}

function currentSegments(model = null) {
  return state.segments
    .filter((segment) => (
      segment.episode_id === state.selectedEpisodeId &&
      (!model || segment.model === model) &&
      segment.caption
    ))
    .sort((a, b) => Number(a.start_sec) - Number(b.start_sec) || Number(a.end_sec) - Number(b.end_sec));
}

function segmentKey(segment) {
  return `${segment.episode_id}::${segment.model}::${segment.phase_index}`;
}

function annotationFor(segment) {
  return state.annotations[segmentKey(segment)] || { labels: [], notes: "", severity: "", reviewed: false };
}

function temporalSignals(segments) {
  const signals = new Map();
  for (const segment of segments) signals.set(segmentKey(segment), { overlap: false, gap_before: false });
  let cursor = null;
  for (let i = 0; i < segments.length; i += 1) {
    const current = segments[i];
    const start = Number(current.start_sec);
    const end = Number(current.end_sec);
    if (cursor !== null && start < cursor.end) {
      signals.get(segmentKey(current)).overlap = true;
      signals.get(segmentKey(cursor.segment)).overlap = true;
    }
    if (cursor !== null && start - cursor.end >= 1) {
      signals.get(segmentKey(current)).gap_before = true;
    }
    if (!cursor || end > cursor.end) cursor = { end, segment: current };
  }
  return signals;
}

function filteredSegments() {
  const segments = currentSegments().filter((segment) => DEFAULT_MODELS.includes(segment.model));
  const signalMaps = new Map(DEFAULT_MODELS.map((model) => [model, temporalSignals(currentSegments(model))]));
  return segments.filter((segment) => {
    const annotation = annotationFor(segment);
    const signal = signalMaps.get(segment.model)?.get(segmentKey(segment));
    if (state.segmentFilter === "unreviewed") return !annotation.reviewed;
    if (state.segmentFilter === "flagged") return annotation.labels.length > 0;
    if (state.segmentFilter === "overlap") return signal?.overlap;
    if (state.segmentFilter === "gap") return signal?.gap_before;
    return true;
  });
}

function renderSegments() {
  const video = selectedVideo();
  const modelSegments = new Map(DEFAULT_MODELS.map((model) => [model, currentSegments(model)]));
  const visibleSegments = filteredSegments();
  const duration = Number(video?.duration_secs) || Math.max(...[...modelSegments.values()].flat().map((segment) => Number(segment.end_sec)), 1);
  const signalMaps = new Map(DEFAULT_MODELS.map((model) => [model, temporalSignals(modelSegments.get(model) || [])]));

  $("comparisonTimelines").innerHTML = DEFAULT_MODELS.map((model) => {
    const segments = modelSegments.get(model) || [];
    const signals = temporalSignals(segments);
    return `
      <div class="compare-lane">
        <div class="lane-header"><span>${escapeHtml(shortModelName(model))}</span><span>${segments.length} segments</span></div>
        <div class="review-track">
          ${renderGapBands(segments, duration)}
          ${renderOverlapBands(segments, duration)}
          ${segments.map((segment) => renderTimelineSegment(segment, duration, signals)).join("")}
        </div>
      </div>
    `;
  }).join("");

  renderCurrentComparison();

  $("segmentList").innerHTML = visibleSegments.map((segment) => renderSegmentRow(segment, signalMaps.get(segment.model))).join("") ||
    '<div class="empty">No segments match this filter.</div>';

  document.querySelectorAll("[data-review-segment-key]").forEach((el) => {
    el.addEventListener("click", () => selectSegment(el.dataset.reviewSegmentKey, true));
  });
}

function shortModelName(model) {
  if (model === "gemini-3.1-pro-2.5-flash") return "Gemini 3.1 Pro 2.5 Flash";
  if (model === "qwen-3-vl-32b") return "Qwen 32B";
  return model;
}

function renderTimelineSegment(segment, duration, signals) {
  const start = Number(segment.start_sec);
  const end = Number(segment.end_sec);
  const left = Math.max(0, (start / duration) * 100);
  const width = Math.max(0.5, ((end - start) / duration) * 100);
  const annotation = annotationFor(segment);
  const signal = signals.get(segmentKey(segment));
  const isTimeActive = state.activeByModel[segment.model] === segmentKey(segment);
  const classes = [
    "review-timeline-segment",
    state.selectedSegmentKey === segmentKey(segment) ? "active" : "",
    isTimeActive ? "time-active" : "",
    annotation.reviewed ? "reviewed" : "",
    annotation.labels.length ? "flagged" : "",
    signal?.overlap ? "has-overlap" : "",
    signal?.gap_before ? "has-gap" : "",
  ].filter(Boolean).join(" ");
  return `
    <button
      class="${classes}"
      data-review-segment-key="${escapeHtml(segmentKey(segment))}"
      title="${escapeHtml(`${segment.start} - ${segment.end}\n${segment.caption}`)}"
      style="left:${left}%;width:${width}%"
      type="button"
    >${isTimeActive ? '<span class="playing-pill">PLAY</span>' : ""}${escapeHtml(String(segment.phase_index))}</button>
  `;
}

function renderGapBands(segments, duration) {
  let cursor = null;
  const bands = [];
  for (const segment of segments) {
    const start = Number(segment.start_sec);
    const end = Number(segment.end_sec);
    if (cursor !== null && start - cursor >= 1) {
      const gap = start - cursor;
      bands.push(`<div class="review-gap-band" title="${escapeHtml(`${gap.toFixed(3)}s gap`)}" style="left:${(cursor / duration) * 100}%;width:${Math.max(0.25, (gap / duration) * 100)}%"></div>`);
    }
    cursor = cursor === null ? end : Math.max(cursor, end);
  }
  return bands.join("");
}

function renderOverlapBands(segments, duration) {
  const bands = [];
  for (let i = 0; i < segments.length; i += 1) {
    for (let j = i + 1; j < segments.length; j += 1) {
      if (Number(segments[j].start_sec) >= Number(segments[i].end_sec)) break;
      const start = Math.max(Number(segments[i].start_sec), Number(segments[j].start_sec));
      const end = Math.min(Number(segments[i].end_sec), Number(segments[j].end_sec));
      if (end <= start) continue;
      bands.push(`<div class="review-overlap-band" title="${escapeHtml(`${(end - start).toFixed(3)}s overlap`)}" style="left:${(start / duration) * 100}%;width:${Math.max(0.25, ((end - start) / duration) * 100)}%"></div>`);
    }
  }
  return bands.join("");
}

function renderSegmentRow(segment, signals) {
  const annotation = annotationFor(segment);
  const signal = signals.get(segmentKey(segment));
  const isTimeActive = state.activeByModel[segment.model] === segmentKey(segment);
  const flags = [
    isTimeActive ? "playing" : "",
    signal?.overlap ? "overlap" : "",
    signal?.gap_before ? "gap before" : "",
    annotation.reviewed ? "reviewed" : "",
    ...annotation.labels,
  ].filter(Boolean);
  return `
    <button class="review-segment-row ${state.selectedSegmentKey === segmentKey(segment) ? "active" : ""} ${isTimeActive ? "time-active" : ""}" data-review-segment-key="${escapeHtml(segmentKey(segment))}" type="button">
      <span>${escapeHtml(shortModelName(segment.model))}</span>
      <span>${escapeHtml(String(segment.phase_index))}</span>
      <strong>${escapeHtml(segment.start)} - ${escapeHtml(segment.end)}</strong>
      <em>${escapeHtml(segment.caption)}</em>
      <small>${flags.map((flag) => `<span class="badge">${escapeHtml(flag)}</span>`).join("")}</small>
    </button>
  `;
}

function selectSegment(key, seek = false) {
  state.selectedSegmentKey = key;
  const segment = currentSegments().find((item) => segmentKey(item) === key);
  if (segment && seek) {
    $("reviewVideo").currentTime = Number(segment.start_sec);
    updateActiveByTime(Number(segment.start_sec));
  }
  renderSegments();
  renderActiveSegment();
}

function syncActiveSegment() {
  const changed = updateActiveByTime($("reviewVideo").currentTime);
  if (changed) {
    renderSegments();
    renderActiveSegment();
  }
}

function updateActiveByTime(time) {
  const nextActiveByModel = {};
  for (const model of DEFAULT_MODELS) {
    const segment = currentSegments(model).find((item) => Number(item.start_sec) <= time && time <= Number(item.end_sec));
    if (segment) nextActiveByModel[model] = segmentKey(segment);
  }
  const changed = JSON.stringify(nextActiveByModel) !== JSON.stringify(state.activeByModel);
  state.activeByModel = nextActiveByModel;
  return changed;
}

function renderCurrentComparison() {
  $("currentComparison").innerHTML = DEFAULT_MODELS.map((model) => {
    const segment = currentSegments(model).find((item) => segmentKey(item) === state.activeByModel[model]);
    return `
      <article class="current-caption-card">
        <div class="section-header">
          <h2>${escapeHtml(shortModelName(model))}</h2>
          <span class="badge">${segment ? `phase ${escapeHtml(String(segment.phase_index))}` : "no active segment"}</span>
        </div>
        ${segment ? `
          <div class="kv"><span>Time</span><strong>${escapeHtml(segment.start)} - ${escapeHtml(segment.end)}</strong></div>
          <p>${escapeHtml(segment.caption)}</p>
        ` : '<div class="empty">No segment at current video time.</div>'}
      </article>
    `;
  }).join("");
}

function activeSegment() {
  return currentSegments().find((segment) => segmentKey(segment) === state.selectedSegmentKey) || null;
}

function renderActiveSegment() {
  const segment = activeSegment();
  if (!segment) {
    $("activeSegmentBadge").textContent = "none";
    $("activeSegmentDetail").innerHTML = '<div class="empty">Play the video or click a segment to start reviewing.</div>';
    resetForm();
    return;
  }
  const annotation = annotationFor(segment);
  $("activeSegmentBadge").textContent = `phase ${segment.phase_index}`;
  $("activeSegmentDetail").innerHTML = `
    <div class="kv"><span>Task</span><strong>${escapeHtml(segment.task_name)}</strong></div>
    <div class="kv"><span>Model</span><strong>${escapeHtml(segment.model)}</strong></div>
    <div class="kv"><span>Time</span><strong>${escapeHtml(segment.start)} - ${escapeHtml(segment.end)} (${fmt(segment.duration_phase_secs, 3)}s)</strong></div>
    <div class="caption-reader"><p>${escapeHtml(segment.caption)}</p></div>
  `;
  setForm(annotation);
}

function resetForm() {
  document.querySelectorAll("#labelGrid input").forEach((input) => { input.checked = false; });
  $("severityInput").value = "";
  $("notesInput").value = "";
}

function setForm(annotation) {
  document.querySelectorAll("#labelGrid input").forEach((input) => {
    input.checked = annotation.labels.includes(input.value);
  });
  $("severityInput").value = annotation.severity || "";
  $("notesInput").value = annotation.notes || "";
}

function readForm() {
  return {
    labels: [...document.querySelectorAll("#labelGrid input:checked")].map((input) => input.value),
    severity: $("severityInput").value,
    notes: $("notesInput").value.trim(),
  };
}

function saveCurrentAnnotation(extra = {}) {
  const segment = activeSegment();
  if (!segment) return;
  state.annotations[segmentKey(segment)] = {
    ...annotationFor(segment),
    ...readForm(),
    ...extra,
    updated_at: new Date().toISOString(),
    segment: {
      episode_id: segment.episode_id,
      task_name: segment.task_name,
      model: segment.model,
      phase_index: segment.phase_index,
      start: segment.start,
      end: segment.end,
      caption: segment.caption,
    },
  };
  saveAnnotations();
  renderSegments();
}

function moveSegment(direction) {
  const segments = currentSegments();
  const index = Math.max(0, segments.findIndex((segment) => segmentKey(segment) === state.selectedSegmentKey));
  const next = segments[Math.min(segments.length - 1, Math.max(0, index + direction))];
  if (next) selectSegment(segmentKey(next), true);
}

function replaySegment() {
  const segment = activeSegment();
  if (!segment) return;
  $("reviewVideo").currentTime = Number(segment.start_sec);
  $("reviewVideo").play();
}

function loadAnnotations() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveAnnotations() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.annotations));
}

function clearSavedLabels() {
  if (!confirm("Clear all saved labels in this browser?")) return;
  state.annotations = {};
  saveAnnotations();
  renderAll();
}

function exportReview() {
  const annotations = Object.values(state.annotations);
  const payload = {
    review_session: {
      created_at: new Date().toISOString(),
      videos_reviewed: state.videos.map((video) => ({
        task_name: video.task_name,
        episode_id: video.episode_id,
        video_url: video.video_url,
      })),
    },
    annotations,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "zion_video_review_annotations.json";
  link.click();
  URL.revokeObjectURL(url);
}

init().catch((error) => {
  document.body.innerHTML = `<pre class="fatal-error">${escapeHtml(error.stack || error.message)}</pre>`;
});
