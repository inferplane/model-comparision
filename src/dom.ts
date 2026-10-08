type Child = Node | string | null | undefined | false;

/** Minimal element builder. Strings go through createTextNode, so model names are never parsed as HTML. */
export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Record<string, unknown> | null = null,
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props ?? {})) {
    if (v === undefined || v === null) continue;
    // aria-* attributes carry the literal strings "true"/"false"; only plain boolean attributes (checked, hidden…) are presence-based.
    if (k.startsWith('aria-')) {
      el.setAttribute(k, String(v));
      continue;
    }
    if (v === false) continue;
    if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v as EventListener);
    else if (k === 'class') el.className = String(v);
    else el.setAttribute(k, v === true ? '' : String(v));
  }
  for (const c of children) if (c) el.append(c);
  return el;
}

type SvgChild = Node | string | null | undefined | false;

/** SVG counterpart of h(): elements need the SVG namespace, and text still goes through text nodes. */
export function s(tag: string, attrs: Record<string, string | number | undefined> = {}, ...children: SvgChild[]): SVGElement {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) if (v !== undefined) el.setAttribute(k, String(v));
  for (const c of children) if (c) el.append(c);
  return el;
}
