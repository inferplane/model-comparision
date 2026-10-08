import type { Availability } from '../src/types.ts';

/** Parsed block of the "Regional availability by models" page: one table per model card. */
export interface RegionEntry {
  availability: Availability;
  /** Earliest EOL note per region, e.g. "2026-07-30", from cells like "Legacy (EOL: 2026-07-30)". */
  eol: Record<string, string>;
}

const FLAG = { 'in-region': 'i', geo: 'g', global: 'G' } as const;
const REGION = /^([a-z]{2}(?:-[a-z]+)+-\d)/;

function cells(line: string): string[] {
  return line.replace(/^\||\|\s*$/g, '').split('|').map((c) => c.trim());
}

/**
 * The page lists every model with one table: Region × (In-Region bedrock-mantle | In-Region bedrock-runtime | Geo | Global).
 * It is the single source that enumerates global availability per region, which individual cards omit when they use a scope table.
 */
export function parseRegionPage(md: string): Record<string, RegionEntry> {
  const out: Record<string, RegionEntry> = {};
  const marks = [...md.matchAll(/\*\*\[[^\]]+\]\((model-card-[a-z0-9.-]+)\.md\)\*\*/g)];
  marks.forEach((mark, n) => {
    const block = md.slice(mark.index! + mark[0].length, marks[n + 1]?.index ?? md.length);
    const lines = block.split('\n').filter((l) => l.startsWith('|'));
    if (lines.length < 3) return;
    const header = cells(lines[0]).map((h) => h.replace(/\*/g, ''));
    const cols = header.map((h) => {
      const m = /(in-region|geo|global)\s*\(\s*`?bedrock-(runtime|mantle)`?\s*\)/i.exec(h);
      return m ? { flag: FLAG[m[1].toLowerCase() as keyof typeof FLAG], key: m[2].toLowerCase() as 'runtime' | 'mantle' } : undefined;
    });
    const entry: RegionEntry = { availability: {}, eol: {} };
    for (const line of lines.slice(2)) {
      const row = cells(line);
      const region = REGION.exec(row[0])?.[1];
      if (!region) continue;
      cols.forEach((col, i) => {
        const cell = row[i] ?? '';
        if (!col || !cell || cell.includes('icon-no') || /not supported|^n\/a$|^—$|^-$/i.test(cell)) return;
        // An icon-yes, or text such as "Legacy (EOL: 2026-07-30)": the option works in this region.
        const av = ((entry.availability[region] ??= {})[col.key] ??= '');
        if (!av.includes(col.flag)) entry.availability[region]![col.key] = av + col.flag;
        const eol = /EOL:\s*(\d{4}-\d{2}-\d{2})/.exec(cell)?.[1];
        if (eol && (!entry.eol[region] || eol < entry.eol[region])) entry.eol[region] = eol;
      });
    }
    if (Object.keys(entry.availability).length) out[mark[1]] = entry;
  });
  return out;
}
