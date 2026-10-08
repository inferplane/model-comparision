import './styles.css';
import { h } from './dom.ts';
import { loadData } from './data.ts';
import { renderHeader } from './components/header.ts';
import { renderDetail } from './views/detail.ts';
import { renderTable } from './views/table.ts';
import { subscribe } from './state.ts';

try {
  const saved = localStorage.getItem('bme-theme');
  if (saved) document.documentElement.dataset.theme = saved;
} catch {
  /* theme falls back to the OS preference */
}

const app = document.getElementById('app')!;
async function start() {
  const { models, generatedAt } = await loadData();
  const header = renderHeader(models, generatedAt);
  const view = h('div', { id: 'view' });
  app.replaceChildren(header, view);

  const route = () => {
    const m = location.hash.match(/^#\/model\/(.+)$/);
    view.replaceChildren(m ? renderDetail(models, decodeURIComponent(m[1])) : renderTable(models));
    window.scrollTo(0, 0);
  };
  // Filters and sorting repaint in place; keep scroll position for those.
  subscribe(() => {
    const y = window.scrollY;
    const m = location.hash.match(/^#\/model\/(.+)$/);
    view.replaceChildren(m ? renderDetail(models, decodeURIComponent(m[1])) : renderTable(models));
    window.scrollTo(0, y);
  });
  window.addEventListener('hashchange', route);
  route();
}

start().catch((e: Error) => app.replaceChildren(h('main', null, h('p', null, `데이터를 불러오지 못했습니다: ${e.message}`))));
