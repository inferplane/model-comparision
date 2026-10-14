import { h } from '../dom.ts';
import { describeAvailability, describePrice, entriesWithin, type Brief, type ChangesFile } from '../changes.ts';
import { emptyState, pageHeading } from '../components/ui.ts';
import type { Model } from '../types.ts';
import { t } from '../i18n.ts';

const WINDOW_DAYS = 30;

const formatChecked = (iso: string) => (iso ? `${iso.slice(0, 10)} ${iso.slice(11, 16)} UTC` : t('확인 기록 없음', 'Never checked'));

export function renderChanges(models: Model[], changes: ChangesFile): HTMLElement {
  const known = new Set(models.map((m) => m.id));
  const today = new Date().toISOString().slice(0, 10);
  const days = entriesWithin(changes.entries, today, WINDOW_DAYS);
  // Removed models are gone from the data, so they get no link; everything else links to its detail page.
  const name = (b: Brief) => (known.has(b.id) ? h('a', { href: `#/model/${b.id}` }, b.name) : h('span', null, b.name));
  const row = (b: Brief, detail?: string) => h('li', null, name(b), h('span', { class: 'provider-tag' }, b.provider), detail ? h('span', { class: 'change-detail' }, detail) : null);
  const group = (title: string, tone: string, items: HTMLElement[]) => (items.length ? h('section', { class: `change-group ${tone}` }, h('h3', null, `${title} · ${items.length}`), h('ul', null, ...items)) : null);

  const body = days.length
    ? days.map((e) => h('article', { class: 'panel change-day' },
        h('h2', null, h('time', { datetime: e.date }, e.date)),
        group(t('신규 모델', 'New models'), 'added', e.added.map((b) => row(b))),
        group(t('삭제된 모델', 'Removed models'), 'removed', e.removed.map((b) => row(b))),
        group(t('가격 변경', 'Price changes'), 'price', e.priceChanges.map((p) => row(p, describePrice(p)))),
        group(t('가용성 변경', 'Availability changes'), 'avail', e.availabilityChanges.map((a) => row(a, describeAvailability(a))))))
    : [emptyState(t(`최근 ${WINDOW_DAYS}일 동안 변경이 없습니다`, `No changes in the last ${WINDOW_DAYS} days`), t('매일 AWS 가격표·모델 카드·리전 표를 확인하며, 신규·삭제 모델과 가격·가용성 변경이 생기면 여기에 쌓입니다.', 'The AWS Price List, model cards and regions page are checked daily; new and removed models and price or availability changes show up here.'))];

  return h('main', null,
    pageHeading('CHANGES', t('최근 변경', 'Recent changes'), t('매일 한 번 AWS 공개 자료를 다시 확인해 달라진 점을 기록합니다. 신규 모델에는 14일 동안 NEW 표시가 붙습니다.', 'Public AWS sources are re-checked once a day and every difference is recorded. New models carry a NEW badge for 14 days.')),
    h('p', { class: 'note change-meta' }, h('span', null, t('마지막 확인 ', 'Last checked '), h('time', { datetime: changes.updatedAt }, formatChecked(changes.updatedAt))), ' · ',
      h('a', { href: `${import.meta.env.BASE_URL}ai/changes.md`, rel: 'noopener' }, t('AI용 마크다운 ↗', 'Markdown for AI ↗'))),
    ...body);
}
