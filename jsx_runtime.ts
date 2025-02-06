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

/** jsx factory */
export function jsx(
  type: string | ((props: Props) => string),
  props: Props,
): string {
  if (typeof type === "function") {
    return type(props);
  }
  const { children, ...rest } = props;
  const attrs = Object.entries(rest).map(
    ([k, v]) => typeof v === "boolean" ? (v ? " " + k : "") : ` ${k}="${v}"`,
  ).join("");
  return voidElements.has(type)
    ? `<${type}${attrs} />`
    : `<${type}${attrs}>${children ?? ""}</${type}>`;
}

/** jsxs factory */
export function jsxs(
  type: string | ((props: Props) => string),
  props: { children: string[] } & Props,
): string {
  return jsx(type, { ...props, children: props.children.join("") });
}

/** Fragment factory */
export function Fragment({ children }: { children: string }): string {
  return children;
}

export declare namespace JSX {
  interface IntrinsicElements {
    // deno-lint-ignore no-explicit-any
    [elemName: string]: any;
  }
}
