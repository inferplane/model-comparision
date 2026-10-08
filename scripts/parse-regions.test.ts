import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseRegionPage } from './parse-regions.ts';

const page = parseRegionPage(readFileSync(new URL('./fixtures/regions-excerpt.md', import.meta.url), 'utf8'));

describe('parseRegionPage', () => {
  it('splits the page into one entry per model card', () => {
    expect(Object.keys(page).sort()).toEqual(['model-card-ai21-labs-jamba-1-5-large', 'model-card-openai-gpt-56-cyber', 'model-card-openai-gpt-6-1-sol']);
  });
  it('separates mantle from runtime in-region and lists global in every region', () => {
    const av = page['model-card-openai-gpt-6-1-sol'].availability;
    expect(av['us-east-1']).toEqual({ mantle: 'i', runtime: 'gG' });
    expect(av['us-east-2']).toEqual({ runtime: 'gG' });
    expect(av['eu-west-1']).toEqual({ runtime: 'G' });
    expect(av['ap-northeast-2']).toEqual({ runtime: 'G' });
  });
  it('treats "Legacy (EOL: …)" cells as supported and keeps the EOL date', () => {
    const jamba = page['model-card-ai21-labs-jamba-1-5-large'];
    expect(jamba.availability['us-east-1']?.runtime).toContain('i');
    expect(jamba.eol['us-east-1']).toBe('2026-11-26');
  });
  it('handles a table without a mantle column', () => {
    expect(page['model-card-openai-gpt-56-cyber'].availability).toEqual({ 'us-east-2': { runtime: 'i' } });
  });
});
