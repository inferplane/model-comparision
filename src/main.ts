import './styles.css';
import { h } from './dom.ts';
import { loadData } from './data.ts';
import { renderHeader } from './components/header.ts';
import { renderChart } from './views/chart.ts';
import { renderCompare } from './views/compare.ts';
import { renderRank } from './views/rank.ts';
import { renderDetail } from './views/detail.ts';
import { renderTable } from './views/table.ts';
import { allRegions } from './data.ts';
import { DEFAULT_REGION, state, subscribe, update } from './state.ts';

try {
  const saved = localStorage.getItem('bme-theme');
  if (saved) document.documentElement.dataset.theme = saved;
} catch {
  /* theme falls back to the OS preference */
}

const app = document.getElementById('app')!;
async function start() {
  const { models, generatedAt } = await loadData();
  // A shared link may name a region or provider this dataset doesn't have (typo, or removed since); fall back instead of showing an empty page.
  if (!allRegions(models).includes(state.region)) update({ region: DEFAULT_REGION });
  if (state.provider && !models.some((m) => m.provider === state.provider)) update({ provider: '' });
  const header = renderHeader(models, generatedAt);
  const view = h('div', { id: 'view' });
  app.replaceChildren(header, view);

  const paint = () => {
    const m = location.hash.match(/^#\/model\/(.+)$/);
    const page = m ? renderDetail(models, decodeURIComponent(m[1]))
      : location.hash === '#/chart' ? renderChart(models)
      : location.hash === '#/rank' ? renderRank(models)
      : location.hash === '#/compare' ? renderCompare(models)
      : renderTable(models);
    view.replaceChildren(page);
  };
  const route = () => {
    paint();
    window.scrollTo(0, 0);
  };
  // Filters and sorting repaint in place; keep scroll position for those.
  subscribe(() => {
    const y = window.scrollY;
    paint();
    window.scrollTo(0, y);
  });
  window.addEventListener('hashchange', route);
  route();
}

start().catch((e: Error) => app.replaceChildren(h('main', null, h('p', null, `데이터를 불러오지 못했습니다: ${e.message}`))));
