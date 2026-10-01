import { Link, route } from 'what-framework/router';
import { assignees, cardById, columns, seedCards } from '../data/projects.js';
import { cards, moveCard, updateCard } from '../state/board.js';

export default function CardDetail() {
  const card = () => cardById(cards(), route.params.id);
  if (!card()) {
    return (
      <section class="empty-state page-enter">
        <p class="eyebrow">Unknown card</p>
        <h1>No project card matches that route.</h1>
        <Link class="button" href="/planner">Back to planner</Link>
      </section>
    );
  }
  const current = () => card() || seedCards[0];
  return (
    <section class="page-enter card-detail">
      <Link class="text-link" href="/planner">← Planner</Link>
      <p class="eyebrow">{current().assignee} · due {current().due}</p>
      <h1>{current().title}</h1>
      <p>{current().detail}</p>
      <div class="editor-grid">
        <label><span>Card status</span><select value={current().status} onChange={(event) => moveCard(current().id, event.target.value)}>
          {columns.map((column) => <option value={column.id}>{column.label}</option>)}
        </select></label>
        <label><span>Assignee</span><select value={current().assignee} onChange={(event) => updateCard(current().id, { assignee: event.target.value })}>
          {assignees.map((person) => <option value={person}>{person}</option>)}
        </select></label>
        <label><span>Due date</span><input type="date" value={current().due} onInput={(event) => updateCard(current().id, { due: event.target.value })} /></label>
      </div>
    </section>
  );
}
