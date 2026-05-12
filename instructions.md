<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Project Overview — Training</title>
  <style>
    :root {
      --bg-main: #05070a;
      --bg-card: #0b0e14;
      --border: #1e222b;
      --border-soft: #2a2d35;
      --text-main: #ffffff;
      --text-body: #D1DCFF;
      --text-muted: #8a94a6;
      --text-soft: #bcc6d4;
      --accent-blue: #3444DA;
      --accent-blue-bright: #5967ff;
      --yellow: #FFAB00;
      --yellow-soft: #FFE0A3;
      --green-ins: #4caf50;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: var(--bg-main);
      background-image:
        radial-gradient(circle at 10% 0%, rgba(52,68,218,.18), transparent 45%),
        radial-gradient(circle at 95% 8%, rgba(52,68,218,.10), transparent 40%);
      color: var(--text-main);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      padding: 40px;
      min-height: 100vh;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
    }

    /* --- Hero header --- */
    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(52,68,218,.15);
      border: 1px solid rgba(74,90,232,.4);
      border-radius: 999px;
      padding: 6px 14px;
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #B8C5FF;
      margin-bottom: 18px;
    }

    h1 {
      font-size: 2.4rem;
      font-weight: 800;
      color: #fff;
      letter-spacing: -0.01em;
      margin-bottom: 16px;
    }

    .lede {
      color: var(--text-body);
      font-size: 1.05rem;
      line-height: 1.65;
      max-width: 950px;
      margin-bottom: 36px;
    }

    .lede strong {
      color: #fff;
    }

    /* --- Pillars: quality criteria --- */
    .quality-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 36px;
    }

    .quality-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 18px 20px;
      position: relative;
      overflow: hidden;
    }

    .quality-card::before {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--accent-blue), var(--accent-blue-bright));
    }

    .quality-card .q-label {
      font-size: 0.68rem;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-weight: 800;
      color: var(--accent-blue-bright);
      margin-bottom: 6px;
    }

    .quality-card .q-title {
      font-size: 1.05rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 6px;
    }

    .quality-card .q-desc {
      font-size: 0.88rem;
      color: var(--text-body);
      line-height: 1.5;
    }

    /* --- Workflow note --- */
    .workflow-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 20px 24px;
      margin-bottom: 36px;
      position: relative;
      overflow: hidden;
    }

    .workflow-card::before {
      content: "";
      position: absolute;
      top: 0; left: 0; bottom: 0;
      width: 4px;
      background: var(--accent-blue-bright);
    }

    .workflow-card .label {
      display: block;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 800;
      color: var(--accent-blue-bright);
      margin-bottom: 8px;
    }

    .workflow-card p {
      color: var(--text-body);
      font-size: 0.95rem;
      line-height: 1.6;
    }

    .workflow-card p strong {
      color: #fff;
    }

    /* --- Central question card --- */
    .question-card {
      background: rgba(52,68,218,.08);
      border: 1px solid rgba(74,90,232,.4);
      border-radius: 12px;
      padding: 28px 32px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .question-card .q-eyebrow {
      display: inline-block;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      font-weight: 800;
      color: #B8C5FF;
      margin-bottom: 12px;
    }

    .question-card .q-text {
      font-size: 1.35rem;
      font-weight: 700;
      color: #fff;
      line-height: 1.4;
      font-style: italic;
    }

    .question-card .q-text::before,
    .question-card .q-text::after {
      content: '"';
      color: var(--accent-blue-bright);
      font-size: 1.6rem;
      font-weight: 800;
    }

    /* Responsive */
    @media (max-width: 900px) {
      .quality-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

<div class="container">

  <div class="eyebrow">📋 Project Overview</div>
  <h1>Time-Stamped Activity Descriptions</h1>

  <p class="lede">
    Zion is a semantic annotation pipeline focused on <strong>auditing and refining AI-generated captions</strong> for short-form video content. Model-generated "seed" descriptions provide a starting point, but often contain hallucinations or inaccuracies. <strong>Experts do not write annotations from scratch</strong> — they adjust them for accuracy and determine the appropriate outcome.
  </p>

  <!-- Quality criteria pillars -->
  <div class="quality-grid">
    <div class="quality-card">
      <div class="q-label">Pillar 01</div>
      <div class="q-title">Correctness</div>
      <div class="q-desc">Each annotation must accurately reflect the visual data — no hallucinations, no inferred details.</div>
    </div>
    <div class="quality-card">
      <div class="q-label">Pillar 02</div>
      <div class="q-title">Completeness</div>
      <div class="q-desc">All relevant hand actions and segments are captured, with no gaps in the sequence.</div>
    </div>
    <div class="quality-card">
      <div class="q-label">Pillar 03</div>
      <div class="q-title">Consistency</div>
      <div class="q-desc">Object descriptions and action labels remain uniform across the entire annotation.</div>
    </div>
  </div>

  <!-- Workflow note -->
  <div class="workflow-card">
    <span class="label">⚙ Expert Workflow</span>
    <p>
      Each annotation is assessed against strict quality standards to ensure it is a <strong>fully accurate reflection of the visual data</strong>. Experts review the seed caption, verify it against the video, and edit or approve as needed.
    </p>
  </div>

  <!-- Central question -->
  <div class="question-card">
    <div class="q-eyebrow">⭐ The Central Question Zion Evaluates</div>
    <div class="q-text">
      Is this annotation reliable enough to be used as training data?
    </div>
  </div>

</div>

</body>
</html>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Handling Time — Training</title>
  <style>
    :root {
      --bg-main: #05070a;
      --bg-card: #0b0e14;
      --border: #1e222b;
      --border-soft: #2a2d35;
      --text-main: #ffffff;
      --text-body: #D1DCFF;
      --text-muted: #8a94a6;
      --text-soft: #bcc6d4;
      --accent-blue: #3444DA;
      --accent-blue-bright: #5967ff;
      --yellow: #FFAB00;
      --yellow-soft: #FFE0A3;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: var(--bg-main);
      background-image:
        radial-gradient(circle at 10% 0%, rgba(52,68,218,.18), transparent 45%),
        radial-gradient(circle at 95% 8%, rgba(52,68,218,.10), transparent 40%);
      color: var(--text-main);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      padding: 40px;
      min-height: 100vh;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
    }

    /* --- Section header (matches existing h2 pattern) --- */
    h2 {
      font-size: 1.2rem;
      color: var(--text-muted);
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 700;
    }

    .section-title {
      font-size: 1.7rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .section-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 32px;
      height: 32px;
      padding: 0 10px;
      background: var(--accent-blue);
      color: #fff;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 800;
    }

    .section-intro {
      color: var(--text-body);
      font-size: 1rem;
      line-height: 1.65;
      margin-bottom: 28px;
      max-width: 950px;
    }

    .section-intro strong { color: #fff; }

    .ratio-callout {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(52,68,218,.1);
      border: 1px solid rgba(74,90,232,.35);
      border-radius: 8px;
      padding: 8px 14px;
      margin-top: 6px;
      font-size: 0.92rem;
      color: var(--text-body);
    }

    .ratio-callout .tag {
      background: var(--accent-blue);
      color: #fff;
      font-weight: 800;
      font-size: 0.78rem;
      padding: 3px 8px;
      border-radius: 5px;
      letter-spacing: 0.04em;
    }

    /* --- Targets table card --- */
    .table-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 0;
      overflow: hidden;
      margin-bottom: 24px;
    }

    table.targets {
      width: 100%;
      border-collapse: collapse;
    }

    table.targets th,
    table.targets td {
      padding: 18px 24px;
      text-align: left;
      font-size: 0.98rem;
    }

    table.targets thead th {
      background: rgba(52,68,218,.12);
      color: #fff;
      font-weight: 700;
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      border-bottom: 1px solid rgba(74,90,232,.3);
    }

    table.targets tbody tr {
      border-top: 1px solid var(--border);
      transition: background 0.15s ease;
    }

    table.targets tbody tr:first-child {
      border-top: 0;
    }

    table.targets tbody tr:hover {
      background: rgba(52,68,218,.04);
    }

    table.targets td.duration {
      font-weight: 700;
      color: #fff;
      width: 50%;
    }

    table.targets td.ht {
      color: var(--text-body);
    }

    table.targets td.ht .val {
      font-weight: 700;
      color: var(--accent-blue-bright);
    }

    /* --- Note card --- */
    .note-card {
      background: rgba(255, 171, 0, 0.06);
      border: 1px solid rgba(255, 171, 0, 0.3);
      border-left: 4px solid var(--yellow);
      border-radius: 10px;
      padding: 18px 22px;
    }

    .note-card .label {
      display: block;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 700;
      color: var(--yellow-soft);
      margin-bottom: 8px;
    }

    .note-card p {
      color: var(--text-body);
      font-size: 0.95rem;
      line-height: 1.6;
    }

    .note-card strong {
      color: #fff;
    }
  </style>
</head>
<body>

<div class="container">

  <h2>Section 1</h2>
  <div class="section-title">
    <span class="section-number">1</span>
    Handling Time
  </div>

  <p class="section-intro">
    Zion annotations are used to set a benchmark for model performance. Consistent <strong>Handling Time (HT)</strong> ensures the model learns from realistic, repeatable task execution.
  </p>

  <div class="ratio-callout">
    <span class="tag">1 : 5 RATIO</span>
    <span>5 seconds of work for every 1 second of video. Refer to the table below for your maximum time allocations.</span>
  </div>

  <div style="height: 24px;"></div>

  <div class="table-card">
    <table class="targets">
      <thead>
        <tr>
          <th>Video Duration</th>
          <th>Maximum Handling Time (HT)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="duration">1 Second</td>
          <td class="ht"><span class="val">5</span> Seconds</td>
        </tr>
        <tr>
          <td class="duration">2 Seconds</td>
          <td class="ht"><span class="val">10</span> Seconds</td>
        </tr>
        <tr>
          <td class="duration">3 Seconds</td>
          <td class="ht"><span class="val">15</span> Seconds</td>
        </tr>
        <tr>
          <td class="duration">4 Seconds</td>
          <td class="ht"><span class="val">20</span> Seconds</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="note-card">
    <span class="label">⚠ Note</span>
    <p>
      These targets include the time taken to <strong>watch the video</strong>, <strong>verify the AI caption</strong>, and <strong>perform any necessary edits</strong>. Consistent adherence to these benchmarks is critical for the success of this pilot and the guaranteed volume of future work.
    </p>
  </div>

</div>

</body>
</html>


<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Caption Validation Criteria — Training</title>
  <style>
    :root {
      --bg-main: #05070a;
      --bg-card: #0b0e14;
      --border: #1e222b;
      --border-soft: #2a2d35;
      --text-main: #ffffff;
      --text-body: #D1DCFF;
      --text-muted: #8a94a6;
      --text-soft: #bcc6d4;
      --accent-blue: #3444DA;
      --accent-blue-bright: #5967ff;
      --red-del: #ef5350;
      --green-ins: #4caf50;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: var(--bg-main);
      background-image:
        radial-gradient(circle at 10% 0%, rgba(52,68,218,.18), transparent 45%),
        radial-gradient(circle at 95% 8%, rgba(52,68,218,.10), transparent 40%);
      color: var(--text-main);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      padding: 40px;
      min-height: 100vh;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
    }

    /* --- Section header (same pattern as previous slide) --- */
    h2 {
      font-size: 1.2rem;
      color: var(--text-muted);
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 700;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .section-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 32px;
      height: 32px;
      padding: 0 10px;
      background: var(--accent-blue);
      color: #fff;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 800;
    }

    .section-intro {
      color: var(--text-body);
      font-size: 1rem;
      line-height: 1.6;
      margin-bottom: 32px;
      max-width: 950px;
    }

    .section-intro strong {
      color: #fff;
    }

    /* --- Pillars grid --- */
    .pillars {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    .pillar {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      position: relative;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .pillar::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--accent-blue), var(--accent-blue-bright));
    }

    .pillar-head {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      margin-bottom: 20px;
      padding-bottom: 18px;
      border-bottom: 1px solid var(--border);
    }

    .pillar-num {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(52,68,218,.15);
      border: 1px solid rgba(74,90,232,.4);
      color: #B8C5FF;
      border-radius: 10px;
      font-size: 1.1rem;
      font-weight: 800;
    }

    .pillar-title-group {
      flex: 1;
      min-width: 0;
    }

    .pillar-label {
      font-size: 0.68rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-muted);
      font-weight: 700;
      margin-bottom: 4px;
    }

    .pillar-title {
      font-size: 1.15rem;
      font-weight: 800;
      color: #fff;
      line-height: 1.25;
    }

    .pillar-subtitle {
      font-size: 0.82rem;
      color: var(--accent-blue-bright);
      font-weight: 700;
      margin-top: 4px;
      letter-spacing: 0.02em;
    }

    /* Check and Fix rows */
    .cf-row {
      display: flex;
      gap: 10px;
      margin-bottom: 14px;
    }

    .cf-row:last-child {
      margin-bottom: 0;
    }

    .cf-icon {
      flex-shrink: 0;
      width: 26px;
      height: 26px;
      border-radius: 7px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      font-weight: 800;
      margin-top: 2px;
    }

    .cf-icon.check {
      background: rgba(76, 175, 80, 0.12);
      border: 1px solid rgba(76, 175, 80, 0.35);
      color: var(--green-ins);
    }

    .cf-icon.fix {
      background: rgba(52,68,218,.15);
      border: 1px solid rgba(74,90,232,.4);
      color: var(--accent-blue-bright);
    }

    .cf-body {
      flex: 1;
      min-width: 0;
    }

    .cf-label {
      display: block;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .cf-label.check { color: var(--green-ins); }
    .cf-label.fix { color: var(--accent-blue-bright); }

    .cf-text {
      font-size: 0.9rem;
      line-height: 1.55;
      color: var(--text-body);
    }

    .cf-text em {
      font-style: normal;
      color: #fff;
      background: rgba(239, 83, 80, 0.12);
      border: 1px solid rgba(239, 83, 80, 0.3);
      padding: 1px 6px;
      border-radius: 4px;
      font-size: 0.82rem;
      white-space: nowrap;
    }

    .cf-text em.good {
      background: rgba(76, 175, 80, 0.12);
      border: 1px solid rgba(76, 175, 80, 0.3);
    }

    /* Responsive fallback */
    @media (max-width: 1100px) {
      .pillars {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>

<div class="container">

  <h2>Section 2</h2>
  <div class="section-title">
    <span class="section-number">2.1</span>
    Caption Validation
  </div>

  <p class="section-intro">
    Focus on the following <strong>core criteria</strong> when auditing every caption. Each pillar defines a <strong>Check</strong> (what to verify) and a <strong>Fix</strong> (how to correct it).
  </p>

  <div class="pillars">

    <!-- Pillar 1 -->
    <div class="pillar">
      <div class="pillar-head">
        <div class="pillar-num">1</div>
        <div class="pillar-title-group">
          <div class="pillar-label">Pillar 01</div>
          <div class="pillar-title">Action Verification</div>
          <div class="pillar-subtitle">Accuracy</div>
        </div>
      </div>

      <div class="cf-row">
        <div class="cf-icon check">✓</div>
        <div class="cf-body">
          <span class="cf-label check">The Check</span>
          <p class="cf-text">Did the described actions actually occur?</p>
        </div>
      </div>

      <div class="cf-row">
        <div class="cf-icon fix">✎</div>
        <div class="cf-body">
          <span class="cf-label fix">The Fix</span>
          <p class="cf-text">Remove any descriptions of actions that are <strong style="color:#fff;">not visible</strong> in the video. If a major action is missing, add a concise description.</p>
        </div>
      </div>
    </div>

    <!-- Pillar 2 -->
    <div class="pillar">
      <div class="pillar-head">
        <div class="pillar-num">2</div>
        <div class="pillar-title-group">
          <div class="pillar-label">Pillar 02</div>
          <div class="pillar-title">Object & Attribute Precision</div>
          <div class="pillar-subtitle">Identity</div>
        </div>
      </div>

      <div class="cf-row">
        <div class="cf-icon check">✓</div>
        <div class="cf-body">
          <span class="cf-label check">The Check</span>
          <p class="cf-text">Are all entities identified correctly?</p>
        </div>
      </div>

      <div class="cf-row">
        <div class="cf-icon fix">✎</div>
        <div class="cf-body">
          <span class="cf-label fix">The Fix</span>
          <p class="cf-text">Verify the <strong style="color:#fff;">color, type, and shape</strong> of objects. If the model identifies a <em>red truck</em> but the video shows a <em class="good">maroon van</em>, update the caption immediately.</p>
        </div>
      </div>
    </div>

    <!-- Pillar 3 -->
    <div class="pillar">
      <div class="pillar-head">
        <div class="pillar-num">3</div>
        <div class="pillar-title-group">
          <div class="pillar-label">Pillar 03</div>
          <div class="pillar-title">Chronological Sequencing</div>
          <div class="pillar-subtitle">Order</div>
        </div>
      </div>

      <div class="cf-row">
        <div class="cf-icon check">✓</div>
        <div class="cf-body">
          <span class="cf-label check">The Check</span>
          <p class="cf-text">Does the caption follow the video's timeline?</p>
        </div>
      </div>

      <div class="cf-row">
        <div class="cf-icon fix">✎</div>
        <div class="cf-body">
          <span class="cf-label fix">The Fix</span>
          <p class="cf-text">Ensure the narrative follows the visual sequence. If the model describes events out of order (e.g. the ending before the beginning) <strong style="color:#fff;">restructure the sentence</strong> to reflect the correct chronology.</p>
        </div>
      </div>
    </div>

  </div>

    <!-- Pillar 4 -->
    <div class="pillar">
      <div class="pillar-head">
        <div class="pillar-num">4</div>
        <div class="pillar-title-group">
          <div class="pillar-label">Pillar 04</div>
          <div class="pillar-title">Annotation Logic & Action Flow</div>
          <div class="pillar-subtitle">Order</div>
        </div>
      </div>

      <div class="cf-row">
        <div class="cf-icon check">✓</div>
        <div class="cf-body">
          <span class="cf-label check">The Check</span>
          <p class="cf-text">Is there a beginning, middle, and end for the object?</p>
        </div>
      </div>

      <div class="cf-row">
        <div class="cf-icon fix">✎</div>
        <div class="cf-body">
          <span class="cf-label fix">The Fix</span>
          <p class="cf-text">Maintain a coherent action sequence throughout each annotation.<br>- Actions should follow a clear, real-world flow rather than appearing as isolated or disjointed events.<br>- When an object is introduced, its lifecycle should be traceable:
    Pick → Use → Place (or equivalent logical sequence)
<br>- Avoid breaking natural continuity (e.g., using an object before it is picked up, or placing an object that was never handled)
<br>- Ensure actions are temporally and causally aligned — each step should logically follow from the previous one
<br>- Do not omit key transitions (e.g., missing the “place” after a “use” when it is clearly shown)
<br>- Consolidate fragmented actions where appropriate to preserve flow</p>
        </div>
      </div>
    </div>

  </div>

    <!-- Pillar 5 -->
    <div class="pillar">
      <div class="pillar-head">
        <div class="pillar-num">5</div>
        <div class="pillar-title-group">
          <div class="pillar-label">Pillar 05</div>
          <div class="pillar-title">Pauses</div>
          <div class="pillar-subtitle">Order</div>
        </div>
      </div>

      <div class="cf-row">
        <div class="cf-icon check">✓</div>
        <div class="cf-body">
          <span class="cf-label check">The Check</span>
          <p class="cf-text">    Should indecision, hesitation, or frustration be annotated?</p>
        </div>
      </div>

      <div class="cf-row">
        <div class="cf-icon fix">✎</div>
        <div class="cf-body">
          <span class="cf-label fix">The Fix</span>
          <p class="cf-text">    No. Ignore internal states and brief pauses. Only annotate observable, task-relevant actions.</p>
        </div>
      </div>
    </div>

  </div>

    <!-- Pillar 6 -->
    <div class="pillar">
      <div class="pillar-head">
        <div class="pillar-num">6</div>
        <div class="pillar-title-group">
          <div class="pillar-label">Pillar 06</div>
          <div class="pillar-title">No-Action Segments</div>
          <div class="pillar-subtitle">Order</div>
        </div>
      </div>

      <div class="cf-row">
        <div class="cf-icon check">✓</div>
        <div class="cf-body">
          <span class="cf-label check">The Check</span>
          <p class="cf-text">How should periods with no actions be handled?</p>
        </div>
      </div>

      <div class="cf-row">
        <div class="cf-icon fix">✎</div>
        <div class="cf-body">
          <span class="cf-label fix">The Fix</span>
          <p class="cf-text">    Label as “No relevant actions.”</p>
        </div>
      </div>
    </div>

    <!-- Pillar 7 -->
    <div class="pillar">
      <div class="pillar-head">
        <div class="pillar-num">7</div>
        <div class="pillar-title-group">
          <div class="pillar-label">Pillar 07</div>
          <div class="pillar-title">Independent Object Descriptions</div>
          <div class="pillar-subtitle">Order</div>
        </div>
      </div>

      <div class="cf-row">
        <div class="cf-icon check">✓</div>
        <div class="cf-body">
          <span class="cf-label check">The Check</span>
          <p class="cf-text">        Should there be reliance on previous steps to understand what an object is?<br>e.g. the cup currently placed on the table being picked up</p>
        </div>
      </div>

      <div class="cf-row">
        <div class="cf-icon fix">✎</div>
        <div class="cf-body">
          <span class="cf-label fix">The Fix</span>
          <p class="cf-text">            Avoid embedding action context into the object description; use consistent, standalone object descriptions across actions.<br>e.g.a blue plastic cup</p>
        </div>
      </div>
    </div>

  </div>

</div>

</body>
</html>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Detail Caption Decision Tree — Training</title>
  <style>
    :root {
      --bg-main: #05070a;
      --bg-card: #0b0e14;
      --border: #1e222b;
      --text-main: #ffffff;
      --text-body: #D1DCFF;
      --text-muted: #8a94a6;
      --accent-blue: #3444DA;
      --accent-blue-bright: #5967ff;
      --red-del: #ef5350;
      --green-ins: #4caf50;
      --yellow: #FFAB00;
      --yellow-soft: #FFE0A3;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: var(--bg-main);
      background-image:
        radial-gradient(circle at 10% 0%, rgba(52,68,218,.18), transparent 45%),
        radial-gradient(circle at 95% 8%, rgba(52,68,218,.10), transparent 40%);
      color: var(--text-main);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      padding: 40px;
      min-height: 100vh;
    }

    .container { max-width: 1400px; margin: 0 auto; }

    h2 {
      font-size: 1.2rem;
      color: var(--text-muted);
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 700;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .section-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 32px;
      height: 32px;
      padding: 0 10px;
      background: var(--accent-blue);
      color: #fff;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 800;
    }

    .section-intro {
      color: var(--text-body);
      font-size: 1rem;
      line-height: 1.6;
      margin-bottom: 32px;
      max-width: 950px;
    }
    .section-intro strong { color: #fff; }

    .tree-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 32px 20px;
      margin-bottom: 24px;
      position: relative;
      overflow: hidden;
    }

    .tree-card::before {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--accent-blue), var(--accent-blue-bright));
    }

    .tree-svg-wrap {
      width: 100%;
    }

    .tree-svg {
      width: 100%;
      height: auto;
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    .tip {
      background: rgba(255, 171, 0, 0.06);
      border: 1px solid rgba(255, 171, 0, 0.3);
      border-left: 4px solid var(--yellow);
      border-radius: 10px;
      padding: 20px 24px;
      display: flex;
      gap: 18px;
      align-items: flex-start;
    }

    .tip-icon {
      flex-shrink: 0;
      width: 40px; height: 40px;
      border-radius: 10px;
      background: rgba(255, 171, 0, 0.15);
      border: 1px solid rgba(255, 171, 0, 0.4);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
    }

    .tip-body { flex: 1; }

    .tip-label {
      display: block;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 800;
      color: var(--yellow-soft);
      margin-bottom: 8px;
    }

    .tip-rules {
      display: flex;
      flex-wrap: wrap;
      gap: 10px 18px;
      color: var(--text-body);
      font-size: 0.95rem;
      line-height: 1.5;
    }
    .tip-rules span { display: inline-flex; align-items: center; gap: 6px; }
    .tip-rules strong { color: #fff; font-weight: 700; }
    .tip-rules .arrow { color: var(--yellow); font-weight: 800; }
  </style>
</head>
<body>

<div class="container">

  <h2>Section 2</h2>
  <div class="section-title">
    <span class="section-number">2.2</span>
    Decision Framework
  </div>

  <p class="section-intro">
    Use the logic map below to guide your review. Move through each question <strong>in order</strong> ( <strong>Yes</strong> = pass, <strong>No</strong> = apply the fix).
  </p>

  <div class="tree-card">
    <div class="tree-svg-wrap">
      <!--
        Tight horizontal budget:
          • Root narrower (240 wide) and positioned tight to the left edge
          • Trunk runs very short distance before peeling into branches
          • Branch lines minimised (~60px horizontal)
          • Question boxes taller (more vertical height) and narrower (320px)
          • Outcome text starts earlier, has full width on the right to render
          • Total viewBox: 1200 wide, 580 tall
      -->
      <svg class="tree-svg" viewBox="0 0 1200 580" xmlns="http://www.w3.org/2000/svg">

        <!-- ROOT NODE (top-left, compact) -->
        <g>
          <rect x="10" y="20" width="200" height="80" rx="12" ry="12"
                fill="rgba(52,68,218,0.08)"
                stroke="#5967ff" stroke-width="2"/>
          <text x="110" y="68" text-anchor="middle"
                font-size="22" font-weight="800" fill="#5967ff">Decision Tree</text>
        </g>

        <!-- TRUNK + BRANCHES (short horizontal runs) -->
        <path d="M 110 130 V 500"
              stroke="#5967ff" stroke-width="2.5" fill="none" stroke-opacity="0.7"/>

        <!-- horizontal branches: shorter, peel off trunk to question boxes -->
        <path d="M 110 190 H 220" stroke="#5967ff" stroke-width="2.5" fill="none" stroke-opacity="0.7"/>
        <path d="M 110 345 H 220" stroke="#5967ff" stroke-width="2.5" fill="none" stroke-opacity="0.7"/>
        <path d="M 110 500 H 220" stroke="#5967ff" stroke-width="2.5" fill="none" stroke-opacity="0.7"/>

        <!-- ================= QUESTION BOX 1 ================= -->
        <g>
          <rect x="220" y="140" width="360" height="100" rx="10" ry="10"
                fill="rgba(89,103,255,0.28)"
                stroke="rgba(89,103,255,0.6)" stroke-width="1"/>
          <text x="240" y="180" font-size="19" font-weight="700" fill="#ffffff">
            1. Did all actions described happen
          </text>
          <text x="240" y="210" font-size="19" font-weight="700" fill="#ffffff">
            in the video?
          </text>
        </g>

        <!-- connector + outcomes for Q1 -->
        <path d="M 580 190 H 620 M 620 165 V 215 M 620 165 H 660 M 620 215 H 660"
              stroke="#5967ff" stroke-width="1.5" fill="none" stroke-opacity="0.55"/>
        <text x="672" y="172" font-size="18" font-weight="800" fill="#ffffff">Yes</text>
        <line x1="715" y1="166" x2="740" y2="166" stroke="#8a94a6" stroke-width="1.5"/>
        <text x="750" y="172" font-size="18" fill="#4caf50" font-weight="700">Pass</text>

        <text x="672" y="222" font-size="18" font-weight="800" fill="#ffffff">No</text>
        <line x1="715" y1="216" x2="740" y2="216" stroke="#8a94a6" stroke-width="1.5"/>
        <text x="750" y="222" font-size="18" fill="#D1DCFF">Remove actions that did not occur</text>

        <!-- ================= QUESTION BOX 2 ================= -->
        <g>
          <rect x="220" y="285" width="360" height="120" rx="10" ry="10"
                fill="rgba(52,68,218,0.38)"
                stroke="rgba(74,90,232,0.7)" stroke-width="1"/>
          <text x="240" y="330" font-size="19" font-weight="700" fill="#ffffff">
            2. Did all actions occur in the right
          </text>
          <text x="240" y="360" font-size="19" font-weight="700" fill="#ffffff">
            order compared to the video?
          </text>
        </g>

        <path d="M 580 345 H 620 M 620 320 V 370 M 620 320 H 660 M 620 370 H 660"
              stroke="#5967ff" stroke-width="1.5" fill="none" stroke-opacity="0.55"/>
        <text x="672" y="327" font-size="18" font-weight="800" fill="#ffffff">Yes</text>
        <line x1="715" y1="321" x2="740" y2="321" stroke="#8a94a6" stroke-width="1.5"/>
        <text x="750" y="327" font-size="18" fill="#4caf50" font-weight="700">Pass</text>

        <text x="672" y="377" font-size="18" font-weight="800" fill="#ffffff">No</text>
        <line x1="715" y1="371" x2="740" y2="371" stroke="#8a94a6" stroke-width="1.5"/>
        <text x="750" y="377" font-size="18" fill="#D1DCFF">Switch action sequence to the correct order</text>

        <!-- ================= QUESTION BOX 3 ================= -->
        <g>
          <rect x="220" y="450" width="360" height="100" rx="10" ry="10"
                fill="rgba(30,42,160,0.55)"
                stroke="rgba(52,68,218,0.8)" stroke-width="1"/>
          <text x="240" y="490" font-size="19" font-weight="700" fill="#ffffff">
            3. Are all the colors / objects
          </text>
          <text x="240" y="520" font-size="19" font-weight="700" fill="#ffffff">
            described correctly?
          </text>
        </g>

        <path d="M 580 500 H 620 M 620 475 V 525 M 620 475 H 660 M 620 525 H 660"
              stroke="#5967ff" stroke-width="1.5" fill="none" stroke-opacity="0.55"/>
        <text x="672" y="482" font-size="18" font-weight="800" fill="#ffffff">Yes</text>
        <line x1="715" y1="476" x2="740" y2="476" stroke="#8a94a6" stroke-width="1.5"/>
        <text x="750" y="482" font-size="18" fill="#4caf50" font-weight="700">Pass</text>

        <text x="672" y="532" font-size="18" font-weight="800" fill="#ffffff">No</text>
        <line x1="715" y1="526" x2="740" y2="526" stroke="#8a94a6" stroke-width="1.5"/>
        <text x="750" y="532" font-size="18" fill="#D1DCFF">Change the colors / objects description</text>

      </svg>
    </div>
  </div>

  <div class="tip">
    <div class="tip-icon">💡</div>
    <div class="tip-body">
      <span class="tip-label">Rule of Thumb</span>
      <div class="tip-rules">
        <span>If it <strong>didn't happen</strong> <span class="arrow">→</span> delete it</span>
        <span>If it's the <strong>wrong color / type</strong> <span class="arrow">→</span> change it</span>
        <span>If the <strong>timing is off</strong> <span class="arrow">→</span> move it</span>
      </div>
    </div>
  </div>

</div>

</body>
</html>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Other Rules — Training</title>
  <style>
    :root {
      --bg-main: #05070a;
      --bg-card: #0b0e14;
      --border: #1e222b;
      --text-main: #ffffff;
      --text-body: #D1DCFF;
      --text-muted: #8a94a6;
      --text-soft: #bcc6d4;
      --accent-blue: #3444DA;
      --accent-blue-bright: #5967ff;
      --red-del: #ef5350;
      --green-ins: #4caf50;
      --yellow: #FFAB00;
      --yellow-soft: #FFE0A3;
      --orange: #FF6B35;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: var(--bg-main);
      background-image:
        radial-gradient(circle at 10% 0%, rgba(52,68,218,.18), transparent 45%),
        radial-gradient(circle at 95% 8%, rgba(52,68,218,.10), transparent 40%);
      color: var(--text-main);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      padding: 40px;
      min-height: 100vh;
    }

    .container { max-width: 1400px; margin: 0 auto; }

    /* --- Header --- */
    h2 {
      font-size: 1.2rem;
      color: var(--text-muted);
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 700;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .section-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 32px;
      height: 32px;
      padding: 0 10px;
      background: var(--accent-blue);
      color: #fff;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 800;
    }

    .section-intro {
      color: var(--text-body);
      font-size: 1rem;
      line-height: 1.6;
      margin-bottom: 32px;
      max-width: 950px;
    }

    .section-intro strong { color: #fff; }

    /* --- Rules grid --- */
    .rules {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 18px;
    }

    /* Make the last rule span both columns */
    .rule.full-width {
      grid-column: 1 / -1;
    }

    .rule {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 22px 24px;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .rule::before {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--accent-blue), var(--accent-blue-bright));
    }

    /* Rule header row: number + topic */
    .rule-head {
      display: flex;
      gap: 14px;
      align-items: flex-start;
    }

    .rule-num {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 9px;
      background: rgba(52,68,218,.15);
      border: 1px solid rgba(74,90,232,.4);
      color: #B8C5FF;
      font-size: 0.95rem;
      font-weight: 800;
    }

    .rule-topic {
      flex: 1;
      min-width: 0;
    }

    .rule-label {
      font-size: 0.66rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 800;
      color: var(--text-muted);
      margin-bottom: 3px;
    }

    .rule-title {
      font-size: 1.08rem;
      font-weight: 800;
      color: #fff;
      line-height: 1.25;
    }

    /* Question block */
    .rule-question {
      color: var(--text-soft);
      font-size: 0.9rem;
      line-height: 1.5;
      padding: 10px 14px;
      background: rgba(255,255,255,0.02);
      border-left: 2px solid var(--border);
      border-radius: 0 6px 6px 0;
      font-style: italic;
    }

    /* Rule answer block */
    .rule-answer {
      background: rgba(52,68,218,0.06);
      border: 1px solid rgba(74,90,232,0.3);
      border-left: 4px solid var(--accent-blue-bright);
      border-radius: 8px;
      padding: 12px 16px;
    }

    .rule-answer-label {
      display: inline-block;
      font-size: 0.64rem;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-weight: 800;
      color: var(--accent-blue-bright);
      margin-bottom: 6px;
    }

    .rule-answer-text {
      font-size: 0.93rem;
      line-height: 1.55;
      color: var(--text-body);
    }

    .rule-answer-text strong { color: #fff; font-weight: 700; }

    /* Inline verdict chips */
    .verdict {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 2px 9px;
      border-radius: 5px;
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      margin-right: 6px;
      vertical-align: 1px;
    }

    .verdict.yes {
      background: rgba(76,175,80,0.14);
      border: 1px solid rgba(76,175,80,0.4);
      color: var(--green-ins);
    }

 .verdict.conditional {
  background: rgba(239,83,80,0.14);
  border: 1px solid rgba(239,83,80,0.4);
  color: var(--red-del);
}

    /* Inline example chip */
    .example-inline {
      display: block;
      margin-top: 8px;
      padding: 8px 12px;
      background: rgba(255,255,255,0.03);
      border: 1px dashed var(--border);
      border-radius: 6px;
      font-size: 0.85rem;
      color: var(--text-muted);
      font-style: italic;
      line-height: 1.5;
    }

    .example-inline .ex-lbl {
      display: inline-block;
      font-style: normal;
      font-weight: 800;
      font-size: 0.62rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-muted);
      margin-right: 6px;
    }

    .example-inline .good-text {
      color: var(--green-ins);
      font-style: normal;
      font-weight: 700;
    }

    .example-inline .strike {
      color: var(--red-del);
      text-decoration: line-through;
      text-decoration-thickness: 1.5px;
      font-style: normal;
    }

    /* Position grid visual */
    .pos-grid {
      display: inline-grid;
      grid-template-columns: repeat(3, auto);
      gap: 4px 10px;
      margin-top: 8px;
      padding: 10px 14px;
      background: rgba(255,255,255,0.03);
      border: 1px dashed var(--border);
      border-radius: 6px;
      font-size: 0.82rem;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      color: var(--text-muted);
    }

    .pos-grid span {
      padding: 3px 8px;
      border-radius: 4px;
      text-align: center;
    }

    .pos-grid .highlight {
      background: rgba(76,175,80,0.12);
      border: 1px solid rgba(76,175,80,0.3);
      color: var(--green-ins);
      font-weight: 700;
    }

    /* Responsive */
    @media (max-width: 1000px) {
      .rules { grid-template-columns: 1fr; }
      .rule.full-width { grid-column: auto; }
    }
  </style>
</head>
<body>

<div class="container">

  <h2>Section 2</h2>
  <div class="section-title">
    <span class="section-number">2.3</span>
    Captioning Conventions
  </div>

  <p class="section-intro">
  </p>

  <div class="rules">

    <!-- RULE 1 -->
    <div class="rule">
      <div class="rule-head">
        <div class="rule-num">1</div>
        <div class="rule-topic">
          <div class="rule-label">Guideline 01</div>
          <div class="rule-title">Movement</div>
        </div>
      </div>

      <div class="rule-question">
        Should we annotate body movements?
      </div>

      <div class="rule-answer">
        <span class="rule-answer-label">decision</span>
        <div class="rule-answer-text">
          <span class="verdict conditional">no</span>
          Zion is focused on captioning hand actions rather than body movements. For example, "both hands move to the right and then move a cloth" instead of "moves the torso to the right and then moves a cloth", or "moves forward, reaches for, and picks up a box from the table" instead of "moves four steps forward and picks up a box from the table". Avoid using "number of steps", "walks", or "moves the legs".
        </div>
      </div>
    </div>

    <!-- RULE 2 -->
    <div class="rule">
      <div class="rule-head">
        <div class="rule-num">2</div>
        <div class="rule-topic">
          <div class="rule-label">Guideline 02</div>
          <div class="rule-title">Viewpoint Changes</div>
        </div>
      </div>

      <div class="rule-question">
        Should we mention when the operator turns his/her head, changing the camera focus?
      </div>

      <div class="rule-answer">
        <span class="rule-answer-label">decision</span>
        <div class="rule-answer-text">
          <span class="verdict conditional">no</span>
          Zion is focused on captioning  <strong>hand actions</strong> rather than head movement. Only label left and right hand actions. Exclude head movement.
        </div>
      </div>
    </div>

    <!-- RULE 3 -->
    <div class="rule">
      <div class="rule-head">
        <div class="rule-num">3</div>
        <div class="rule-topic">
          <div class="rule-label">Guideline 03</div>
          <div class="rule-title">Object Identification</div>
        </div>
      </div>

      <div class="rule-question">
        Should we mention all visible objects?
      </div>

      <div class="rule-answer">
        <span class="rule-answer-label">Decision</span>
        <div class="rule-answer-text">
Use objects as <strong>reference points</strong> for hand actions—<strong>not</strong> as standalone mentions.
        </div>
      </div>
    </div>

    <!-- RULE 4 -->
    <div class="rule">
      <div class="rule-head">
        <div class="rule-num">4</div>
        <div class="rule-topic">
          <div class="rule-label">Guideline 04</div>
          <div class="rule-title">Action Outcomes</div>
        </div>
      </div>

      <div class="rule-question">
            Should we describe events caused by left or right hand actions?
      </div>

      <div class="rule-answer">
        <span class="rule-answer-label">Decision</span>
        <div class="rule-answer-text">
          <span class="verdict yes">Yes</span>
If an action results in a <strong>secondary event</strong>, include it in the caption.
          <span class="example-inline">
            <span class="ex-lbl">Example</span>
            The right hand places a cup on the counter <span class="good-text">and a finger knocks it over</span>.
          </span>
        </div>
      </div>
    </div>

    <!-- RULE 5 -->
    <div class="rule full-width">
      <div class="rule-head">
        <div class="rule-num">5</div>
        <div class="rule-topic">
          <div class="rule-label">Guideline 05</div>
          <div class="rule-title">Object Generalization</div>
        </div>
      </div>

      <div class="rule-question">
        Can we generalize an object if a specific description of its material is hard to assess?
      </div>

      <div class="rule-answer">
        <span class="rule-answer-label">Decision</span>
        <div class="rule-answer-text">
          <span class="verdict yes">Yes</span>
          If the material is difficult to identify, use a <strong>general term</strong> rather than guessing. <em style="color: var(--text-muted); font-style: normal;">(This ties directly back to the "Avoid Hallucinated Detail" principle.)</em>
          <span class="example-inline">
            <span class="ex-lbl">Example</span>
            Use <span class="good-text">"cup"</span> instead of <span class="strike">"plastic / glass cup"</span> when the material isn't clearly identifiable.
          </span>
        </div>
      </div>
    </div>

    <!-- RULE 6 -->
    <div class="rule">
      <div class="rule-head">
        <div class="rule-num">6</div>
        <div class="rule-topic">
          <div class="rule-label">Guideline 06</div>
          <div class="rule-title">Hand Rest Positioning</div>
        </div>
      </div>

      <div class="rule-question">
        Should captions describe the return of the hand to the resting position after a main action, or is it acceptable to end the caption at the main action itself?
      </div>

      <div class="rule-answer">
        <span class="rule-answer-label">Decision</span>
        <div class="rule-answer-text">
          <span class="verdict yes">Yes</span>
          Always describe the hand's resting position at the end of each segment. Use <strong>"high default position"</strong> for anything near the body <strong>above the waist</strong>, and <strong>"low default position"</strong> for anything <strong>below the waist</strong>. If the hand is not positioned near the body, describe its <strong>specific position and location</strong> in the scene.
          <span class="example-inline">
            <span class="ex-lbl">Example</span>
            The right hand places the cup on the counter, <span class="good-text">then returns to a high default position</span>.
          </span>
        </div>
      </div>
    </div>

    

</body>
</html>


<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Edit Categories — Training</title>
  <style>
    :root {
      --bg-main: #05070a;
      --bg-card: #0b0e14;
      --border: #1e222b;
      --border-soft: #2a2d35;
      --text-main: #ffffff;
      --text-body: #D1DCFF;
      --text-muted: #8a94a6;
      --text-soft: #bcc6d4;
      --accent-blue: #3444DA;
      --accent-blue-bright: #5967ff;
      --yellow: #FFAB00;
      --yellow-soft: #FFE0A3;
      --red-del: #ef5350;
      --green-ins: #4caf50;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: var(--bg-main);
      background-image:
        radial-gradient(circle at 10% 0%, rgba(52,68,218,.18), transparent 45%),
        radial-gradient(circle at 95% 8%, rgba(52,68,218,.10), transparent 40%);
      color: var(--text-main);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      padding: 40px;
      min-height: 100vh;
    }

    .container { max-width: 1400px; margin: 0 auto; }

    /* --- Section header --- */
    h2 {
      font-size: 1.2rem;
      color: var(--text-muted);
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 700;
    }

    .section-title {
      font-size: 1.7rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .section-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 32px;
      height: 32px;
      padding: 0 10px;
      background: var(--accent-blue);
      color: #fff;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 800;
    }

    .section-intro {
      color: var(--text-body);
      font-size: 1rem;
      line-height: 1.65;
      margin-bottom: 28px;
      max-width: 950px;
    }

    .section-intro strong { color: #fff; }

    /* --- Errors grid (3x3 for 9 cards) --- */
    .errors-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 28px;
    }

    .error-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px 22px;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: border-color 0.15s ease, transform 0.15s ease;
    }

    .error-card:hover {
      border-color: var(--border-soft);
      transform: translateY(-1px);
    }

    .error-card::before {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--accent-blue), var(--accent-blue-bright));
    }

    .error-head {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .error-num {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 9px;
      background: rgba(52,68,218,.15);
      border: 1px solid rgba(74,90,232,.4);
      color: #B8C5FF;
      font-size: 0.95rem;
      font-weight: 800;
    }

    .error-meta {
      flex: 1;
      min-width: 0;
    }

    /* Tag-first header: monospace tag prominent, human name beside it */
    .tag-row {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 8px;
    }

    .tag-chip {
      display: inline-flex;
      align-items: center;
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 0.88rem;
      font-weight: 700;
      letter-spacing: 0.01em;
      background: rgba(89,103,255,0.15);
      border: 1px solid rgba(89,103,255,0.5);
      color: var(--accent-blue-bright);
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    }

    .tag-name {
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--text-soft);
    }

    .error-body {
      color: var(--text-body);
      font-size: 0.86rem;
      line-height: 1.55;
    }

    .error-body strong { color: #fff; }

    .error-example {
      margin-top: 4px;
      padding: 8px 12px;
      background: rgba(255,255,255,0.02);
      border-left: 2px solid var(--border-soft);
      border-radius: 4px;
      font-size: 0.78rem;
      color: var(--text-muted);
      line-height: 1.5;
      font-style: italic;
    }

    .error-example .ex-lbl {
      display: inline-block;
      font-size: 0.6rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 800;
      color: var(--text-muted);
      margin-right: 6px;
      font-style: normal;
    }

    /* --- Bottom callout --- */
    .tip {
      background: rgba(255, 171, 0, 0.06);
      border: 1px solid rgba(255, 171, 0, 0.3);
      border-left: 4px solid var(--yellow);
      border-radius: 10px;
      padding: 18px 22px;
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }

    .tip-icon {
      flex-shrink: 0;
      width: 38px; height: 38px;
      border-radius: 9px;
      background: rgba(255, 171, 0, 0.15);
      border: 1px solid rgba(255, 171, 0, 0.4);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
    }

    .tip-body { flex: 1; }

    .tip-label {
      display: block;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 800;
      color: var(--yellow-soft);
      margin-bottom: 6px;
    }

    .tip-text {
      color: var(--text-body);
      font-size: 0.92rem;
      line-height: 1.55;
    }

    .tip-text strong { color: #fff; }

    /* Responsive */
    @media (max-width: 1100px) {
      .errors-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 700px) {
      .errors-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

<div class="container">

  <h2>Section 3</h2>
  <div class="section-title">
    <span class="section-number">3</span>
    Edit Categories
  </div>

  <p class="section-intro">
    When you edit a caption, you'll tag <strong>why</strong> using one of the nine categories below. Tags align directly with the edit-reason buttons in the annotation tool — they let the team track <strong>which kinds of errors</strong> the model makes most often.
  </p>

  <!-- Errors grid -->
  <div class="errors-grid">

    <!-- 1. action_fix -->
    <div class="error-card">
      <div class="error-head">
        <div class="error-num">1</div>
        <div class="error-meta">
          <div class="tag-row">
            <span class="tag-chip">action_fix</span>
            <span class="tag-name">Action Fix</span>
          </div>
        </div>
      </div>
      <div class="error-body">
        The <strong>motion described is wrong</strong> — the verb itself doesn't match what's happening.
      </div>
      <div class="error-example">
        <span class="ex-lbl">e.g.</span>
        Caption says <em>"shakes the bottle"</em> but the hand actually <em>rotates</em> it.
      </div>
    </div>

    <!-- 2. timestamp_fix -->
    <div class="error-card">
      <div class="error-head">
        <div class="error-num">2</div>
        <div class="error-meta">
          <div class="tag-row">
            <span class="tag-chip">timestamp_fix</span>
            <span class="tag-name">Timestamp Fix</span>
          </div>
        </div>
      </div>
      <div class="error-body">
        The caption is correct but the <strong>start or end time is off</strong> — the window doesn't tightly bound the action.
      </div>
      <div class="error-example">
        <span class="ex-lbl">e.g.</span>
        Window <em>0:03 → 0:09</em> when the action ends at <em>0:07</em>.
      </div>
    </div>

    <!-- 3. hand_fix -->
    <div class="error-card">
      <div class="error-head">
        <div class="error-num">3</div>
        <div class="error-meta">
          <div class="tag-row">
            <span class="tag-chip">hand_fix</span>
            <span class="tag-name">Hand Fix</span>
          </div>
        </div>
      </div>
      <div class="error-body">
        The <strong>hand label is wrong</strong> — left attributed when it's the right, or one hand marked active when both are.
      </div>
      <div class="error-example">
        <span class="ex-lbl">e.g.</span>
        <em>"Left hand reaches"</em> when it's the right hand performing the action.
      </div>
    </div>

    <!-- 4. object_fix -->
    <div class="error-card">
      <div class="error-head">
        <div class="error-num">4</div>
        <div class="error-meta">
          <div class="tag-row">
            <span class="tag-chip">object_fix</span>
            <span class="tag-name">Object Fix</span>
          </div>
        </div>
      </div>
      <div class="error-body">
        Wrong <strong>object label or attribute</strong> — incorrect name, color, or descriptor that needs correcting.
      </div>
      <div class="error-example">
        <span class="ex-lbl">e.g.</span>
        <em>"maroon cup"</em> instead of <em>"red cup"</em>.
      </div>
    </div>

    <!-- 5. hallucination -->
    <div class="error-card">
      <div class="error-head">
        <div class="error-num">5</div>
        <div class="error-meta">
          <div class="tag-row">
            <span class="tag-chip">hallucination</span>
            <span class="tag-name">Hallucination</span>
          </div>
        </div>
      </div>
      <div class="error-body">
        The model <strong>made something up</strong> — invented an object, action, or detail that isn't in the video.
      </div>
      <div class="error-example">
        <span class="ex-lbl">e.g.</span>
        Caption mentions a brand or sub-action that isn't visible.
      </div>
    </div>

    <!-- 6. missing_phase -->
    <div class="error-card">
      <div class="error-head">
        <div class="error-num">6</div>
        <div class="error-meta">
          <div class="tag-row">
            <span class="tag-chip">missing_phase</span>
            <span class="tag-name">Missing Phase</span>
          </div>
        </div>
      </div>
      <div class="error-body">
        The model <strong>didn't annotate a segment</strong> — there's a gap in the timeline where an action occurs.
      </div>
      <div class="error-example">
        <span class="ex-lbl">e.g.</span>
        A reach action between two captions has no phase of its own.
      </div>
    </div>

    <!-- 7. merge_segments -->
    <div class="error-card">
      <div class="error-head">
        <div class="error-num">7</div>
        <div class="error-meta">
          <div class="tag-row">
            <span class="tag-chip">merge_segments</span>
            <span class="tag-name">Merge Segments</span>
          </div>
        </div>
      </div>
      <div class="error-body">
        The model <strong>combined segments</strong> that should be split — one caption covers more time than the action it describes.
      </div>
      <div class="error-example">
        <span class="ex-lbl">e.g.</span>
        <em>"Picking up cup"</em> tagged <em>0:03 → 0:07</em>, but pickup ends at <em>0:05</em>.
      </div>
    </div>

    <!-- 8. split_segments -->
    <div class="error-card">
      <div class="error-head">
        <div class="error-num">8</div>
        <div class="error-meta">
          <div class="tag-row">
            <span class="tag-chip">split_segments</span>
            <span class="tag-name">Split Segments</span>
          </div>
        </div>
      </div>
      <div class="error-body">
        Reverse of merge — the model <strong>unnecessarily split</strong> one continuous action into multiple short captions.
      </div>
      <div class="error-example">
        <span class="ex-lbl">e.g.</span>
        A single reach broken into three 1-second captions with invented sub-actions.
      </div>
    </div>

    <!-- 9. structural_cleanup -->
    <div class="error-card">
      <div class="error-head">
        <div class="error-num">9</div>
        <div class="error-meta">
          <div class="tag-row">
            <span class="tag-chip">structural_cleanup</span>
            <span class="tag-name">Structural Cleanup</span>
          </div>
        </div>
      </div>
      <div class="error-body">
        General <strong>cleanup of phrasing or structure</strong> — wording is off but the facts are right.
      </div>
      <div class="error-example">
        <span class="ex-lbl">e.g.</span>
        Subject placed at the end of the sentence; awkward word order.
      </div>
    </div>

  </div>

  <!-- Bottom callout -->
  <div class="tip">
    <div class="tip-icon">🏷</div>
    <div class="tip-body">
      <span class="tip-label">When tagging</span>
      <p class="tip-text">
        Pick <strong>every category that applies</strong> to your edit — a single fix often involves multiple tags. For example, fixing <em>"left hand picks the maroon cup"</em> when it's the right hand grasping a red one needs both <strong>hand_fix</strong> and <strong>object_fix</strong>.
      </p>
    </div>
  </div>

</div>

</body>
</html>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Task Review - Overspecified / Hallucinated Detail</title>
  <style>
    :root {
      --bg-main: #05070a;
      --bg-card: #0b0e14;
      --border: #1e222b;
      --border-soft: #2a2d35;
      --text-main: #ffffff;
      --text-muted: #8a94a6;
      --text-body: #D1DCFF;
      --accent-blue: #3444DA;
      --accent-blue-bright: #5967ff;
      --red-del: #ef5350;
      --green-ins: #4caf50;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: var(--bg-main);
      color: var(--text-main);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 40px;
      min-height: 100vh;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
    }

    h1 {
      font-size: 1.6rem;
      margin-bottom: 20px;
      font-weight: 800;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    h1 .ex-num {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 34px;
      height: 34px;
      padding: 0 10px;
      background: var(--accent-blue);
      color: #fff;
      border-radius: 8px;
      font-size: 0.88rem;
      font-weight: 800;
      letter-spacing: 0.04em;
    }

    h2 {
      font-size: 1.2rem;
      color: var(--text-muted);
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    /* --- Guidelines (top) --- */
    .guidelines-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 48px;
    }

    .guide-card {
      padding: 24px;
      border-radius: 10px;
      border: 1px solid var(--border);
    }

    .guide-card.wrong {
      background: rgba(239, 83, 80, 0.05);
      border-color: rgba(239, 83, 80, 0.3);
    }

    .guide-card.correct {
      background: rgba(76, 175, 80, 0.05);
      border-color: rgba(76, 175, 80, 0.3);
    }

    .guide-header {
      font-weight: 700;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .text-display {
      color: #d1dcff;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    hr.divider {
      border: 0;
      border-top: 1px solid var(--border);
      margin-bottom: 36px;
    }

    /* --- Example section --- */
    .example-section {
      margin-bottom: 72px;
    }

    /* Full-width video card on top */
    .video-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 12px;
      margin-bottom: 18px;
    }

    .video-container {
      width: 100%;
      aspect-ratio: 16 / 9;
      background: #000;
      border-radius: 8px;
      position: relative;
      overflow: hidden;
      border: 1px solid var(--border-soft);
    }

    .video-container video {
      width: 100%;
      height: 100%;
      display: block;
    }

    /* Captions row: Bad + Good side by side */
    .captions-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
      margin-bottom: 16px;
    }

    .caption-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 18px 20px;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .caption-card::before {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
    }

    .caption-card.bad::before  { background: var(--red-del); }
    .caption-card.good::before { background: var(--green-ins); }

    .caption-card.bad {
      background: rgba(239, 83, 80, 0.04);
      border-color: rgba(239, 83, 80, 0.28);
    }

    .caption-card.good {
      background: rgba(76, 175, 80, 0.04);
      border-color: rgba(76, 175, 80, 0.28);
    }

    .caption-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 800;
      margin-bottom: 12px;
    }

    .caption-card.bad  .caption-label { color: var(--red-del); }
    .caption-card.good .caption-label { color: var(--green-ins); }

    .caption-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 800;
    }

    .caption-card.bad .caption-badge {
      background: rgba(239,83,80,0.15);
      border: 1px solid rgba(239,83,80,0.4);
      color: var(--red-del);
    }

    .caption-card.good .caption-badge {
      background: rgba(76,175,80,0.15);
      border: 1px solid rgba(76,175,80,0.4);
      color: var(--green-ins);
    }

    .caption-subtag {
      margin-left: auto;
      font-size: 0.62rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 700;
      color: var(--text-muted);
    }

    .caption-text {
      color: #d1dcff;
      font-size: 0.95rem;
      line-height: 1.55;
    }

    .caption-text .hl-bad {
      color: var(--red-del);
      font-weight: 600;
    }

    /* Issue description (bottom) */
    .description-card {
      background: rgba(52, 68, 218, 0.07);
      border: 1px solid rgba(52, 68, 218, 0.3);
      border-radius: 10px;
      padding: 16px 20px;
    }

    .description-card .label {
      color: #6b7fd4;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 800;
      margin-bottom: 6px;
      display: block;
    }

    .description-card .text-display {
      color: #a0aecf;
      font-size: 0.9rem;
    }

    /* Responsive — stack captions vertically only on very narrow widths */
    @media (max-width: 600px) {
      .captions-row { grid-template-columns: 1fr; }
      .guidelines-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

<div class="container">

  <h2>Error Category: Overspecified / Hallucinated Detail</h2>
  <div class="guidelines-grid">
    <div class="guide-card wrong">
      <div class="guide-header" style="color: var(--red-del);">✕ Incorrect</div>
      <p class="text-display" style="color: var(--text-muted);">
        Adding inferred or invented objects, descriptors, or sub-actions: <br> "silver tip", "pours the contents", "flips upside down", guessed brands
      </p>
    </div>
    <div class="guide-card correct">
      <div class="guide-header" style="color: var(--green-ins);">✓ Correct</div>
      <p class="text-display">
        Describe only what is visibly verifiable: no inferred objects, emotions, or intentions. If an adjective or sub-action cannot be proven from the frames, omit it. When in doubt, generalize rather than embellish.
      </p>
    </div>
  </div>

  <hr class="divider">

  <!-- ============ Example 1 ============ -->
  <div class="example-section">
    <h1><span class="ex-num">Ex 1</span> Unverifiable object brand</h1>

    <!-- Full-width video -->
    <div class="video-card">
      <div class="video-container">
        <video controls>
          <source src="https://pub-f4aee76241b44e469df5ee6e157f67fb.r2.dev/horizon-resources/69e6db78bea9c69e1d86aa55.mov" type="video/mp4">
        </video>
      </div>
    </div>

    <!-- Captions side by side below -->
    <div class="captions-row">
      <div class="caption-card bad">
        <div class="caption-label">
          <span class="caption-badge">✕</span>
          Incorrect
          <span class="caption-subtag">Overspecified</span>
        </div>
        <p class="caption-text">
Both hands carry an upside-down <span class="hl-bad">Olavson</span> copper pan, gripping opposite edges of the pan to transport it steadily.
        </p>
      </div>

      <div class="caption-card good">
        <div class="caption-label">
          <span class="caption-badge">✓</span>
          Correct
          <span class="caption-subtag">Verifiable</span>
        </div>
        <p class="caption-text">
Both hands carry an upside-down copper pan, gripping opposite edges.
        </p>
      </div>
    </div>

    <!-- Error -->
    <div class="description-card">
      <span class="label">📝 Error</span>
      <div class="text-display">Avoid inferring unverifiable information about the objects.</div>
    </div>
  </div>

  <!-- ============ Example 2 ============ -->
  <div class="example-section">
    <h1><span class="ex-num">Ex 2</span> Hallucinated product type</h1>

    <!-- Full-width video -->
    <div class="video-card">
      <div class="video-container">
        <video controls>
          <source src="https://pub-f4aee76241b44e469df5ee6e157f67fb.r2.dev/horizon-resources/69e6dbb7bea9c69e1d86b0ab.mov" type="video/mp4">
        </video>
      </div>
    </div>

    <!-- Captions side by side below -->
    <div class="captions-row">
      <div class="caption-card bad">
        <div class="caption-label">
          <span class="caption-badge">✕</span>
          Incorrect
          <span class="caption-subtag">Hallucinated</span>
        </div>
        <p class="caption-text">
          The right hand sets a green <span class="hl-bad">lime soda</span> can into a wooden counter while the left hand remains idle.
        </p>
      </div>

      <div class="caption-card good">
        <div class="caption-label">
          <span class="caption-badge">✓</span>
          Correct
          <span class="caption-subtag">Verifiable</span>
        </div>
        <p class="caption-text">
          The right hand sets a green can onto a wooden counter while the left hand remains idle.
        </p>
      </div>
    </div>

    <!-- Issue description -->
    <div class="description-card">
      <span class="label">📝 Error</span>
      <div class="text-display">Unable to verify if the can is Lime Soda.</div>
    </div>
  </div>

</div>

</body>
</html>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Examples — hand_fix</title>
  <style>
    :root {
      --bg-main: #05070a;
      --bg-card: #0b0e14;
      --border: #1e222b;
      --border-soft: #2a2d35;
      --text-main: #ffffff;
      --text-muted: #8a94a6;
      --text-body: #D1DCFF;
      --accent-blue: #3444DA;
      --accent-blue-bright: #5967ff;
      --red-del: #ef5350;
      --green-ins: #4caf50;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: var(--bg-main);
      color: var(--text-main);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 40px;
      min-height: 100vh;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
    }

    h1 {
      font-size: 1.6rem;
      margin-bottom: 20px;
      font-weight: 800;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    h1 .ex-num {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 34px;
      height: 34px;
      padding: 0 10px;
      background: var(--accent-blue);
      color: #fff;
      border-radius: 8px;
      font-size: 0.88rem;
      font-weight: 800;
      letter-spacing: 0.04em;
    }

    /* Section title with monospace tag chip */
    h2 {
      font-size: 1.2rem;
      color: var(--text-muted);
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    h2 .tag-chip {
      display: inline-flex;
      align-items: center;
      padding: 5px 12px;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 700;
      letter-spacing: 0.01em;
      background: rgba(89,103,255,0.15);
      border: 1px solid rgba(89,103,255,0.5);
      color: var(--accent-blue-bright);
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      text-transform: none;
    }

    h2 .tag-name {
      color: #fff;
      font-weight: 700;
    }

    /* --- Guidelines (top) --- */
    .guidelines-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 48px;
    }

    .guide-card {
      padding: 24px;
      border-radius: 10px;
      border: 1px solid var(--border);
    }

    .guide-card.wrong {
      background: rgba(239, 83, 80, 0.05);
      border-color: rgba(239, 83, 80, 0.3);
    }

    .guide-card.correct {
      background: rgba(76, 175, 80, 0.05);
      border-color: rgba(76, 175, 80, 0.3);
    }

    .guide-header {
      font-weight: 700;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .text-display {
      color: #d1dcff;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    hr.divider {
      border: 0;
      border-top: 1px solid var(--border);
      margin-bottom: 36px;
    }

    /* --- Example section --- */
    .example-section {
      margin-bottom: 72px;
    }

    /* Full-width video card on top */
    .video-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 12px;
      margin-bottom: 18px;
    }

    .video-container {
      width: 100%;
      aspect-ratio: 16 / 9;
      background: #000;
      border-radius: 8px;
      position: relative;
      overflow: hidden;
      border: 1px solid var(--border-soft);
    }

    .video-container video {
      width: 100%;
      height: 100%;
      display: block;
    }

    /* Captions row: Bad + Good side by side */
    .captions-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
      margin-bottom: 16px;
    }

    .caption-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 18px 20px;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .caption-card::before {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
    }

    .caption-card.bad::before  { background: var(--red-del); }
    .caption-card.good::before { background: var(--green-ins); }

    .caption-card.bad {
      background: rgba(239, 83, 80, 0.04);
      border-color: rgba(239, 83, 80, 0.28);
    }

    .caption-card.good {
      background: rgba(76, 175, 80, 0.04);
      border-color: rgba(76, 175, 80, 0.28);
    }

    .caption-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 800;
      margin-bottom: 12px;
    }

    .caption-card.bad  .caption-label { color: var(--red-del); }
    .caption-card.good .caption-label { color: var(--green-ins); }

    .caption-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 800;
    }

    .caption-card.bad .caption-badge {
      background: rgba(239,83,80,0.15);
      border: 1px solid rgba(239,83,80,0.4);
      color: var(--red-del);
    }

    .caption-card.good .caption-badge {
      background: rgba(76,175,80,0.15);
      border: 1px solid rgba(76,175,80,0.4);
      color: var(--green-ins);
    }

    .caption-subtag {
      margin-left: auto;
      font-size: 0.62rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 700;
      color: var(--text-muted);
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    }

    .caption-text {
      color: #d1dcff;
      font-size: 0.95rem;
      line-height: 1.55;
    }

    .caption-text .hl-bad {
      color: var(--red-del);
      font-weight: 600;
    }

    /* Issue description (bottom) */
    .description-card {
      background: rgba(52, 68, 218, 0.07);
      border: 1px solid rgba(52, 68, 218, 0.3);
      border-radius: 10px;
      padding: 16px 20px;
    }

    .description-card .label {
      color: #6b7fd4;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 800;
      margin-bottom: 6px;
      display: block;
    }

    .description-card .text-display {
      color: #a0aecf;
      font-size: 0.9rem;
    }

    /* Responsive */
    @media (max-width: 600px) {
      .captions-row { grid-template-columns: 1fr; }
      .guidelines-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

<div class="container">

  <h2>
    <span>Examples:</span>
    <span class="tag-chip">hand_fix</span>
    <span class="tag-name">Incorrect Hand Attribution</span>
  </h2>

  <div class="guidelines-grid">
    <div class="guide-card wrong">
      <div class="guide-header" style="color: var(--red-del);">✕ Incorrect</div>
      <p class="text-display" style="color: var(--text-muted);">
        Wrong hand label — describing a hand as active when it's idle, marking it idle when it's clearly moving, or swapping left and right entirely. Avoid unverifiable assumptions (e.g., "rests on his right thigh"); if the state can't be confirmed, label the hand as idle.
      </p>
    </div>
    <div class="guide-card correct">
      <div class="guide-header" style="color: var(--green-ins);">✓ Correct</div>
      <p class="text-display">
        Assess each hand independently. Determine whether it is (a) active and performing a distinct action, (b) idle or holding steady, or (c) out of frame. Anchor laterality from the robot's POV — double-check which hand actually closes or interacts.
      </p>
    </div>
  </div>

  <hr class="divider">

  <!-- ============ Example 1 ============ -->
  <div class="example-section">
    <h1><span class="ex-num">Ex 1</span> Left hand incorrectly labeled as active</h1>

    <!-- Full-width video -->
    <div class="video-card">
      <div class="video-container">
        <video controls>
          <source src="https://pub-f4aee76241b44e469df5ee6e157f67fb.r2.dev/horizon-resources/69e6db20bea9c69e1d869e4c.mov" type="video/mp4">
        </video>
      </div>
    </div>

    <!-- Captions side by side below -->
    <div class="captions-row">
      <div class="caption-card bad">
        <div class="caption-label">
          <span class="caption-badge">✕</span>
          Incorrect
          <span class="caption-subtag">hand_fix</span>
        </div>
        <p class="caption-text">
          The right hand places a white cup in the sink, while the left hand <span class="hl-bad">reaches for the pan handle but fails to grasp it</span>.
        </p>
      </div>

      <div class="caption-card good">
        <div class="caption-label">
          <span class="caption-badge">✓</span>
          Correct
          <span class="caption-subtag">Verifiable</span>
        </div>
        <p class="caption-text">
          The right hand places a white cup in the sink, while the left hand remains still.
        </p>
      </div>
    </div>

    <!-- Issue description -->
    <div class="description-card">
      <span class="label">📝 Error</span>
      <div class="text-display">Left hand is idle.</div>
    </div>
  </div>

  <!-- ============ Example 2 ============ -->
  <div class="example-section">
    <h1><span class="ex-num">Ex 2</span> Left hand incorrectly labeled as grabbing</h1>

    <!-- Full-width video -->
    <div class="video-card">
      <div class="video-container">
        <video controls>
          <source src="https://pub-f4aee76241b44e469df5ee6e157f67fb.r2.dev/horizon-resources/69e6db40bea9c69e1d86a2eb.mov" type="video/mp4">
        </video>
      </div>
    </div>

    <!-- Captions side by side below -->
    <div class="captions-row">
      <div class="caption-card bad">
        <div class="caption-label">
          <span class="caption-badge">✕</span>
          Incorrect
          <span class="caption-subtag">hand_fix</span>
        </div>
        <p class="caption-text">
          The left hand <span class="hl-bad">grabs the wooden counter</span> while the right hand lifts a small metal pot over the sink basin.
        </p>
      </div>

      <div class="caption-card good">
        <div class="caption-label">
          <span class="caption-badge">✓</span>
          Correct
          <span class="caption-subtag">Verifiable</span>
        </div>
        <p class="caption-text">
          The left hand remains idle while the right hand lifts a small metal pot over the sink basin.
        </p>
      </div>
    </div>

    <!-- Issue description -->
    <div class="description-card">
      <span class="label">📝 Error</span>
      <div class="text-display">Left hand is idle.</div>
    </div>
  </div>

  <!-- ============ Example 3 ============ -->
  <div class="example-section">
    <h1><span class="ex-num">Ex 3</span> Wrong hand — left, not right</h1>

    <div class="video-card">
      <div class="video-container">
        <video controls>
          <source src="https://pub-f4aee76241b44e469df5ee6e157f67fb.r2.dev/horizon-resources/69e8206d197a5ad4447bd122.mp4" type="video/mp4">
        </video>
      </div>
    </div>

    <div class="captions-row">
      <div class="caption-card bad">
        <div class="caption-label">
          <span class="caption-badge">✕</span>
          Incorrect
          <span class="caption-subtag">hand_fix</span>
        </div>
        <p class="caption-text">
          <span class="hl-bad">The right hand</span> reaches out to grasp and lift a blue-capped water bottle from the counter while the left hand remains resting on the edge of the counter.
        </p>
      </div>

      <div class="caption-card good">
        <div class="caption-label">
          <span class="caption-badge">✓</span>
          Correct
          <span class="caption-subtag">Verifiable</span>
        </div>
        <p class="caption-text">
          <span class="hl-good">The left hand</span> rests open on the right side of the table, then lifts, moves backward to the left, and reaches for the blue-capped water bottle to grasp it, while the right hand remains idle.
        </p>
      </div>
    </div>

    <div class="description-card">
      <span class="label">📝 Error</span>
      <div class="text-display">The original caption incorrectly states that the right hand grabs the bottle. In the video, the left hand performs the action while the right hand remains idle.</div>
    </div>
  </div>

  <!-- ============ Example 4 ============ -->
  <div class="example-section">
    <h1><span class="ex-num">Ex 4</span> Wrong hand — left hand is active, not right</h1>

    <div class="video-card">
      <div class="video-container">
        <video controls>
          <source src="https://pub-f4aee76241b44e469df5ee6e157f67fb.r2.dev/horizon-resources/69e788c9c75a2a206d2bb11c.mov" type="video/mp4">
        </video>
      </div>
    </div>

    <div class="captions-row">
      <div class="caption-card bad">
        <div class="caption-label">
          <span class="caption-badge">✕</span>
          Incorrect
          <span class="caption-subtag">hand_fix</span>
        </div>
        <p class="caption-text">
          The <span class="hl-bad">right hand</span> reaches into a white bowl, briefly touches a green snack bar, and then picks up and removes the blue snack bar while the <span class="hl-bad">left hand</span> remains out of view.
        </p>
      </div>

      <div class="caption-card good">
        <div class="caption-label">
          <span class="caption-badge">✓</span>
          Correct
          <span class="caption-subtag">Verifiable</span>
        </div>
        <p class="caption-text">
          The <span class="hl-good">left hand</span> reaches into a white bowl and picks up a blue snack bar, while the <span class="hl-good">right hand</span> remains out of view.
        </p>
      </div>
    </div>

    <div class="description-card">
      <span class="label">📝 Error</span>
      <div class="text-display">The original caption swaps the hands: the hand performing the action is the left, and the one off-screen is the right.</div>
    </div>
  </div>

  <!-- ============ Example 5 ============ -->
  <div class="example-section">
    <h1><span class="ex-num">Ex 5</span> Wrong hand — right hand receives, not left</h1>

    <div class="video-card">
      <div class="video-container">
        <video controls>
          <source src="https://pub-f4aee76241b44e469df5ee6e157f67fb.r2.dev/horizon-resources/69e788dec75a2a206d2bb4b7.mov" type="video/mp4">
        </video>
      </div>
    </div>

    <div class="captions-row">
      <div class="caption-card bad">
        <div class="caption-label">
          <span class="caption-badge">✕</span>
          Incorrect
          <span class="caption-subtag">hand_fix</span>
        </div>
        <p class="caption-text">
          The <span class="hl-bad">left hand</span> reaches out and takes a green bottle offered by a person, while the <span class="hl-bad">right hand</span> remains out of view.
        </p>
      </div>

      <div class="caption-card good">
        <div class="caption-label">
          <span class="caption-badge">✓</span>
          Correct
          <span class="caption-subtag">Verifiable</span>
        </div>
        <p class="caption-text">
          The <span class="hl-good">right hand</span> reaches out and takes the green bottle, while the <span class="hl-good">left hand</span> remains out of view.
        </p>
      </div>
    </div>

    <div class="description-card">
      <span class="label">📝 Error</span>
      <div class="text-display">The robot reaches for the bottle with its right hand, not the left; the left hand is the one out of view.</div>
    </div>
  </div>

</div>

</body>
</html>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Examples — action_fix</title>
  <style>
    :root {
      --bg-main: #05070a;
      --bg-card: #0b0e14;
      --border: #1e222b;
      --border-soft: #2a2d35;
      --text-main: #ffffff;
      --text-muted: #8a94a6;
      --text-body: #D1DCFF;
      --accent-blue: #3444DA;
      --accent-blue-bright: #5967ff;
      --red-del: #ef5350;
      --green-ins: #4caf50;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: var(--bg-main);
      color: var(--text-main);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 40px;
      min-height: 100vh;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
    }

    h1 {
      font-size: 1.6rem;
      margin-bottom: 20px;
      font-weight: 800;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    h1 .ex-num {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 34px;
      height: 34px;
      padding: 0 10px;
      background: var(--accent-blue);
      color: #fff;
      border-radius: 8px;
      font-size: 0.88rem;
      font-weight: 800;
      letter-spacing: 0.04em;
    }

    /* Section title with monospace tag chip */
    h2 {
      font-size: 1.2rem;
      color: var(--text-muted);
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    h2 .tag-chip {
      display: inline-flex;
      align-items: center;
      padding: 5px 12px;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 700;
      letter-spacing: 0.01em;
      background: rgba(89,103,255,0.15);
      border: 1px solid rgba(89,103,255,0.5);
      color: var(--accent-blue-bright);
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      text-transform: none;
    }

    h2 .tag-name {
      color: #fff;
      font-weight: 700;
    }

    /* --- Guidelines (top) --- */
    .guidelines-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 48px;
    }

    .guide-card {
      padding: 24px;
      border-radius: 10px;
      border: 1px solid var(--border);
    }

    .guide-card.wrong {
      background: rgba(239, 83, 80, 0.05);
      border-color: rgba(239, 83, 80, 0.3);
    }

    .guide-card.correct {
      background: rgba(76, 175, 80, 0.05);
      border-color: rgba(76, 175, 80, 0.3);
    }

    .guide-header {
      font-weight: 700;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .text-display {
      color: #d1dcff;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    hr.divider {
      border: 0;
      border-top: 1px solid var(--border);
      margin-bottom: 36px;
    }

    /* --- Example section --- */
    .example-section {
      margin-bottom: 72px;
    }

    .video-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 12px;
      margin-bottom: 18px;
    }

    .video-container {
      width: 100%;
      aspect-ratio: 16 / 9;
      background: #000;
      border-radius: 8px;
      position: relative;
      overflow: hidden;
      border: 1px solid var(--border-soft);
    }

    .video-container video {
      width: 100%;
      height: 100%;
      display: block;
    }

    .captions-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
      margin-bottom: 16px;
    }

    .caption-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 18px 20px;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .caption-card::before {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
    }

    .caption-card.bad::before  { background: var(--red-del); }
    .caption-card.good::before { background: var(--green-ins); }

    .caption-card.bad {
      background: rgba(239, 83, 80, 0.04);
      border-color: rgba(239, 83, 80, 0.28);
    }

    .caption-card.good {
      background: rgba(76, 175, 80, 0.04);
      border-color: rgba(76, 175, 80, 0.28);
    }

    .caption-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 800;
      margin-bottom: 12px;
    }

    .caption-card.bad  .caption-label { color: var(--red-del); }
    .caption-card.good .caption-label { color: var(--green-ins); }

    .caption-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 800;
    }

    .caption-card.bad .caption-badge {
      background: rgba(239,83,80,0.15);
      border: 1px solid rgba(239,83,80,0.4);
      color: var(--red-del);
    }

    .caption-card.good .caption-badge {
      background: rgba(76,175,80,0.15);
      border: 1px solid rgba(76,175,80,0.4);
      color: var(--green-ins);
    }

    .caption-subtag {
      margin-left: auto;
      font-size: 0.62rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 700;
      color: var(--text-muted);
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    }

    .caption-text {
      color: #d1dcff;
      font-size: 0.95rem;
      line-height: 1.55;
    }

    .caption-text .hl-bad {
      color: var(--red-del);
      font-weight: 600;
    }

    .caption-text .hl-good {
      color: var(--green-ins);
      font-weight: 600;
    }

    /* Issue description (bottom) */
    .description-card {
      background: rgba(52, 68, 218, 0.07);
      border: 1px solid rgba(52, 68, 218, 0.3);
      border-radius: 10px;
      padding: 16px 20px;
    }

    .description-card .label {
      color: #6b7fd4;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 800;
      margin-bottom: 6px;
      display: block;
    }

    .description-card .text-display {
      color: #a0aecf;
      font-size: 0.9rem;
    }

    @media (max-width: 600px) {
      .captions-row { grid-template-columns: 1fr; }
      .guidelines-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

<div class="container">

  <h2>
    <span>Examples:</span>
    <span class="tag-chip">action_fix</span>
    <span class="tag-name">Incorrect Action Direction or Destination</span>
  </h2>

  <div class="guidelines-grid">
    <div class="guide-card wrong">
      <div class="guide-header" style="color: var(--red-del);">✕ Incorrect</div>
      <p class="text-display" style="color: var(--text-muted);">
        Using the correct verb but the wrong direction or destination <br>
        e.g., "picks up from tray" vs "places into tray," "drops next to" vs "places into," or adding rotation when none occurs (and vice versa).
      </p>
    </div>
    <div class="guide-card correct">
      <div class="guide-header" style="color: var(--green-ins);">✓ Correct</div>
      <p class="text-display">
        Verify direction of motion — pickup vs placement, into vs onto, horizontal vs rotational. When multiple verbs seem plausible, choose the one that matches the hand's start and end state.
      </p>
    </div>
  </div>

  <hr class="divider">

  <!-- ============ Example 1 ============ -->
  <div class="example-section">
    <h1><span class="ex-num">Ex 1</span> Wrong verb — pick up &amp; rotate, not shake</h1>

    <div class="video-card">
      <div class="video-container">
        <video controls>
          <source src="https://pub-f4aee76241b44e469df5ee6e157f67fb.r2.dev/horizon-resources/69e6daf2bea9c69e1d8698ce.mov" type="video/mp4">
        </video>
      </div>
    </div>

    <div class="captions-row">
      <div class="caption-card bad">
        <div class="caption-label">
          <span class="caption-badge">✕</span>
          Incorrect
          <span class="caption-subtag">action_fix</span>
        </div>
        <p class="caption-text">
          The right hand <span class="hl-bad">shakes</span> the silver travel mug from the desk while the left hand remains idle.
        </p>
      </div>

      <div class="caption-card good">
        <div class="caption-label">
          <span class="caption-badge">✓</span>
          Correct
          <span class="caption-subtag">Verifiable</span>
        </div>
        <p class="caption-text">
          The right hand <span class="hl-good">picks up the silver travel mug from the desk and rotates it horizontally</span>, while the left hand remains idle.
        </p>
      </div>
    </div>

    <div class="description-card">
      <span class="label">📝 Error</span>
      <div class="text-display">The correct action is pick up and rotate.</div>
    </div>
  </div>

  <!-- ============ Example 2 ============ -->
  <div class="example-section">
    <h1><span class="ex-num">Ex 2</span> Wrong verb — reach for, not grasp</h1>

    <div class="video-card">
      <div class="video-container">
        <video controls>
          <source src="https://pub-f4aee76241b44e469df5ee6e157f67fb.r2.dev/horizon-resources/69e78c857f705cdd33b95f9c.mov" type="video/mp4">
        </video>
      </div>
    </div>

    <div class="captions-row">
      <div class="caption-card bad">
        <div class="caption-label">
          <span class="caption-badge">✕</span>
          Incorrect
          <span class="caption-subtag">action_fix</span>
        </div>
        <p class="caption-text">
          The left hand <span class="hl-bad">grasps</span> and lifts a water bottle from the table, rotating it horizontally, while the right hand remains stationary holding a clear plastic cup.
        </p>
      </div>

      <div class="caption-card good">
        <div class="caption-label">
          <span class="caption-badge">✓</span>
          Correct
          <span class="caption-subtag">Verifiable</span>
        </div>
        <p class="caption-text">
          The left hand <span class="hl-good">reaches for</span> and lifts a water bottle from the table, rotating it horizontally, while the right hand remains stationary, holding a clear plastic cup.
        </p>
      </div>
    </div>

    <div class="description-card">
      <span class="label">📝 Error</span>
      <div class="text-display">The original caption says "grasps", but since the hand must travel a significant distance to reach the bottle, "reaches for" is more accurate.</div>
    </div>
  </div>

  <!-- ============ Example 3 ============ -->
  <div class="example-section">
    <h1><span class="ex-num">Ex 3</span> Wrong verb — grab &amp; lift, not rotate</h1>

    <div class="video-card">
      <div class="video-container">
        <video controls>
          <source src="https://pub-f4aee76241b44e469df5ee6e157f67fb.r2.dev/horizon-resources/69e80f0c197a5ad4447969a3.mp4" type="video/mp4">
        </video>
      </div>
    </div>

    <div class="captions-row">
      <div class="caption-card bad">
        <div class="caption-label">
          <span class="caption-badge">✕</span>
          Incorrect
          <span class="caption-subtag">action_fix</span>
        </div>
        <p class="caption-text">
          The right hand <span class="hl-bad">rotates</span> a clear, blue-capped water bottle on a counter while the left hand hovers nearby without interacting with any objects.
        </p>
      </div>

      <div class="caption-card good">
        <div class="caption-label">
          <span class="caption-badge">✓</span>
          Correct
          <span class="caption-subtag">Verifiable</span>
        </div>
        <p class="caption-text">
          The right hand <span class="hl-good">grabs and lifts</span> a clear, blue-capped water bottle from the counter while the left hand remains idle.
        </p>
      </div>
    </div>

    <div class="description-card">
      <span class="label">📝 Error</span>
      <div class="text-display">The hand never rotates the bottle. The correct action is grabbing and lifting the bottle from the counter.</div>
    </div>
  </div>

</div>

</body>
</html>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Examples — missing_phase</title>
  <style>
    :root {
      --bg-main: #05070a;
      --bg-card: #0b0e14;
      --border: #1e222b;
      --border-soft: #2a2d35;
      --text-main: #ffffff;
      --text-muted: #8a94a6;
      --text-body: #D1DCFF;
      --accent-blue: #3444DA;
      --accent-blue-bright: #5967ff;
      --red-del: #ef5350;
      --green-ins: #4caf50;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: var(--bg-main);
      color: var(--text-main);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 40px;
      min-height: 100vh;
    }

    .container { max-width: 1400px; margin: 0 auto; }

    h1 {
      font-size: 1.6rem;
      margin-bottom: 20px;
      font-weight: 800;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    h1 .ex-num {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 34px;
      height: 34px;
      padding: 0 10px;
      background: var(--accent-blue);
      color: #fff;
      border-radius: 8px;
      font-size: 0.88rem;
      font-weight: 800;
      letter-spacing: 0.04em;
    }

    /* Section title with monospace tag chip */
    h2 {
      font-size: 1.2rem;
      color: var(--text-muted);
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    h2 .tag-chip {
      display: inline-flex;
      align-items: center;
      padding: 5px 12px;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 700;
      letter-spacing: 0.01em;
      background: rgba(89,103,255,0.15);
      border: 1px solid rgba(89,103,255,0.5);
      color: var(--accent-blue-bright);
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      text-transform: none;
    }

    h2 .tag-name {
      color: #fff;
      font-weight: 700;
    }

    /* --- Guidelines (top) --- */
    .guidelines-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 48px;
    }

    .guide-card {
      padding: 24px;
      border-radius: 10px;
      border: 1px solid var(--border);
    }

    .guide-card.wrong {
      background: rgba(239, 83, 80, 0.05);
      border-color: rgba(239, 83, 80, 0.3);
    }

    .guide-card.correct {
      background: rgba(76, 175, 80, 0.05);
      border-color: rgba(76, 175, 80, 0.3);
    }

    .guide-header {
      font-weight: 700;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .text-display {
      color: #d1dcff;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    hr.divider {
      border: 0;
      border-top: 1px solid var(--border);
      margin-bottom: 36px;
    }

    /* --- Example section --- */
    .example-section {
      margin-bottom: 72px;
    }

    .video-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 12px;
      margin-bottom: 18px;
    }

    .video-container {
      width: 100%;
      aspect-ratio: 16 / 9;
      background: #000;
      border-radius: 8px;
      position: relative;
      overflow: hidden;
      border: 1px solid var(--border-soft);
    }

    .video-container video {
      width: 100%;
      height: 100%;
      display: block;
    }

    .captions-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
      margin-bottom: 16px;
    }

    .caption-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 18px 20px;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .caption-card::before {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
    }

    .caption-card.bad::before  { background: var(--red-del); }
    .caption-card.good::before { background: var(--green-ins); }

    .caption-card.bad {
      background: rgba(239, 83, 80, 0.04);
      border-color: rgba(239, 83, 80, 0.28);
    }

    .caption-card.good {
      background: rgba(76, 175, 80, 0.04);
      border-color: rgba(76, 175, 80, 0.28);
    }

    .caption-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 800;
      margin-bottom: 12px;
    }

    .caption-card.bad  .caption-label { color: var(--red-del); }
    .caption-card.good .caption-label { color: var(--green-ins); }

    .caption-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 800;
    }

    .caption-card.bad .caption-badge {
      background: rgba(239,83,80,0.15);
      border: 1px solid rgba(239,83,80,0.4);
      color: var(--red-del);
    }

    .caption-card.good .caption-badge {
      background: rgba(76,175,80,0.15);
      border: 1px solid rgba(76,175,80,0.4);
      color: var(--green-ins);
    }

    .caption-subtag {
      margin-left: auto;
      font-size: 0.62rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 700;
      color: var(--text-muted);
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    }

    .caption-text {
      color: #d1dcff;
      font-size: 0.95rem;
      line-height: 1.55;
    }

    .caption-text .hl-bad {
      color: var(--red-del);
      font-weight: 600;
    }

    .caption-text .hl-good {
      color: var(--green-ins);
      font-weight: 600;
    }

    /* Issue description (bottom) */
    .description-card {
      background: rgba(52, 68, 218, 0.07);
      border: 1px solid rgba(52, 68, 218, 0.3);
      border-radius: 10px;
      padding: 16px 20px;
    }

    .description-card .label {
      color: #6b7fd4;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 800;
      margin-bottom: 6px;
      display: block;
    }

    .description-card .text-display {
      color: #a0aecf;
      font-size: 0.9rem;
    }

    @media (max-width: 600px) {
      .captions-row { grid-template-columns: 1fr; }
      .guidelines-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

<div class="container">

  <h2>
    <span>Examples:</span>
    <span class="tag-chip">missing_phase</span>
    <span class="tag-name">Missing Action / Incomplete Sequence</span>
  </h2>

  <div class="guidelines-grid">
    <div class="guide-card wrong">
      <div class="guide-header" style="color: var(--red-del);">✕ Incorrect</div>
      <p class="text-display" style="color: var(--text-muted);">
        Collapsing a multi-step sequence into a single verb <br>
        e.g., "picks up" omits the reach, or "transfers to bowl" skips an intermediate placement (like a plate).
      </p>
    </div>
    <div class="guide-card correct">
      <div class="guide-header" style="color: var(--green-ins);">✓ Correct</div>
      <p class="text-display">
        Break multi-step actions into a sequence using connectives ("reaches across, grasps, lifts, places"). Assign a distinct verb to each meaningful motion.
      </p>
    </div>
  </div>

  <hr class="divider">

  <!-- ============ Example 1 ============ -->
  <div class="example-section">
    <h1><span class="ex-num">Ex 1</span> Multi-step reach collapsed into "pick up"</h1>

    <div class="video-card">
      <div class="video-container">
        <video controls>
          <source src="https://pub-f4aee76241b44e469df5ee6e157f67fb.r2.dev/horizon-resources/69e78c997f705cdd33b962ab.mov" type="video/mp4">
        </video>
      </div>
    </div>

    <div class="captions-row">
      <div class="caption-card bad">
        <div class="caption-label">
          <span class="caption-badge">✕</span>
          Incorrect
          <span class="caption-subtag">missing_phase</span>
        </div>
        <p class="caption-text">
          <span class="hl-bad">pick up Fiji water bottle with right hand</span>
        </p>
      </div>

      <div class="caption-card good">
        <div class="caption-label">
          <span class="caption-badge">✓</span>
          Correct
          <span class="caption-subtag">Verifiable</span>
        </div>
        <p class="caption-text">
          The right hand rests below the table. The right hand <span class="hl-good">reaches for the bottle and picks it up</span>, while the left hand remains idle.
        </p>
      </div>
    </div>

    <div class="description-card">
      <span class="label">📝 Error</span>
      <div class="text-display">The right hand performs multiple actions before picking up the bottle; the left hand remains visible and idle.</div>
    </div>
  </div>

  <!-- ============ Example 2 ============ -->
  <div class="example-section">
    <h1><span class="ex-num">Ex 2</span> Five-step pickup reduced to a single reach</h1>

    <div class="video-card">
      <div class="video-container">
        <video controls>
          <source src="https://pub-f4aee76241b44e469df5ee6e157f67fb.r2.dev/horizon-resources/69e78cae7f705cdd33b96732.mov" type="video/mp4">
        </video>
      </div>
    </div>

    <div class="captions-row">
      <div class="caption-card bad">
        <div class="caption-label">
          <span class="caption-badge">✕</span>
          Incorrect
          <span class="caption-subtag">missing_phase</span>
        </div>
        <p class="caption-text">
          The right hand <span class="hl-bad">reaches forward and grasps</span> a blue bottle on a wooden table while the left hand remains idle.
        </p>
      </div>

      <div class="caption-card good">
        <div class="caption-label">
          <span class="caption-badge">✓</span>
          Correct
          <span class="caption-subtag">Verifiable</span>
        </div>
        <p class="caption-text">
          The right hand rests closed on the table to the right of the water bottle, then <span class="hl-good">moves backward, opens, and moves forward to pick up the bottle</span> while the left hand is out of frame.
        </p>
      </div>
    </div>

    <div class="description-card">
      <span class="label">📝 Error</span>
      <div class="text-display">The hand performs five distinct actions to pick up the bottle, and the left hand is not idle — it is simply out of frame.</div>
    </div>
  </div>

</div>

</body>
</html>


<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Examples — object_fix</title>
  <style>
    :root {
      --bg-main: #05070a;
      --bg-card: #0b0e14;
      --border: #1e222b;
      --border-soft: #2a2d35;
      --text-main: #ffffff;
      --text-muted: #8a94a6;
      --text-body: #D1DCFF;
      --accent-blue: #3444DA;
      --accent-blue-bright: #5967ff;
      --red-del: #ef5350;
      --green-ins: #4caf50;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: var(--bg-main);
      color: var(--text-main);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 40px;
      min-height: 100vh;
    }

    .container { max-width: 1400px; margin: 0 auto; }

    h1 {
      font-size: 1.6rem;
      margin-bottom: 20px;
      font-weight: 800;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    h1 .ex-num {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 34px;
      height: 34px;
      padding: 0 10px;
      background: var(--accent-blue);
      color: #fff;
      border-radius: 8px;
      font-size: 0.88rem;
      font-weight: 800;
      letter-spacing: 0.04em;
    }

    h2 {
      font-size: 1.2rem;
      color: var(--text-muted);
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    h2 .tag-chip {
      display: inline-flex;
      align-items: center;
      padding: 5px 12px;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 700;
      letter-spacing: 0.01em;
      background: rgba(89,103,255,0.15);
      border: 1px solid rgba(89,103,255,0.5);
      color: var(--accent-blue-bright);
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      text-transform: none;
    }

    h2 .tag-name {
      color: #fff;
      font-weight: 700;
    }

    .guidelines-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 48px;
    }

    .guide-card {
      padding: 24px;
      border-radius: 10px;
      border: 1px solid var(--border);
    }

    .guide-card.wrong {
      background: rgba(239, 83, 80, 0.05);
      border-color: rgba(239, 83, 80, 0.3);
    }

    .guide-card.correct {
      background: rgba(76, 175, 80, 0.05);
      border-color: rgba(76, 175, 80, 0.3);
    }

    .guide-header {
      font-weight: 700;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .text-display {
      color: #d1dcff;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    hr.divider {
      border: 0;
      border-top: 1px solid var(--border);
      margin-bottom: 36px;
    }

    .example-section { margin-bottom: 72px; }

    .video-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 12px;
      margin-bottom: 18px;
    }

    .video-container {
      width: 100%;
      aspect-ratio: 16 / 9;
      background: #000;
      border-radius: 8px;
      position: relative;
      overflow: hidden;
      border: 1px solid var(--border-soft);
    }

    .video-container video {
      width: 100%;
      height: 100%;
      display: block;
    }

    .captions-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
      margin-bottom: 16px;
    }

    .caption-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 18px 20px;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .caption-card::before {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
    }

    .caption-card.bad::before  { background: var(--red-del); }
    .caption-card.good::before { background: var(--green-ins); }

    .caption-card.bad {
      background: rgba(239, 83, 80, 0.04);
      border-color: rgba(239, 83, 80, 0.28);
    }

    .caption-card.good {
      background: rgba(76, 175, 80, 0.04);
      border-color: rgba(76, 175, 80, 0.28);
    }

    .caption-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 800;
      margin-bottom: 12px;
    }

    .caption-card.bad  .caption-label { color: var(--red-del); }
    .caption-card.good .caption-label { color: var(--green-ins); }

    .caption-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 800;
    }

    .caption-card.bad .caption-badge {
      background: rgba(239,83,80,0.15);
      border: 1px solid rgba(239,83,80,0.4);
      color: var(--red-del);
    }

    .caption-card.good .caption-badge {
      background: rgba(76,175,80,0.15);
      border: 1px solid rgba(76,175,80,0.4);
      color: var(--green-ins);
    }

    .caption-subtag {
      margin-left: auto;
      font-size: 0.62rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 700;
      color: var(--text-muted);
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    }

    .caption-text {
      color: #d1dcff;
      font-size: 0.95rem;
      line-height: 1.55;
    }

    .caption-text .hl-bad {
      color: var(--red-del);
      font-weight: 600;
    }

    .caption-text .hl-good {
      color: var(--green-ins);
      font-weight: 600;
    }

    .description-card {
      background: rgba(52, 68, 218, 0.07);
      border: 1px solid rgba(52, 68, 218, 0.3);
      border-radius: 10px;
      padding: 16px 20px;
    }

    .description-card .label {
      color: #6b7fd4;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 800;
      margin-bottom: 6px;
      display: block;
    }

    .description-card .text-display {
      color: #a0aecf;
      font-size: 0.9rem;
    }

    @media (max-width: 600px) {
      .captions-row { grid-template-columns: 1fr; }
      .guidelines-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

<div class="container">

  <h2>
    <span>Examples:</span>
    <span class="tag-chip">object_fix</span>
    <span class="tag-name">Wrong Object Label or Attribute</span>
  </h2>

  <div class="guidelines-grid">
    <div class="guide-card wrong">
      <div class="guide-header" style="color: var(--red-del);">✕ Incorrect</div>
      <p class="text-display" style="color: var(--text-muted);">
        Misidentifying the object — wrong name, wrong scope, or guessing a specific category when uncertain. <br>
        e.g., "green ball" vs "lime," "blue cap" vs "blue-capped water bottle," or "yellow-orange fruit" when you can't confirm it's a fruit.
      </p>
    </div>
    <div class="guide-card correct">
      <div class="guide-header" style="color: var(--green-ins);">✓ Correct</div>
      <p class="text-display">
        Verify the object's identity, scope, and attributes against the frames. When uncertain, use a superordinate term ("object," "container") rather than guessing — prioritize clear category distinctions over speculative detail.
      </p>
    </div>
  </div>

  <hr class="divider">

  <!-- ============ Example 1 ============ -->
  <div class="example-section">
    <h1><span class="ex-num">Ex 1</span> Wrong object — lime, not ball</h1>

    <div class="video-card">
      <div class="video-container">
        <video controls>
          <source src="https://pub-f4aee76241b44e469df5ee6e157f67fb.r2.dev/horizon-resources/69e78818c75a2a206d2b917b.mov" type="video/mp4">
        </video>
      </div>
    </div>

    <div class="captions-row">
      <div class="caption-card bad">
        <div class="caption-label">
          <span class="caption-badge">✕</span>
          Incorrect
          <span class="caption-subtag">object_fix</span>
        </div>
        <p class="caption-text">
          The right hand grasps and lifts a <span class="hl-bad">green ball</span> from the container while the left hand remains idle.
        </p>
      </div>

      <div class="caption-card good">
        <div class="caption-label">
          <span class="caption-badge">✓</span>
          Correct
          <span class="caption-subtag">Verifiable</span>
        </div>
        <p class="caption-text">
          The right hand grasps and lifts a <span class="hl-good">lime</span> from the container while the left hand remains idle.
        </p>
      </div>
    </div>

    <div class="description-card">
      <span class="label">📝 Error</span>
      <div class="text-display">The original caption refers to a green ball, but the video clearly shows a lime. Correct clear object misidentifications — e.g., "green ball" → "lime." Avoid unnecessary detail, but fix obvious errors.</div>
    </div>
  </div>

  <!-- ============ Example 2 ============ -->
  <div class="example-section">
    <h1><span class="ex-num">Ex 2</span> Unverifiable fruit — generalize to "object"</h1>

    <div class="video-card">
      <div class="video-container">
        <video controls>
          <source src="https://pub-f4aee76241b44e469df5ee6e157f67fb.r2.dev/horizon-resources/69e787adc75a2a206d2b7b91.mov" type="video/mp4">
        </video>
      </div>
    </div>

    <div class="captions-row">
      <div class="caption-card bad">
        <div class="caption-label">
          <span class="caption-badge">✕</span>
          Incorrect
          <span class="caption-subtag">object_fix</span>
        </div>
        <p class="caption-text">
          The left hand holds a Rubik's cube while the right hand places a <span class="hl-bad">yellow-orange fruit</span> into a cardboard box and then picks up a <span class="hl-bad">yellow lemon</span>.
        </p>
      </div>

      <div class="caption-card good">
        <div class="caption-label">
          <span class="caption-badge">✓</span>
          Correct
          <span class="caption-subtag">Verifiable</span>
        </div>
        <p class="caption-text">
          The left hand holds a Rubik's cube while the right hand grabs a <span class="hl-good">yellow-orange object</span> from a cardboard box.
        </p>
      </div>
    </div>

    <div class="description-card">
      <span class="label">📝 Error</span>
      <div class="text-display">If the object cannot be confidently identified (e.g., as a fruit), use a neutral term like "object" rather than guessing a category.</div>
    </div>
  </div>

  <!-- ============ Example 3 ============ -->
  <div class="example-section">
    <h1><span class="ex-num">Ex 3</span> Wrong scope — whole bottle, not just the cap</h1>

    <div class="video-card">
      <div class="video-container">
        <video controls>
          <source src="https://pub-f4aee76241b44e469df5ee6e157f67fb.r2.dev/horizon-resources/69e82427197a5ad4447c37a7.mp4" type="video/mp4">
        </video>
      </div>
    </div>

    <div class="captions-row">
      <div class="caption-card bad">
        <div class="caption-label">
          <span class="caption-badge">✕</span>
          Incorrect
          <span class="caption-subtag">object_fix</span>
        </div>
        <p class="caption-text">
          The right hand reaches for and picks up a <span class="hl-bad">blue cap</span> from the counter while the left hand remains idle.
        </p>
      </div>

      <div class="caption-card good">
        <div class="caption-label">
          <span class="caption-badge">✓</span>
          Correct
          <span class="caption-subtag">Verifiable</span>
        </div>
        <p class="caption-text">
          The right hand moves backward, grasps a <span class="hl-good">blue-capped water bottle</span>, and lifts it from the counter while the left hand remains idle.
        </p>
      </div>
    </div>

    <div class="description-card">
      <span class="label">📝 Error</span>
      <div class="text-display">The hand does not pick up a blue cap. Instead, it moves backward, grasps the blue-capped water bottle, and lifts it from the counter.</div>
    </div>
  </div>

</div>

</body>
</html>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Examples — hand_fix</title>
  <style>
    :root {
      --bg-main: #05070a;
      --bg-card: #0b0e14;
      --border: #1e222b;
      --border-soft: #2a2d35;
      --text-main: #ffffff;
      --text-muted: #8a94a6;
      --text-body: #D1DCFF;
      --accent-blue: #3444DA;
      --accent-blue-bright: #5967ff;
      --red-del: #ef5350;
      --green-ins: #4caf50;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: var(--bg-main);
      color: var(--text-main);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 40px;
      min-height: 100vh;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
    }

    h1 {
      font-size: 1.6rem;
      margin-bottom: 20px;
      font-weight: 800;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    h1 .ex-num {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 34px;
      height: 34px;
      padding: 0 10px;
      background: var(--accent-blue);
      color: #fff;
      border-radius: 8px;
      font-size: 0.88rem;
      font-weight: 800;
      letter-spacing: 0.04em;
    }

    h2 {
      font-size: 1.2rem;
      color: var(--text-muted);
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    h2 .tag-chip {
      display: inline-flex;
      align-items: center;
      padding: 5px 12px;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 700;
      letter-spacing: 0.01em;
      background: rgba(89,103,255,0.15);
      border: 1px solid rgba(89,103,255,0.5);
      color: var(--accent-blue-bright);
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      text-transform: none;
    }

    h2 .tag-name {
      color: #fff;
      font-weight: 700;
    }

    /* --- Guidelines (top) --- */
    .guidelines-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 48px;
    }

    .guide-card {
      padding: 24px;
      border-radius: 10px;
      border: 1px solid var(--border);
    }

    .guide-card.wrong {
      background: rgba(239, 83, 80, 0.05);
      border-color: rgba(239, 83, 80, 0.3);
    }

    .guide-card.correct {
      background: rgba(76, 175, 80, 0.05);
      border-color: rgba(76, 175, 80, 0.3);
    }

    .guide-header {
      font-weight: 700;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .text-display {
      color: #d1dcff;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    hr.divider {
      border: 0;
      border-top: 1px solid var(--border);
      margin-bottom: 36px;
    }

    /* --- Example section --- */
    .example-section {
      margin-bottom: 72px;
    }

    /* Full-width video card on top */
    .video-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 12px;
      margin-bottom: 18px;
    }

    .video-container {
      width: 100%;
      aspect-ratio: 16 / 9;
      background: #000;
      border-radius: 8px;
      position: relative;
      overflow: hidden;
      border: 1px solid var(--border-soft);
    }

    .video-container video {
      width: 100%;
      height: 100%;
      display: block;
    }

    /* Captions row: Bad + Good side by side */
    .captions-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
      margin-bottom: 16px;
    }

    .caption-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 18px 20px;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .caption-card::before {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
    }

    .caption-card.bad::before  { background: var(--red-del); }
    .caption-card.good::before { background: var(--green-ins); }

    .caption-card.bad {
      background: rgba(239, 83, 80, 0.04);
      border-color: rgba(239, 83, 80, 0.28);
    }

    .caption-card.good {
      background: rgba(76, 175, 80, 0.04);
      border-color: rgba(76, 175, 80, 0.28);
    }

    .caption-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 800;
      margin-bottom: 12px;
    }

    .caption-card.bad  .caption-label { color: var(--red-del); }
    .caption-card.good .caption-label { color: var(--green-ins); }

    .caption-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 800;
    }

    .caption-card.bad .caption-badge {
      background: rgba(239,83,80,0.15);
      border: 1px solid rgba(239,83,80,0.4);
      color: var(--red-del);
    }

    .caption-card.good .caption-badge {
      background: rgba(76,175,80,0.15);
      border: 1px solid rgba(76,175,80,0.4);
      color: var(--green-ins);
    }

    .caption-subtag {
      margin-left: auto;
      font-size: 0.62rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 700;
      color: var(--text-muted);
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    }

    .caption-text {
      color: #d1dcff;
      font-size: 0.95rem;
      line-height: 1.55;
    }

    .caption-text .hl-bad {
      color: var(--red-del);
      font-weight: 600;
    }

    .caption-text .hl-good {
      color: var(--green-ins);
      font-weight: 600;
    }

    /* Issue description (bottom) */
    .description-card {
      background: rgba(52, 68, 218, 0.07);
      border: 1px solid rgba(52, 68, 218, 0.3);
      border-radius: 10px;
      padding: 16px 20px;
    }

    .description-card .label {
      color: #6b7fd4;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 800;
      margin-bottom: 6px;
      display: block;
    }

    .description-card .text-display {
      color: #a0aecf;
      font-size: 0.9rem;
    }

    /* Responsive */
    @media (max-width: 600px) {
      .captions-row { grid-template-columns: 1fr; }
      .guidelines-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

<div class="container">

  <h2>
    <span>Examples:</span>
    <span class="tag-chip">hand_fix</span>
    <span class="tag-name">Incorrect Hand Attribution</span>
  </h2>

  <div class="guidelines-grid">
    <div class="guide-card wrong">
      <div class="guide-header" style="color: var(--red-del);">✕ Incorrect</div>
      <p class="text-display" style="color: var(--text-muted);">
        Wrong hand label — describing a hand as active when it's idle, marking it idle when it's clearly moving, or swapping left and right entirely. Avoid unverifiable assumptions (e.g., "rests on his right thigh"); if the state can't be confirmed, label the hand as idle.
      </p>
    </div>
    <div class="guide-card correct">
      <div class="guide-header" style="color: var(--green-ins);">✓ Correct</div>
      <p class="text-display">
        Assess each hand independently. Determine whether it is (a) active and performing a distinct action, (b) idle or holding steady, or (c) out of frame. Anchor laterality from the robot's POV — double-check which hand actually closes or interacts.
      </p>
    </div>
  </div>

  <hr class="divider">

  <!-- ============ Example 1 ============ -->
  <div class="example-section">
    <h1><span class="ex-num">Ex 1</span> Left hand incorrectly labeled as active</h1>

    <!-- Full-width video -->
    <div class="video-card">
      <div class="video-container">
        <video controls>
          <source src="https://pub-f4aee76241b44e469df5ee6e157f67fb.r2.dev/horizon-resources/69e6db20bea9c69e1d869e4c.mov" type="video/mp4">
        </video>
      </div>
    </div>

    <!-- Captions side by side below -->
    <div class="captions-row">
      <div class="caption-card bad">
        <div class="caption-label">
          <span class="caption-badge">✕</span>
          Incorrect
          <span class="caption-subtag">hand_fix</span>
        </div>
        <p class="caption-text">
          The right hand places a white cup in the sink, while the left hand <span class="hl-bad">reaches for the pan handle but fails to grasp it</span>.
        </p>
      </div>

      <div class="caption-card good">
        <div class="caption-label">
          <span class="caption-badge">✓</span>
          Correct
          <span class="caption-subtag">Verifiable</span>
        </div>
        <p class="caption-text">
          The right hand places a white cup in the sink, while the left hand remains still.
        </p>
      </div>
    </div>

    <!-- Issue description -->
    <div class="description-card">
      <span class="label">📝 Error</span>
      <div class="text-display">Left hand is idle.</div>
    </div>
  </div>

  <!-- ============ Example 2 ============ -->
  <div class="example-section">
    <h1><span class="ex-num">Ex 2</span> Left hand incorrectly labeled as grabbing</h1>

    <!-- Full-width video -->
    <div class="video-card">
      <div class="video-container">
        <video controls>
          <source src="https://pub-f4aee76241b44e469df5ee6e157f67fb.r2.dev/horizon-resources/69e6db40bea9c69e1d86a2eb.mov" type="video/mp4">
        </video>
      </div>
    </div>

    <!-- Captions side by side below -->
    <div class="captions-row">
      <div class="caption-card bad">
        <div class="caption-label">
          <span class="caption-badge">✕</span>
          Incorrect
          <span class="caption-subtag">hand_fix</span>
        </div>
        <p class="caption-text">
          The left hand <span class="hl-bad">grabs the wooden counter</span> while the right hand lifts a small metal pot over the sink basin.
        </p>
      </div>

      <div class="caption-card good">
        <div class="caption-label">
          <span class="caption-badge">✓</span>
          Correct
          <span class="caption-subtag">Verifiable</span>
        </div>
        <p class="caption-text">
          The left hand remains idle while the right hand lifts a small metal pot over the sink basin.
        </p>
      </div>
    </div>

    <!-- Issue description -->
    <div class="description-card">
      <span class="label">📝 Error</span>
      <div class="text-display">Left hand is idle.</div>
    </div>
  </div>

  <!-- ============ Example 3 ============ -->
  <div class="example-section">
    <h1><span class="ex-num">Ex 3</span> Wrong hand — left, not right</h1>

    <div class="video-card">
      <div class="video-container">
        <video controls>
          <source src="https://pub-f4aee76241b44e469df5ee6e157f67fb.r2.dev/horizon-resources/69e8206d197a5ad4447bd122.mp4" type="video/mp4">
        </video>
      </div>
    </div>

    <div class="captions-row">
      <div class="caption-card bad">
        <div class="caption-label">
          <span class="caption-badge">✕</span>
          Incorrect
          <span class="caption-subtag">hand_fix</span>
        </div>
        <p class="caption-text">
          <span class="hl-bad">The right hand</span> reaches out to grasp and lift a blue-capped water bottle from the counter while the left hand remains resting on the edge of the counter.
        </p>
      </div>

      <div class="caption-card good">
        <div class="caption-label">
          <span class="caption-badge">✓</span>
          Correct
          <span class="caption-subtag">Verifiable</span>
        </div>
        <p class="caption-text">
          <span class="hl-good">The left hand</span> rests open on the right side of the table, then lifts, moves backward to the left, and reaches for the blue-capped water bottle to grasp it, while the right hand remains idle.
        </p>
      </div>
    </div>

    <div class="description-card">
      <span class="label">📝 Error</span>
      <div class="text-display">The original caption incorrectly states that the right hand grabs the bottle. In the video, the left hand performs the action while the right hand remains idle.</div>
    </div>
  </div>

  <!-- ============ Example 4 ============ -->
  <div class="example-section">
    <h1><span class="ex-num">Ex 4</span> Wrong hand — left hand is active, not right</h1>

    <div class="video-card">
      <div class="video-container">
        <video controls>
          <source src="https://pub-f4aee76241b44e469df5ee6e157f67fb.r2.dev/horizon-resources/69e788c9c75a2a206d2bb11c.mov" type="video/mp4">
        </video>
      </div>
    </div>

    <div class="captions-row">
      <div class="caption-card bad">
        <div class="caption-label">
          <span class="caption-badge">✕</span>
          Incorrect
          <span class="caption-subtag">hand_fix</span>
        </div>
        <p class="caption-text">
          The <span class="hl-bad">right hand</span> reaches into a white bowl, briefly touches a green snack bar, and then picks up and removes the blue snack bar while the <span class="hl-bad">left hand</span> remains out of view.
        </p>
      </div>

      <div class="caption-card good">
        <div class="caption-label">
          <span class="caption-badge">✓</span>
          Correct
          <span class="caption-subtag">Verifiable</span>
        </div>
        <p class="caption-text">
          The <span class="hl-good">left hand</span> reaches into a white bowl and picks up a blue snack bar, while the <span class="hl-good">right hand</span> remains out of view.
        </p>
      </div>
    </div>

    <div class="description-card">
      <span class="label">📝 Error</span>
      <div class="text-display">The original caption swaps the hands: the hand performing the action is the left, and the one off-screen is the right.</div>
    </div>
  </div>

  <!-- ============ Example 5 ============ -->
  <div class="example-section">
    <h1><span class="ex-num">Ex 5</span> Wrong hand — right hand receives, not left</h1>

    <div class="video-card">
      <div class="video-container">
        <video controls>
          <source src="https://pub-f4aee76241b44e469df5ee6e157f67fb.r2.dev/horizon-resources/69e788dec75a2a206d2bb4b7.mov" type="video/mp4">
        </video>
      </div>
    </div>

    <div class="captions-row">
      <div class="caption-card bad">
        <div class="caption-label">
          <span class="caption-badge">✕</span>
          Incorrect
          <span class="caption-subtag">hand_fix</span>
        </div>
        <p class="caption-text">
          The <span class="hl-bad">left hand</span> reaches out and takes a green bottle offered by a person, while the <span class="hl-bad">right hand</span> remains out of view.
        </p>
      </div>

      <div class="caption-card good">
        <div class="caption-label">
          <span class="caption-badge">✓</span>
          Correct
          <span class="caption-subtag">Verifiable</span>
        </div>
        <p class="caption-text">
          The <span class="hl-good">right hand</span> reaches out and takes the green bottle, while the <span class="hl-good">left hand</span> remains out of view.
        </p>
      </div>
    </div>

    <div class="description-card">
      <span class="label">📝 Error</span>
      <div class="text-display">The robot reaches for the bottle with its right hand, not the left; the left hand is the one out of view.</div>
    </div>
  </div>

</div>

</body>
</html>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Anatomy of a Task — Training</title>
  <style>
    :root {
      --bg-main: #05070a;
      --bg-card: #0b0e14;
      --border: #1e222b;
      --border-soft: #2a2d35;
      --text-main: #ffffff;
      --text-body: #D1DCFF;
      --text-muted: #8a94a6;
      --text-soft: #bcc6d4;
      --accent-blue: #3444DA;
      --accent-blue-bright: #5967ff;
      --yellow: #FFAB00;
      --yellow-soft: #FFE0A3;
      --green-ins: #4caf50;
      --red-del: #ef5350;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: var(--bg-main);
      background-image:
        radial-gradient(circle at 10% 0%, rgba(52,68,218,.18), transparent 45%),
        radial-gradient(circle at 95% 8%, rgba(52,68,218,.10), transparent 40%);
      color: var(--text-main);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      padding: 40px;
      min-height: 100vh;
    }

    .container { max-width: 1400px; margin: 0 auto; }

    /* --- Section header --- */
    h2 {
      font-size: 1.2rem;
      color: var(--text-muted);
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 700;
    }

    .section-title {
      font-size: 1.7rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .section-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 32px;
      height: 32px;
      padding: 0 10px;
      background: var(--accent-blue);
      color: #fff;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 800;
    }

    .section-intro {
      color: var(--text-body);
      font-size: 1rem;
      line-height: 1.65;
      margin-bottom: 32px;
      max-width: 950px;
    }

    .section-intro strong { color: #fff; }

    .subsection { margin-bottom: 36px; }

    .subsection-label {
      display: inline-block;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-weight: 800;
      color: var(--accent-blue-bright);
      margin-bottom: 10px;
    }

    .subsection-title {
      font-size: 1.2rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 18px;
    }

    /* --- Definition callout --- */
    .definition-card {
      background: rgba(52,68,218,.08);
      border: 1px solid rgba(74,90,232,.4);
      border-left: 4px solid var(--accent-blue-bright);
      border-radius: 10px;
      padding: 20px 24px;
      margin-bottom: 32px;
    }

    .def-label {
      display: inline-block;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-weight: 800;
      color: var(--accent-blue-bright);
      margin-bottom: 8px;
    }

    .def-term {
      font-size: 1.15rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 8px;
    }

    .def-text {
      color: var(--text-body);
      font-size: 0.95rem;
      line-height: 1.6;
    }

    .def-text strong { color: #fff; }
    .def-text code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 0.85rem;
      padding: 1px 7px;
      background: rgba(255,255,255,0.06);
      border: 1px solid var(--border);
      border-radius: 4px;
      color: #fff;
    }

    /* --- Screenshot example --- */
    .screenshot-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 36px;
      position: relative;
    }

    .screenshot-card::before {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--accent-blue), var(--accent-blue-bright));
      z-index: 1;
    }

    .screenshot-header {
      padding: 18px 24px;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .screenshot-title-group .label {
      display: block;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-weight: 800;
      color: var(--accent-blue-bright);
      margin-bottom: 4px;
    }

    .screenshot-title-group .title {
      font-size: 1.1rem;
      font-weight: 800;
      color: #fff;
    }

    .screenshot-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      border-radius: 6px;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      background: rgba(76,175,80,0.12);
      border: 1px solid rgba(76,175,80,0.4);
      color: var(--green-ins);
    }

    .screenshot-image {
      padding: 20px 24px;
      background: #000;
      border-bottom: 1px solid var(--border);
    }

    .screenshot-image img {
      width: 100%;
      height: auto;
      display: block;
      border-radius: 8px;
    }

    .annotations-row {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 0;
      background: rgba(52,68,218,.04);
    }

    .annotation-item {
      padding: 14px 16px;
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .annotation-item:last-child {
      border-right: 0;
    }

    .annotation-label {
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 800;
      color: var(--text-muted);
    }

    .annotation-value {
      font-size: 0.88rem;
      font-weight: 700;
      color: #fff;
      line-height: 1.3;
    }

    .annotation-value.mono {
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      color: var(--accent-blue-bright);
    }

    /* --- Action / Object example breakdown --- */
    .breakdown {
      display: grid;
      grid-template-columns: 1.3fr 1fr;
      gap: 18px;
      margin-bottom: 36px;
    }

    .bd-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px 22px;
      position: relative;
      overflow: hidden;
    }

    .bd-card::before {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: var(--accent-blue-bright);
    }

    .bd-card.actions::before { background: var(--green-ins); }
    .bd-card.objects::before { background: var(--yellow); }

    .bd-head {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--border);
    }

    .bd-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.95rem;
      flex-shrink: 0;
    }

    .bd-card.actions .bd-icon {
      background: rgba(76,175,80,0.12);
      border: 1px solid rgba(76,175,80,0.4);
      color: var(--green-ins);
    }

    .bd-card.objects .bd-icon {
      background: rgba(255,171,0,0.12);
      border: 1px solid rgba(255,171,0,0.4);
      color: var(--yellow);
    }

    .bd-head .bd-title {
      flex: 1;
    }

    .bd-head .bd-label {
      display: block;
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 800;
      color: var(--text-muted);
    }

    .bd-head .bd-name {
      font-size: 1rem;
      font-weight: 800;
      color: #fff;
    }

    /* Action sequence list */
    .action-list {
      list-style: none;
      counter-reset: act;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .action-list li {
      counter-increment: act;
      padding: 10px 14px 10px 38px;
      background: rgba(76,175,80,0.06);
      border: 1px solid rgba(76,175,80,0.25);
      border-radius: 8px;
      font-size: 0.9rem;
      color: var(--text-body);
      line-height: 1.5;
      position: relative;
    }

    .action-list li::before {
      content: counter(act);
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      width: 22px;
      height: 22px;
      border-radius: 5px;
      background: rgba(76,175,80,0.18);
      border: 1px solid rgba(76,175,80,0.45);
      color: var(--green-ins);
      font-size: 0.75rem;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .action-list li strong { color: #fff; font-weight: 700; }

    .action-list li .hands-tag {
      display: inline-block;
      margin-left: 6px;
      padding: 1px 7px;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      background: rgba(89,103,255,0.12);
      border: 1px solid rgba(89,103,255,0.35);
      color: var(--accent-blue-bright);
      vertical-align: 1px;
    }

    .action-list li .hands-tag.idle {
      background: rgba(138,148,166,0.12);
      border-color: rgba(138,148,166,0.35);
      color: var(--text-muted);
    }

    /* Object chips */
    .object-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .object-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 12px;
      background: rgba(255,171,0,0.06);
      border: 1px solid rgba(255,171,0,0.25);
      border-radius: 999px;
      font-size: 0.83rem;
      color: var(--text-body);
    }

    .object-chip::before {
      content: "";
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--yellow);
      flex-shrink: 0;
    }

    .object-note {
      margin-top: 16px;
      padding: 10px 14px;
      background: rgba(255,255,255,0.03);
      border: 1px dashed var(--border);
      border-radius: 6px;
      font-size: 0.8rem;
      color: var(--text-muted);
      line-height: 1.5;
      font-style: italic;
    }

    .object-note strong {
      color: #fff;
      font-style: normal;
      font-weight: 700;
    }

    /* --- Taxonomy table --- */
    .taxonomy-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
    }

    table.taxonomy {
      width: 100%;
      border-collapse: collapse;
    }

    table.taxonomy th,
    table.taxonomy td {
      padding: 14px 20px;
      text-align: left;
      font-size: 0.92rem;
      vertical-align: middle;
    }

    table.taxonomy thead th {
      background: rgba(52,68,218,.12);
      color: #fff;
      font-weight: 700;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      border-bottom: 1px solid rgba(74,90,232,.3);
    }

    table.taxonomy tbody tr {
      border-top: 1px solid var(--border);
      transition: background 0.15s ease;
    }

    table.taxonomy tbody tr:first-child { border-top: 0; }
    table.taxonomy tbody tr:hover { background: rgba(52,68,218,.04); }

    .field-name {
      font-weight: 700;
      color: #fff;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .field-icon {
      width: 28px;
      height: 28px;
      border-radius: 7px;
      background: rgba(52,68,218,.15);
      border: 1px solid rgba(74,90,232,.4);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      flex-shrink: 0;
    }

    .field-type {
      display: inline-block;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 0.78rem;
      padding: 2px 8px;
      border-radius: 4px;
      background: rgba(89,103,255,0.1);
      border: 1px solid rgba(89,103,255,0.3);
      color: var(--accent-blue-bright);
    }

    .field-desc {
      color: var(--text-body);
      line-height: 1.5;
    }

    /* Responsive */
    @media (max-width: 1000px) {
      .breakdown { grid-template-columns: 1fr; }
      .annotations-row { grid-template-columns: repeat(2, 1fr); }
      .annotation-item { border-right: 0; border-bottom: 1px solid var(--border); }
    }
  </style>
