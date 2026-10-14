export type Lang = 'ko' | 'en';

const KEY = 'bme-lang';

/** Saved choice first, then the browser language. Outside a browser (tests, build scripts) the UI stays Korean. */
function detect(): Lang {
  if (typeof window === 'undefined') return 'ko';
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'ko' || saved === 'en') return saved;
  } catch {
    /* storage can be blocked; fall back to the browser language */
  }
  return (navigator.language ?? '').toLowerCase().startsWith('ko') ? 'ko' : 'en';
}

/** Fixed for the page's lifetime: views build module-level tables (columns, metrics) once, so switching languages reloads the page. */
export const lang: Lang = detect();

/** Pick the string for the active language. Both sit side by side at the call site, so a translation never drifts from its source. */
export const t = (ko: string, en: string): string => (lang === 'en' ? en : ko);

/** Number formatting that follows the UI language rather than the OS locale. */
export const locale = lang === 'en' ? 'en-US' : 'ko-KR';

/** Save the choice and reload; call after the URL already carries the current filters so the same view comes back. */
export function setLang(next: Lang) {
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* without storage the choice can't survive the reload */
    return;
  }
  location.reload();
}
