import { computed, effect, signal } from 'what-framework';
import { assignees, byDueDate, cardById, columns, seedCards } from '../data/projects.js';

export const STORAGE_KEY = 'what-starter-drift-v1';

function cloneSeed() {
  return seedCards.map((card) => ({ ...card, tags: [...card.tags] }));
}

function initialActivity() {
  return [{ id: 'evt-seed', text: 'Seeded project planner.', at: '09:10' }];
}

function validCard(card) {
  return card
    && typeof card.id === 'string'
    && typeof card.title === 'string'
    && columns.some((column) => column.id === card.status)
    && assignees.includes(card.assignee)
    && typeof card.due === 'string'
    && Array.isArray(card.tags);
}

function safeLoad() {
  if (typeof localStorage === 'undefined') return { cards: cloneSeed(), view: 'board', filter: 'all', activity: initialActivity(), status: 'Session only.' };
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (!parsed || !Array.isArray(parsed.cards) || !parsed.cards.every(validCard)) {
      return { cards: cloneSeed(), view: 'board', filter: 'all', activity: initialActivity(), status: 'Loaded seed planner.' };
    }
    return {
      cards: parsed.cards,
      view: parsed.view === 'list' ? 'list' : 'board',
      filter: parsed.filter || 'all',
      activity: Array.isArray(parsed.activity) ? parsed.activity : initialActivity(),
      status: 'Planner restored from this browser.',
    };
  } catch {
    return { cards: cloneSeed(), view: 'board', filter: 'all', activity: initialActivity(), status: 'Stored planner was invalid, so seed data loaded.' };
  }
}

const initial = safeLoad();

export const cards = signal(initial.cards, 'drift.cards');
export const viewMode = signal(initial.view, 'drift.viewMode');
export const assigneeFilter = signal(initial.filter, 'drift.assigneeFilter');
export const activity = signal(initial.activity, 'drift.activity');
export const saveStatus = signal(initial.status, 'drift.saveStatus');
export const exportStatus = signal('JSON export is generated locally.', 'drift.exportStatus');

export const visibleCards = computed(() => cards()
  .filter((card) => assigneeFilter() === 'all' || card.assignee === assigneeFilter())
  .sort(byDueDate));

export const boardGroups = computed(() => columns.map((column) => ({
  ...column,
  cards: visibleCards().filter((card) => card.status === column.id),
})));

export const plannerSummary = computed(() => ({
  total: cards().length,
  active: cards().filter((card) => card.status === 'active').length,
  review: cards().filter((card) => card.status === 'review').length,
  unowned: cards().filter((card) => card.assignee === 'No owner').length,
}));

function eventId() {
  return `evt-${Math.random().toString(36).slice(2, 8)}`;
}

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function log(text) {
  activity((items) => [{ id: eventId(), text, at: nowLabel() }, ...items].slice(0, 40));
}

export function moveCard(cardId, status) {
  const card = cardById(cards(), cardId);
  if (!card || !columns.some((column) => column.id === status)) return;
  cards((items) => items.map((item) => (item.id === cardId ? { ...item, status } : item)));
  log(`Moved “${card.title}” to ${columns.find((column) => column.id === status).label}.`);
}

export function moveCardStep(cardId, direction) {
  const card = cardById(cards(), cardId);
  if (!card) return;
  const index = columns.findIndex((column) => column.id === card.status);
  const next = Math.max(0, Math.min(columns.length - 1, index + direction));
  moveCard(cardId, columns[next].id);
}

export function updateCard(cardId, patch) {
  const card = cardById(cards(), cardId);
  if (!card) return;
  cards((items) => items.map((item) => (item.id === cardId ? { ...item, ...patch } : item)));
  log(`Updated “${card.title}”.`);
}

export function resetPlanner() {
  cards(cloneSeed());
  viewMode('board');
  assigneeFilter('all');
  activity(initialActivity());
  saveStatus('Planner reset to seed cards.');
}

export function exportPlanner() {
  exportStatus('Prepared local planner JSON export.');
  return JSON.stringify({ cards: cards(), activity: activity(), exportedAt: new Date().toISOString() }, null, 2);
}

function persistSnapshot(snapshot) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    saveStatus(`Saved ${snapshot.cards.length} card${snapshot.cards.length === 1 ? '' : 's'} locally.`);
  } catch {
    saveStatus('Changes are not saved in this browser. Planner edits will last for this session only.');
  }
}

effect(() => {
  if (typeof localStorage === 'undefined') return;
  persistSnapshot({ cards: cards(), view: viewMode(), filter: assigneeFilter(), activity: activity() });
});
