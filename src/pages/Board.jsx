import { Link } from 'what-framework/router';
import { assignees, columns } from '../data/projects.js';
import { assigneeFilter, boardGroups, exportPlanner, moveCard, moveCardStep, resetPlanner, viewMode } from '../state/board.js';

let dragDropInstalled = false;

function installNativeDragDrop() {
  if (dragDropInstalled || typeof document === 'undefined') return;
  dragDropInstalled = true;
  document.addEventListener('dragstart', (event) => {
    const card = event.target.closest?.('[data-card-id]');
    if (card && event.dataTransfer) event.dataTransfer.setData('text/plain', card.dataset.cardId);
  });
  document.addEventListener('dragover', (event) => {
    if (event.target.closest?.('[data-column-id]')) event.preventDefault();
  });
  document.addEventListener('drop', (event) => {
    const column = event.target.closest?.('[data-column-id]');
    const cardId = event.dataTransfer?.getData('text/plain');
    if (!column || !cardId) return;
    event.preventDefault();
    moveCard(cardId, column.dataset.columnId);
  });
}

function exportJson() {
  const blob = new Blob([exportPlanner()], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'drift-planner.json';
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function Board() {
  installNativeDragDrop();
  return (
    <section class="page-enter">
      <div class="section-head">
        <div>
          <p class="eyebrow">Planner</p>
          <h1>Board and list, same source.</h1>
        </div>
        <div class="action-row">
          <button class={`button ${viewMode() === 'board' ? 'primary' : ''}`} onClick={() => viewMode('board')}>Board</button>
          <button class={`button ${viewMode() === 'list' ? 'primary' : ''}`} onClick={() => viewMode('list')}>List</button>
          <button class="button" onClick={exportJson}>Export JSON</button>
          <button class="button ghost" onClick={resetPlanner}>Reset</button>
        </div>
      </div>
      <label class="filter-control">
        <span>Assignee filter</span>
        <select value={assigneeFilter()} onInput={(event) => assigneeFilter(event.target.value)} onChange={(event) => assigneeFilter(event.target.value)}>
          <option value="all">All assignees</option>
          {assignees.map((person) => <option value={person}>{person}</option>)}
        </select>
      </label>
      {viewMode() === 'board' ? <BoardView /> : <ListView />}
    </section>
  );
}

function Card({ card }) {
  return (
    <article
      class="task-card"
      data-card-id={card.id}
      draggable="true"
      onDragStart={(event) => event.dataTransfer.setData('text/plain', card.id)}
    >
      <p class="row-kicker">{card.assignee} · due {card.due}</p>
      <h2><Link href={`/cards/${card.id}`}>{card.title}</Link></h2>
      <p>{card.detail}</p>
      <div class="tag-row">{card.tags.map((tag) => <span>{tag}</span>)}</div>
      <div class="move-row">
        <button class="button small" onClick={() => moveCardStep(card.id, -1)}>Move left</button>
        <button class="button small" onClick={() => moveCardStep(card.id, 1)}>Move right</button>
      </div>
    </article>
  );
}

function BoardView() {
  return (
    <div class="board-grid" aria-label="Project board">
      {boardGroups().map((column) => (
        <section
          class="board-column"
          aria-label={`${column.label} column`}
          data-column-id={column.id}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => moveCard(event.dataTransfer.getData('text/plain'), column.id)}
        >
          <h2>{column.label} <span>{column.cards.length}</span></h2>
          {column.cards.length === 0 ? <p class="empty-note">No cards here.</p> : column.cards.map((card) => <Card card={card} />)}
        </section>
      ))}
    </div>
  );
}

function ListView() {
  const cards = boardGroups().flatMap((group) => group.cards.map((card) => ({ ...card, column: group.label })));
  return (
    <div class="list-view">
      {cards.length === 0 ? <div class="empty-state"><h2>No cards match this filter.</h2><p>Clear the assignee filter to see the full plan.</p></div> : cards.map((card) => (
        <article class="list-row">
          <div>
            <p class="row-kicker">{card.column} · {card.assignee}</p>
            <h2><Link href={`/cards/${card.id}`}>{card.title}</Link></h2>
          </div>
          <span>{card.due}</span>
        </article>
      ))}
    </div>
  );
}
