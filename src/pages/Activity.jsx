import { activity } from '../state/board.js';

export default function Activity() {
  return (
    <section class="page-enter">
      <p class="eyebrow">Activity</p>
      <h1>Local planning trail.</h1>
      <div class="activity-list">
        {activity().map((event) => <article><strong>{event.at}</strong><span>{event.text}</span></article>)}
      </div>
    </section>
  );
}
