import type { Model } from './types.ts';

/** A missing composite Coding Index stays missing even when individual coding benchmarks exist. */
export function codingIndexOf(model: Model): number | undefined {
  const value = model.benchmarks?.codingIndex;
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : undefined;
}

/** SciCode is its own scientific-programming pass rate, stored as a fraction. */
export function scienceCodingPercent(model: Model): number | undefined {
  const value = model.benchmarks?.scicode;
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1 ? value * 100 : undefined;
}
