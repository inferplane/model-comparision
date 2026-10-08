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
}

const KEY = 'bme-prefs';
const defaults: State = { query: '', region: 'us-east-1', modes: ['in-region', 'geo'], tier: 'standard', provider: '', onlyCache: false, onlyInRegion: true, sort: { key: 'provider', dir: 1 } };

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
