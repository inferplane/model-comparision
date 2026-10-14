import { h } from '../dom.ts';
import { allRegions, matches, MODE_LABEL, MODES } from '../data.ts';
import { currentUrl, state, subscribe, update } from '../state.ts';
import type { Model } from '../types.ts';
import { icon, type IconName } from './ui.ts';
import { lang, setLang, t } from '../i18n.ts';

export function renderHeader(models: Model[], generatedAt: string): HTMLElement {
  const input = h('input', { type: 'search', id: 'q', placeholder: t('모델 이름이나 제공사로 검색', 'Search by model or provider'), autocomplete: 'off', 'aria-label': t('모델 검색', 'Search models'), value: state.query, 'aria-controls': 'search-results', 'aria-expanded': false });
  const results = h('ul', { id: 'search-results', class: 'suggest', role: 'listbox', 'aria-label': t('모델 검색 결과', 'Model search results'), hidden: true });
  let active = -1;

  const close = () => {
    results.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    active = -1;
  };
  const paint = () => {
    results.replaceChildren();
    const q = input.value.trim();
    if (!q || !location.hash.startsWith('#/model/')) return close();
    const hits = models.filter((m) => matches(m, q)).slice(0, 8);
    hits.forEach((m, i) => results.append(
      h('li', { id: `search-option-${i}`, role: 'option', class: i === active ? 'on' : '', 'aria-selected': i === active },
        h('a', { href: `#/model/${m.id}`, onclick: close }, h('strong', null, m.name), h('span', null, m.provider))),
    ));
    results.hidden = hits.length === 0;
    input.setAttribute('aria-expanded', String(hits.length > 0));
    if (active >= 0) input.setAttribute('aria-activedescendant', `search-option-${active}`);
    else input.removeAttribute('aria-activedescendant');
  };
  input.addEventListener('input', () => {
    active = -1;
    update({ query: input.value });
    paint();
  });
  input.addEventListener('focus', paint);
  input.addEventListener('keydown', (e) => {
    const items = [...results.querySelectorAll('a')];
    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && items.length) {
      e.preventDefault();
      active = active < 0 ? (e.key === 'ArrowDown' ? 0 : items.length - 1) : (active + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
      paint();
    } else if (e.key === 'Enter' && active >= 0) items[active]?.click();
    else if (e.key === 'Escape') close();
  });
  document.addEventListener('keydown', (e) => {
    const el = document.activeElement;
    if (e.key === '/' && !(el instanceof HTMLInputElement) && !(el instanceof HTMLSelectElement) && !(el instanceof HTMLTextAreaElement) && !(el instanceof HTMLElement && el.isContentEditable) && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      input.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (!(e.target as Element).closest('.search')) close();
  });
  window.addEventListener('hashchange', close);

  const region = h('select', { id: 'region', 'aria-label': t('리전', 'Region'), onchange: (e: Event) => update({ region: (e.target as HTMLSelectElement).value }) },
    ...allRegions(models).map((r) => h('option', { value: r, selected: r === state.region }, r)));
  const modes = h('div', { class: 'chips', role: 'group', 'aria-label': t('추론 방식', 'Inference mode') },
    ...MODES.map((mode) =>
      h('button', { type: 'button', class: 'chip', 'aria-pressed': state.modes.includes(mode), onclick: () => {
        const next = state.modes.includes(mode) ? state.modes.filter((x) => x !== mode) : MODES.filter((x) => x === mode || state.modes.includes(x));
        if (next.length) update({ modes: next });
      } }, MODE_LABEL[mode])));
  subscribe(() => {
    if (input.value !== state.query) input.value = state.query;
    region.value = state.region;
    modes.querySelectorAll('button').forEach((btn, i) => btn.setAttribute('aria-pressed', String(state.modes.includes(MODES[i]))));
  });

  const announcement = h('span', { class: 'sr-only', role: 'status' });
  let shareTimer: ReturnType<typeof setTimeout>;
  const share = h('button', { class: 'icon', type: 'button', 'aria-label': t('현재 필터가 담긴 링크 복사', 'Copy a link with the current filters'), title: t('현재 화면 링크 복사', 'Copy link to this view'), onclick: async () => {
    try {
      await navigator.clipboard.writeText(currentUrl());
      share.replaceChildren(icon('check'));
      announcement.textContent = t('현재 화면의 링크를 복사했습니다.', 'Link to this view copied.');
      clearTimeout(shareTimer);
      shareTimer = setTimeout(() => { share.replaceChildren(icon('link')); announcement.textContent = ''; }, 1800);
    } catch {
      window.prompt(t('이 링크를 복사하세요', 'Copy this link'), currentUrl());
    }
  } }, icon('link'));
  const dark = () => document.documentElement.dataset.theme
    ? document.documentElement.dataset.theme === 'dark'
    : window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = h('button', { class: 'icon', type: 'button', onclick: () => {
    const next = dark() ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('bme-theme', next); } catch { /* ignore */ }
    markTheme();
  } });
  const markTheme = () => {
    const label = dark() ? t('라이트 모드로 전환', 'Switch to light mode') : t('다크 모드로 전환', 'Switch to dark mode');
    theme.setAttribute('aria-label', label);
    theme.title = label;
    theme.replaceChildren(icon(dark() ? 'sun' : 'moon'));
  };
  markTheme();
  // Shows the language it switches to, each written in its own language, so either reader can find it.
  const language = h('button', { class: 'icon lang-toggle', type: 'button', lang: lang === 'ko' ? 'en' : 'ko',
    'aria-label': lang === 'ko' ? 'Switch to English' : '한국어로 보기', title: lang === 'ko' ? 'English' : '한국어',
    onclick: () => { currentUrl(); setLang(lang === 'ko' ? 'en' : 'ko'); } }, lang === 'ko' ? 'EN' : 'KO');
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', markTheme);

  const compareCount = h('span', { class: 'nav-count', hidden: !state.compare.length }, String(state.compare.length));
  subscribe(() => { compareCount.hidden = !state.compare.length; compareCount.textContent = String(state.compare.length); });
  const navItems: [string, IconName, string, string][] = [
    ['#/', 'table', t('모델 탐색', 'Explore'), 'table'], ['#/rank', 'rank', t('모델 순위', 'Rankings'), 'rank'],
    ['#/chart', 'chart', t('성능 대비 비용', 'Cost vs. performance'), 'chart'], ['#/compare', 'compare', t('모델 비교', 'Compare'), 'compare'],
    ['#/changes', 'history', t('변경 내역', 'Changes'), 'changes'],
  ];
  const nav = h('nav', { class: 'nav', 'aria-label': t('보기', 'Views') },
    ...navItems.map(([href, glyph, label, view]) => h('a', { href, 'data-view': view }, icon(glyph), label, view === 'compare' ? compareCount : null)));
  const markNav = () => {
    const hash = location.hash.replace(/^#\//, '');
    const view = hash.startsWith('model/') ? '' : ['chart', 'rank', 'compare', 'changes'].includes(hash) ? hash : 'table';
    nav.querySelectorAll('a').forEach((a) => (a.dataset.view === view ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current')));
    // On narrow screens the nav scrolls sideways; keep the current view's tab in sight.
    nav.querySelector<HTMLElement>('a[aria-current="page"]')?.scrollIntoView({ inline: 'center', block: 'nearest' });
  };
  markNav();
  window.addEventListener('hashchange', markNav);

  return h('header', { class: 'top' },
    h('div', { class: 'header-main' },
      h('a', { class: 'brand', href: '#/', 'aria-label': t('Bedrock Model Explorer 홈', 'Bedrock Model Explorer home') },
        h('span', { class: 'brand-mark' }, icon('layers')),
        h('span', { class: 'brand-text' }, h('strong', null, 'Bedrock'), h('span', null, 'Model Explorer'))),
      nav,
      h('div', { class: 'header-actions' },
        h('span', { class: 'stamp', title: t('데이터의 마지막 갱신 날짜', 'When the data was last refreshed') }, h('i', { class: 'status-dot' }), h('span', null, t('데이터 업데이트 ', 'Data updated '), h('time', { datetime: generatedAt }, generatedAt.slice(0, 10)))),
        share, language, theme, announcement)),
    h('div', { class: 'header-tools' },
      h('div', { class: 'search' }, icon('search'), input, h('kbd', null, '/'), results),
      h('div', { class: 'ctrls' },
        h('label', { class: 'region-control', for: 'region' }, icon('globe'), h('span', null, t('리전', 'Region')), region),
        h('div', { class: 'mode-control' }, h('span', { class: 'control-label' }, t('추론 방식', 'Inference mode')), modes))),
  );
}