</head>
<body>

<div class="container">

  <h2>Section 4</h2>
  <div class="section-title">
    <span class="section-number">4</span>
    Anatomy of a Task
  </div>

  <p class="section-intro">
    Each task you claim corresponds to a single video, broken down into smaller units you'll review one at a time. Understanding <strong>what makes up a task</strong> — and the structure of each reviewable unit inside it — is the foundation for every audit decision that follows.
  </p>

  <!-- ========= Definition ========= -->
  <div class="definition-card">
    <span class="def-label">⚙ Core Concept</span>
    <div class="def-term">Task → Captions</div>
    <p class="def-text">
      A <strong>task</strong> is a single video pre-segmented into multiple <strong>captions</strong> by the model. Each caption is the atomic reviewable unit: a numbered <code>[start, end]</code> time window on a hand-scoped track, paired with a natural-language description of the hand actions during that window and a list of relevant objects. <strong>You review every caption in the task</strong> before submitting.
    </p>
  </div>

  <!-- ========= Real Screenshot Example ========= -->
  <div class="screenshot-card">
    <div class="screenshot-header">
      <div class="screenshot-title-group">
        <span class="label">📸 Real Example</span>
        <div class="title">A caption inside a task</div>
      </div>
      <span class="screenshot-tag">✓ Approved</span>
    </div>

    <div class="screenshot-image">
      <img src="https://video-evals.vercel.app/api/resources/download/69fd14a69d3858cdadb0b0dc/image%20(12).png">
    </div>

    <div class="annotations-row">
      <div class="annotation-item">
        <span class="annotation-label">ID</span>
        <span class="annotation-value mono">#3</span>
      </div>
      <div class="annotation-item">
        <span class="annotation-label">Track</span>
        <span class="annotation-value">Both Hands</span>
      </div>
      <div class="annotation-item">
        <span class="annotation-label">Window</span>
        <span class="annotation-value mono">0:07 → 0:12</span>
      </div>
      <div class="annotation-item">
        <span class="annotation-label">Duration</span>
        <span class="annotation-value">5 seconds</span>
      </div>
      <div class="annotation-item">
        <span class="annotation-label">Objects</span>
        <span class="annotation-value">6 tagged</span>
      </div>
    </div>
  </div>

  <!-- ========= Breakdown: Actions and Objects ========= -->
  <div class="subsection">
    <span class="subsection-label">🔍 Inside a caption</span>
    <div class="subsection-title">Actions &amp; objects breakdown</div>

    <div class="breakdown">

      <!-- Actions -->
      <div class="bd-card actions">
        <div class="bd-head">
          <div class="bd-icon">▶</div>
          <div class="bd-title">
            <span class="bd-label">Description</span>
            <div class="bd-name">Action sequence</div>
          </div>
        </div>
        <ol class="action-list">
          <li>
            <strong>Turns away</strong> from the bed
            <span class="hands-tag idle">Hands idle</span>
          </li>
          <li>
            <strong>Walks</strong> toward the balcony
            <span class="hands-tag idle">Hands idle</span>
          </li>
          <li>
            <strong>Crouches</strong> to the floor
            <span class="hands-tag idle">Hands idle</span>
          </li>
        </ol>
      </div>

      <!-- Objects -->
      <div class="bd-card objects">
        <div class="bd-head">
          <div class="bd-icon">📦</div>
          <div class="bd-title">
            <span class="bd-label">Tagged</span>
            <div class="bd-name">Objects in scene</div>
          </div>
        </div>
        <div class="object-chips">
          <span class="object-chip">brown and blue plush dog</span>
          <span class="object-chip">clear plastic storage box</span>
          <span class="object-chip">yellow plush duck</span>
          <span class="object-chip">green and yellow plush toy</span>
          <span class="object-chip">small blue and white plush toy</span>
          <span class="object-chip">orange plush monkey</span>
        </div>
        <div class="object-note">
          Objects are <strong>reference points</strong> for hand actions, not standalone mentions. They're listed even when the hands are idle.
        </div>
      </div>

    </div>
  </div>

  <!-- ========= Taxonomy Table ========= -->
  <div class="subsection">
    <span class="subsection-label">📋 Field Reference</span>
    <div class="subsection-title">The five fields of every caption</div>

    <div class="taxonomy-card">
      <table class="taxonomy">
        <thead>
          <tr>
            <th style="width: 22%;">Field</th>
            <th style="width: 14%;">Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="field-name"><span class="field-icon">#</span>ID</span></td>
            <td><span class="field-type">integer</span></td>
            <td class="field-desc">Sequential number identifying the caption within the video.</td>
          </tr>
          <tr>
            <td><span class="field-name"><span class="field-icon">✋</span>Track</span></td>
            <td><span class="field-type">scope</span></td>
            <td class="field-desc">Which hand(s) the annotation covers — left, right, or both hands.</td>
          </tr>
          <tr>
            <td><span class="field-name"><span class="field-icon">⏱</span>Time Window</span></td>
            <td><span class="field-type">[start, end]</span></td>
            <td class="field-desc">The bounded video slice — start and end timestamps that define the caption's footprint on the timeline.</td>
          </tr>
          <tr>
            <td><span class="field-name"><span class="field-icon">📝</span>Description</span></td>
            <td><span class="field-type">text</span></td>
            <td class="field-desc">Natural-language caption of the hand actions during the window. Must account for <strong>both hands</strong>, even if one is idle or out of frame.</td>
          </tr>
          <tr>
            <td><span class="field-name"><span class="field-icon">📦</span>Objects</span></td>
            <td><span class="field-type">tag list</span></td>
            <td class="field-desc">The objects relevant to the caption, listed as standalone descriptors used as <strong>reference points</strong> for hand actions.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

