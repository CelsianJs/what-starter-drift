import { describe, expect, it } from 'vitest';
import { byDueDate, columns, seedCards } from '../src/data/projects.js';

describe('project data helpers', () => {
  it('sorts cards by due date', () => {
    const sorted = [...seedCards].sort(byDueDate);
    expect(sorted[0].id).toBe('card-orbit');
  });

  it('keeps expected board columns', () => {
    expect(columns.map((column) => column.id)).toEqual(['backlog', 'active', 'review', 'done']);
  });
});
