import { Link } from 'what-framework/router';
import { plannerSummary, saveStatus } from '../state/board.js';

const nav = [
  ['/', 'Home'],
  ['/planner', 'Planner'],
  ['/activity', 'Activity'],
  ['/build', 'Build Notes'],
];

export default function AppShell({ children }) {
  return (
    <div class="site-shell">
      <a class="skip-link" href="#content">Skip to content</a>
      <header class="masthead">
        <div>
          <p class="eyebrow">Project drift map</p>
          <Link class="brand" href="/" aria-label="Drift home">Drift</Link>
        </div>
        <nav class="nav" aria-label="Primary">
          {nav.map(([href, label]) => (
            <Link href={href} activeClass="active" exactActiveClass="active">{label}</Link>
          ))}
        </nav>
      </header>
      <aside class="ribbon" aria-label="Workspace status">
        <span>{plannerSummary().total} cards</span>
        <span>{plannerSummary().review} in review</span>
        <span>{saveStatus()}</span>
      </aside>
      <main id="content" class="content">
        {children}
      </main>
      <footer class="footer">
        <p>Drift uses synthetic local project data. It does not sync to a remote tracker or create real assignments.</p>
      </footer>
    </div>
  );
}
