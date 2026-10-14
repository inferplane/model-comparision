import { h, s } from '../dom.ts';
import { t } from '../i18n.ts';

const PATHS = {
  layers: ['m12 3 9 5-9 5-9-5 9-5Z', 'm3 12 9 5 9-5', 'm3 16 9 5 9-5'],
  search: ['m21 21-4.5-4.5', 'M19 10.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0'],
  table: ['M3 3h18v18H3z', 'M3 9h18', 'M9 9v12'],
  rank: ['M5 20V10', 'M12 20V4', 'M19 20v-6'],
  chart: ['M3 3v18h18', 'm7 14 4-4 4 3 5-8'],
  compare: ['M8 3v18', 'M16 3v18', 'M3 7h10', 'M11 17h10'],
  globe: ['M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0', 'M3 12h18', 'M12 3c5 5 5 13 0 18-5-5-5-13 0-18'],
  link: ['m10 13 4-4', 'M8 16H6a4 4 0 0 1 0-8h4', 'M14 8h4a4 4 0 0 1 0 8h-4'],
  sun: ['M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0', 'M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5'],
  moon: ['M20 15.5A9 9 0 0 1 8.5 4 9 9 0 1 0 20 15.5Z'],
  check: ['m5 12 4 4L19 6'],
  arrow: ['M5 12h14', 'm13 6 6 6-6 6'],
  close: ['m6 6 12 12', 'M6 18 18 6'],
  filter: ['M4 7h16M7 12h10m-7 5h4'],
  reset: ['M3 10a9 9 0 1 1 2 9', 'M3 4v6h6'],
  coins: ['M20 7c0 2-4 3-8 3S4 9 4 7s4-3 8-3 8 1 8 3Z', 'M4 7v5c0 2 4 3 8 3s8-1 8-3V7', 'M4 12v5c0 2 4 3 8 3s8-1 8-3v-5'],
  context: ['M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5', 'M8 8h8v8H8z'],
  history: ['M3 12a9 9 0 1 0 3-6.7', 'M3 4v5h5', 'M12 7v5l3 2'],
  info: ['M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0', 'M12 11v6', 'M12 7v.01'],
  copy: ['M9 9h11v11H9z', 'M5 15H4V4h11v1'],
} as const;

export type IconName = keyof typeof PATHS;

export function icon(name: IconName, className = ''): SVGElement {
  return s('svg', { viewBox: '0 0 24 24', width: 20, height: 20, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true', class: `ui-icon ${className}` },
    ...PATHS[name].map((d) => s('path', { d })));
}

export function pageHeading(eyebrow: string, title: string, description: string): HTMLElement {
  return h('div', { class: 'page-heading' },
    h('span', { class: 'eyebrow' }, eyebrow),
    h('h1', { class: 'chart-title' }, title),
    h('p', { class: 'page-description' }, description));
}

/** Live region shared by every copy button, so screen readers hear the confirmation even though views repaint. */
let copyStatus: HTMLElement | undefined;
let statusTimer: ReturnType<typeof setTimeout> | undefined;

/** Icon button that copies `text`, flashing a check mark. Falls back to a prompt where the clipboard API is blocked. */
export function copyButton(text: string, label: string, className = 'copy-btn'): HTMLElement {
  if (!copyStatus) {
    copyStatus = h('span', { class: 'sr-only', role: 'status' });
    document.body.append(copyStatus);
  }
  const status = copyStatus;
  let timer: ReturnType<typeof setTimeout>;
  const btn = h('button', { type: 'button', class: className, 'aria-label': label, title: `${t('복사', 'Copy')}: ${text}`, onclick: async (e: Event) => {
    // Rows and cards are often links or toggles themselves; a copy must not also trigger them.
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      btn.replaceChildren(icon('check'));
      btn.classList.add('done');
      status.textContent = t(`${text} 복사됨`, `Copied ${text}`);
      // One timer for the shared live region, so an earlier button's timeout can't blank a later confirmation.
      clearTimeout(statusTimer);
      statusTimer = setTimeout(() => { status.textContent = ''; }, 1500);
      clearTimeout(timer);
      timer = setTimeout(() => { btn.replaceChildren(icon('copy')); btn.classList.remove('done'); }, 1500);
    } catch {
      window.prompt(t('이 ID를 복사하세요', 'Copy this ID'), text);
    }
  } }, icon('copy'));
  return btn;
}

export function emptyState(title: string, description: string, action?: HTMLElement): HTMLElement {
  return h('div', { class: 'empty-state' },
    h('span', { class: 'empty-icon' }, icon('search')),
    h('h2', null, title), h('p', null, description), action);
}
