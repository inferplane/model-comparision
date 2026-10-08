import { blended, longPriceOf, priceOf, tokens, usd, type Row } from './data.ts';
import { state } from './state.ts';
import type { BenchmarkScores } from './types.ts';

export interface Metric {
  key: string;
  label: string;
  /** Short unit/explanation shown under the chart title. */
  hint: string;
  higherBetter: boolean;
  value: (r: Row) => number | undefined;
  fmt: (v: number) => string;
}

const score = (k: keyof BenchmarkScores, pct = false) => (r: Row) => {
  const v = r.m.benchmarks?.[k];
  return v === undefined ? undefined : pct ? v * 100 : v;
};
/** Speed and latency come back as 0 when AA has no measurement, which would otherwise win every "fastest" ranking. */
const positive = (k: keyof BenchmarkScores) => (r: Row) => {
  const v = r.m.benchmarks?.[k];
  return v !== undefined && v > 0 ? v : undefined;
};
const one = (v: number) => v.toFixed(1);
const percent = (v: number) => `${v.toFixed(1)}%`;
const price = (kind: Parameters<typeof priceOf>[4]) => (r: Row) => priceOf(r.m, state.region, r.scope, state.tier, kind);

export const METRICS: Record<string, Metric> = {
  intelligence: { key: 'intelligence', label: 'Intelligence Index', hint: 'Artificial Analysis 종합 지수 (높을수록 좋음)', higherBetter: true, value: score('intelligenceIndex'), fmt: one },
  coding: { key: 'coding', label: 'Coding Index', hint: 'Artificial Analysis 코딩 지수', higherBetter: true, value: score('codingIndex'), fmt: one },
  math: { key: 'math', label: 'Math Index', hint: 'Artificial Analysis 수학 지수', higherBetter: true, value: score('mathIndex'), fmt: one },
  gpqa: { key: 'gpqa', label: 'GPQA Diamond', hint: '대학원 수준 과학 문제 정답률', higherBetter: true, value: score('gpqa', true), fmt: percent },
  hle: { key: 'hle', label: "Humanity's Last Exam", hint: '전문가 수준 종합 문제 정답률', higherBetter: true, value: score('hle', true), fmt: percent },
  mmluPro: { key: 'mmluPro', label: 'MMLU-Pro', hint: '다분야 지식 정답률', higherBetter: true, value: score('mmluPro', true), fmt: percent },
  liveCodeBench: { key: 'liveCodeBench', label: 'LiveCodeBench', hint: '코딩 문제 통과율', higherBetter: true, value: score('liveCodeBench', true), fmt: percent },
  scicode: { key: 'scicode', label: 'SciCode', hint: '과학 코딩 통과율', higherBetter: true, value: score('scicode', true), fmt: percent },
  aime: { key: 'aime', label: 'AIME', hint: '수학 올림피아드 정답률', higherBetter: true, value: score('aime', true), fmt: percent },
  speed: { key: 'speed', label: '출력 속도', hint: '초당 출력 토큰 (Artificial Analysis 측정 중앙값, 높을수록 빠름)', higherBetter: true, value: positive('outputTokensPerSecond'), fmt: (v) => `${Math.round(v).toLocaleString()} tok/s` },
  ttft: { key: 'ttft', label: '첫 토큰 지연', hint: '첫 토큰까지 걸린 시간(초). reasoning 모델은 추론 시간이 포함될 수 있음 (낮을수록 좋음)', higherBetter: false, value: positive('timeToFirstTokenSeconds'), fmt: (v) => `${v.toFixed(2)}s` },
  context: { key: 'context', label: 'Context window', hint: '입력 context 길이 (models.dev 기준)', higherBetter: true, value: (r) => r.m.contextWindow, fmt: tokens },
  blend: { key: 'blend', label: '4:1 혼합 단가', hint: 'USD / 1M tokens, 입력 4 : 출력 1, 캐시 미반영 (낮을수록 저렴)', higherBetter: false, value: (r) => blended(price('input')(r), price('output')(r)), fmt: usd },
  input: { key: 'input', label: 'Input 단가', hint: 'USD / 1M tokens', higherBetter: false, value: price('input'), fmt: usd },
  output: { key: 'output', label: 'Output 단가', hint: 'USD / 1M tokens', higherBetter: false, value: price('output'), fmt: usd },
  cacheRead: { key: 'cacheRead', label: 'Cache read 단가', hint: 'USD / 1M tokens', higherBetter: false, value: price('cacheRead'), fmt: usd },
  longInput: { key: 'longInput', label: '장문 Input 단가', hint: '임계값을 넘는 프롬프트의 입력 단가', higherBetter: false, value: (r) => longPriceOf(r.m, state.region, r.scope, state.tier, 'input'), fmt: usd },
};

/** Best row per metric, for highlight cards. */
export function leader(rows: Row[], metric: Metric): { row: Row; value: number } | undefined {
  let best: { row: Row; value: number } | undefined;
  for (const row of rows) {
    const value = metric.value(row);
    if (value === undefined) continue;
    if (!best || (metric.higherBetter ? value > best.value : value < best.value)) best = { row, value };
  }
  return best;
}
