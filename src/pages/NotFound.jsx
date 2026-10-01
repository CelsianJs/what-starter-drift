import { Link, route } from 'what-framework/router';

export default function NotFound() {
  return (
    <section class="empty-state page-enter">
      <p class="eyebrow">404</p>
      <h1>This planning route drifted away.</h1>
      <p>No Drift page exists for <code>{route.path}</code>.</p>
      <Link class="button primary" href="/planner">Return to planner</Link>
    </section>
  );
}
