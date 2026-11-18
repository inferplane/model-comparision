import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { expect, it } from 'vitest';

it('records the net daily change after another addition, a reversal and a no-op refresh', () => {
  const dir = mkdtempSync(join(tmpdir(), 'daily-changes-'));
  const date = new Date().toISOString().slice(0, 10);
  const write = (day: string, ids: string[]) => writeFileSync(join(dir, 'public/data/models.json'), JSON.stringify({
    generatedAt: day + 'T01:00:00Z',
    models: ids.map((id) => ({ id, name: id, provider: 'OpenAI', pricing: {}, regions: [], firstSeen: day })),
  }));
  const git = (...args: string[]) => execFileSync('git', args, { cwd: dir, stdio: 'pipe' });
  const commit = () => { git('add', 'public'); git('-c', 'user.name=test', '-c', 'user.email=test@example.com', 'commit', '-qm', 'snapshot'); };
  const diff = () => execFileSync(process.execPath, ['--import', pathToFileURL(createRequire(import.meta.url).resolve('tsx')).href,
    fileURLToPath(new URL('./diff-data.ts', import.meta.url))], { cwd: dir, stdio: 'pipe' });
  try {
    git('init', '-q');
    mkdirSync(join(dir, 'public/data'), { recursive: true });
    write('2020-01-01', ['base']); commit();
    write(date, ['base', 'astra', 'temporary']); diff(); commit();
    write(date, ['base', 'astra', 'sol']); diff(); commit();
    diff();
    const { entries } = JSON.parse(readFileSync(join(dir, 'public/data/changes.json'), 'utf8'));
    expect(entries).toHaveLength(1);
    expect(entries[0].added.map((m: { id: string }) => m.id)).toEqual(['astra', 'sol']);
    expect(entries[0].removed).toEqual([]);
    expect(readFileSync(join(dir, 'public/ai/changes.md'), 'utf8')).toContain('astra');
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
