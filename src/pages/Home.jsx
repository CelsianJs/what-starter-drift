import { Link } from 'what-framework/router';
import { columns } from '../data/projects.js';
import { cards, moveCardStep, moveTarget, plannerSummary, shortDue } from '../state/board.js';

function previewGroups() {
  return columns.map((column) => ({
    ...column,
    cards: cards().filter((card) => card.status === column.id),
  }));
}

function MoveButton({ card, direction }) {
  const target = () => moveTarget(card, direction);
  const label = () => target() ? `Move ${card.title} to ${target().label}` : `${card.title} is already at the ${direction < 0 ? 'first' : 'last'} lane`;
  return (
    <button class="button small" aria-label={label} disabled={!target()} onClick={() => moveCardStep(card.id, direction)}>
      {direction < 0 ? '←' : '→'}
    </button>
  );
}

export default function Home() {
  return (
    <section class="planning-wall page-enter">
      <div class="planner-brief">
        <p class="eyebrow">Project planner</p>
        <h1>Cards first. Copy second.</h1>
        <p>Drift is a working planner for synthetic project cards: move tasks by drag or keyboard, filter the board, review activity, and export a local snapshot.</p>
        <div class="hero-actions">
          <Link class="button primary" href="/planner">Open full planner</Link>
          <Link class="button" href="/activity">Activity trail</Link>
        </div>
        <div class="planner-stats" aria-label="Workspace metrics">
          <span>{plannerSummary().total} cards</span>
          <span>{plannerSummary().active} active</span>
          <span>{plannerSummary().unowned} unowned</span>
        </div>
      </div>
      <div class="preview-wrap"><p class="lane-cue">Scroll across all four lanes →</p><div class="board-preview" aria-label="Planner board preview" tabindex="0">
        {previewGroups().map((column) => (
          <section class="preview-column">
            <h2>{column.label}<span>{column.cards.length}</span></h2>
            {column.cards.slice(0, 2).map((card) => (
              <article class="task-card compact-card">
                <p class="row-kicker"><span>{card.assignee}</span><span>{shortDue(card.due)}</span></p>
                <h3><Link href={`/cards/${card.id}`}>{card.title}</Link></h3>
                <div class="move-row">
                  <MoveButton card={card} direction={-1} />
                  <MoveButton card={card} direction={1} />
                </div>
              </article>
            ))}
          </section>
        ))}
      </div></div>
    </section>
  );
}
