import { h } from '../dom.ts';
import { MAX_COMPARE, state, subscribe, toggleCompare, update } from '../state.ts';
import type { Model } from '../types.ts';
import { icon } from './ui.ts';
import { t } from '../i18n.ts';

export function renderCompareDock(models: Model[]): HTMLElement {
  const dock = h('aside', { class: 'compare-dock', 'aria-label': t('선택한 모델 비교', 'Selected models for comparison'), hidden: true });
  const byId = new Map(models.map((m) => [m.id, m]));
  const count = h('span', { class: 'sr-only', role: 'status' });
  const paint = () => {
    const active = document.activeElement;
    const focusLabel = active instanceof HTMLElement && dock.contains(active) ? active.getAttribute('aria-label') : null;
    const picked = state.compare.flatMap((id) => byId.has(id) ? [byId.get(id)!] : []);
    dock.hidden = !picked.length || location.hash === '#/compare';
    document.body.classList.toggle('has-compare-dock', !dock.hidden);
    count.textContent = picked.length ? t(`${picked.length}개 모델을 비교에 선택했습니다. 최대 ${MAX_COMPARE}개까지 선택할 수 있습니다.`, `${picked.length} models selected for comparison. Up to ${MAX_COMPARE} can be selected.`) : '';
    dock.replaceChildren(
      h('div', { class: 'dock-label' }, icon('compare'), h('strong', null, t('모델 비교', 'Compare')), h('span', { class: 'nav-count' }, `${picked.length}/${MAX_COMPARE}`)),
      h('div', { class: 'dock-models' }, ...picked.map((m) => h('span', { class: 'dock-pick' }, h('span', null, m.name),
        h('button', { type: 'button', 'aria-label': t(`${m.name} 비교에서 제거`, `Remove ${m.name} from comparison`), onclick: () => toggleCompare(m.id) }, icon('close'))))),
      h('button', { type: 'button', class: 'text-button dock-clear', onclick: () => update({ compare: [] }) }, t('선택 해제', 'Clear')),
      h('a', { class: 'button primary', href: '#/compare', 'aria-label': t('선택한 모델 비교하기', 'Compare selected models') }, t('비교하기', 'Compare'), icon('arrow')),
    );
    if (focusLabel && !dock.hidden) {
      const target = [...dock.querySelectorAll<HTMLElement>('[aria-label]')].find((el) => el.getAttribute('aria-label') === focusLabel)
        ?? dock.querySelector<HTMLElement>('.dock-pick button, .button');
      target?.focus({ preventScroll: true });
    } else if (focusLabel && dock.hidden) document.querySelector<HTMLElement>('.nav a[data-view="compare"]')?.focus({ preventScroll: true });
  };
  subscribe(paint);
  window.addEventListener('hashchange', paint);
  paint();
  return h('div', null, count, dock);
}
