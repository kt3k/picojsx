// Copyright 2025 Yoshiya Hinosawa. MIT License.
// inspired by https://oliverjam.es/articles/diy-jsx

/**
 * static jsx runtime
 *
 * @module
 */

const voidElements = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

type Props = Record<string, unknown>;

function escape(str: unknown): string {
  return String(str).replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const rendered = new Set();
let clearTaskQueued = false;
function markRendered(text: string) {
  rendered.add(text);
  if (!clearTaskQueued) {
    clearTaskQueued = true;
    queueMicrotask(() => {
      rendered.clear();
      clearTaskQueued = false;
    });
  }
}

/** jsx factory */
export function jsx(
  type: string | ((props: Props) => string),
  props: Props | { children: string | string[] },
): string {
  if (typeof type === "function") {
    const text = type(props);
    markRendered(text);
    return text;
  }
  let { children, ...rest } = props;
  if (Array.isArray(children)) {
    children = children.map((child) =>
      rendered.has(child) ? child : escape(child)
    ).join("");
  } else if (children && !rendered.has(children)) {
    children = escape(children);
  }
  const attrs = Object.entries(rest).map(
    ([k, v]) =>
      typeof v === "boolean" ? (v ? " " + k : "") : ` ${k}="${escape(v)}"`,
  ).join("");
  const text = voidElements.has(type)
    ? `<${type}${attrs} />`
    : `<${type}${attrs}>${children ? children : ""}</${type}>`;
  markRendered(text);
  return text;
}

export { jsx as jsxs };

/** Fragment factory */
export function Fragment({ children }: { children: string }): string {
  return Array.isArray(children) ? children.join("") : children;
}

export declare namespace JSX {
  interface IntrinsicElements {
    // deno-lint-ignore no-explicit-any
    [elemName: string]: any;
  }
}
