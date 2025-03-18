// Copyright 2025 Yoshiya Hinosawa. MIT License.

import { assertEquals } from "@std/assert"

Deno.test("jsx factory", () => {
  assertEquals(<div class="foo">hello</div>, '<div class="foo">hello</div>')
  assertEquals(<input type="text" />, '<input type="text" />')
  assertEquals(
    <input type="radio" checked />,
    '<input type="radio" checked />',
  )
  assertEquals(<span></span>, "<span></span>")

  function Foo() {
    return <span>foo</span>
  }

  assertEquals(<Foo />, "<span>foo</span>")
})

Deno.test("jsxs factory", () => {
  assertEquals(
    <div>
      <span>hello</span>
      <span>world</span>
    </div>,
    "<div><span>hello</span><span>world</span></div>",
  )
})

Deno.test("Fragment factory", () => {
  assertEquals(
    <>
      <span>hello</span>
      <span>world</span>
    </>,
    "<span>hello</span><span>world</span>",
  )

  assertEquals(
    <>
      <span>hello</span>
      world
    </>,
    "<span>hello</span>world",
  )

  function Foo() {
    return <span>foo</span>
  }

  assertEquals(
    <>
      <Foo />
      <span>bar</span>
    </>,
    "<span>foo</span><span>bar</span>",
  )
})

Deno.test("props are escaped", () => {
  assertEquals(
    <div class={'"><script>alert(1)</script><div><div class="'} />,
    '<div class="&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;&lt;div&gt;&lt;div class=&quot;"></div>',
  )
})

Deno.test("children are escaped", () => {
  assertEquals(
    <div>{"<script>alert(1)</script>"}</div>,
    "<div>&lt;script&gt;alert(1)&lt;/script&gt;</div>",
  )
  assertEquals(
    <div>
      <div>
        {"<script>alert(1)</script>"}
      </div>
    </div>,
    "<div><div>&lt;script&gt;alert(1)&lt;/script&gt;</div></div>",
  )
})
