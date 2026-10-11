import { execFileSync } from 'node:child_process';
import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import type { Model } from '../src/types.ts';
import { changesMarkdown, commitMessage, computeChanges, needsReview, sanityGuard, type Changes } from './data-changes.ts';

/**
 * Compares the freshly built public/data/models.json with the previous one and records what moved: new/removed models, price and
 * availability changes. Also stops the run when the change looks like a broken source rather than real news.
 */
const readModels = (json: string) => (JSON.parse(json) as { models: Model[] }).models;

function previous(): Model[] | undefined {
  // CI copies the committed file here before refreshing; locally fall back to what git has.
  if (existsSync('data/raw/models.prev.json')) return readModels(readFileSync('data/raw/models.prev.json', 'utf8'));
  try {
    return readModels(execFileSync('git', ['show', 'HEAD:public/data/models.json'], { encoding: 'utf8', maxBuffer: 64 << 20, stdio: ['ignore', 'pipe', 'ignore'] }));
  } catch {
    return undefined;
  }
}

const next = readModels(readFileSync('public/data/models.json', 'utf8'));
const prev = previous();
const date = new Date().toISOString().slice(0, 10);
const summary = (text: string) => process.env.GITHUB_STEP_SUMMARY && appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${text}\n`);

const empty: Changes = { added: [], removed: [], priceChanges: [], availabilityChanges: [] };
const changes = prev ? computeChanges(prev, next) : empty;
const guard = prev ? sanityGuard(changes, prev.length) : { ok: true };

if (!guard.ok && process.env.ALLOW_BIG_CHANGE !== '1') {
  const msg = `Refusing to publish: ${guard.reason}. This usually means a source page changed or a parser broke. Re-run with ALLOW_BIG_CHANGE=1 (workflow_dispatch input) once checked.`;
  console.error(msg);
  summary(`## ⚠️ Data refresh blocked\n\n${msg}\n\n${changesMarkdown(changes, date, 15)}`);
  process.exit(3);
}

// Rolling history: keep a day's entry only if something moved, and the last 90 days.
interface Entry extends Changes {
  date: string;
}
const historyPath = 'public/data/changes.json';
const old: Entry[] = existsSync(historyPath) ? (JSON.parse(readFileSync(historyPath, 'utf8')) as { entries: Entry[] }).entries : [];
const moved = changes.added.length + changes.removed.length + changes.priceChanges.length + changes.availabilityChanges.length > 0;
const cutoff = new Date(Date.now() - 90 * 86_400_000).toISOString().slice(0, 10);
const entries = [...old.filter((e) => e.date !== date && e.date >= cutoff), ...(moved ? [{ date, ...changes }] : [])].sort((a, b) => b.date.localeCompare(a.date));
await writeFile(historyPath, JSON.stringify({ updatedAt: new Date().toISOString(), entries }));

await mkdir('public/ai', { recursive: true });
await writeFile(
  'public/ai/changes.md',
  `# Recent changes to the Bedrock model data\n\nNew and removed models, price changes (Standard tier, input/output/cache read), and changes in how many Regions offer In-region / Geo / Global CRIS. Newest first. Only days where something changed are listed. Updated ${date}.\n\n${entries.filter((e) => e.date >= new Date(Date.now() - 30 * 86_400_000).toISOString().slice(0, 10)).map((e) => changesMarkdown(e, e.date)).join('\n') || 'No changes in the last 30 days.\n'}`,
);

await mkdir('data/raw', { recursive: true });
await writeFile('data/raw/commit-msg.txt', `${commitMessage(changes)}\n`);

// New models the automatic matching could not fully cover become a GitHub issue (the workflow opens/updates/closes it).
const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString().slice(0, 10);
const recentIds = new Set(entries.filter((e) => e.date >= weekAgo).flatMap((e) => e.added.map((m) => m.id)));
const reviews = needsReview(next, recentIds, next.some((m) => m.benchmarks));
if (reviews.length) {
  const body = `최근 7일 안에 처음 발견된 모델 중 자동 매칭이 끝나지 않은 항목입니다. 값은 이미 사이트에 반영되어 있으며, 아래를 채우면 더 정확해집니다. 처리되면 다음 실행에서 자동으로 이 이슈가 닫힙니다.\n\n${reviews.map((r) => `### ${r.model.name} (${r.model.provider})\n${r.todo.map((t) => `- ${t}`).join('\n')}`).join('\n\n')}\n`;
  await writeFile('data/raw/review.md', body);
} else {
  await rm('data/raw/review.md', { force: true });
}

console.log(`${commitMessage(changes)} | review items: ${reviews.length} | history entries: ${entries.length}${prev ? '' : ' | no previous data to compare'}`);
summary(`## Data changes (${date})\n\n${changesMarkdown(changes, date)}${reviews.length ? `\n### Needs review\n${reviews.map((r) => `- **${r.model.name}**: ${r.todo.join('; ')}`).join('\n')}\n` : ''}`);
