import { h } from '../dom.ts';
import { allRegions, matches } from '../data.ts';
import { state, update } from '../state.ts';
import type { Model } from '../types.ts';

export function renderHeader(models: Model[], generatedAt: string): HTMLElement {
  const input = h('input', { type: 'search', id: 'q', placeholder: '모델·제공사 검색  ( / )', autocomplete: 'off', 'aria-label': '모델 검색', value: state.query });
  const results = h('ul', { class: 'suggest', role: 'listbox', hidden: true });
  let active = -1;

  const close = () => {
    results.hidden = true;
    active = -1;
  };
  const paint = () => {
    results.replaceChildren();
    const q = input.value.trim();
    // On the list view the table already filters live, so suggestions would only cover it.
    const onList = location.hash === '' || location.hash === '#/';
    if (!q || onList) return close();
    const hits = models.filter((m) => matches(m, q)).slice(0, 8);
    hits.forEach((m, i) =>
      results.append(
        h('li', { role: 'option', class: i === active ? 'on' : '', 'aria-selected': i === active },
          h('a', { href: `#/model/${m.id}`, onclick: close }, h('strong', null, m.name), h('span', null, m.provider))),
      ),
    );
    results.hidden = hits.length === 0;
  };
  input.addEventListener('input', () => {
    active = -1;
    update({ query: input.value });
    paint();
  });
  input.addEventListener('keydown', (e) => {
    const items = [...results.querySelectorAll('a')];
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      active = (active + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % Math.max(items.length, 1);
      paint();
    } else if (e.key === 'Enter' && active >= 0) items[active]?.click();
    else if (e.key === 'Escape') close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== input && !(document.activeElement instanceof HTMLInputElement) && !(document.activeElement instanceof HTMLSelectElement)) {
      e.preventDefault();
      input.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('.search')) close();
  });

  const region = h('select', { 'aria-label': '리전', onchange: (e: Event) => update({ region: (e.target as HTMLSelectElement).value }) },
    ...allRegions(models).map((r) => h('option', { value: r, selected: r === state.region }, r)));
  const scope = h('select', { 'aria-label': '추론 범위', onchange: (e: Event) => update({ scope: (e.target as HTMLSelectElement).value as 'regional' | 'global' }) },
    h('option', { value: 'regional', selected: state.scope === 'regional' }, 'In-region / Geo(US) CRIS'),
    h('option', { value: 'global', selected: state.scope === 'global' }, 'Global CRIS'));
  const theme = h('button', { class: 'icon', type: 'button', 'aria-label': '테마 전환', title: '테마 전환', onclick: () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('bme-theme', next); } catch { /* ignore */ }
  } }, '◐');

  return h('header', { class: 'top' },
    h('a', { class: 'brand', href: '#/' }, 'Bedrock ', h('b', null, 'Model Explorer')),
    h('div', { class: 'search' }, input, results),
    h('div', { class: 'ctrls' }, region, scope, theme),
    h('div', { class: 'stamp' }, `가격 기준 ${generatedAt.slice(0, 10)}`),
  );
}
