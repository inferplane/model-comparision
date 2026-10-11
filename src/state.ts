import type { Mode, Tier } from './types.ts';
import { parseParams, sanitizeStored, serializeParams } from './urlstate.ts';
import type { ValueOrder, ValueQuality } from './value.ts';

export interface State {
  query: string;
  region: string;
  modes: Mode[];
  tier: Tier;
  provider: string;
  onlyCache: boolean;
  onlyInRegion: boolean;
  sort: { key: string; dir: 1 | -1 };
  chartY: string;
  rankMetric: string;
  rankTop: number;
  weights: '' | 'open' | 'closed';
  reasoning: '' | 'yes' | 'no';
  compare: string[];
  expandCols: boolean;
  chartX: 'blend' | 'input' | 'output';
  chartQuality: ValueQuality;
  chartBudget: number;
  chartOrder: ValueOrder;
  chartLatest: boolean;
}

const KEY = 'bme-prefs';
const defaults: State = { query: '', region: 'us-east-1', modes: ['in-region', 'geo'], tier: 'standard', provider: '', onlyCache: false, onlyInRegion: true, sort: { key: 'provider', dir: 1 }, chartY: 'intelligenceIndex', chartX: 'blend', chartQuality: 'balanced', chartBudget: 0, chartOrder: 'value', chartLatest: false, rankMetric: 'intelligence', rankTop: 20, weights: '', reasoning: '', compare: [], expandCols: false };

function load(): State {
  // A shared link reproduces its view exactly: when the URL carries any filter, personal saved preferences are ignored,
  // otherwise a viewer's own leftovers (say "cache only") would leak into someone else's link.
  const fromUrl = parseParams(typeof location === 'undefined' ? '' : location.search);
  if (Object.keys(fromUrl).length) return { ...defaults, ...fromUrl };
  try {
    return sanitizeStored(JSON.parse(localStorage.getItem(KEY) ?? '{}'), defaults);
  } catch {
    return { ...defaults };
  }
}

export const state: State = load();
export const DEFAULT_REGION = defaults.region;
const listeners = new Set<() => void>();

/** Mirror the filter state into ?query=... without adding history entries; the #/route part is left alone. */
function syncUrl() {
  if (typeof history === 'undefined') return;
  const qs = serializeParams(state, defaults);
  const next = `${location.pathname}${qs ? `?${qs}` : ''}${location.hash}`;
  if (next !== `${location.pathname}${location.search}${location.hash}`) history.replaceState(null, '', next);
}

let urlTimer: ReturnType<typeof setTimeout> | undefined;

/** The current URL with the latest filters applied immediately (used when copying a link, so a pending debounced update isn't lost). */
export function currentUrl(): string {
  clearTimeout(urlTimer);
  syncUrl();
  return location.href;
}

export function update(patch: Partial<State>) {
  Object.assign(state, patch);
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...state, query: '' }));
  } catch {
    /* storage can be blocked; preferences just won't persist */
  }
  // Typing in the search box fires this per keystroke and some browsers cap history.replaceState calls, so batch the URL write.
  clearTimeout(urlTimer);
  urlTimer = setTimeout(syncUrl, 200);
  listeners.forEach((fn) => fn());
}
export const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const MAX_COMPARE = 6;

/** Add or remove a model from the comparison set; the set is capped so each model keeps its own series color. */
export function toggleCompare(id: string) {
  const on = state.compare.includes(id);
  if (!on && state.compare.length >= MAX_COMPARE) return;
  update({ compare: on ? state.compare.filter((x) => x !== id) : [...state.compare, id] });
}

// A page opened from a link keeps that link's params as-is; a plain visit gets its saved preferences reflected in the URL too.
syncUrl();
