import type { Mode, Tier } from './types.ts';

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
}

const KEY = 'bme-prefs';
const defaults: State = { query: '', region: 'us-east-1', modes: ['in-region', 'geo'], tier: 'standard', provider: '', onlyCache: false, onlyInRegion: true, sort: { key: 'provider', dir: 1 }, chartY: 'intelligenceIndex', chartX: 'blend', rankMetric: 'intelligence', rankTop: 20, weights: '', reasoning: '', compare: [], expandCols: false };

function load(): State {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? '{}');
    return { ...defaults, ...saved, query: '' };
  } catch {
    return { ...defaults };
  }
}

export const state: State = load();
const listeners = new Set<() => void>();

export function update(patch: Partial<State>) {
  Object.assign(state, patch);
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage can be blocked; preferences just won't persist */
  }
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
