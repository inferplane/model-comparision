import { h } from './dom.ts';
import { NO_CHANGES, parseChanges, type ChangesFile } from './changes.ts';

/** Fetch the daily change history. It is optional: a missing or broken file must never stop the app from loading. */
export async function loadChanges(): Promise<ChangesFile> {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}data/changes.json`);
    return res.ok ? parseChanges(await res.json()) : NO_CHANGES;
  } catch {
    return NO_CHANGES;
  }
}

let added = new Map<string, string>();

/** model id -> day the pipeline first saw it, for models added in the last two weeks. Set once at startup. */
export function setRecentlyAdded(map: Map<string, string>) {
  added = map;
}

export const addedOn = (id: string): string | undefined => added.get(id);

/** "NEW" marker for a model the daily check added recently, or null. */
export function newBadge(id: string): HTMLElement | null {
  const day = added.get(id);
  return day ? h('em', { class: 'badge new', title: `이 사이트가 ${day}에 Bedrock 목록에서 처음 감지한 모델입니다 (AWS 출시일과는 다를 수 있음)` }, 'NEW') : null;
}
