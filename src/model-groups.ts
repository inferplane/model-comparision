import type { Row } from './data.ts';
import type { Model } from './types.ts';

export interface ModelGroup {
  m: Model;
  rows: Row[];
}

/** Group only the already filtered variants; each price keeps its original scope and invocation ID. */
export function groupModelRows(rows: Row[]): ModelGroup[] {
  const groups = new Map<string, ModelGroup>();
  for (const row of rows) {
    const group = groups.get(row.m.id);
    if (group) group.rows.push(row);
    else groups.set(row.m.id, { m: row.m, rows: [row] });
  }
  return [...groups.values()];
}

/** Price sorts compare the lowest available price among the selected scopes. Shared metrics have the same value in each scope. */
export function groupSortValue(group: ModelGroup, value: (row: Row) => string | number | undefined): string | number | undefined {
  const values = group.rows.map(value).filter((v) => v !== undefined);
  if (values.every((v) => typeof v === 'number')) return values.length ? Math.min(...values as number[]) : undefined;
  if (values.every((v) => v === values[0])) return values[0];
  return values.join(' · ');
}
