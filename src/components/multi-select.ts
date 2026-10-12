import { h } from '../dom.ts';

export interface MultiSelectOptions {
  /** Stable key; lets the open/closed state survive the full repaint that every state change triggers. */
  id: string;
  label: string;
  /** Summary text when nothing is selected (an empty selection means "everything"). */
  allLabel: string;
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}

let openId: string | null = null;
let listening = false;

function closeAll() {
  openId = null;
  document.querySelectorAll<HTMLDetailsElement>('details.multi[open]').forEach((d) => (d.open = false));
}

/**
 * One set of document listeners for every multi-select: click outside and Escape close the panel.
 * They read the real `open` attribute rather than `openId`, because the details "toggle" event is delivered asynchronously
 * and a quick click-then-Escape would otherwise find nothing to close.
 */
function listen() {
  if (listening) return;
  listening = true;
  document.addEventListener('click', (e) => {
    if (document.querySelector('details.multi[open]') && !(e.target as Element).closest('details.multi')) closeAll();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const summary = document.querySelector<HTMLElement>('details.multi[open] > summary');
    if (!summary) return;
    closeAll();
    summary.focus();
  });
}

/**
 * A dropdown of checkboxes. The views repaint from scratch on every state change, so the open state lives in this module
 * and each checkbox has a unique aria-label, which main.ts uses to put keyboard focus back after the repaint.
 */
export function multiSelect(o: MultiSelectOptions): HTMLElement {
  listen();
  const chosen = new Set(o.selected);
  const details = h('details', { class: `multi${chosen.size ? ' active' : ''}`, 'data-multi': o.id });
  if (openId === o.id) details.open = true;
  details.addEventListener('toggle', () => {
    if (details.open) {
      openId = o.id;
      document.querySelectorAll<HTMLDetailsElement>('details.multi[open]').forEach((d) => d !== details && (d.open = false));
    } else if (openId === o.id) openId = null;
  });

  const clear = h('button', { type: 'button', class: 'text-button', disabled: !chosen.size, onclick: () => o.onChange([]) }, '선택 해제');
  details.append(
    h('summary', { 'aria-label': `${o.label} 필터${chosen.size ? `, ${chosen.size}개 선택` : ''}`, title: chosen.size ? [...chosen].join(', ') : undefined },
      h('span', null, chosen.size ? `${o.label} ${chosen.size}` : o.allLabel)),
    h('div', { class: 'multi-panel', role: 'group', 'aria-label': o.label },
      h('div', { class: 'multi-head' }, h('span', null, `${o.options.length}개 중 ${chosen.size}개`), clear,
        // The panel is a bottom sheet on phones and covers most of the screen, so give it an explicit way out.
        h('button', { type: 'button', class: 'text-button multi-close', onclick: () => { const summary = details.querySelector<HTMLElement>('summary'); closeAll(); summary?.focus(); } }, '닫기')),
      ...o.options.map((name) =>
        h('label', { class: 'multi-option' },
          h('input', { type: 'checkbox', 'aria-label': `${o.label} ${name}`, checked: chosen.has(name),
            onchange: (e: Event) => o.onChange((e.target as HTMLInputElement).checked ? [...chosen, name].sort() : [...chosen].filter((x) => x !== name)) }),
          h('span', null, name)))));
  return details;
}
