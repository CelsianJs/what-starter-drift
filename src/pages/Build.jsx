export default function Build() {
  return (
    <article class="build-notes page-enter">
      <p class="eyebrow">Agent reference</p>
      <h1>How Drift is built.</h1>
      <section>
        <h2>Signals</h2>
        <p><code>src/state/board.js</code> keeps project cards, view mode, assignee filter, activity, and save/export status in module-scoped signals.</p>
      </section>
      <section>
        <h2>Computed values</h2>
        <p><code>visibleCards</code>, <code>boardGroups</code>, and <code>plannerSummary</code> derive board/list UI without duplicating state.</p>
      </section>
      <section>
        <h2>Effects and persistence</h2>
        <p>A single <code>effect</code> writes planner snapshots into localStorage and updates the saved status. Malformed or denied storage falls back to safe in-memory session edits.</p>
      </section>
      <section>
        <h2>Routing</h2>
        <p><code>src/routes.js</code> defines explicit What router routes including <code>/cards/:id</code> and a catch-all 404 route. The build script emits concrete aliases for every bundled card plus <code>404.html</code>.</p>
      </section>
      <section>
        <h2>Build journal</h2>
        <p>Card movement is implemented twice: native drag/drop for pointer users and explicit move buttons for keyboard/touch workflows. Static hosting also needed generated detail aliases instead of only index shells.</p>
      </section>
      <section>
        <h2>Problem → fix → proof</h2>
        <p><strong>Movement access:</strong> <code>moveCardStep()</code> backs visible Move left/right buttons, while native drag/drop still works for pointer users. Browser tests cover both paths.</p>
        <p><strong>Shared state:</strong> <code>boardGroups</code> powers the homepage preview, board view, and list route from the same card signals.</p>
        <p><strong>First viewport:</strong> <code>src/pages/Home.jsx</code> now leads with board columns and compact cards, so Drift reads as a planner rather than a landing page.</p>
      </section>
    </article>
  );
}
