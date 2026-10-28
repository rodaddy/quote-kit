// Drives the REAL inline script out of the shipped form.html against a minimal
// DOM shim. The kit has no browser and no dependencies, so the shim covers only
// what the form's own script touches. The point is the export path: a quote the
// form knows is invalid must not stay copyable or downloadable.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";

const kitRoot = path.resolve(import.meta.dirname, "..");
const formPath = path.join(kitRoot, "skills/quotes/templates/quote/form.html");

class Node {
  constructor(tag) {
    this.tagName = String(tag || "div").toUpperCase();
    this.children = [];
    this.parentNode = null;
    this.attributes = new Map();
    this.listeners = new Map();
    this.textContent = "";
    this.value = "";
    this.className = "";
  }

  // The copy path falls back to a detached textarea when there is no clipboard
  // API, which is exactly the case in this sandbox.
  select() {}

  get classList() {
    const self = this;
    return { add(name) { self.className = `${self.className} ${name}`.trim(); } };
  }

  appendChild(child) {
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  removeChild(child) {
    this.children = this.children.filter((entry) => entry !== child);
    child.parentNode = null;
    return child;
  }

  addEventListener(type, handler) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type).push(handler);
  }

  dispatch(type) {
    // Events bubble to the form, which is how the form-level invalidation
    // listener sees an edit to a field it does not know about individually.
    for (let node = this; node; node = node.parentNode) {
      for (const handler of node.listeners.get(type) ?? []) handler({ target: this });
    }
  }

  descendants() {
    return this.children.flatMap((child) => [child, ...child.descendants()]);
  }

  matches(selector) {
    if (selector.startsWith(".")) return this.className.split(/\s+/).includes(selector.slice(1));
    const named = /^\[name="(.*)"\]$/.exec(selector);
    if (named) return this.attributes.get("name") === named[1];
    return this.tagName === selector.toUpperCase();
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] ?? null;
  }

  querySelectorAll(selector) {
    const matched = this.descendants().filter((node) => node.matches(selector));
    matched.forEach = Array.prototype.forEach.bind(matched);
    return matched;
  }

  // The form's addItemRow builds a row from an HTML string. Parsing only the
  // classes and tags it actually uses keeps the shim honest and small.
  set innerHTML(html) {
    this.children = [];
    for (const match of html.matchAll(/<(input|button|div)\b([^>]*)>/g)) {
      const node = new Node(match[1]);
      const className = /class="([^"]*)"/.exec(match[2]);
      if (className) node.className = className[1];
      this.appendChild(node);
    }
  }
}

function buildDocument() {
  const registry = new Map();
  const form = new Node("form");
  const body = new Node("body");

  function register(id, node, parent) {
    registry.set(id, node);
    (parent ?? body).appendChild(node);
    return node;
  }

  for (const id of ["itemRows", "taxRate", "depositType", "depositValue"]) {
    register(id, new Node(id === "depositType" ? "select" : "input"), form);
  }
  for (const id of ["subtotalView", "taxView", "totalView", "depositView", "balanceView", "status"]) {
    register(id, new Node("span"), form);
  }
  for (const id of ["addItemBtn", "fillBtn", "copyBtn", "downloadBtn"]) {
    register(id, new Node("button"), form);
  }
  register("quoteForm", form);
  register("output", new Node("div"));

  const fieldNames = [
    "business name", "business tagline", "business street address",
    "business city, state, and postal code", "business phone number",
    "business email address", "sender full name and title", "quote number",
    "today's date", "valid until date", "client full name",
    "client company name if any", "client street address if known",
    "client email address if known", "start window", "terms and conditions",
    "what this quote does not include", "what this price assumes",
  ];
  for (const name of fieldNames) {
    const field = new Node("input");
    field.attributes.set("name", name);
    form.appendChild(field);
  }

  return {
    body,
    form,
    registry,
    document: {
      body,
      getElementById: (id) => registry.get(id) ?? null,
      createElement: (tag) => new Node(tag),
      execCommand: () => true,
    },
  };
}

