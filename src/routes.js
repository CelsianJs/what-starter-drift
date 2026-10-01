import AppShell from './components/AppShell.jsx';
import Activity from './pages/Activity.jsx';
import Board from './pages/Board.jsx';
import Build from './pages/Build.jsx';
import CardDetail from './pages/CardDetail.jsx';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';

const withShell = (path, component) => ({ path, component, layout: AppShell });

export const routes = [
  withShell('/', Home),
  withShell('/planner', Board),
  withShell('/cards/:id', CardDetail),
  withShell('/activity', Activity),
  withShell('/build', Build),
  withShell('/404', NotFound),
  withShell('/*', NotFound),
];

export const routeMeta = {
  '/': 'Drift project planner',
  '/planner': 'Project planner',
  '/activity': 'Activity trail',
  '/build': 'How it is built',
};
