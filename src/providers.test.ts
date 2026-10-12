import { describe, expect, it } from 'vitest';
import { providerSelected } from './data.ts';

describe('providerSelected', () => {
  it('treats an empty or missing selection as every provider', () => {
    expect(providerSelected([], 'OpenAI')).toBe(true);
    expect(providerSelected(undefined, 'OpenAI')).toBe(true);
  });
  it('matches any of several providers and nothing else', () => {
    expect(providerSelected(['Anthropic', 'OpenAI'], 'OpenAI')).toBe(true);
    expect(providerSelected(['Anthropic', 'OpenAI'], 'Meta')).toBe(false);
  });
});