</div>

</body>
</html>


<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>End-to-End Workflow — Training</title>
  <style>
    :root {
      --bg-main: #05070a;
      --bg-card: #0b0e14;
      --border: #1e222b;
      --border-soft: #2a2d35;
      --text-main: #ffffff;
      --text-body: #D1DCFF;
      --text-muted: #8a94a6;
      --text-soft: #bcc6d4;
      --accent-blue: #3444DA;
      --accent-blue-bright: #5967ff;
      --yellow: #FFAB00;
      --yellow-soft: #FFE0A3;
      --green-ins: #4caf50;
      --red-del: #ef5350;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: var(--bg-main);
      background-image:
        radial-gradient(circle at 10% 0%, rgba(52,68,218,.18), transparent 45%),
        radial-gradient(circle at 95% 8%, rgba(52,68,218,.10), transparent 40%);
      color: var(--text-main);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      padding: 40px;
      min-height: 100vh;
    }

    .container { max-width: 1400px; margin: 0 auto; }

    /* --- Section header --- */
    h2 {
      font-size: 1.2rem;
      color: var(--text-muted);
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 700;
    }

    .section-title {
      font-size: 1.7rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .section-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 32px;
      height: 32px;
      padding: 0 10px;
      background: var(--accent-blue);
      color: #fff;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 800;
    }

    .section-intro {
      color: var(--text-body);
      font-size: 1rem;
      line-height: 1.65;
      margin-bottom: 32px;
      max-width: 950px;
    }

    .section-intro strong { color: #fff; }

    /* --- Workflow stages --- */
    .stages {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 32px;
    }

    .stage {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 22px 24px;
      position: relative;
      overflow: hidden;
    }

    .stage::before {
      content: "";
      position: absolute;
      top: 0; left: 0; bottom: 0;
      width: 4px;
      background: linear-gradient(180deg, var(--accent-blue), var(--accent-blue-bright));
    }

    .stage-loop::before {
      background: linear-gradient(180deg, var(--accent-blue-bright), var(--green-ins));
    }

    .stage-head {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 12px;
    }

    .stage-num {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      border-radius: 10px;
      background: rgba(52,68,218,.15);
      border: 1px solid rgba(74,90,232,.4);
      color: #B8C5FF;
      font-size: 1.2rem;
      font-weight: 800;
    }

    .stage-meta {
      flex: 1;
      min-width: 0;
    }

    .stage-label {
      display: block;
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-weight: 800;
      color: var(--text-muted);
      margin-bottom: 2px;
    }

    .stage-title {
      font-size: 1.15rem;
      font-weight: 800;
      color: #fff;
      line-height: 1.25;
    }

    .stage-body {
      color: var(--text-body);
      font-size: 0.92rem;
      line-height: 1.55;
    }

    .stage-body strong { color: #fff; }

    /* Nested loop inside Stage 2 */
    .loop-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-top: 16px;
      margin-bottom: 14px;
      padding: 16px;
      background: rgba(52,68,218,.04);
      border: 1px dashed rgba(74,90,232,.3);
      border-radius: 10px;
    }

    .loop-step {
      display: flex;
      gap: 10px;
      padding: 12px 14px;
      background: rgba(11,14,20,0.6);
      border: 1px solid var(--border);
      border-radius: 8px;
    }

    .loop-letter {
      flex-shrink: 0;
      width: 26px;
      height: 26px;
      border-radius: 6px;
      background: rgba(89,103,255,0.15);
      border: 1px solid rgba(89,103,255,0.4);
      color: var(--accent-blue-bright);
      font-size: 0.85rem;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    }

    .loop-content {
      flex: 1;
      min-width: 0;
    }

    .loop-title {
      font-size: 0.85rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 3px;
      line-height: 1.25;
    }

    .loop-desc {
      font-size: 0.78rem;
      color: var(--text-body);
      line-height: 1.4;
    }

    .loop-desc strong { color: #fff; }

    .loop-note {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      background: rgba(76,175,80,0.08);
      border: 1px solid rgba(76,175,80,0.3);
      border-radius: 6px;
      font-size: 0.85rem;
      color: var(--text-body);
    }

    .loop-note strong { color: #fff; }

    .loop-note-icon {
      font-size: 1rem;
      color: var(--green-ins);
      font-weight: 800;
    }

    /* --- Closing tip --- */
    .tip {
      background: rgba(255, 171, 0, 0.06);
      border: 1px solid rgba(255, 171, 0, 0.3);
      border-left: 4px solid var(--yellow);
      border-radius: 10px;
      padding: 18px 22px;
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }

    .tip-icon {
      flex-shrink: 0;
      width: 38px; height: 38px;
      border-radius: 9px;
      background: rgba(255, 171, 0, 0.15);
      border: 1px solid rgba(255, 171, 0, 0.4);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
    }

    .tip-body { flex: 1; }

    .tip-label {
      display: block;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 800;
      color: var(--yellow-soft);
      margin-bottom: 6px;
    }

    .tip-text {
      color: var(--text-body);
      font-size: 0.92rem;
      line-height: 1.55;
    }

    .tip-text strong { color: #fff; }

    /* Responsive */
    @media (max-width: 1100px) {
      .loop-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 600px) {
      .loop-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

<div class="container">

  <h2>Section 5</h2>
  <div class="section-title">
    <span class="section-number">5</span>
    End-to-End Workflow
  </div>

  <p class="section-intro">
    Every task you take on follows the same <strong>three-stage process</strong>: claim, review, submit. The bulk of your work happens inside Stage 2, where you cycle through every caption in the video using a consistent <strong>per-caption review loop</strong>.
  </p>

  <div class="stages">

    <!-- Stage 1 -->
    <div class="stage">
      <div class="stage-head">
        <div class="stage-num">1</div>
        <div class="stage-meta">
          <span class="stage-label">Stage 01</span>
          <div class="stage-title">Claim a task</div>
        </div>
      </div>
      <div class="stage-body">
        Pick up an available task from the queue. Each task corresponds to a single video <strong>pre-segmented into multiple captions</strong> by the model. Once claimed, the task is yours to complete in full.
      </div>
    </div>

    <!-- Stage 2 - the review loop -->
    <div class="stage stage-loop">
      <div class="stage-head">
        <div class="stage-num">2</div>
        <div class="stage-meta">
          <span class="stage-label">Stage 02</span>
          <div class="stage-title">Review the video, caption by caption</div>
        </div>
      </div>
      <div class="stage-body">
        Move through the video <strong>one caption at a time</strong>. For each caption, run the same micro-loop before advancing:
      </div>

      <div class="loop-grid">
        <div class="loop-step">
          <div class="loop-letter">a</div>
          <div class="loop-content">
            <div class="loop-title">Check the caption</div>
            <div class="loop-desc">Read the model-generated description carefully.</div>
          </div>
        </div>

        <div class="loop-step">
          <div class="loop-letter">b</div>
          <div class="loop-content">
            <div class="loop-title">Verify against the video</div>
            <div class="loop-desc">Watch the clip. Confirm the caption matches what's actually visible — both hands, all objects.</div>
          </div>
        </div>

        <div class="loop-step">
          <div class="loop-letter">c</div>
          <div class="loop-content">
            <div class="loop-title">Check timestamps</div>
            <div class="loop-desc">Confirm the <strong>start</strong> and <strong>end</strong> times tightly bound the action.</div>
          </div>
        </div>

        <div class="loop-step">
          <div class="loop-letter">d</div>
          <div class="loop-content">
            <div class="loop-title">Make changes &amp; advance</div>
            <div class="loop-desc">Apply corrections if needed, then move to the next caption.</div>
          </div>
        </div>
      </div>

      <div class="loop-note">
        <span class="loop-note-icon">↻</span>
        <span>Repeat <strong>a → d</strong> for every caption in the video.</span>
      </div>
    </div>

    <!-- Stage 3 -->
    <div class="stage">
      <div class="stage-head">
        <div class="stage-num">3</div>
        <div class="stage-meta">
          <span class="stage-label">Stage 03</span>
          <div class="stage-title">Save &amp; submit</div>
        </div>
      </div>
      <div class="stage-body">
        Once <strong>every caption in the video has been reviewed</strong>, save your changes and submit the task. Submission applies only when the full video is complete — partial reviews aren't submitted.
      </div>
    </div>

  </div>

  <!-- Closing tip -->
  <div class="tip">
    <div class="tip-icon">⏱</div>
    <div class="tip-body">
      <span class="tip-label">Remember</span>
      <p class="tip-text">
        The <strong>Handling Time (HT)</strong> budget covers the entire workflow — claiming, the full review loop across all captions, and submission. Keep the per-caption loop tight to stay within the 1:5 ratio.
      </p>
    </div>
  </div>

</div>

</body>
</html>


<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Segment Rules — Section 5 (Forced 2-Col)</title>
  <style>
    :root {
      --bg-main: #05070a;
      --bg-card: #0b0e14;
      --border: #1e222b;
      --text-main: #ffffff;
      --text-body: #D1DCFF;
      --text-muted: #8a94a6;
      --accent-blue: #3444DA;
      --accent-blue-bright: #5967ff;
      --green-ins: #4caf50;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: var(--bg-main);
      background-image:
        radial-gradient(circle at 10% 0%, rgba(52,68,218,.18), transparent 45%),
        radial-gradient(circle at 95% 8%, rgba(52,68,218,.10), transparent 40%);
      color: var(--text-main);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      padding: 40px;
      min-height: 100vh;
      display: flex;
      justify-content: center;
    }

    .container { 
      width: 100%;
      max-width: 1300px; /* Incrementado para dar espacio a las 2 columnas */
      min-width: 800px;  /* Esto evita que se comprima demasiado */
    }

    h2 {
      font-size: 1.1rem;
      color: var(--text-muted);
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-weight: 700;
    }

    .section-title {
      font-size: 1.6rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .section-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 34px;
      height: 34px;
      background: var(--accent-blue);
      color: #fff;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 800;
    }

    /* --- HARD FORCED 2 COLUMNS --- */
    .rules-grid {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important; /* Fuerza dos columnas iguales */
      gap: 20px;
      margin-top: 30px;
    }

    .rule-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 24px;
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .rule-card::before {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0; height: 3px;
      background: linear-gradient(90deg, var(--accent-blue), var(--accent-blue-bright));
      border-radius: 14px 14px 0 0;
    }

    .rule-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px;
    }

    .rule-index {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      background: rgba(52,68,218,0.12);
      border: 1px solid rgba(74,90,232,0.3);
      color: #B8C5FF;
      border-radius: 7px;
      font-size: 0.85rem;
      font-weight: 800;
    }

    .rule-name {
      font-size: 1.05rem;
      font-weight: 800;
      color: #fff;
    }

    .rule-content {
      font-size: 0.88rem;
      line-height: 1.5;
      color: var(--text-body);
      flex-grow: 1;
    }

    .example-box {
      margin-top: 12px;
      padding: 10px;
      background: rgba(255,255,255,0.02);
      border-radius: 6px;
      border-left: 2px solid var(--accent-blue-bright);
      font-size: 0.8rem;
      font-style: italic;
    }

    .tag-good {
      color: var(--green-ins);
      font-weight: 800;
      font-size: 0.65rem;
      text-transform: uppercase;
      margin-right: 5px;
    }

    .footer-label {
      margin-top: 15px;
      padding-top: 10px;
      border-top: 1px solid var(--border);
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--accent-blue-bright);
      font-weight: 700;
    }

    /* Media query eliminada para evitar el colapso a 1 columna */
  </style>
</head>
<body>

<div class="container">
  <h2>Section 5</h2>
  <div class="section-title">
    <span class="section-number">5.1</span>
    Segment & Temporal Rules
  </div>

  <div class="rules-grid">

    <!-- Rule 1 -->
    <div class="rule-card">
      <div class="rule-header">
        <div class="rule-index">1</div>
        <div class="rule-name">Full Action Lifecycle</div>
      </div>
      <div class="rule-content">
        Capture the entire motion from intent to completion. Must include <strong>Initiation</strong> (reach), <strong>Execution</strong> (task), and <strong>Resolution</strong> (release/idle).
      </div>
      <div class="footer-label">Completeness</div>
    </div>

    <!-- Rule 2 -->
    <div class="rule-card">
      <div class="rule-header">
        <div class="rule-index">2</div>
        <div class="rule-name">10-40s Minimum Window</div>
      </div>
      <div class="rule-content">
        Segments must range from <strong>10 to 40 seconds</strong>. Group micro-actions to maintain narrative flow and prevent fragmentation.
      </div>
      <div class="footer-label">Contextual Flow</div>
    </div>

    <!-- Rule 3 -->
    <div class="rule-card">
      <div class="rule-header">
        <div class="rule-index">3</div>
        <div class="rule-name">Mandatory Spatial Anchoring</div>
      </div>
      <div class="rule-content">
        Tie every description to environmental coordinates. 
        <div class="example-box">
          <span class="tag-good">Fixed:</span> "Places the item on the <strong>top-right corner</strong> of the counter."
        </div>
      </div>
      <div class="footer-label">Localization</div>
    </div>

    <!-- Rule 4 -->
    <div class="rule-card">
      <div class="rule-header">
        <div class="rule-index">4</div>
        <div class="rule-name">Explicit Bimanual Annotation</div>
      </div>
      <div class="rule-content">
        Distinguish between <strong>active</strong> and <strong>support</strong> hands. Document the stabilizer hand even if it only holds a lid open.
      </div>
      <div class="footer-label">Hand Coordination</div>
    </div>

    <!-- Rule 5 -->
    <div class="rule-card">
      <div class="rule-header">
        <div class="rule-index">5</div>
        <div class="rule-name">Empty Time Policy</div>
      </div>
      <div class="rule-content">
        The timeline must be strictly continuous. No gaps or empty time allowed between segments.
      </div>
      <div class="footer-label">Seamless Timeline</div>
    </div>

    <!-- Rule 6 -->
    <div class="rule-card">
      <div class="rule-header">
        <div class="rule-index">6</div>
        <div class="rule-name">Repetitive Actions Strategy</div>
      </div>
      <div class="rule-content">
        Mention the main action once at the start for repetitive sequences. Precise descriptions apply to each subsequent object.
        <div class="example-box">
          "The right hand picks up items: the red pot, the brush, and the pen..."
        </div>
      </div>
      <div class="footer-label">Narrative Efficiency</div>
    </div>

  </div>
</div>

</body>
</html>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Common Errors - Granularity Consistency</title>
  <style>
    :root {
      --bg-main: #05070a;
      --bg-card: #0b0e14;
      --border: #1e222b;
      --border-soft: #2a2d35;
      --text-main: #ffffff;
      --text-body: #D1DCFF;
      --text-muted: #8a94a6;
      --text-soft: #bcc6d4;
      --accent-blue: #3444DA;
      --accent-blue-bright: #5967ff;
      --yellow: #FFAB00;
      --yellow-soft: #FFE0A3;
      --red-del: #ef5350;
      --green-ins: #4caf50;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: var(--bg-main);
      background-image:
        radial-gradient(circle at 10% 0%, rgba(52,68,218,.18), transparent 45%),
        radial-gradient(circle at 95% 8%, rgba(52,68,218,.10), transparent 40%);
      color: var(--text-main);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      padding: 40px;
      min-height: 100vh;
    }

    .container { max-width: 1400px; margin: 0 auto; }

    /* --- Section header --- */
    h2 {
      font-size: 1.2rem;
      color: var(--text-muted);
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 700;
    }

    .section-title {
      font-size: 1.7rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .section-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 32px;
      height: 32px;
      padding: 0 10px;
      background: var(--accent-blue);
      color: #fff;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 800;
    }

    .section-intro {
      color: var(--text-body);
      font-size: 1rem;
      line-height: 1.65;
      margin-bottom: 36px;
      max-width: 950px;
    }

    .section-intro strong { color: #fff; }

    /* --- Error block (numbered card, like the section opener pattern) --- */
    .error-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 28px 30px;
      position: relative;
      overflow: hidden;
      margin-bottom: 28px;
    }

    .error-card::before {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--red-del), var(--yellow));
    }

    .error-head {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 22px;
      padding-bottom: 18px;
      border-bottom: 1px solid var(--border);
    }

    .error-num {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: rgba(239,83,80,0.12);
      border: 1px solid rgba(239,83,80,0.4);
      color: var(--red-del);
      font-size: 1.1rem;
      font-weight: 800;
    }

    .error-meta {
      flex: 1;
      min-width: 0;
    }

    .error-label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-weight: 800;
      color: var(--text-muted);
      margin-bottom: 4px;
    }

    .error-title {
      font-size: 1.25rem;
      font-weight: 800;
      color: #fff;
      line-height: 1.3;
      margin-bottom: 10px;
    }

    .tag-row {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .tag-row .tag-label {
      font-size: 0.7rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 700;
    }

    .tag-chip {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      border-radius: 5px;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.01em;
      background: rgba(89,103,255,0.15);
      border: 1px solid rgba(89,103,255,0.5);
      color: var(--accent-blue-bright);
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    }

    .tag-or {
      font-size: 0.72rem;
      color: var(--text-muted);
      font-weight: 700;
    }

    .error-description {
      color: var(--text-body);
      font-size: 0.95rem;
      line-height: 1.65;
      margin-bottom: 22px;
    }

    .error-description strong { color: #fff; }

    /* --- Compare cards (avoid / use instead) --- */
    .compare-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 22px;
    }

    .compare-card {
      background: rgba(255,255,255,0.02);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 18px 20px;
      position: relative;
      overflow: hidden;
    }

    .compare-card::before {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
    }

    .compare-card.bad::before { background: var(--red-del); }
    .compare-card.good::before { background: var(--green-ins); }

    .compare-card.bad {
      background: rgba(239, 83, 80, 0.04);
      border-color: rgba(239, 83, 80, 0.25);
    }

    .compare-card.good {
      background: rgba(76, 175, 80, 0.04);
      border-color: rgba(76, 175, 80, 0.25);
    }

    .compare-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 800;
      margin-bottom: 12px;
    }

    .compare-card.bad .compare-label { color: var(--red-del); }
    .compare-card.good .compare-label { color: var(--green-ins); }

    .compare-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 800;
    }

    .compare-card.bad .compare-badge {
      background: rgba(239,83,80,0.15);
      border: 1px solid rgba(239,83,80,0.4);
      color: var(--red-del);
    }

    .compare-card.good .compare-badge {
      background: rgba(76,175,80,0.15);
      border: 1px solid rgba(76,175,80,0.4);
      color: var(--green-ins);
    }

    .compare-tag {
      margin-left: auto;
      font-size: 0.62rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 700;
      color: var(--text-muted);
    }

    .compare-text {
      color: var(--text-body);
      font-size: 0.92rem;
      line-height: 1.6;
    }

    .compare-text .strike {
      color: var(--red-del);
      font-weight: 600;
    }

    .compare-text .keep {
      color: var(--green-ins);
      font-weight: 700;
    }

    /* Step list inside the good card */
    .step-list {
      list-style: none;
      counter-reset: step;
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 8px;
    }

    .step-list li {
      counter-increment: step;
      padding: 6px 10px 6px 32px;
      background: rgba(76,175,80,0.06);
      border: 1px solid rgba(76,175,80,0.2);
      border-radius: 5px;
      font-size: 0.85rem;
      color: var(--text-body);
      position: relative;
    }

    .step-list li::before {
      content: counter(step);
      position: absolute;
      left: 8px;
      top: 50%;
      transform: translateY(-50%);
      width: 18px;
      height: 18px;
      border-radius: 4px;
      background: rgba(76,175,80,0.18);
      border: 1px solid rgba(76,175,80,0.4);
      color: var(--green-ins);
      font-size: 0.7rem;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    }

    .step-list li strong { color: #fff; font-weight: 700; }

    /* Why card */
    .why-card {
      background: rgba(255, 171, 0, 0.06);
      border: 1px solid rgba(255, 171, 0, 0.3);
      border-left: 4px solid var(--yellow);
      border-radius: 10px;
      padding: 16px 20px;
      display: flex;
      gap: 14px;
      align-items: flex-start;
    }

    .why-icon {
      flex-shrink: 0;
      width: 36px; height: 36px;
      border-radius: 9px;
      background: rgba(255, 171, 0, 0.15);
      border: 1px solid rgba(255, 171, 0, 0.4);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
    }

    .why-body { flex: 1; }

    .why-label {
      display: block;
      font-size: 0.68rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 800;
      color: var(--yellow-soft);
      margin-bottom: 6px;
    }

    .why-text {
      color: var(--text-body);
      font-size: 0.9rem;
      line-height: 1.55;
    }

    .why-text strong { color: #fff; }

    /* Responsive */
    @media (max-width: 900px) {
      .compare-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

<div class="container">

  <h2>Section 7 </h2>
  <div class="section-title">
    <span class="section-number">7</span>
    Common Errors
  </div>

  <p class="section-intro">
    Patterns we've spotted in recent reviews, keep an eye out for these as you work. We'll add to this list as new patterns surface, so check back when updates are announced.
  </p>

  <!-- ============ Error 1 ============ -->
  <div class="error-card">

    <div class="error-head">
      <div class="error-num">1</div>
      <div class="error-meta">
        <div class="error-label">Common Error</div>
        <div class="error-title">Inconsistent action granularity</div>
        <div class="tag-row">
          <span class="tag-label">Tag with:</span>
          <span class="tag-chip">missing_phase</span>
          <span class="tag-or">or</span>
          <span class="tag-chip">structural_cleanup</span>
        </div>
      </div>
    </div>

    <p class="error-description">
      We're seeing real differences between annotators on how detailed an action should be. Some annotators write high-level summaries like <em>"pick up and throw an item in A,"</em> while others break the same action into its mechanical sub-steps. <strong>The detailed version is the standard</strong>, every distinct hand motion gets its own verb.
    </p>

    <!-- Avoid vs Use instead -->
    <div class="compare-grid">

      <div class="compare-card bad">
        <div class="compare-label">
          <span class="compare-badge">✕</span>
          Avoid
          <span class="compare-tag">Too high-level</span>
        </div>
        <p class="compare-text">
          The right hand <span class="strike">picks up and throws an item in A</span>.
        </p>
      </div>

      <div class="compare-card good">
        <div class="compare-label">
          <span class="compare-badge">✓</span>
          Use instead
          <span class="compare-tag">Atomic verbs</span>
        </div>
        <p class="compare-text">
          The right hand:
        </p>
        <ul class="step-list">
          <li><strong>grasps</strong> the item</li>
          <li><strong>lifts</strong> it from the surface</li>
          <li><strong>approaches</strong> A</li>
          <li><strong>places</strong> it inside</li>
        </ul>
      </div>

    </div>

    <!-- Why this matters -->
    <div class="why-card">
      <div class="why-icon">🤖</div>
      <div class="why-body">
        <span class="why-label">Why consistency matters</span>
        <p class="why-text">
          The model learns motor control from caption granularity. <strong>"Pick up and throw"</strong> compresses four distinct motions into a verb the robot can't execute step-by-step. <strong>Each atomic verb</strong>, grasp, lift, approach, place, corresponds to a discrete motion the model can reproduce. Mixed granularity across the dataset confuses training.
        </p>
      </div>
    </div>

  </div>

</div>

</body>
</html>

