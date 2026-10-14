import { h } from '../dom.ts';
import { matches, variantRows, type Row } from '../data.ts';
import { METRICS, type Metric } from '../metrics.ts';
import { MAX_COMPARE, state, toggleCompare } from '../state.ts';
import type { Model } from '../types.ts';
import { emptyState, icon, pageHeading } from '../components/ui.ts';
import { codingNotice } from '../components/coding-notice.ts';
import { t } from '../i18n.ts';
import { zdrOf } from '../zdr.ts';

const GROUPS: [string, string[]][] = [
  [t('종합 성능', 'Overall'), ['intelligence', 'math']],
  [t('코딩 측정값', 'Coding'), ['coding', 'scicode', 'liveCodeBench']],
  [t('개별 벤치마크', 'Other benchmarks'), ['gpqa', 'hle', 'mmluPro', 'aime']],
  [t('속도', 'Speed'), ['speed', 'ttft']],
  [t('단가 (USD / 1M)', 'Price (USD / 1M)'), ['input', 'output', 'blend', 'cacheRead', 'longInput']],
  ['Context', ['context']],
];

/** Series color follows the model's slot in the selection, not its rank in any one chart. */
const color = (i: number) => `var(--series-${i + 1})`;

export function renderCompare(models: Model[]): HTMLElement {
  const byId = new Map(models.map((m) => [m.id, m]));
  const picked = state.compare.map((id) => byId.get(id)).filter((m): m is Model => !!m);
  const all = variantRows(picked, state);
  // Rows keep the model's slot color; a model with two price scopes gets two bars in the same color.
  const cols = picked.flatMap((m, i) => all.filter((r) => r.m.id === m.id).map((r) => ({ r, c: color(i) })));
  const unavailable = picked.filter((m) => !cols.some((x) => x.r.m.id === m.id));
  const multi = new Set(all.map((r) => r.scope)).size > 1;
  const nameOf = (r: Row) => (multi ? `${r.m.name} · ${r.label}` : r.m.name);

  const chips = h('div', { class: 'chips-row' }, ...picked.map((m, i) =>
    h('span', { class: 'pick' }, h('i', { class: 'sw', style: `background:${color(i)}` }), h('a', { href: `#/model/${m.id}` }, m.name),
      h('button', { type: 'button', 'aria-label': t(`${m.name} 제거`, `Remove ${m.name}`), onclick: () => toggleCompare(m.id) }, '×'))));

  const results = h('ul', { class: 'suggest static', hidden: true, id: 'compare-results' });
  const noResults = h('p', { class: 'note compare-search-status', role: 'status', hidden: true }, t('검색 결과가 없습니다. 다른 모델 이름이나 제공사를 입력해 보세요.', 'No results. Try another model name or provider.'));
  const searchLabel = t('비교할 모델 검색', 'Search models to compare');
  const input = h('input', { type: 'search', placeholder: state.compare.length >= MAX_COMPARE ? t(`최대 ${MAX_COMPARE}개까지 선택했습니다`, `${MAX_COMPARE} models selected (the maximum)`) : t('비교할 모델을 검색해 추가하세요', 'Search for a model to add'), 'aria-label': searchLabel, 'aria-controls': 'compare-results', 'aria-expanded': false, disabled: state.compare.length >= MAX_COMPARE });
  input.addEventListener('input', () => {
    const q = input.value.trim();
    const hits = q ? models.filter((m) => !state.compare.includes(m.id) && matches(m, q)).slice(0, 8) : [];
    results.replaceChildren(...hits.map((m) => h('li', null, h('button', { type: 'button', onclick: () => {
      toggleCompare(m.id);
      document.querySelector<HTMLInputElement>(`[aria-label="${searchLabel}"]`)?.focus({ preventScroll: true });
    } }, h('strong', null, m.name), h('span', null, m.provider)))));
    results.hidden = hits.length === 0;
    noResults.hidden = !q || hits.length > 0;
    input.setAttribute('aria-expanded', String(hits.length > 0));
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' && !results.hidden) { e.preventDefault(); results.querySelector('button')?.focus(); }
    if (e.key === 'Escape') { results.hidden = true; input.setAttribute('aria-expanded', 'false'); }
  });
  results.addEventListener('keydown', (e) => {
    const buttons = [...results.querySelectorAll('button')];
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = index + (e.key === 'ArrowDown' ? 1 : -1);
      if (next < 0) input.focus();
      else buttons[next % buttons.length]?.focus();
    } else if (e.key === 'Escape') { results.hidden = true; input.setAttribute('aria-expanded', 'false'); input.focus(); }
  });
  const adder = h('div', { class: 'adder' }, h('div', { class: 'search' }, icon('search'), input, results), noResults);
  adder.addEventListener('focusout', (e) => {
    if (!adder.contains(e.relatedTarget as Node | null)) {
      results.hidden = true;
      input.setAttribute('aria-expanded', 'false');
    }
  });

  if (!picked.length) {
    return h('main', null,
      pageHeading('SIDE BY SIDE', t('같은 기준으로, 꼼꼼하게 비교하세요', 'Compare on the same footing'), t('최대 6개 모델의 성능, 속도, 가격을 나란히 비교할 수 있습니다.', 'Put up to 6 models side by side on performance, speed and price.')),
      adder, emptyState(t('어떤 모델이 더 잘 맞을까요?', 'Which model fits better?'), t('위에서 모델을 검색하거나, 모델 탐색에서 ＋ 버튼을 눌러 비교할 모델을 담아보세요.', 'Search for a model above, or use the ＋ button in Explore to add models.'),
        h('a', { href: '#/', class: 'button secondary' }, t('모델 탐색하기', 'Explore models'), icon('arrow'))));
  }

  const panel = (metric: Metric) => {
    const vals = cols.map((x) => ({ ...x, v: metric.value(x.r) }));
    if (!vals.length) return null;
    if (vals.every((x) => x.v === undefined) && metric.key !== 'coding') return null;
    const max = Math.max(...vals.map((x) => x.v ?? 0), 0) || 1;
    const best = vals.filter((x) => x.v !== undefined).reduce<number | undefined>((b, x) => (b === undefined || (metric.higherBetter ? x.v! > b : x.v! < b) ? x.v : b), undefined);
    return h('section', { class: 'panel', 'data-metric': metric.key },
      h('h3', null, metric.label), h('p', { class: 'note' }, metric.hint),
      h('ul', { class: 'mini' }, ...vals.map((x) => {
        const w = x.v === undefined ? 0 : (x.v / max) * 64;
        return h('li', null,
          h('span', { class: 'mn' }, nameOf(x.r)),
          h('div', { class: 'track' },
            x.v === undefined ? h('b', { class: 'val na', style: 'left:0' }, metric.key === 'coding' ? t('원본 미제공', 'Not provided') : t('데이터 없음', 'No data')) : h('i', { class: 'fill', style: `width:${w}%;background:${x.c}` }),
            x.v === undefined ? null : h('b', { class: `val${x.v === best ? ' best' : ''}`, style: `left:calc(${w}% + 8px)` }, metric.fmt(x.v))));
      })));
  };

  const groups = GROUPS.map(([title, keys]) => {
    const panels = keys.map((k) => panel(METRICS[k])).filter(Boolean) as HTMLElement[];
    return panels.length ? h('div', { class: 'group' }, h('h2', null, title), h('div', { class: 'panels' }, ...panels)) : null;
  });

  const metricsAll = GROUPS.flatMap(([, ks]) => ks).map((k) => METRICS[k]);
  const table = h('details', { class: 'twin', open: true },
    h('summary', null, t('표로 보기', 'Table view')),
    h('div', { class: 'scroll' }, h('table', null,
      h('thead', null, h('tr', null, h('th', null, t('지표', 'Metric')), ...cols.map((x) => h('th', { class: 'num' }, h('i', { class: 'sw', style: `background:${x.c}` }), nameOf(x.r))))),
      h('tbody', null,
        h('tr', null, h('td', { title: t('Zero Data Retention 지원 여부', 'Zero data retention support') }, 'ZDR'),
          ...cols.map((x) => h('td', { class: `num zdr${zdrOf(x.r.m) ? ' on' : ' off'}` }, zdrOf(x.r.m) ? t('✓ 지원', '✓ Yes') : t('✕ 미지원', '✕ No')))),
        ...metricsAll.map((metric) => {
        const vs = cols.map((x) => metric.value(x.r));
        if (vs.every((v) => v === undefined) && metric.key !== 'coding') return null;
        const defined = vs.filter((v): v is number => v !== undefined);
        const best = metric.higherBetter ? Math.max(...defined) : Math.min(...defined);
        return h('tr', null, h('td', null, metric.label), ...vs.map((v) => h('td', { class: `num${v === undefined ? ' na' : v === best && defined.length > 1 ? ' best' : ''}` }, v === undefined ? metric.key === 'coding' ? t('원본 미제공', 'Not provided') : '—' : metric.fmt(v))));
      })))));

  return h('main', null,
    pageHeading('SIDE BY SIDE', t('같은 기준으로, 꼼꼼하게 비교하세요', 'Compare on the same footing'), t('모델별 색상으로 차이를 살펴보세요. 별표는 해당 지표에서 가장 좋은 값입니다.', 'Each model keeps its own color. The bold value is the best for that metric.')),
    h('p', { class: 'note' }, `${state.region} · ${state.tier}. ${t('모델마다 고정된 색을 쓰며, 굵은 값이 그 지표의 최고입니다. 단가는 선택한 추론 방식 기준입니다.', 'Each model keeps a fixed color; the bold value is the best for that metric. Prices follow the selected inference modes.')}`),
    chips, adder,
    !cols.length ? emptyState(t('현재 조건에서 비교할 데이터가 없습니다', 'Nothing to compare under these conditions'), t('선택한 모델의 지원 리전과 추론 방식을 확인하고, 상단에서 조건을 바꿔보세요.', 'Check the regions and inference modes the selected models support, and change them at the top.'))
      : unavailable.length ? h('p', { class: 'note' }, `${unavailable.map((m) => m.name).join(', ')}: ${t('현재 리전과 추론 방식에서 비교할 데이터가 없어 차트에서 제외했습니다.', 'left out of the charts because there is no data for the current region and inference modes.')}`) : null,
    codingNotice(picked),
    ...groups, cols.length ? table : null);
}
