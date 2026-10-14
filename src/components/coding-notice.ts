import { h } from '../dom.ts';
import { codingIndexOf, scienceCodingPercent } from '../coding.ts';
import type { Model } from '../types.ts';
import { icon } from './ui.ts';
import { t } from '../i18n.ts';

export function codingNotice(models: Model[], action?: HTMLElement): HTMLElement | null {
  const missing = [...new Map(models.filter((model) => model.benchmarks && codingIndexOf(model) === undefined).map((model) => [model.id, model])).values()];
  if (!missing.length) return null;
  const scienceCount = missing.filter((model) => scienceCodingPercent(model) !== undefined).length;
  return h('aside', { class: 'coding-notice', 'aria-label': t('Coding Index 데이터 안내', 'About Coding Index data') },
    h('div', { class: 'coding-notice-title' }, icon('info'), h('strong', null, t(`Coding Index 미제공 · ${missing.length}개 모델`, `Coding Index not provided · ${missing.length} models`))),
    h('p', null, t('현재 연동한 Artificial Analysis 측정 항목에 해당 모델의 Coding Index 값이 없습니다. ', 'The connected Artificial Analysis data has no Coding Index for these models. '),
      scienceCount ? t(`${scienceCount}개 모델은 별도 과학 코딩 벤치마크인 SciCode 값으로 비교할 수 있습니다. `, `${scienceCount} of them can be compared on SciCode, a separate scientific-coding benchmark. `) : '',
      t('Coding Index와 SciCode는 서로 다른 지표이며, 값을 대체하거나 추정하지 않습니다.', 'Coding Index and SciCode are different metrics; neither is substituted for or estimated from the other.')),
    h('div', { class: 'coding-notice-actions' }, action,
      h('details', { class: 'coding-notice-sources' }, h('summary', null, t('해당 모델과 측정 원문 확인', 'See these models and the source measurements')),
        h('div', { class: 'coverage-models' }, ...missing.map((model) => {
          const source = model.benchmarkSource;
          return h('a', { href: source ? source.url ?? `https://artificialanalysis.ai/models/${source.slug}` : `#/model/${model.id}`,
            rel: source ? 'noopener' : undefined }, model.name, source ? ' ↗' : '');
        })))));
}
