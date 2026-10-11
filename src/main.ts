import './styles.css';
import { h } from './dom.ts';
import { loadData } from './data.ts';
import { recentlyAdded } from './changes.ts';
import { loadChanges, setRecentlyAdded } from './recent.ts';
import { renderChanges } from './views/changes.ts';
import { renderHeader } from './components/header.ts';
import { renderChart } from './views/chart.ts';
import { renderCompare } from './views/compare.ts';
import { renderRank } from './views/rank.ts';
import { renderDetail } from './views/detail.ts';
import { renderTable } from './views/table.ts';
import { allRegions } from './data.ts';
import { DEFAULT_REGION, state, subscribe, update } from './state.ts';
import { renderCompareDock } from './components/compare-dock.ts';
import { emptyState, icon } from './components/ui.ts';

try {
  const saved = localStorage.getItem('bme-theme');
  if (saved === 'light' || saved === 'dark') document.documentElement.dataset.theme = saved;
} catch {
  /* theme falls back to the OS preference */
}

const app = document.getElementById('app')!;
app.replaceChildren(h('main', { class: 'loading-state', role: 'status' },
  h('span', { class: 'brand-mark' }, icon('layers')),
  h('h1', null, '모델 정보를 불러오고 있습니다'),
  h('p', null, '잠시 후 가격과 성능을 한눈에 비교할 수 있습니다.'),
  h('div', { class: 'loading-line' })));

async function start() {
  const [{ models, generatedAt }, changes] = await Promise.all([loadData(), loadChanges()]);
  setRecentlyAdded(recentlyAdded(changes.entries, new Date().toISOString().slice(0, 10)));
  // A shared link may name a region or provider this dataset doesn't have (typo, or removed since); fall back instead of showing an empty page.
  if (!allRegions(models).includes(state.region)) update({ region: DEFAULT_REGION });
  if (state.provider && !models.some((m) => m.provider === state.provider)) update({ provider: '' });
  const header = renderHeader(models, generatedAt);
  const view = h('div', { id: 'view', tabindex: -1 });
  const footer = h('footer', { class: 'site-footer' },
    h('span', null, 'Bedrock Model Explorer'),
    h('span', null, '가격 · AWS Price List 및 모델 카드', h('span', { class: 'footer-divider' }, ' / '), h('a', { href: 'https://artificialanalysis.ai/', rel: 'noopener' }, '벤치마크 · Artificial Analysis')));
  app.replaceChildren(h('a', { class: 'skip-link', href: '#view', onclick: (e: Event) => { e.preventDefault(); view.focus(); view.scrollIntoView(); } }, '본문으로 건너뛰기'), header, view, footer, renderCompareDock(models));
  // Keep the table's sticky comparison action below the actual responsive header.
  const headerSize = new ResizeObserver(() => document.documentElement.style.setProperty('--header-height', `${header.getBoundingClientRect().height}px`));
  headerSize.observe(header);

  const paint = () => {
    const m = location.hash.match(/^#\/model\/(.+)$/);
    const page = m ? renderDetail(models, decodeURIComponent(m[1]))
      : location.hash === '#/chart' ? renderChart(models)
      : location.hash === '#/rank' ? renderRank(models)
      : location.hash === '#/compare' ? renderCompare(models)
      : location.hash === '#/changes' ? renderChanges(models, changes)
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
    const active = document.activeElement;
    const focusLabel = active instanceof HTMLElement && view.contains(active) ? active.getAttribute('aria-label') : null;
    paint();
    if (focusLabel) {
      const target = [...view.querySelectorAll<HTMLElement>('[aria-label]')].find((el) => el.getAttribute('aria-label') === focusLabel);
      target?.focus({ preventScroll: true });
    }
    window.scrollTo(0, y);
  });
  window.addEventListener('hashchange', route);
  route();
}

start().catch((e: Error) => app.replaceChildren(h('main', null,
  emptyState('모델 정보를 불러오지 못했습니다', '연결을 확인한 후 다시 시도해 주세요.',
    h('button', { type: 'button', class: 'button primary', onclick: () => location.reload() }, icon('reset'), '다시 불러오기')),
  h('details', { class: 'error-details' }, h('summary', null, '오류 정보'), h('p', null, e.message)))));