function loadForm() {
  const html = fs.readFileSync(formPath, "utf8");
  const scriptBlocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/gi)].map((match) => match[1]);
  assert.equal(scriptBlocks.length, 1, "form.html must contain exactly one inline script block");

  const dom = buildDocument();
  const sandbox = {
    document: dom.document,
    navigator: {},
    Blob: class { constructor(parts) { this.parts = parts; } },
    URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
    console,
  };
  vm.createContext(sandbox);
  new vm.Script(scriptBlocks[0], { filename: "form.html:inline-script" }).runInContext(sandbox);

  function setField(name, value) {
    const field = dom.form.querySelector(`[name="${name}"]`);
    assert.ok(field, `form.html is missing the field ${name}`);
    field.value = value;
    field.dispatch("input");
  }

  function fillValidQuote() {
    const required = {
      "business name": "DiMarco Masonry",
      "business street address": "12 Bay Ave",
      "business city, state, and postal code": "Islip, NY 11751",
      "business phone number": "631-555-0100",
      "business email address": "hello@example.com",
      "sender full name and title": "Anthony DiMarco, Owner",
      "today's date": "2026-08-13",
      "valid until date": "2026-09-12",
      "client full name": "Delia Moreno",
      "terms and conditions": "Balance on completion.",
      "what this quote does not include": "Permits",
      "what this price assumes": "Truck access",
    };
    for (const [name, value] of Object.entries(required)) setField(name, value);

    const row = dom.registry.get("itemRows").querySelector(".item-row");
    row.querySelector(".li-desc").value = "Patio";
    row.querySelector(".li-qty").value = "480";
    row.querySelector(".li-unit").value = "square feet";
    row.querySelector(".li-price").value = "22.00";
    row.querySelector(".li-price").dispatch("input");

    dom.registry.get("fillBtn").dispatch("click");
  }

  return { dom, setField, fillValidQuote };
}

test("a valid quote fills and stays exportable until something changes", () => {
  const { dom, fillValidQuote } = loadForm();
  fillValidQuote();

  const produced = dom.registry.get("output").textContent;
  assert.match(produced, /# QUOTE/);
  assert.match(produced, /\$10,560\.00/);

  dom.registry.get("copyBtn").dispatch("click");
  assert.equal(dom.registry.get("output").textContent, produced, "an untouched valid quote stays exportable");
});

test("emptying a required field after Fill clears the stale quote", () => {
  const { dom, setField, fillValidQuote } = loadForm();
  fillValidQuote();
  assert.notEqual(dom.registry.get("output").textContent, "");

  // The terms field has no money listener, so only the form-level invalidation
  // catches this. Before the fix the prior quote stayed sitting in #output.
  setField("terms and conditions", "");
  assert.equal(dom.registry.get("output").textContent, "", "a stale quote must not survive an edit");

  dom.registry.get("copyBtn").dispatch("click");
  assert.equal(dom.registry.get("output").textContent, "", "Copy must not export a quote the form refuses");
  assert.match(dom.registry.get("status").textContent, /Quote not produced/);
});

test("invalidating a line item after Fill blocks download", () => {
  const { dom, fillValidQuote } = loadForm();
  fillValidQuote();

  const row = dom.registry.get("itemRows").querySelector(".item-row");
  row.querySelector(".li-qty").value = "0";
  row.querySelector(".li-qty").dispatch("input");
  assert.equal(dom.registry.get("output").textContent, "");

  dom.registry.get("downloadBtn").dispatch("click");
  assert.equal(dom.registry.get("output").textContent, "", "Download must not export an invalid quote");
  assert.match(dom.registry.get("status").textContent, /Quote not produced/);
});

test("an oversized fixed deposit after Fill blocks export", () => {
  const { dom, fillValidQuote } = loadForm();
  fillValidQuote();

  dom.registry.get("depositType").value = "fixed";
  dom.registry.get("depositType").dispatch("change");
  dom.registry.get("depositValue").value = "99999999";
  dom.registry.get("depositValue").dispatch("input");

  dom.registry.get("copyBtn").dispatch("click");
  assert.equal(dom.registry.get("output").textContent, "");
  assert.match(dom.registry.get("status").textContent, /larger than the quote total/);
});
