import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRecentImageryPanel } from './recentImagery.js';
import { createRecentImageryLayer } from '../layers/recentImagery/index.js';
import {
  BOX,
  fakeCatalog,
  fakeController,
  fakeRenderer,
  fakeThumbnails,
  manualTimers,
  response,
  settle,
} from '../layers/recentImagery/testDoubles.mjs';

const S18 = 'S30:2026-09-18';
const L16 = 'L30:2026-09-16';
const V21 = 'VIIRS:2026-09-21';
const V15 = 'VIIRS:2026-09-15';

// ---- a small DOM double ------------------------------------------------------
class FakeClassList {
  constructor(node) {
    this.node = node;
  }
  get names() {
    return new Set(
      String(this.node.className || '')
        .split(/\s+/)
        .filter(Boolean),
    );
  }
  contains(name) {
    return this.names.has(name);
  }
  toggle(name, force) {
    const names = this.names;
    const on = force === undefined ? !names.has(name) : Boolean(force);
    if (on) names.add(name);
    else names.delete(name);
    this.node.className = [...names].join(' ');
    return on;
  }
  add(...list) {
    for (const name of list) this.toggle(name, true);
  }
  remove(...list) {
    for (const name of list) this.toggle(name, false);
  }
}

function matches(node, selector) {
  if (selector.startsWith('.'))
    return node.classList.contains(selector.slice(1));
  if (selector.startsWith('#')) return node.id === selector.slice(1);
  const attr = /^\[([\w-]+)(?:="([^"]*)")?\]$/.exec(selector);
  if (!attr) return false;
  const key = attr[1].startsWith('data-')
    ? attr[1].slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
    : null;
  const value = key ? node.dataset[key] : node.getAttribute(attr[1]);
  return attr[2] === undefined ? value != null : value === attr[2];
}

class FakeElement {
  constructor(tagName, ownerDocument) {
    this.tagName = String(tagName).toUpperCase();
    this.ownerDocument = ownerDocument;
    this.children = [];
    this.parentNode = null;
    this.className = '';
    this.dataset = {};
    this.style = {};
    this.attributes = new Map();
    this.listeners = new Map();
    this.hidden = false;
    this.disabled = false;
    this.id = '';
    this.title = '';
    this._text = '';
    this.scrollTop = 0;
    this.scrollLeft = 0;
    this.focused = 0;
    this.blurred = 0;
  }
  get classList() {
    return new FakeClassList(this);
  }
  get textContent() {
    return this.children.length
      ? this.children.map((child) => child.textContent).join('')
      : this._text;
  }
  set textContent(value) {
    for (const child of this.children) child.parentNode = null;
    this.children = [];
    this._text = String(value);
  }
  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }
  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }
  removeAttribute(name) {
    this.attributes.delete(name);
  }
  appendChild(child) {
    return this.insertBefore(child, null);
  }
  insertBefore(child, reference) {
    child.parentNode?.removeChild(child);
    const index = reference ? this.children.indexOf(reference) : -1;
    if (index < 0) this.children.push(child);
    else this.children.splice(index, 0, child);
    child.parentNode = this;
    return child;
  }
  append(...children) {
    for (const child of children) this.appendChild(child);
  }
  removeChild(child) {
    this.children.splice(this.children.indexOf(child), 1);
    child.parentNode = null;
  }
  remove() {
    this.parentNode?.removeChild(this);
  }
  addEventListener(type, handler) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(handler);
  }
  removeEventListener(type, handler) {
    this.listeners.get(type)?.delete(handler);
  }
  /** Bubble an event from this node to the root. */
  dispatch(type, init = {}) {
    const event = {
      type,
      target: this,
      defaultPrevented: false,
      preventDefault() {
        this.defaultPrevented = true;
      },
      ...init,
    };
    for (let node = this; node; node = node.parentNode)
      for (const handler of [...(node.listeners.get(type) || [])])
        handler(event);
    return event;
  }
  click() {
    if (!this.disabled) this.dispatch('click');
  }
  matches(selector) {
    return matches(this, selector);
  }
  closest(selector) {
    for (let node = this; node; node = node.parentNode)
      if (matches(node, selector)) return node;
    return null;
  }
  querySelector(selector) {
    return this.find((node) => matches(node, selector));
  }
  find(predicate) {
    for (const child of this.children) {
      if (predicate(child)) return child;
      const inner = child.find(predicate);
      if (inner) return inner;
    }
    return null;
  }
  findAll(predicate, out = []) {
    for (const child of this.children) {
      if (predicate(child)) out.push(child);
      child.findAll(predicate, out);
    }
    return out;
  }
  focus(options) {
    this.focused += 1;
    this.focusOptions = options;
  }
  blur() {
    this.blurred += 1;
  }
  listenerCount() {
    return [...this.listeners.values()].reduce((n, set) => n + set.size, 0);
  }
}

/** The static rail panel skeleton from templates/context.html. */
function fakeDocument() {
  const document = {
    documentElement: { clientWidth: 1200 },
    createElement: (tag) => new FakeElement(tag, document),
    getElementById: (id) => document.body.find((node) => node.id === id),
  };
  document.body = new FakeElement('body', document);
  const panel = document.createElement('div');
  panel.id = 'recent-imagery-panel';
  panel.className = 'panel-collapsible collapsed';
  panel.hidden = true;
  const count = document.createElement('span');
  count.id = 'recent-imagery-panel-count';
  const collapse = document.createElement('button');
  collapse.dataset.collapseTarget = 'recent-imagery-panel';
  collapse.clicked = 0;
  collapse.click = () => {
    collapse.clicked += 1;
    panel.classList.toggle('collapsed');
  };
  const body = document.createElement('div');
  body.id = 'recent-imagery-panel-body';
  panel.append(count, collapse, body);
  document.body.appendChild(panel);
  return { document, panel, count, collapse, body };
}

// ---- the real layer, with fakes for everything it injects ------------------
function fixture({ fetchImpl, controller = fakeController() } = {}) {
  const dom = fakeDocument();
  const renderer = fakeRenderer();
  const thumbnails = fakeThumbnails();
  const catalog = fakeCatalog();
  const timers = manualTimers();
  const layer = createRecentImageryLayer({
    catalog,
    renderer,
    thumbnails,
    host: () => ({ collection: {}, kind: 'globe' }),
    now: () => new Date('2026-09-21T15:00:00Z'),
    setTimeoutImpl: timers.setTimeoutImpl,
    clearTimeoutImpl: timers.clearTimeoutImpl,
  });
  layer.setSources({ viirs: true });
  const viewer = {
    camera: {},
    scene: { canvas: { clientWidth: 1000 }, requestRender() {} },
  };
  layer.init(viewer);
  layer.attachMapStackController(controller);
  let active = false;
  const tool = {
    calls: [],
    start() {
      active = true;
      this.calls.push('start');
      layer.setToolActive(true);
    },
    cancel(reason) {
      active = false;
      this.calls.push(`cancel:${reason}`);
      layer.setToolActive(false);
    },
    isActive: () => active,
  };
  const splits = [];
  const fetches = [];
  const urls = { created: [], revoked: [] };
  const readout = createRecentImageryPanel({
    container: dom.body,
    layer,
    viewer,
    tool,
    createSplit: (options) => {
      const split = {
        options,
        value: options.initialValue,
        values: [],
        destroyed: false,
        setValue(next) {
          this.value = next;
          this.values.push(next);
        },
        destroy() {
          this.destroyed = true;
        },
      };
      splits.push(split);
      return split;
    },
    fetchImpl:
      fetchImpl ||
      (async (url) => {
        fetches.push(url);
        return response();
      }),
    createObjectUrl: () => {
      urls.created.push('blob:export');
      return 'blob:export';
    },
    revokeObjectUrl: (url) => urls.revoked.push(url),
  });
  const root = readout.root;
  const byId = (id) => root.find((node) => node.id === id);
  const byAction = (id) => root.find((node) => node.dataset.actionId === id);
  const cards = () =>
    root.findAll((node) => node.classList.contains('ri-card'));
  const card = (key) => cards().find((node) => node.dataset.key === key);
  const chip = (key, slot) =>
    card(key).find((node) => node.dataset.slot === slot);
  const part = (node, name) =>
    node.find((child) => child.classList.contains(name));
  const strip = byId('ri-strip');
  const key = (name, extra = {}) =>
    strip.dispatch('keydown', { key: name, ...extra });
  /** Enable, select BOX and land the catalog. */
  const ready = async () => {
    layer.enable();
    layer.setBox(BOX);
    catalog.resolveLast();
    await settle();
  };
  const settleLease = async () => {
    controller.lease?.settle();
    await settle();
  };
  return {
    ...dom,
    layer,
    viewer,
    renderer,
    thumbnails,
    catalog,
    controller,
    timers,
    tool,
    splits,
    fetches,
    urls,
    readout,
    root,
    byId,
    byAction,
    cards,
    card,
    chip,
    part,
    strip,
    key,
    ready,
    settleLease,
    snap: () => layer.getSnapshot(),
  };
}

const rowText = (f, slotId) =>
  [
    part(f, `ri-slot-${slotId}`, 'ri-slot-tag').textContent,
    part(f, `ri-slot-${slotId}`, 'ri-slot-value').textContent,
  ].join(' | ');
function part(f, id, name) {
  return f.byId(id).find((node) => node.classList.contains(name));
}

// ---- tests ---------------------------------------------------------------------
test('[recent-imagery-043] the readout mounts in the rail body, hides while the layer is off and opens the panel once on first appearance', async () => {
  const f = fixture();
  assert.equal(f.root.parentNode, f.body);
  assert.equal(f.panel.hidden, true);
  assert.equal(f.count.textContent, '');
  await f.ready();
  const panel = f.document.getElementById('recent-imagery-panel');
  assert.equal(panel.hidden, false);
  assert.equal(f.collapse.clicked, 1, 'first appearance expands');
  assert.equal(panel.classList.contains('collapsed'), false);
  assert.equal(f.count.textContent, '4 DAYS');
  f.collapse.click();
  f.layer.disable();
  f.layer.enable();
  assert.equal(f.collapse.clicked, 2, 'never again: the user collapsed it');
  f.layer.disable();
  assert.equal(panel.hidden, true);
  assert.equal(f.count.textContent, '');
  // A stored or shared collapse choice wins over the first appearance.
  const g = fixture();
  g.document.getElementById(
    'recent-imagery-panel',
  ).dataset.collapsedPreference = 'stored';
  g.layer.enable();
  assert.equal(g.collapse.clicked, 0);
});

test('[recent-imagery-043] the body is a fixed stack of seven blocks in a fixed order, each with a fixed height in the stylesheet', () => {
  const f = fixture();
  assert.deepEqual(
    f.root.children.map((node) => node.id || node.className),
    [
      'ri-actions',
      'ri-notice',
      'ri-strip',
      'ri-hint',
      'ri-selection',
      'ri-controls',
      'ri-details',
    ],
  );
  const css = readFileSync(
    new URL('./styles/recent-imagery.css', import.meta.url),
    'utf8',
  );
  const rule = (selector) => {
    const start = css.indexOf(`${selector} {`);
    assert.ok(start >= 0, selector);
    return css.slice(start, css.indexOf('}', start));
  };
  assert.match(rule('.recent-imagery-readout .ri-actions-row'), /height: 22px/);
  assert.match(rule('.recent-imagery-readout .ri-line'), /height: 14px/);
  assert.match(rule('.recent-imagery-readout .ri-strip'), /height: 120px/);
  assert.match(rule('.recent-imagery-readout .ri-card'), /height: 112px/);
  assert.match(
    rule('.recent-imagery-readout .ri-selection'),
    /grid-template-rows: 20px 20px 20px/,
  );
  assert.match(rule('.recent-imagery-readout .ri-slot'), /height: 20px/);
  assert.match(rule('.recent-imagery-readout .ri-controls'), /height: 22px/);
  assert.match(
    rule('.recent-imagery-readout .is-reserved'),
    /visibility: hidden/,
  );
});

/*
 * A DOM-structure guard, not a layout-shift check: the fake DOM has no
 * layout, so this pins what the layout rests on (every control keeps its
 * place in the tree, nothing is hidden, and every block that must not change
 * height keeps the class the stylesheet fixes it by). The live gate
 * `scripts/qa-recent-imagery.mjs` measures the real rectangles.
 */
test('[recent-imagery-043] no control changes place in the tree, no block is hidden and every fixed-height block keeps its height class across every state (DOM-structure guard)', async () => {
  const f = fixture();
  const cssRule = (file, selector) => {
    const css = readFileSync(new URL(file, import.meta.url), 'utf8');
    const start = css.indexOf(`${selector} {`);
    assert.ok(start >= 0, `${file} has ${selector}`);
    return css.slice(start, css.indexOf('}', start));
  };
  const readout = (selector) =>
    cssRule(
      './styles/recent-imagery.css',
      `.recent-imagery-readout ${selector}`,
    );
  /**
   * Every block that must keep its height: the node carrying the class, that
   * class, and the rule it gets its height from. The mode row is the first
   * 20 px track of the selection grid. The details header has no height of
   * its own: it is the last block, so it moves nothing below it, and its
   * title is held to one line.
   */
  const fixedHeightBlocks = () => {
    const mode = f.byId('ri-mode');
    const header = f
      .byId('ri-details')
      .find((node) => node.classList.contains('rail-card-header'));
    return {
      'ri-actions': [
        f.byId('ri-actions'),
        'ri-actions-row',
        readout('.ri-actions-row'),
        /height: 22px/,
      ],
      'ri-notice': [
        f.byId('ri-notice'),
        'ri-line',
        readout('.ri-line'),
        /height: 14px/,
      ],
      'ri-zoom-in': [
        f.byId('ri-zoom-in')?.parentNode === f.byId('ri-notice')
          ? f.byId('ri-zoom-in')
          : null,
        'ri-zoom-in',
        readout('.ri-zoom-in'),
        /height: 14px/,
      ],
      'ri-strip': [
        f.byId('ri-strip'),
        'ri-strip',
        readout('.ri-strip'),
        /height: 120px/,
      ],
      'ri-hint': [
        f.byId('ri-hint'),
        'ri-line',
        readout('.ri-line'),
        /height: 14px/,
      ],
      'ri-mode': [
        mode.parentNode.children[0] === mode ? mode.parentNode : null,
        'ri-selection',
        readout('.ri-selection'),
        /grid-template-rows: 20px 20px 20px/,
      ],
      'ri-slot-a': [
        f.byId('ri-slot-a'),
        'ri-slot',
        readout('.ri-slot'),
        /height: 20px/,
      ],
      'ri-slot-b': [
        f.byId('ri-slot-b'),
        'ri-slot',
        readout('.ri-slot'),
        /height: 20px/,
      ],
      'ri-controls': [
        f.byId('ri-controls'),
        'ri-controls',
        readout('.ri-controls'),
        /height: 22px/,
      ],
      'ri-swap': [
        f.byId('ri-swap')?.parentNode === f.byId('ri-controls')
          ? f.byId('ri-swap')
          : null,
        'data-toggle-chip',
        readout('.data-toggle-chip'),
        /height: 22px/,
      ],
      'details header': [
        f.root.children.at(-1) === f.byId('ri-details')
          ? header?.find((node) => node.classList.contains('rail-card-title'))
          : null,
        'rail-card-nowrap',
        cssRule('./styles/weather.css', '.rail-card-nowrap'),
        /white-space: nowrap/,
      ],
    };
  };
  const assertFixedHeights = (label) => {
    for (const [name, [node, className, rule, fixed]] of Object.entries(
      fixedHeightBlocks(),
    )) {
      assert.ok(node, `${name} is in place (${label})`);
      assert.ok(
        node.classList.contains(className),
        `${name} carries .${className} (${label})`,
      );
      assert.match(rule, fixed, `.${className} fixes ${name}`);
    }
  };
  const controls = () => ({
    'select-box': f.byAction('select-box'),
    'use-view': f.byAction('use-view'),
    clear: f.byAction('clear'),
    notice: f.byId('ri-notice'),
    'zoom-in': f.byId('ri-zoom-in'),
    strip: f.strip,
    hint: f.byId('ri-hint'),
    'mode-image': f.root.find(
      (node) =>
        node.classList.contains('ri-mode-btn') && node.dataset.mode === 'image',
    ),
    'mode-basemap': f.root.find(
      (node) =>
        node.classList.contains('ri-mode-btn') &&
        node.dataset.mode === 'basemap',
    ),
    'mode-ab': f.root.find(
      (node) =>
        node.classList.contains('ri-mode-btn') && node.dataset.mode === 'ab',
    ),
    'row-a': f.byId('ri-slot-a'),
    'row-b': f.byId('ri-slot-b'),
    'unpin-a': f.byId('ri-unpin-a'),
    'unpin-b': f.byId('ri-unpin-b'),
    opacity: f.byId('ri-opacity'),
    swap: f.byId('ri-swap'),
    'export-a': f.byAction('export-a'),
    'export-b': f.byAction('export-b'),
    details: f
      .byId('ri-details')
      .find((node) => node.classList.contains('rail-card-header')),
  });
  /** Tag and index from the root down, plus every hidden flag on the way. */
  const layout = () => {
    const out = {};
    for (const [name, node] of Object.entries(controls())) {
      assert.ok(node, name);
      const path = [];
      for (let at = node; at && at !== f.root; at = at.parentNode) {
        assert.equal(at.hidden, false, `${name} is never hidden`);
        path.unshift(`${at.tagName}${at.parentNode.children.indexOf(at)}`);
      }
      out[name] = path.join('/');
    }
    return out;
  };
  const baseline = layout();
  assertFixedHeights('built');
  const states = [];
  const record = (label) => {
    assert.deepEqual(layout(), baseline, label);
    assertFixedHeights(label);
    states.push(label);
  };
  f.layer.enable();
  record('enabled, no box');
  f.layer.setBox(BOX);
  record('searching');
  f.catalog.resolveLast();
  await settle();
  await f.settleLease();
  record('preview');
  f.chip(S18, 'a').click();
  record('pinned');
  f.byId('ri-opacity').value = '40';
  f.byId('ri-opacity').dispatch('input');
  record('opacity');
  f.root
    .find(
      (node) =>
        node.classList.contains('ri-mode-btn') &&
        node.dataset.mode === 'basemap',
    )
    .click();
  record('vs basemap');
  f.root
    .find(
      (node) =>
        node.classList.contains('ri-mode-btn') && node.dataset.mode === 'ab',
    )
    .click();
  f.chip(L16, 'b').click();
  record('A / B');
  f.byId('ri-swap').click();
  record('swapped');
  f.byId('ri-unpin-b').click();
  record('B unpinned');
  f.byId('ri-unpin-a').click();
  record('A unpinned');
  f.layer.setBox({ west: 0, south: 0, east: 20, north: 20 });
  record('refused');
  f.byAction('clear').click();
  record('cleared');
  assert.equal(states.length, 12);
});

test('[recent-imagery-044] cards carry thumbnail, date, sensor, cloud, START HERE and PREVIEW; the chips follow the mode without moving', async () => {
  const f = fixture();
  await f.ready();
  f.thumbnails.setStatus(S18, 'present');
  f.layer.setVisibleRange(0, 3);
  f.layer.focus(1);
  const s18 = f.card(S18);
  assert.equal(f.part(s18, 'ri-card-date').textContent, 'Sep 18');
  assert.equal(f.part(s18, 'ri-card-sensor').textContent, 'Sentinel-2 · 30 m');
  assert.equal(f.part(s18, 'ri-card-cloud').textContent, '12% cloud');
  assert.equal(f.part(s18, 'ri-card-start').hidden, false);
  assert.match(f.part(s18, 'ri-card-start').title, /Newest low-cloud day/);
  assert.equal(f.part(s18, 'ri-card-flag').textContent, 'PREVIEW');
  assert.equal(
    f.part(f.card(V21), 'ri-card-cloud').textContent,
    'cloud unknown',
  );
  assert.equal(f.part(f.card(V21), 'ri-thumb-text').textContent, 'Checking');
  assert.equal(
    f.part(f.card(V21), 'ri-card-sensor').textContent,
    'Daily overview · 250 m',
  );
  assert.equal(
    f.part(f.card(L16), 'ri-card-sensor').textContent,
    'Landsat 8/9 · 30 m',
  );
  // IMAGE: one SHOW chip; the B chip keeps its box but is invisible.
  const [a, b] = [f.chip(S18, 'a'), f.chip(S18, 'b')];
  assert.deepEqual(
    [
      a.textContent,
      a.getAttribute('aria-pressed'),
      b.classList.contains('is-reserved'),
      b.disabled,
    ],
    ['SHOW', 'false', true, true],
  );
  assert.equal(a.getAttribute('aria-label'), 'Show Sep 18');
  a.click();
  assert.equal(a.getAttribute('aria-pressed'), 'true');
  assert.equal(a.classList.contains('active'), true);
  assert.equal(
    f.part(s18, 'ri-card-flag').hidden,
    true,
    'pinned, not previewed',
  );
  assert.match(s18.getAttribute('aria-label'), /· shown$/);
  // A / B: the same chip slots, relabelled.
  f.root
    .find(
      (node) =>
        node.classList.contains('ri-mode-btn') && node.dataset.mode === 'ab',
    )
    .click();
  assert.deepEqual(
    [
      a.textContent,
      b.textContent,
      b.classList.contains('is-reserved'),
      b.disabled,
    ],
    ['A', 'B', false, false],
  );
  assert.equal(a.parentNode.children.indexOf(a), 0);
  assert.equal(b.getAttribute('aria-label'), 'Pin Sep 18 as B');
  // A day is one slot only: B moves it.
  b.click();
  assert.deepEqual(
    [a.getAttribute('aria-pressed'), b.getAttribute('aria-pressed')],
    ['false', 'true'],
  );
  // An empty day cannot be pinned.
  f.thumbnails.probe(V21, 'empty');
  f.layer.setShowUnavailable(true);
  assert.equal(f.chip(V21, 'a').disabled, true);
  assert.equal(f.part(f.card(V21), 'ri-card-cloud').textContent, 'no imagery');
});

test('[recent-imagery-044] the selection bar reads the mode, both rows and a preview, with × reserved when empty', async () => {
  const f = fixture();
  await f.ready();
  const modes = f.root.findAll((node) =>
    node.classList.contains('ri-mode-btn'),
  );
  assert.deepEqual(
    modes.map((node) => [
      node.textContent,
      node.getAttribute('role'),
      node.getAttribute('aria-checked'),
    ]),
    [
      ['IMAGE', 'radio', 'true'],
      ['VS BASEMAP', 'radio', 'false'],
      ['A / B', 'radio', 'false'],
    ],
  );
  assert.equal(rowText(f, 'a'), 'IMAGE | Sep 18 · Sentinel-2 · 30 m · preview');
  assert.equal(f.byId('ri-slot-a').dataset.state, 'preview');
  assert.equal(rowText(f, 'b'), 'VS | Basemap');
  assert.equal(f.byId('ri-slot-b').classList.contains('lit'), false, 'dimmed');
  const unpinA = f.byId('ri-unpin-a');
  assert.deepEqual(
    [
      unpinA.disabled,
      unpinA.classList.contains('is-reserved'),
      unpinA.textContent,
    ],
    [true, true, '×'],
  );
  f.key('s');
  assert.equal(rowText(f, 'a'), 'IMAGE | Sep 18 · Sentinel-2 · 30 m');
  assert.equal(f.byId('ri-slot-a').dataset.state, 'pinned');
  assert.equal(unpinA.disabled, false);
  assert.equal(unpinA.getAttribute('aria-label'), 'Unpin the image');
  modes[1].click();
  assert.equal(f.snap().mode, 'basemap');
  assert.equal(modes[1].getAttribute('aria-checked'), 'true');
  assert.equal(f.byId('ri-slot-b').classList.contains('lit'), true, 'lit');
  modes[2].click();
  assert.equal(rowText(f, 'a'), 'A | Sep 18 · Sentinel-2 · 30 m');
  assert.equal(rowText(f, 'b'), 'B | Not set');
  assert.equal(f.byId('ri-slot-b').dataset.state, 'empty');
  assert.equal(f.byId('ri-unpin-b').classList.contains('is-reserved'), true);
  f.chip(L16, 'b').click();
  assert.equal(rowText(f, 'b'), 'B | Sep 16 · Landsat 8/9 · 30 m');
  f.byId('ri-unpin-b').click();
  assert.equal(f.snap().pins.b.key, null);
  unpinA.click();
  assert.equal(f.snap().pins.a.key, null);
  assert.equal(f.renderer.ownedCount(), 0, 'unpinning drops the layer');
  // Mode keys move the radio selection.
  f.byId('ri-mode').dispatch('keydown', { key: 'ArrowRight' });
  assert.equal(f.snap().mode, 'image');
});

test('[recent-imagery-045] strip keys: arrows preview after the debounce, S / A / B pin, Enter previews, repeats are ignored', async () => {
  const f = fixture();
  await f.ready();
  f.key('ArrowRight');
  assert.equal(f.snap().focus.key, 'L30:2026-09-16');
  f.timers.flush();
  assert.equal(f.snap().preview.key, 'L30:2026-09-16');
  f.key('Home');
  assert.equal(f.snap().focus.key, 'VIIRS:2026-09-21');
  f.key('End');
  assert.equal(f.snap().focus.index, 3);
  f.key('ArrowLeft');
  f.timers.flush();
  f.key('a', { repeat: true });
  assert.equal(f.snap().pins.a.key, null, 'key repeat never pins');
  f.key('b');
  assert.equal(f.snap().pins.b.key, null, 'no B outside A / B');
  f.key('A');
  assert.equal(f.snap().pins.a.key, 'L30:2026-09-16');
  f.key('a');
  assert.equal(f.snap().pins.a.key, null, 'A again unpins');
  f.layer.setMode('ab');
  f.key('a');
  f.key('ArrowLeft');
  f.key('b');
  assert.deepEqual(
    [f.snap().pins.a.key, f.snap().pins.b.key],
    ['L30:2026-09-16', 'S30:2026-09-18'],
  );
  f.key('a', { metaKey: true });
  assert.equal(
    f.snap().pins.a.key,
    'L30:2026-09-16',
    'modified keys are not ours',
  );
  f.layer.setAssignment('a', null);
  f.layer.setAssignment('b', null);
  f.key('Enter');
  assert.equal(
    f.snap().preview.key,
    'S30:2026-09-18',
    'Enter previews the focused day',
  );
});

test('[recent-imagery-045] clicks: a card previews and focuses the strip, a chip pins, SELECT BOX toggles the tool, USE VIEW and CLEAR drive the layer', async () => {
  const f = fixture();
  await f.ready();
  f.card(L16).click();
  assert.equal(f.snap().preview.key, 'L30:2026-09-16');
  assert.equal(f.strip.focused, 1);
  assert.deepEqual(f.strip.focusOptions, { preventScroll: true });
  f.chip(S18, 'a').click();
  assert.equal(f.snap().pins.a.key, 'S30:2026-09-18');
  const selectBox = f.byAction('select-box');
  selectBox.click();
  assert.deepEqual(f.tool.calls, ['start']);
  assert.equal(selectBox.getAttribute('aria-pressed'), 'true');
  selectBox.click();
  assert.deepEqual(f.tool.calls, ['start', 'cancel:toggle']);
  assert.equal(selectBox.getAttribute('aria-pressed'), 'false');
  f.byAction('use-view').click();
  assert.equal(
    f.snap().boxError,
    'Point the camera at the ground to use the view',
  );
  assert.equal(f.byAction('clear').disabled, false);
  f.byAction('clear').click();
  assert.equal(f.snap().box, null);
  assert.equal(f.byAction('clear').disabled, true);
});

test('[recent-imagery-045] Escape clears the preview first, then cancels the box tool, then blurs the strip', async () => {
  const f = fixture();
  await f.ready();
  f.tool.start();
  f.key('Escape');
  assert.equal(f.snap().preview.key, null);
  assert.equal(f.tool.isActive(), true);
  f.key('Escape');
  assert.equal(f.tool.isActive(), false);
  f.key('Escape');
  assert.equal(f.strip.blurred, 1);
  // From elsewhere in the panel Escape only acts when there is something to undo.
  f.card(L16).click();
  const escape = f.byId('ri-opacity').dispatch('keydown', { key: 'Escape' });
  assert.equal(escape.defaultPrevented, true);
  assert.equal(f.snap().preview.key, null);
  const idle = f.byId('ri-opacity').dispatch('keydown', { key: 'Escape' });
  assert.equal(idle.defaultPrevented, false);
});

test('the notice line shows the refusal, then errors, then CLEAR, then the Esri note; the hint names the next step and that SWAP trades the sides', async () => {
  const controller = fakeController();
  let active = 'photoreal';
  controller.getActiveId = () => active;
  const f = fixture({ controller });
  const notice = f.byId('ri-notice');
  const noticeText = f.byId('ri-notice-text');
  const hint = f.byId('ri-hint');
  f.layer.enable();
  assert.equal(noticeText.textContent, '');
  assert.equal(hint.textContent, 'Select a box or use the view');
  f.layer.setBox(BOX);
  assert.equal(hint.textContent, 'Searching the last 30 days');
  f.catalog.resolveLast();
  await settle();
  assert.equal(hint.textContent, '← → preview · S shows the focused day');
  active = 'esri-imagery';
  controller.lease.settle({ status: 'ready', activeId: active });
  await settle();
  assert.equal(
    noticeText.textContent,
    'Imagery on Esri · Google 3D returns when cleared',
  );
  assert.equal(notice.classList.contains('info'), true);
  f.layer.setBox({ west: 0, south: 0, east: 20, north: 20 });
  assert.equal(noticeText.textContent, 'Box is 2,226 km wide · limit 1,000 km');
  assert.equal(notice.classList.contains('warn'), true);
  assert.equal(hint.textContent, 'Zoom in or draw a smaller box');
  f.layer.setBox(BOX);
  f.chip(S18, 'a').click();
  assert.equal(hint.textContent, 'S on another day replaces it · × unpins');
  f.layer.setMode('basemap');
  assert.equal(hint.textContent, 'Drag the divider · SWAP trades sides');
  f.layer.setMode('ab');
  assert.equal(hint.textContent, '← → preview the other side · A or B pins it');
  f.chip(L16, 'b').click();
  assert.equal(hint.textContent, 'Drag the divider · SWAP trades sides');
  f.layer.setAssignment('b', null);
  f.layer.setAssignment('a', null);
  assert.equal(hint.textContent, '← → preview · A or B pins the focused day');
  f.byAction('clear').click();
  assert.equal(noticeText.textContent, 'Box and images cleared');
  assert.equal(notice.classList.contains('info'), true);
});

test('[recent-imagery-046] an oversized box shows its size limit, the warn style and the zoom in hint', () => {
  const f = fixture();
  const notice = f.byId('ri-notice');
  f.layer.enable();
  f.layer.setBox({ west: 0, south: 0, east: 20, north: 20 });
  assert.equal(
    f.byId('ri-notice-text').textContent,
    'Box is 2,226 km wide · limit 1,000 km',
  );
  assert.equal(notice.classList.contains('warn'), true);
  assert.equal(notice.classList.contains('info'), false);
  assert.equal(f.byId('ri-hint').textContent, 'Zoom in or draw a smaller box');
});

test('[recent-imagery-046] the Esri note uses the information style', async () => {
  const controller = fakeController();
  let active = 'photoreal';
  controller.getActiveId = () => active;
  const f = fixture({ controller });
  f.layer.enable();
  f.layer.setBox(BOX);
  f.catalog.resolveLast();
  await settle();
  active = 'esri-imagery';
  controller.lease.settle({ status: 'ready', activeId: active });
  await settle();
  assert.equal(
    f.byId('ri-notice-text').textContent,
    'Imagery on Esri · Google 3D returns when cleared',
  );
  assert.equal(f.byId('ri-notice').classList.contains('info'), true);
  assert.equal(f.byId('ri-notice').classList.contains('warn'), false);
});

test('[recent-imagery-046] an oversized box offers ZOOM IN in a fixed slot at the end of the notice line; it asks the layer to fit', async () => {
  const f = fixture();
  const flights = [];
  f.viewer.scene.canvas.clientHeight = 500;
  f.viewer.scene.ellipsoid = {
    cartographicToCartesian: (c) => ({ ...c }),
  };
  Object.assign(f.viewer.camera, {
    frustum: { fovy: 2 * Math.atan(Math.tan(Math.PI / 6) / 2) },
    flyTo: (options) => flights.push(options),
  });
  const notice = f.byId('ri-notice');
  const zoom = f.byId('ri-zoom-in');
  assert.equal(zoom.tagName, 'BUTTON');
  assert.equal(zoom.textContent, 'ZOOM IN');
  assert.equal(notice.children.at(-1), zoom, 'the right end of the line');
  const reserved = () => [
    zoom.classList.contains('is-reserved'),
    zoom.disabled,
    zoom.getAttribute('aria-hidden'),
    notice.classList.contains('has-action'),
  ];
  await f.ready();
  assert.deepEqual(reserved(), [true, true, 'true', false]);
  zoom.click();
  assert.equal(flights.length, 0);
  f.layer.setBox({ west: 0, south: 0, east: 20, north: 20 });
  assert.deepEqual(reserved(), [false, false, 'false', true]);
  assert.equal(
    f.byId('ri-notice-text').textContent,
    'Box is 2,226 km wide · limit 1,000 km',
  );
  assert.equal(f.byId('ri-hint').textContent, 'Zoom in or draw a smaller box');
  assert.equal(zoom.title, 'Fly in until the view fits the 1,000 km limit');
  zoom.click();
  assert.equal(flights.length, 1);
  assert.ok(
    Math.abs(
      flights[0].destination.height - 400_000 / (2 * Math.tan(Math.PI / 6)),
    ) < 1e-6,
  );
  // Another refusal has nothing to fit; a box that succeeds hides it again.
  f.layer.reportBoxRefusal('Select one side of the dateline');
  assert.deepEqual(reserved(), [true, true, 'true', false]);
  f.layer.setBox({ west: 0, south: 0, east: 20, north: 20 });
  f.layer.setBox(BOX);
  assert.deepEqual(reserved(), [true, true, 'true', false]);
});

test('[recent-imagery-047] the divider exists only while a swipe is live, labelled A / B or IMAGE / BASEMAP; SWAP trades its sides and Space does nothing', async () => {
  const f = fixture();
  const swap = f.byId('ri-swap');
  const swapState = () => [
    swap.disabled,
    swap.classList.contains('is-reserved'),
    swap.getAttribute('aria-hidden'),
    swap.getAttribute('aria-pressed'),
  ];
  const labels = () => {
    const { beforeLabel, afterLabel } = f.splits.at(-1).options;
    return [beforeLabel, afterLabel];
  };
  const directions = () => {
    const owned = f.renderer.getOwned();
    return [owned.a?.splitDirection, owned.b?.splitDirection];
  };
  assert.equal(swap.tagName, 'BUTTON');
  assert.equal(swap.textContent, 'SWAP');
  assert.equal(swap.parentNode, f.byId('ri-controls'));
  await f.ready();
  await f.settleLease();
  assert.equal(f.splits.length, 0, 'one image, no divider');
  assert.deepEqual(swapState(), [true, true, 'true', 'false']);
  swap.click();
  assert.equal(f.snap().swapped, false, 'no swipe, nothing to swap');
  f.layer.setMode('basemap');
  assert.equal(f.splits.length, 1);
  assert.deepEqual(labels(), ['IMAGE', 'BASEMAP']);
  assert.equal(f.splits[0].options.id, 'recent-imagery-split-line');
  assert.deepEqual(swapState(), [false, false, 'false', 'false']);
  assert.deepEqual(directions(), ['left', undefined]);
  // VS BASEMAP: SWAP puts the image right of the basemap, and back.
  swap.click();
  assert.equal(f.snap().swapped, true);
  assert.deepEqual(labels(), ['BASEMAP', 'IMAGE']);
  assert.deepEqual(directions(), ['right', undefined]);
  assert.deepEqual(swapState(), [false, false, 'false', 'true']);
  swap.click();
  assert.deepEqual(labels(), ['IMAGE', 'BASEMAP']);
  assert.deepEqual(directions(), ['left', undefined]);
  f.layer.setMode('ab');
  f.layer.setAssignment('a', S18);
  f.layer.setAssignment('b', L16);
  assert.equal(f.splits[0].destroyed, true);
  const split = f.splits.at(-1);
  assert.deepEqual(
    [split.options.beforeLabel, split.options.afterLabel],
    ['A', 'B'],
  );
  assert.equal(split.options.afterTitle, 'Landsat 8/9 · 30 m · 2026-09-16');
  split.options.onChange(0.3);
  assert.equal(f.snap().split, 0.3);
  assert.deepEqual(directions(), ['left', 'right']);
  // Space is push-to-talk: the panel never takes it.
  for (const target of [f.strip, f.byId('ri-opacity'), f.root]) {
    const space = target.dispatch('keydown', { key: ' ' });
    assert.equal(space.defaultPrevented, false);
  }
  assert.equal(f.splits.at(-1), split, 'the divider is untouched');
  assert.equal(f.snap().swapped, false);
  // SWAP: A moves right and B left, the labels follow; the divider stays.
  swap.click();
  assert.equal(split.destroyed, true);
  assert.deepEqual(labels(), ['B', 'A']);
  assert.equal(
    f.splits.at(-1).options.beforeTitle,
    'Landsat 8/9 · 30 m · 2026-09-16',
  );
  assert.equal(f.splits.at(-1).options.initialValue, 0.3);
  assert.deepEqual(directions(), ['right', 'left']);
  assert.equal(swap.getAttribute('aria-pressed'), 'true');
  assert.equal(f.layer.getParams().swapped, undefined, 'not in the link');
  // Again restores.
  swap.click();
  assert.deepEqual(labels(), ['A', 'B']);
  assert.deepEqual(directions(), ['left', 'right']);
  assert.equal(swap.getAttribute('aria-pressed'), 'false');
  // Unpinning B ends the swipe and SWAP goes back to its reserved slot.
  f.byId('ri-unpin-b').click();
  assert.equal(f.splits.at(-1).destroyed, true);
  assert.deepEqual(swapState(), [true, true, 'true', 'false']);
});

test('[recent-imagery-048] opacity drives both images; EXPORT downloads the pin or the preview and EXPORT B only exists in A / B', async () => {
  const f = fixture();
  await f.ready();
  const exportA = f.byAction('export-a');
  const exportB = f.byAction('export-b');
  assert.deepEqual(
    [
      exportA.textContent,
      exportA.disabled,
      exportB.classList.contains('is-reserved'),
      exportB.disabled,
    ],
    ['EXPORT', false, true, true],
  );
  f.byId('ri-opacity').value = '40';
  f.byId('ri-opacity').dispatch('input');
  assert.equal(f.snap().alpha, 0.4);
  assert.equal(
    f.part(f.byId('ri-controls'), 'ri-opacity-value').textContent,
    '40%',
  );
  assert.equal(await f.readout.exportImage('a'), true);
  assert.match(f.fetches[0], /LAYERS=HLS_S30_Nadir_BRDF_Adjusted_Reflectance/);
  assert.match(f.fetches[0], /WIDTH=1024/);
  assert.deepEqual(f.urls, {
    created: ['blob:export'],
    revoked: ['blob:export'],
  });
  assert.equal(await f.readout.exportImage('b'), false, 'no B outside A / B');
  // A wide box exports wide: the longer side at the limit, degrees kept.
  f.layer.setBox({ ...BOX, east: -97.6 });
  f.catalog.resolveLast();
  await settle();
  assert.equal(await f.readout.exportImage('a'), true);
  assert.match(f.fetches.at(-1), /WIDTH=1024&HEIGHT=512/);
  f.layer.setMode('ab');
  assert.deepEqual(
    [
      exportA.textContent,
      exportB.textContent,
      exportB.classList.contains('is-reserved'),
    ],
    ['EXPORT A', 'EXPORT B', false],
  );
  const failing = fixture({
    fetchImpl: async () => response({ ok: false, status: 503 }),
  });
  await failing.ready();
  assert.equal(await failing.readout.exportImage('a'), false);
  assert.equal(
    failing.byId('ri-notice-text').textContent,
    'Export failed · HTTP 503',
  );
});

test('[recent-imagery-049] DETAILS is a collapsed rail card holding every note, and the empty-days toggle', async () => {
  const f = fixture();
  await f.ready();
  const header = f
    .byId('ri-details')
    .find((node) => node.classList.contains('rail-card-header'));
  const article = header.parentNode;
  assert.equal(article.dataset.open, 'false');
  assert.equal(header.getAttribute('aria-expanded'), 'false');
  header.click();
  assert.equal(article.dataset.open, 'true');
  const text = f.byId('ri-details').textContent;
  assert.match(text, /Box \d+\.\d × \d+\.\d km/);
  assert.match(text, /Sep 18, 2026 17:12Z/);
  assert.match(text, /Acquired 17:12Z–17:14Z · Coverage full/);
  assert.match(text, /S30-2026-09-18 · 17:12Z · 12% cloud/);
  assert.match(text, /START HERE · newest clear day/);
  assert.match(
    text,
    /Daily overview for today may still be empty until the pass/,
  );
  assert.match(text, /Daily overview shows little detail in a box this small/);
  assert.match(text, /NASA GIBS/);
  const toggle = f.byAction('toggle-empty');
  assert.equal(toggle.disabled, true, 'nothing hidden yet');
  f.thumbnails.probe(L16, 'empty');
  assert.equal(toggle.textContent, 'SHOW EMPTY DAYS · 1');
  toggle.click();
  assert.equal(f.snap().showUnavailable, true);
  assert.equal(toggle.textContent, 'HIDE EMPTY DAYS');
  header.click();
  assert.equal(article.dataset.open, 'false');
});

test('[recent-imagery-050] the body scroll position stays after content updates', async () => {
  const f = fixture();
  await f.ready();
  f.body.scrollTop = 120;
  const insert = f.strip.insertBefore.bind(f.strip);
  f.strip.insertBefore = (...args) => {
    f.body.scrollTop = 0;
    return insert(...args);
  };
  f.thumbnails.probe(L16, 'empty');
  assert.equal(f.body.scrollTop, 120);
  f.layer.setShowUnavailable(true);
  assert.equal(f.body.scrollTop, 120);
});

test('[recent-imagery-043] destroy returns every listener, the divider and the panel state', async () => {
  const f = fixture();
  await f.ready();
  await f.settleLease();
  f.layer.setMode('basemap');
  const split = f.splits.at(-1);
  f.readout.destroy();
  assert.equal(split.destroyed, true);
  assert.equal(f.root.listenerCount(), 0);
  assert.equal(f.strip.listenerCount(), 0);
  assert.equal(f.root.parentNode, null);
  assert.equal(f.document.getElementById('recent-imagery-panel').hidden, true);
  f.layer.setMode('ab');
  assert.equal(f.splits.length, 1, 'no renders after destroy');
  f.readout.destroy();
});

function snapshotPanel(initial, options = {}) {
  const dom = fakeDocument();
  options.setupDom?.(dom);
  if (options.noChrome) dom.document.getElementById = () => null;
  let snapshot = initial;
  let callback;
  const calls = [];
  const layer = {
    getSnapshot: () => snapshot,
    subscribe(fn) {
      callback = fn;
      return () => calls.push(['off']);
    },
    setToolHandler(fn) {
      calls.push(['tool', Boolean(fn)]);
    },
    setVisibleRange(first, last) {
      calls.push(['range', first, last]);
    },
    focus(index) {
      calls.push(['focus', index]);
    },
    preview(key) {
      calls.push(['preview', key]);
    },
    toggleAssignment(slot, key) {
      calls.push(['pin', slot, key]);
    },
    setMode(mode) {
      calls.push(['mode', mode]);
    },
    clearPreview() {
      return false;
    },
    zoomToFit() {
      calls.push(['zoom']);
    },
    setAlpha(value) {
      calls.push(['alpha', value]);
    },
    setSplit(value) {
      calls.push(['split', value]);
    },
    setShowUnavailable(value) {
      calls.push(['empty', value]);
    },
  };
  options.setupLayer?.(layer, calls);
  const readout = createRecentImageryPanel({
    container: dom.body,
    layer,
    ...options,
  });
  return {
    ...dom,
    readout,
    calls,
    byId: (id) => readout.root.find((node) => node.id === id),
    emit(next, reason = 'state') {
      if (next) snapshot = next;
      callback(next, reason);
    },
  };
}

test('[recent-imagery-043 recent-imagery-044] absent panel input and an absent thumbnail state use known DOM values', async () => {
  assert.equal(createRecentImageryPanel(), null);
  const f = fixture();
  await f.ready();
  const s = f.snap();
  const p = snapshotPanel(s);
  const c = {
    ...s.candidates[0],
    thumbnail: { status: 'present', objectUrl: 'blob:thumb' },
    cloud: { min: 2, max: 12 },
    pending: true,
    preview: false,
  };
  const next = {
    ...s,
    candidates: [c],
    focus: c,
    focusIndex: 0,
    recommended: { key: c.key, reason: 'bad' },
  };
  p.emit(next);
  const image = p.readout.root.find((node) => node.tagName === 'IMG');
  assert.equal(image.src, 'blob:thumb');
  assert.equal(image.hidden, false);
  assert.equal(p.readout.root.textContent.includes('2–12% cloud'), true);
  p.emit(
    { ...next, candidates: [{ ...c, thumbnail: { status: 'unknown' } }] },
    'thumbnail',
  );
  assert.equal(image.src, '');
  assert.equal(image.hidden, true);
  p.emit(next, 'thumbnail');
  p.readout.destroy();
  assert.equal(image.src, '');
  f.readout.destroy();
  f.layer.destroy();
});

test('[recent-imagery-045] strip keys and dimensions keep focus local', async () => {
  const f = fixture();
  await f.ready();
  const p = snapshotPanel(f.snap());
  const strip = p.byId('ri-strip');
  strip.clientWidth = 100;
  const cards = strip.findAll((node) => node.classList.contains('ri-card'));
  cards.forEach((card, index) => {
    card.offsetLeft = index * 80;
    card.offsetWidth = 80;
  });
  strip.scrollLeft = 100;
  strip.dispatch('scroll');
  assert.deepEqual(p.calls.at(-1), ['range', 1, 2]);
  p.emit({ ...f.snap(), focusIndex: 0 });
  strip.dispatch('keydown', { key: 'Home' });
  assert.equal(strip.scrollLeft, 0);
  p.emit({ ...f.snap(), focusIndex: 2 });
  strip.dispatch('keydown', { key: 'End' });
  assert.equal(strip.scrollLeft, 140);
  const before = p.calls.length;
  for (const extra of [{ ctrlKey: true }, { metaKey: true }, { altKey: true }])
    strip.dispatch('keydown', { key: 'Enter', ...extra });
  strip.dispatch('keydown', { key: '' });
  assert.equal(p.calls.length, before);
  p.byId('ri-mode').dispatch('keydown', { key: 'ArrowRight' });
  assert.deepEqual(p.calls.at(-1), ['mode', 'basemap']);
  p.byId('ri-mode').dispatch('keydown', { key: 'Space' });
  assert.deepEqual(p.calls.at(-1), ['mode', 'basemap']);
  p.readout.destroy();
  f.readout.destroy();
  f.layer.destroy();
});

test('[recent-imagery-048] an export failure and late data do not create a download', async () => {
  const f = fixture({ fetchImpl: async () => undefined });
  await f.ready();
  assert.equal(await f.readout.exportImage(), false);
  assert.equal(
    f.byId('ri-notice-text').textContent,
    'Export failed · HTTP error',
  );
  assert.deepEqual(f.urls.created, []);
  f.readout.destroy();
  f.layer.destroy();
  let finish;
  const g = fixture({
    fetchImpl: () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  });
  await g.ready();
  const work = g.readout.exportImage();
  assert.equal(await g.readout.exportImage(), false);
  g.readout.destroy();
  finish(response());
  assert.equal(await work, false);
  assert.deepEqual(g.urls.created, []);
  g.layer.destroy();
});

test('[recent-imagery-047] divider callbacks use globe width and screen reader side labels', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setMode('basemap');
  await f.settleLease();
  const options = f.splits.at(-1).options;
  assert.equal(options.getViewportWidth(), 1000);
  assert.equal(
    options.formatValueText(40, 60),
    'Image 40 percent, basemap 60 percent',
  );
  f.viewer.scene.canvas.clientWidth = 0;
  assert.equal(options.getViewportWidth(), 1200);
  f.document.documentElement.clientWidth = 0;
  assert.equal(options.getViewportWidth(), 0);
  options.onChange(0.4);
  assert.equal(f.snap().split, 0.4);
  f.readout.destroy();
  f.layer.destroy();
});

test('[recent-imagery-043 recent-imagery-048 recent-imagery-049] the panel owns its class, details title and export filename', async () => {
  const f = fixture();
  await f.ready();
  assert.equal(f.root.className, 'recent-imagery-readout');
  assert.equal(f.byId('ri-details').textContent.includes('Details'), true);
  let download;
  const create = f.document.createElement;
  f.document.createElement = (tag) => {
    const node = create(tag);
    if (tag === 'a')
      node.click = () => {
        download = node.download;
      };
    return node;
  };
  assert.equal(await f.readout.exportImage(), true);
  assert.equal(download, 'recent-imagery-S30-2026-09-18.png');
  f.readout.destroy();
  f.layer.destroy();
});

test('[recent-imagery-049 recent-imagery-055] the panel shows the DETAILS card when DETAILS opens', async () => {
  const f = fixture();
  await f.ready();
  f.body.clientHeight = 100;
  f.body.clientTop = 2;
  f.body.getBoundingClientRect = () => ({ top: 10 });
  const header = f
    .byId('ri-details')
    .find((node) => node.classList.contains('rail-card-header'));
  header.parentNode.getBoundingClientRect = () => ({
    top: 120,
    height: header.parentNode.dataset.open === 'true' ? 60 : 0,
  });
  header.click();
  assert.equal(header.parentNode.dataset.open, 'true');
  assert.equal(f.body.scrollTop, 68);
  header.click();
  header.parentNode.getBoundingClientRect = () => ({
    top: -10,
    height: header.parentNode.dataset.open === 'true' ? 60 : 0,
  });
  header.click();
  assert.equal(header.parentNode.dataset.open, 'true');
  assert.equal(f.body.scrollTop, 46);
  header.click();
  f.body.clientTop = 0;
  f.body.scrollTop = 40;
  header.click();
  assert.equal(header.parentNode.dataset.open, 'true');
  assert.equal(f.body.scrollTop, 20);
  f.readout.destroy();
  f.layer.destroy();
});

test('[recent-imagery-044 recent-imagery-049] the panel details use absent and overview facts', async () => {
  const f = fixture();
  await f.ready();
  const base = f.snap();
  const c = {
    ...base.candidates[0],
    product: 'X30',
    cloud: null,
    timeRange: { start: 'bad' },
    granules: [{ product: 'X30', timeStart: 'bad', cloud: null }],
    coverage: null,
    thumbnail: null,
  };
  const p = snapshotPanel({
    ...base,
    candidates: [c],
    focus: c,
    focusIndex: 0,
    boxSizeKm: { width: NaN, height: 120 },
    readout: null,
  });
  assert.equal(p.readout.root.textContent.includes('Box ? × 120 km'), true);
  assert.equal(p.readout.root.textContent.includes('Coverage unknown'), true);
  assert.equal(p.readout.root.textContent.includes('X30'), true);
  const overview = {
    ...c,
    product: 'VIIRS',
    timeRange: null,
    granules: null,
    thumbnail: { acquisitionTime: '2026-09-18T17:12:00Z' },
  };
  p.emit({
    ...base,
    candidates: [overview],
    focus: overview,
    focusIndex: 0,
    pins: {
      ...base.pins,
      a: { key: c.key, candidate: c, sourceOff: true, label: 'Old image' },
    },
  });
  assert.equal(p.readout.root.textContent.includes('Acquired 17:12Z'), true);
  assert.equal(
    p.readout.root.textContent.includes('Source off · Old image'),
    true,
  );
  p.emit({ ...base, candidates: [], focus: null, hiddenCount: 1 });
  assert.equal(
    p.readout.root.textContent.includes('Every day is empty here'),
    true,
  );
  p.emit({
    ...base,
    candidates: [],
    focus: null,
    sources: { hls: false, viirs: false },
    hiddenCount: 0,
  });
  assert.equal(p.readout.root.textContent.includes('Sources off'), true);
  p.readout.destroy();
  f.readout.destroy();
  f.layer.destroy();
});

test('[recent-imagery-048] the default export URL helpers own and release a large PNG', async () => {
  const f = fixture();
  await f.ready();
  const base = f.snap();
  const create = URL.createObjectURL;
  const revoke = URL.revokeObjectURL;
  const revoked = [];
  const fetches = [];
  URL.createObjectURL = () => 'blob:large';
  URL.revokeObjectURL = (url) => revoked.push(url);
  try {
    const p = snapshotPanel(
      {
        ...base,
        box: { west: 0, south: 0, east: 2, north: 1 },
        boxSizeKm: { width: 222, height: 111 },
      },
      {
        fetchImpl: async (url) => {
          fetches.push(url);
          return response();
        },
      },
    );
    assert.equal(await p.readout.exportImage(), true);
    assert.match(fetches[0], /WIDTH=2048&HEIGHT=1024/);
    assert.deepEqual(revoked, ['blob:large']);
    p.readout.destroy();
  } finally {
    URL.createObjectURL = create;
    URL.revokeObjectURL = revoke;
  }
  f.readout.destroy();
  f.layer.destroy();
});

test('[recent-imagery-045] an Enter repeat does not ask for another preview', async () => {
  const f = fixture();
  await f.ready();
  const p = snapshotPanel(f.snap());
  p.byId('ri-strip').dispatch('keydown', { key: 'Enter' });
  p.byId('ri-strip').dispatch('keydown', { key: 'Enter', repeat: true });
  assert.deepEqual(
    p.calls.filter(([call]) => call === 'preview'),
    [['preview', 'S30:2026-09-18']],
  );
  p.readout.destroy();
  f.readout.destroy();
  f.layer.destroy();
});

test('[recent-imagery-045 recent-imagery-048] the export action and the layer CLEAR action use panel callbacks', async () => {
  const f = fixture();
  await f.ready();
  f.byAction('export-a').click();
  await settle();
  assert.deepEqual(f.urls.revoked, ['blob:export']);
  f.tool.start();
  f.layer.clear();
  assert.equal(f.tool.isActive(), false);
  assert.equal(f.tool.calls.includes('cancel:layer'), true);
  f.readout.destroy();
  f.layer.destroy();
});

test('[recent-imagery-043 recent-imagery-047] the panel uses the default frame callback and ignores late state', async () => {
  const f = fixture();
  await f.ready();
  const base = f.snap();
  let callback;
  let renders = 0;
  const p = snapshotPanel(
    {
      ...base,
      comparison: { active: true },
      shown: { ...base.shown, swipe: 'basemap' },
    },
    {
      viewer: {
        scene: {
          requestRender() {
            renders += 1;
          },
        },
      },
      createSplit: (options) => {
        callback = options.requestRender;
        return { setValue() {}, destroy() {} };
      },
    },
  );
  callback();
  assert.equal(renders, 1);
  p.emit(null, 'alpha');
  p.readout.destroy();
  p.emit({ ...base, mode: 'ab' });
  assert.equal(p.readout.root.dataset.mode, 'image');
  assert.equal(p.calls.filter(([call]) => call === 'off').length, 1);
  f.readout.destroy();
  f.layer.destroy();
});

test('[recent-imagery-048] a thrown export value appears as an error', async () => {
  const f = fixture({
    fetchImpl: async () => {
      throw 'source-error';
    },
  });
  await f.ready();
  assert.equal(await f.readout.exportImage(), false);
  assert.equal(
    f.byId('ri-notice-text').textContent,
    'Export failed · source-error',
  );
  f.readout.destroy();
  f.layer.destroy();
});

test('[recent-imagery-043 recent-imagery-044] absent chrome and source facts keep the panel usable', async () => {
  const f = fixture();
  await f.ready();
  const base = f.snap();
  const c = { ...base.candidates[0], product: '', pinned: 'b' };
  const p = snapshotPanel(
    {
      ...base,
      candidates: [c],
      focus: c,
      focusIndex: 0,
      boxSizeKm: { width: 11 },
    },
    { noChrome: true },
  );
  assert.equal(p.readout.root.hidden, false);
  assert.equal(p.readout.root.textContent.includes('Box 11.0 × ? km'), true);
  assert.equal(
    p.readout.root.find((node) => node.classList.contains('ri-card-sensor'))
      .textContent,
    '',
  );
  const label = p.readout.root
    .find((node) => node.classList.contains('ri-card'))
    .getAttribute('aria-label');
  assert.equal(label.includes('pinned'), false);
  assert.equal(label.includes('shown'), false);
  p.emit({
    ...base,
    pins: {
      ...base.pins,
      a: {
        key: c.key,
        candidate: c,
        label: 'Day',
        sourceOff: false,
        drapable: false,
      },
    },
  });
  assert.equal(p.readout.root.textContent.includes('Day · loading'), true);
  p.readout.destroy();
  f.readout.destroy();
  f.layer.destroy();
});

test('[recent-imagery-048] zero snapshot spans still request a finite image size', async () => {
  const f = fixture();
  await f.ready();
  const fetches = [];
  const p = snapshotPanel(
    { ...f.snap(), box: { west: 0, south: 0, east: 0, north: 0 } },
    {
      fetchImpl: async (url) => {
        fetches.push(url);
        return response();
      },
      createObjectUrl: () => 'blob:square',
      revokeObjectUrl: () => {},
    },
  );
  assert.equal(await p.readout.exportImage(), true);
  assert.match(fetches[0], /WIDTH=1024&HEIGHT=1024/);
  p.readout.destroy();
  f.readout.destroy();
  f.layer.destroy();
});

test('[recent-imagery-048] an export rejection after panel destroy does not add a notice', async () => {
  let reject;
  const f = fixture({
    fetchImpl: () =>
      new Promise((resolve, fail) => {
        reject = fail;
      }),
  });
  await f.ready();
  const work = f.readout.exportImage();
  const notice = f.byId('ri-notice-text');
  const before = notice.textContent;
  f.readout.destroy();
  reject(new Error('late'));
  assert.equal(await work, false);
  assert.equal(notice.textContent, before);
  f.layer.destroy();
});

test('[recent-imagery-051] absent card dimensions use zero for the visible range', async () => {
  const f = fixture();
  await f.ready();
  const p = snapshotPanel(f.snap());
  const strip = p.byId('ri-strip');
  strip.clientWidth = 100;
  strip.scrollLeft = 1;
  strip.dispatch('scroll');
  assert.deepEqual(
    p.calls.filter(([call]) => call === 'range'),
    [],
  );
  strip.scrollLeft = 0;
  strip.dispatch('scroll');
  assert.deepEqual(
    p.calls.filter(([call]) => call === 'range'),
    [['range', 0, 3]],
  );
  p.readout.destroy();
  f.readout.destroy();
  f.layer.destroy();
});

test('[recent-imagery-045] a pin action without a card key does not call the layer', async () => {
  const f = fixture();
  await f.ready();
  let calls = 0;
  const assign = f.layer.toggleAssignment;
  f.layer.toggleAssignment = (...args) => {
    calls += 1;
    return assign(...args);
  };
  const chip = f.chip(S18, 'a');
  f.card(S18).dataset.key = '';
  chip.click();
  assert.equal(calls, 0);
  assert.equal(f.snap().pins.a.key, null);
  f.readout.destroy();
  f.layer.destroy();
});

test('[recent-imagery-045] a focus callback that clears the layer keeps strip scroll fixed', async () => {
  const f = fixture();
  await f.ready();
  f.strip.clientWidth = 100;
  f.strip.scrollLeft = 10;
  f.card(L16).offsetWidth = 100;
  f.card(L16).offsetLeft = 200;
  const off = f.layer.subscribe((snapshot) => {
    if (snapshot.box && snapshot.focus?.key === L16) f.layer.clear();
  });
  assert.doesNotThrow(() => f.key('ArrowRight'));
  assert.equal(f.snap().candidates.length, 0);
  assert.equal(f.strip.scrollLeft, 10);
  off();
  f.readout.destroy();
  f.layer.destroy();
});

test('[recent-imagery-044] an empty thumbnail host gets a new image', async () => {
  const f = fixture();
  await f.ready();
  const host = f.part(f.card(S18), 'ri-thumb');
  for (const child of [...host.children]) child.remove();
  const get = f.thumbnails.get;
  f.thumbnails.get = (key) =>
    key === S18 ? { status: 'present', objectUrl: 'blob:rebuilt' } : get(key);
  f.thumbnails.probe(S18, 'present');
  assert.equal(host.children.length, 1);
  assert.equal(host.children[0].src, 'blob:rebuilt');
  assert.equal(Object.hasOwn(host.children[0], 'src'), true);
  f.readout.destroy();
  f.layer.destroy();
});

test('[recent-imagery-044] new catalog cards can go into an empty strip host', async () => {
  const f = fixture();
  await f.ready();
  f.strip.find((node) => node.classList.contains('ri-strip-empty')).remove();
  f.layer.setBox({ ...BOX, east: -97.6 });
  f.catalog.resolveLast();
  await settle();
  assert.deepEqual(
    f.strip.children.map((node) => node.dataset.key),
    [
      'VIIRS:2026-09-21',
      'S30:2026-09-18',
      'L30:2026-09-16',
      'VIIRS:2026-09-15',
    ],
  );
  f.readout.destroy();
  f.layer.destroy();
});

test('[recent-imagery-044] a new catalog removes both old day cards', async () => {
  const f = fixture();
  await f.ready();
  assert.equal(f.cards().length, 4);
  f.layer.setBox({ ...BOX, east: -97.69 });
  f.catalog.resolveLast([]);
  await settle();
  assert.equal(f.cards().length, 0);
  assert.equal(f.card(S18), undefined);
  assert.equal(f.card(L16), undefined);
  f.readout.destroy();
  f.layer.destroy();
});

test('[recent-imagery-049] details show both independent notes', async () => {
  const f = fixture();
  await f.ready();
  const p = snapshotPanel({
    ...f.snap(),
    notes: ['First note', 'Second note'],
  });
  assert.equal(p.byId('ri-details').textContent.includes('First note'), true);
  assert.equal(p.byId('ri-details').textContent.includes('Second note'), true);
  p.readout.destroy();
  f.readout.destroy();
  f.layer.destroy();
});

test('[recent-imagery-043] the panel clears both day image URLs when it stops', async () => {
  const f = fixture();
  await f.ready();
  f.thumbnails.get = (key) => ({ status: 'present', objectUrl: `blob:${key}` });
  f.layer.setShowUnavailable(true);
  const images = f
    .cards()
    .map((card) => card.find((node) => node.tagName === 'IMG'));
  assert.equal(images[0].src, 'blob:VIIRS:2026-09-21');
  assert.equal(images[1].src, 'blob:S30:2026-09-18');
  f.readout.destroy();
  assert.equal(images[0].src, '');
  assert.equal(images[1].src, '');
  f.layer.destroy();
});

async function auditPanelState() {
  const catalog = fakeCatalog();
  const layer = createRecentImageryLayer({
    catalog,
    renderer: fakeRenderer(),
    thumbnails: fakeThumbnails(),
    host: () => ({ collection: {}, kind: 'globe' }),
    now: () => new Date('2026-09-21T15:00:00Z'),
  });
  layer.setSources({ viirs: true });
  layer.init({ camera: {} });
  layer.enable();
  layer.setBox(BOX);
  catalog.resolveLast();
  await settle();
  const state = layer.getSnapshot();
  layer.destroy();
  return state;
}
function auditPanel(state, options = {}) {
  const splits = [];
  const p = snapshotPanel(state, {
    createSplit: (value) => {
      splits.push(value);
      return { setValue() {}, destroy() {} };
    },
    fetchImpl: async () => response(),
    createObjectUrl: () => 'blob:audit',
    revokeObjectUrl() {},
    ...options,
  });
  return { ...p, splits };
}
const auditNode = (p, cls) =>
  p.readout.root.find((node) => node.classList.contains(cls));
const auditAction = (p, id) =>
  p.readout.root.find((node) => node.dataset.actionId === id);
const auditCard = (p) => auditNode(p, 'ri-card');
const auditLine = (p, id) =>
  p.readout.root.find((node) => node.dataset.lineId === id);
function auditScroll(
  p,
  { height = 100, top = 90, cardHeight = 20, cardRect = true } = {},
) {
  const requests = [];
  let scroll = 0;
  Object.defineProperty(p.body, 'scrollTop', {
    configurable: true,
    get: () => scroll,
    set: (value) => {
      requests.push(value);
      scroll = value;
    },
  });
  p.body.clientHeight = height;
  p.body.clientTop = 0;
  p.body.getBoundingClientRect = () => ({ top: 0 });
  const header = auditNode(p, 'rail-card-header');
  if (cardRect)
    header.parentNode.getBoundingClientRect = () => ({
      top,
      height: cardHeight,
    });
  return { requests, header };
}

test('[recent-imagery-043] an absent layer alone does not allow a panel', async () => {
  const dom = fakeDocument();
  assert.equal(createRecentImageryPanel({ container: dom.body }), null);
});

test('[recent-imagery-043] an absent document factory alone does not allow a panel', async () => {
  const dom = fakeDocument();
  dom.document.createElement = null;
  assert.equal(
    createRecentImageryPanel({ container: dom.body, layer: {} }),
    null,
  );
});

test('[recent-imagery-044] one day uses the singular count label', async () => {
  const s = await auditPanelState();
  s.candidates = [s.candidates[1]];
  const p = auditPanel(s);
  assert.equal(p.count.textContent, '1 DAY');
  p.readout.destroy();
});

test('[recent-imagery-046] a single B pin gives the other side hint', async () => {
  const s = await auditPanelState();
  s.mode = 'ab';
  s.pins.b.key = L16;
  const p = auditPanel(s);
  assert.equal(
    p.byId('ri-hint').textContent,
    '← → preview the other side · A or B pins it',
  );
  p.readout.destroy();
});

test('[recent-imagery-045] a box refusal alone keeps CLEAR active', async () => {
  const s = await auditPanelState();
  s.box = null;
  s.boxError = 'Box edges must be finite';
  const p = auditPanel(s);
  assert.equal(auditAction(p, 'clear').disabled, false);
  p.readout.destroy();
});

test('[recent-imagery-046] an error alone does not allow the information style', async () => {
  const s = await auditPanelState();
  s.error = 'Failed';
  const p = auditPanel(s);
  assert.equal(auditNode(p, 'ri-notice').classList.contains('info'), false);
  p.readout.destroy();
});

test('[recent-imagery-046] an empty notice alone does not allow the information style', async () => {
  const s = await auditPanelState();
  s.error = null;
  s.notice = null;
  s.borrowedEsri = false;
  const p = auditPanel(s);
  assert.equal(auditNode(p, 'ri-notice').classList.contains('info'), false);
  p.readout.destroy();
});

test('[recent-imagery-044] an unknown day status alone keeps its placeholder', async () => {
  const s = await auditPanelState();
  s.candidates = [
    {
      ...s.candidates[1],
      thumbnail: { status: 'unknown', objectUrl: 'blob:1' },
    },
  ];
  const p = auditPanel(s);
  assert.equal(auditNode(p, 'ri-thumb-text').hidden, false);
  p.readout.destroy();
});

test('[recent-imagery-044] an absent image URL alone keeps the placeholder', async () => {
  const s = await auditPanelState();
  s.candidates = [
    { ...s.candidates[1], thumbnail: { status: 'present', objectUrl: null } },
  ];
  const p = auditPanel(s);
  assert.equal(auditNode(p, 'ri-thumb-text').hidden, false);
  p.readout.destroy();
});

test('[recent-imagery-044] a stable thumbnail uses the same image element again', async () => {
  const s = await auditPanelState();
  s.candidates = [
    {
      ...s.candidates[1],
      thumbnail: { status: 'present', objectUrl: 'blob:1' },
    },
  ];
  const p = auditPanel(s);
  p.emit(s, 'thumbnail');
  assert.equal(
    p.readout.root.findAll((node) => node.tagName === 'IMG').length,
    1,
  );
  p.readout.destroy();
});

test('[recent-imagery-044] an unchanged thumbnail URL does not set the image URL again', async () => {
  const s = await auditPanelState();
  s.candidates = [
    {
      ...s.candidates[1],
      thumbnail: { status: 'present', objectUrl: 'blob:1' },
    },
  ];
  const p = auditPanel(s);
  const image = auditNode(p, 'ri-thumb-img'),
    writes = [];
  let src = image.src;
  Object.defineProperty(image, 'src', {
    configurable: true,
    get: () => src,
    set: (value) => {
      writes.push(value);
      src = value;
    },
  });
  p.emit(s, 'thumbnail');
  assert.deepEqual(writes, []);
  p.readout.destroy();
});

test('[recent-imagery-044] an error status alone clears the old image URL', async () => {
  const s = await auditPanelState();
  s.candidates = [
    {
      ...s.candidates[1],
      thumbnail: { status: 'present', objectUrl: 'blob:1' },
    },
  ];
  const p = auditPanel(s),
    image = auditNode(p, 'ri-thumb-img');
  s.candidates = [
    { ...s.candidates[0], thumbnail: { status: 'error', objectUrl: 'blob:1' } },
  ];
  p.emit(s, 'thumbnail');
  assert.equal(image.src, '');
  p.readout.destroy();
});

test('[recent-imagery-044] an active day request has the busy flag', async () => {
  const s = await auditPanelState();
  s.candidates = [{ ...s.candidates[1], preview: false, pending: true }];
  const p = auditPanel(s);
  assert.equal(auditNode(p, 'ri-card-flag').textContent, 'LOADING');
  p.readout.destroy();
});

test('[recent-imagery-044] an inactive B chip has a false screen reader state', async () => {
  const s = await auditPanelState();
  s.candidates = [{ ...s.candidates[1], pinned: 'b', preview: false }];
  const p = auditPanel(s);
  assert.equal(
    auditCard(p)
      .find((node) => node.dataset.slot === 'b')
      .getAttribute('aria-pressed'),
    'false',
  );
  p.readout.destroy();
});

test('[recent-imagery-044] an A and B pin has its screen reader slot', async () => {
  const s = await auditPanelState();
  s.mode = 'ab';
  s.candidates = [{ ...s.candidates[1], pinned: 'a', preview: false }];
  s.recommended = null;
  const p = auditPanel(s);
  assert.equal(
    auditCard(p).getAttribute('aria-label'),
    'Sep 18 · Sentinel-2 · 30 m · 12% cloud · pinned A',
  );
  p.readout.destroy();
});

test('[recent-imagery-044] a preview day has its screen reader state', async () => {
  const s = await auditPanelState();
  s.mode = 'image';
  s.candidates = [{ ...s.candidates[1], pinned: null, preview: true }];
  s.recommended = null;
  const p = auditPanel(s);
  assert.equal(
    auditCard(p).getAttribute('aria-label'),
    'Sep 18 · Sentinel-2 · 30 m · 12% cloud · preview',
  );
  p.readout.destroy();
});

test('[recent-imagery-044] a plain day has only its screen reader facts', async () => {
  const s = await auditPanelState();
  s.mode = 'image';
  s.candidates = [{ ...s.candidates[1], pinned: null, preview: false }];
  s.recommended = null;
  const p = auditPanel(s);
  assert.equal(
    auditCard(p).getAttribute('aria-label'),
    'Sep 18 · Sentinel-2 · 30 m · 12% cloud',
  );
  p.readout.destroy();
});

test('[recent-imagery-044] a recommended day has its screen reader rank', async () => {
  const s = await auditPanelState();
  s.mode = 'image';
  s.candidates = [{ ...s.candidates[1], pinned: null, preview: false }];
  s.recommended = { key: S18, reason: 'clear' };
  const p = auditPanel(s);
  assert.equal(
    auditCard(p).getAttribute('aria-label'),
    'Sep 18 · Sentinel-2 · 30 m · 12% cloud · start here',
  );
  p.readout.destroy();
});

test('[recent-imagery-044] a full strip has an empty status label', async () => {
  const s = await auditPanelState();
  const p = auditPanel(s);
  assert.equal(auditNode(p, 'ri-strip-empty').textContent, '');
  p.readout.destroy();
});

test('[recent-imagery-044] an absent box gives its strip status', async () => {
  const s = await auditPanelState();
  s.candidates = [];
  s.box = null;
  const p = auditPanel(s);
  assert.equal(auditNode(p, 'ri-strip-empty').textContent, 'No box');
  p.readout.destroy();
});

test('[recent-imagery-044] an active search gives its strip status', async () => {
  const s = await auditPanelState();
  s.candidates = [];
  s.searching = true;
  const p = auditPanel(s);
  assert.equal(auditNode(p, 'ri-strip-empty').textContent, 'Searching');
  p.readout.destroy();
});

test('[recent-imagery-044] active sources give the empty imagery status', async () => {
  const s = await auditPanelState();
  s.candidates = [];
  s.sources = { hls: true, viirs: true };
  const p = auditPanel(s);
  assert.equal(auditNode(p, 'ri-strip-empty').textContent, 'No imagery');
  p.readout.destroy();
});

test('[recent-imagery-044] an active HLS source alone gives the empty imagery status', async () => {
  const s = await auditPanelState();
  s.candidates = [];
  s.sources = { hls: true, viirs: false };
  const p = auditPanel(s);
  assert.equal(auditNode(p, 'ri-strip-empty').textContent, 'No imagery');
  p.readout.destroy();
});

test('[recent-imagery-044] an active VIIRS source alone gives the empty imagery status', async () => {
  const s = await auditPanelState();
  s.candidates = [];
  s.sources = { hls: false, viirs: true };
  const p = auditPanel(s);
  assert.equal(auditNode(p, 'ri-strip-empty').textContent, 'No imagery');
  p.readout.destroy();
});

test('[recent-imagery-044] the active mode alone has the zero tab index', async () => {
  const s = await auditPanelState();
  const p = auditPanel(s);
  const buttons = p.readout.root.findAll((node) =>
    node.classList.contains('ri-mode-btn'),
  );
  assert.equal(buttons[0].tabIndex, 0);
  assert.equal(buttons[1].tabIndex, -1);
  assert.equal(buttons[2].tabIndex, -1);
  p.readout.destroy();
});

test('[recent-imagery-044] the A preview does not fill the B row', async () => {
  const s = await auditPanelState();
  s.mode = 'ab';
  const p = auditPanel(s);
  assert.equal(
    p.byId('ri-slot-b').find((node) => node.classList.contains('ri-slot-value'))
      .textContent,
    'Not set',
  );
  p.readout.destroy();
});

test('[recent-imagery-044] IMAGE keeps the stored B pin controls inactive', async () => {
  const s = await auditPanelState();
  s.pins.b = {
    ...s.pins.b,
    key: L16,
    candidate: s.candidates[2],
    drapable: true,
    sourceOff: false,
    label: 'Day B',
  };
  const p = auditPanel(s);
  assert.equal(p.byId('ri-slot-b').dataset.state, 'empty');
  assert.equal(p.byId('ri-unpin-b').disabled, true);
  assert.equal(auditAction(p, 'export-b').disabled, true);
  assert.equal(await p.readout.exportImage('b'), false);
  p.readout.destroy();
});

test('[recent-imagery-044] a pin whose source is off loses its image controls', async () => {
  const s = await auditPanelState();
  s.pins.a = {
    ...s.pins.a,
    key: S18,
    candidate: s.candidates[1],
    drapable: false,
    sourceOff: false,
    label: 'Day A',
  };
  s.preview = { key: null, slot: null };
  const p = auditPanel(s);
  assert.equal(p.byId('ri-slot-a').classList.contains('lit'), true);
  s.pins.a = { ...s.pins.a, sourceOff: true };
  p.emit(s);
  assert.equal(p.byId('ri-slot-a').classList.contains('lit'), false);
  assert.equal(p.byId('ri-slot-a').textContent.includes(' · loading'), false);
  assert.equal(auditAction(p, 'export-a').disabled, true);
  p.readout.destroy();
});

test('[recent-imagery-044] a pin without day facts has only its day label', async () => {
  const s = await auditPanelState();
  s.pins.a = {
    ...s.pins.a,
    key: S18,
    candidate: null,
    drapable: false,
    sourceOff: false,
    label: 'Day A',
  };
  const p = auditPanel(s);
  assert.equal(
    p.byId('ri-slot-a').find((node) => node.classList.contains('ri-slot-value'))
      .textContent,
    'Day A',
  );
  p.readout.destroy();
});

test('[recent-imagery-044] an image row has the active style', async () => {
  const s = await auditPanelState();
  const p = auditPanel(s);
  assert.equal(p.byId('ri-slot-a').classList.contains('lit'), true);
  p.readout.destroy();
});

test('[recent-imagery-044] an A and B pin has its screen reader removal action', async () => {
  const s = await auditPanelState();
  s.mode = 'ab';
  const p = auditPanel(s);
  assert.equal(p.byId('ri-unpin-a').getAttribute('aria-label'), 'Unpin A');
  assert.equal(p.byId('ri-unpin-b').getAttribute('aria-label'), 'Unpin B');
  p.readout.destroy();
});

test('[recent-imagery-047] an inactive swipe keeps its swap state false', async () => {
  const s = await auditPanelState();
  s.comparison.active = false;
  s.swapped = true;
  const p = auditPanel(s);
  assert.equal(p.byId('ri-swap').classList.contains('active'), false);
  assert.equal(p.byId('ri-swap').getAttribute('aria-pressed'), 'false');
  p.readout.destroy();
});

test('[recent-imagery-047] an unchanged swipe keeps its swap state false', async () => {
  const s = await auditPanelState();
  s.comparison.active = true;
  s.swapped = false;
  const p = auditPanel(s);
  assert.equal(p.byId('ri-swap').classList.contains('active'), false);
  assert.equal(p.byId('ri-swap').getAttribute('aria-pressed'), 'false');
  p.readout.destroy();
});

test('[recent-imagery-048] IMAGE gives its button the correct title', async () => {
  const s = await auditPanelState();
  s.mode = 'image';
  const p = auditPanel(s);
  assert.equal(auditAction(p, 'export-a').title, 'Download the image as a PNG');
  p.readout.destroy();
});

test('[recent-imagery-048] A and B gives its A button the correct title', async () => {
  const s = await auditPanelState();
  s.mode = 'ab';
  const p = auditPanel(s);
  assert.equal(auditAction(p, 'export-a').title, 'Download A as a PNG');
  p.readout.destroy();
});

test('[recent-imagery-049] equal acquisition times have one screen reader time', async () => {
  const s = await auditPanelState();
  s.focus = {
    ...s.focus,
    timeRange: { start: '2026-09-18T17:12:00Z', end: '2026-09-18T17:12:00Z' },
  };
  const p = auditPanel(s);
  assert.equal(
    auditLine(p, 'acquired').textContent,
    'Acquired 17:12Z · Coverage full',
  );
  p.readout.destroy();
});

test('[recent-imagery-049] an invalid granule time has an empty time label', async () => {
  const s = await auditPanelState();
  s.focus = {
    ...s.focus,
    granules: [{ id: 'Scene', timeStart: 'bad', cloud: null }],
  };
  const p = auditPanel(s);
  assert.equal(auditLine(p, 'granule-0').textContent, 'Scene · ');
  p.readout.destroy();
});

test('[recent-imagery-049] an absent granule cloud has no cloud suffix', async () => {
  const s = await auditPanelState();
  s.focus = {
    ...s.focus,
    granules: [{ id: 'Scene', timeStart: '2026-09-18T17:12:00Z', cloud: null }],
  };
  const p = auditPanel(s);
  assert.equal(auditLine(p, 'granule-0').textContent, 'Scene · 17:12Z');
  p.readout.destroy();
});

test('[recent-imagery-049] an inactive overview source alone does not allow its scale note', async () => {
  const s = await auditPanelState();
  s.sources.viirs = false;
  const p = auditPanel(s);
  assert.equal(Boolean(auditLine(p, 'overview-scale')), false);
  p.readout.destroy();
});

test('[recent-imagery-049] a large box alone does not allow its overview scale note', async () => {
  const s = await auditPanelState();
  s.boxSizeKm = { width: 30, height: 30 };
  const p = auditPanel(s);
  assert.equal(Boolean(auditLine(p, 'overview-scale')), false);
  p.readout.destroy();
});

test('[recent-imagery-049] a focused day has its compact readout', async () => {
  const s = await auditPanelState();
  const p = auditPanel(s);
  assert.equal(
    auditNode(p, 'rail-card-compact').textContent,
    'Sep 18, 2026 17:12Z · 3 days ago · Sentinel-2 via HLS · 30 m · 12% scene cloud',
  );
  p.readout.destroy();
});

test('[recent-imagery-049] an absent focus has the generic details title', async () => {
  const s = await auditPanelState();
  s.focus = null;
  s.readout = '';
  const p = auditPanel(s);
  assert.equal(
    auditNode(p, 'rail-card-compact').textContent,
    'Times, coverage, sources',
  );
  p.readout.destroy();
});

test('[recent-imagery-049] the empty day control stays active while it shows empty days', async () => {
  const s = await auditPanelState();
  s.showUnavailable = true;
  s.hiddenCount = 0;
  const p = auditPanel(s);
  assert.equal(auditAction(p, 'toggle-empty').disabled, false);
  p.readout.destroy();
});

test('[recent-imagery-049] a card above the viewport requests its upper edge', async () => {
  const s = await auditPanelState();
  const p = auditPanel(s),
    view = auditScroll(p, { top: -10 });
  view.header.click();
  assert.equal(view.requests[0], -10);
  p.readout.destroy();
});

test('[recent-imagery-049] a tall card requests its upper edge', async () => {
  const s = await auditPanelState();
  const p = auditPanel(s),
    view = auditScroll(p, { top: 10, cardHeight: 120 });
  view.header.click();
  assert.equal(view.requests[0], 10);
  p.readout.destroy();
});

test('[recent-imagery-049] a card below the viewport requests the minimum offset', async () => {
  const s = await auditPanelState();
  const p = auditPanel(s),
    view = auditScroll(p, { top: 90 });
  view.header.click();
  assert.equal(view.requests[0], 10);
  p.readout.destroy();
});

test('[recent-imagery-049] a zero viewport height alone does not allow a scroll request', async () => {
  const s = await auditPanelState();
  const p = auditPanel(s),
    view = auditScroll(p, { height: 0 });
  view.header.click();
  assert.deepEqual(view.requests, []);
  p.readout.destroy();
});

test('[recent-imagery-049 recent-imagery-055] an absent card rectangle alone does not allow a scroll request', async () => {
  const s = await auditPanelState();
  const p = auditPanel(s),
    view = auditScroll(p, { cardRect: false });
  p.body.scrollTop = 40;
  view.requests.length = 0;
  assert.doesNotThrow(() => view.header.click());
  assert.equal(p.body.scrollTop, 40);
  assert.deepEqual(view.requests, []);
  p.readout.destroy();
});

test('[recent-imagery-049] a closed DETAILS card does not request scroll', async () => {
  const s = await auditPanelState();
  const p = auditPanel(s),
    view = auditScroll(p);
  p.emit(s);
  assert.deepEqual(view.requests, []);
  p.readout.destroy();
});

test('[recent-imagery-049 recent-imagery-050 recent-imagery-055] an open DETAILS card does not request scroll again', async () => {
  const s = await auditPanelState();
  const p = auditPanel(s),
    view = auditScroll(p);
  view.header.click();
  assert.equal(p.body.scrollTop, 10);
  view.requests.length = 0;
  p.emit(s);
  assert.equal(p.body.scrollTop, 10);
  assert.deepEqual(view.requests, []);
  p.readout.destroy();
});

test('[recent-imagery-047] a basemap divider has its screen reader name', async () => {
  const s = await auditPanelState();
  s.mode = 'basemap';
  s.comparison.active = true;
  s.shown.swipe = 'basemap';
  const p = auditPanel(s);
  assert.equal(
    p.splits[0].ariaLabel,
    'Recent imagery against the basemap divider',
  );
  p.readout.destroy();
});

test('[recent-imagery-047] an A and B divider has its screen reader name', async () => {
  const s = await auditPanelState();
  s.mode = 'ab';
  s.comparison.active = true;
  s.shown.swipe = 'ab';
  const p = auditPanel(s);
  assert.equal(p.splits[0].ariaLabel, 'Recent imagery A and B divider');
  p.readout.destroy();
});

test('[recent-imagery-043] an open panel keeps its state at first appearance', async () => {
  const s = await auditPanelState();
  const p = auditPanel(s, {
    setupDom: (dom) => dom.panel.classList.remove('collapsed'),
  });
  assert.equal(p.collapse.clicked, 0);
  p.readout.destroy();
});

test('[recent-imagery-043] the default panel choice opens a collapsed panel', async () => {
  const s = await auditPanelState();
  const p = auditPanel(s, {
    setupDom: (dom) => {
      dom.panel.dataset.collapsedPreference = 'default';
    },
  });
  assert.equal(p.collapse.clicked, 1);
  p.readout.destroy();
});

test('[recent-imagery-048] a second export does not start another fetch', async () => {
  const s = await auditPanelState(),
    calls = [];
  const p = auditPanel(s, {
    fetchImpl: () => new Promise((resolve) => calls.push(resolve)),
  });
  const first = p.readout.exportImage('a'),
    second = p.readout.exportImage('a');
  try {
    assert.equal(calls.length, 1);
    assert.equal(auditAction(p, 'export-a').disabled, true);
  } finally {
    calls.forEach((resolve) => resolve(response()));
    await Promise.allSettled([first, second]);
    p.readout.destroy();
  }
});

test('[recent-imagery-048] an absent slot image alone does not add an error', async () => {
  const s = await auditPanelState();
  s.preview = { key: null, slot: null };
  const p = auditPanel(s);
  assert.equal(await p.readout.exportImage('a'), false);
  assert.equal(auditNode(p, 'ri-notice-text').textContent, '');
  p.readout.destroy();
});

test('[recent-imagery-045] an absent viewport width alone does not allow a strip scroll action', async () => {
  const state = await auditPanelState(),
    p = auditPanel(state),
    strip = p.byId('ri-strip');
  const card = p.readout.root.find(
    (node) =>
      node.classList.contains('ri-card') &&
      node.dataset.key === state.candidates[state.focusIndex].key,
  );
  card.offsetWidth = 80;
  card.offsetLeft = 0;
  strip.clientWidth = 0;
  let left = 100;
  const requests = [];
  Object.defineProperty(strip, 'scrollLeft', {
    configurable: true,
    get: () => left,
    set: (value) => {
      requests.push(value);
      left = value;
    },
  });
  strip.dispatch('keydown', { key: 'Home' });
  assert.deepEqual(requests, []);
  assert.equal(strip.scrollLeft, 100);
  p.readout.destroy();
});

test('[recent-imagery-048] an A image alone enables opacity', async () => {
  const s = await auditPanelState(),
    p = auditPanel(s);
  assert.equal(p.byId('ri-opacity').disabled, false);
  p.readout.destroy();
});

test('[recent-imagery-048] a B image alone enables opacity', async () => {
  const s = await auditPanelState();
  s.mode = 'ab';
  s.shown = { a: null, b: L16, swipe: 'none' };
  s.preview = { key: null, slot: null };
  s.pins.b = {
    ...s.pins.b,
    key: L16,
    candidate: s.candidates[2],
    drapable: true,
    sourceOff: false,
    label: 'Day B',
  };
  const p = auditPanel(s);
  assert.equal(p.byId('ri-opacity').disabled, false);
  p.readout.destroy();
});

test('[recent-imagery-047] the same divider state does not create another divider', async () => {
  const s = await auditPanelState();
  s.mode = 'basemap';
  s.comparison.active = true;
  s.shown.swipe = 'basemap';
  const p = auditPanel(s);
  p.emit(s, 'state');
  assert.equal(p.splits.length, 1);
  p.readout.destroy();
});

test('[recent-imagery-045] an empty strip ignores Enter and pin keys', async () => {
  const s = await auditPanelState();
  s.candidates = [];
  s.focusIndex = -1;
  s.focus = null;
  const p = auditPanel(s);
  for (const key of ['Enter', 'a', 's', 'b'])
    assert.doesNotThrow(() => p.byId('ri-strip').dispatch('keydown', { key }));
  assert.deepEqual(
    p.calls.filter(([name]) => ['preview', 'pin'].includes(name)),
    [],
  );
  p.readout.destroy();
});

test('[recent-imagery-045] an arrow key on an empty strip keeps its default action', async () => {
  const s = await auditPanelState();
  s.candidates = [];
  s.focusIndex = -1;
  s.focus = null;
  const p = auditPanel(s);
  const event = p.byId('ri-strip').dispatch('keydown', { key: 'ArrowRight' });
  assert.equal(event.defaultPrevented, false);
  p.readout.destroy();
});

test('[recent-imagery-045] S does not pin a day in A and B mode', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setMode('ab');
  f.strip.dispatch('keydown', { key: 's' });
  assert.equal(f.snap().pins.a.key, null);
  f.readout.destroy();
  f.layer.destroy();
});

test('[recent-imagery-045] another key outside the strip keeps the preview', async () => {
  const f = fixture();
  await f.ready();
  const event = f.byId('ri-opacity').dispatch('keydown', { key: 'x' });
  assert.equal(event.defaultPrevented, false);
  assert.equal(f.snap().preview.key, 'S30:2026-09-18');
  f.readout.destroy();
  f.layer.destroy();
});

test('[recent-imagery-045] Escape outside the strip cancels an active tool', async () => {
  const f = fixture();
  await f.ready();
  f.layer.clearPreview();
  f.tool.start();
  const event = f.byId('ri-opacity').dispatch('keydown', { key: 'Escape' });
  assert.equal(event.defaultPrevented, true);
  assert.equal(f.tool.isActive(), false);
  f.readout.destroy();
  f.layer.destroy();
});

test('[recent-imagery-045] Escape outside the strip clears a future preview', async () => {
  const f = fixture();
  await f.ready();
  f.layer.clearPreview();
  f.layer.preview(V15);
  const event = f.byId('ri-opacity').dispatch('keydown', { key: 'Escape' });
  assert.equal(event.defaultPrevented, true);
  assert.equal(f.snap().preview.pending, null);
  f.readout.destroy();
  f.layer.destroy();
});

test('[recent-imagery-044] an empty day outside the map leaves the strip', async () => {
  const f = fixture();
  await f.ready();
  f.thumbnails.probe(V15, 'empty');
  assert.equal(Boolean(f.card(V15)), false);
  assert.equal(Boolean(f.card(S18)), true);
  f.readout.destroy();
  f.layer.destroy();
});

test('[recent-imagery-045] a click outside ZOOM IN does not ask for a flight', async () => {
  const s = await auditPanelState();
  s.boxError = 'Box too wide';
  s.zoomToFit = true;
  const p = auditPanel(s);
  p.calls.length = 0;
  p.byId('ri-notice-text').dispatch('click');
  assert.deepEqual(p.calls, []);
  p.readout.destroy();
});

test('[recent-imagery-045] an inactive B unpin control keeps the stored B pin', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setMode('ab');
  f.layer.setAssignment('b', L16);
  f.layer.setMode('image');
  f.byId('ri-unpin-b').dispatch('click');
  assert.equal(f.snap().pins.b.key, 'L30:2026-09-16');
  f.readout.destroy();
  f.layer.destroy();
});

test('[recent-imagery-048] A and B mode exports its B pin', async () => {
  const s = await auditPanelState();
  s.mode = 'ab';
  s.pins.b = {
    ...s.pins.b,
    key: L16,
    candidate: s.candidates[2],
    drapable: true,
    sourceOff: false,
    label: 'Day B',
  };
  const p = auditPanel(s);
  assert.equal(await p.readout.exportImage('b'), true);
  assert.equal(auditAction(p, 'export-b').disabled, false);
  p.readout.destroy();
});

test('[recent-imagery-044] a preview slot without a key has the empty state', async () => {
  const s = await auditPanelState();
  s.preview = { ...s.preview, slot: 'a', key: null };
  const p = auditPanel(s);
  assert.equal(p.byId('ri-slot-a').dataset.state, 'empty');
  p.readout.destroy();
});

test('[recent-imagery-049] an absent box size does not add the overview scale note', async () => {
  const s = await auditPanelState();
  s.boxSizeKm = null;
  const p = auditPanel(s);
  assert.equal(Boolean(auditLine(p, 'overview-scale')), false);
  p.readout.destroy();
});

test('[recent-imagery-049] an absent box does not add the overview scale note', async () => {
  const s = await auditPanelState();
  s.box = null;
  s.boxSizeKm = { width: 1, height: 1 };
  const p = auditPanel(s);
  assert.equal(Boolean(auditLine(p, 'overview-scale')), false);
  p.readout.destroy();
});

test('[recent-imagery-048] an export without a box does not call fetch', async () => {
  const s = await auditPanelState();
  s.box = null;
  let fetches = 0;
  const p = auditPanel(s, {
    fetchImpl: async () => {
      fetches += 1;
      return response();
    },
  });
  assert.equal(await p.readout.exportImage('a'), false);
  assert.equal(fetches, 0);
  p.readout.destroy();
});

test('[recent-imagery-045] a chip without a card does not call the layer', async () => {
  const p = auditPanel(await auditPanelState());
  p.calls.length = 0;
  const chip = { disabled: false, dataset: { slot: 'a' } };
  const target = {
    closest: (selector) => (selector === '.ri-chip' ? chip : null),
  };
  assert.doesNotThrow(() => p.readout.root.dispatch('click', { target }));
  assert.deepEqual(p.calls, []);
  p.readout.destroy();
});

test('[recent-imagery-045] a disabled SWAP control does not call the layer', async () => {
  const p = auditPanel(await auditPanelState(), {
    setupLayer: (layer, calls) => {
      layer.swapSides = () => calls.push(['swap']);
    },
  });
  const swap = auditNode(p, 'ri-swap');
  assert.equal(swap.disabled, true);
  p.calls.length = 0;
  swap.dispatch('click');
  assert.deepEqual(p.calls, []);
  p.readout.destroy();
});

test('[recent-imagery-046] a disabled ZOOM IN control does not call the layer', async () => {
  const p = auditPanel(await auditPanelState());
  const zoom = auditNode(p, 'ri-zoom-in');
  assert.equal(zoom.disabled, true);
  p.calls.length = 0;
  zoom.dispatch('click');
  assert.deepEqual(p.calls, []);
  p.readout.destroy();
});

test('[recent-imagery-045] an empty day key does not pin or remove the export error', async () => {
  const s = await auditPanelState();
  const p = auditPanel(s, {
    fetchImpl: async () => {
      throw new Error('test error');
    },
  });
  assert.equal(await p.readout.exportImage('a'), false);
  s.candidates[s.focusIndex] = {
    ...s.candidates[s.focusIndex],
    thumbnail: { status: 'empty' },
  };
  p.emit(s);
  p.calls.length = 0;
  p.byId('ri-strip').dispatch('keydown', { key: 's' });
  assert.equal(
    p.calls.some(([type]) => type === 'pin'),
    false,
  );
  p.emit(s);
  assert.equal(
    auditNode(p, 'ri-notice-text').textContent,
    'Export failed · test error',
  );
  p.readout.destroy();
});

test('[recent-imagery-047] an inactive comparison removes the divider with the same image keys', async () => {
  const s = await auditPanelState();
  s.comparison.active = true;
  s.shown.swipe = 'basemap';
  let removed = 0;
  const p = auditPanel(s, {
    createSplit: () => ({
      setValue() {},
      destroy() {
        removed += 1;
      },
    }),
  });
  s.comparison.active = false;
  p.emit(s);
  assert.equal(removed, 1);
  p.readout.destroy();
});

test('[recent-imagery-051] a candidate without a card does not enter the visible range', async () => {
  const s = await auditPanelState();
  s.candidates = [{ ...s.candidates[0], key: null }];
  const p = auditPanel(s);
  p.byId('ri-strip').clientWidth = 100;
  p.calls.length = 0;
  p.byId('ri-strip').dispatch('scroll');
  assert.equal(
    p.calls.some(([type]) => type === 'range'),
    false,
  );
  p.readout.destroy();
});

test('[recent-imagery-047] a snapshot value that destroys the panel does not create another divider', async () => {
  const s = await auditPanelState();
  s.comparison.active = true;
  s.shown.swipe = 'basemap';
  const p = auditPanel(s);
  let stopped = false;
  Object.defineProperty(s.candidates[1], 'product', {
    get() {
      if (!stopped) {
        stopped = true;
        p.readout.destroy();
      }
      return 'S30';
    },
  });
  p.emit(s);
  assert.equal(p.splits.length, 1);
});

test('[recent-imagery-051] a zero length candidate list does not enter the visible range', async () => {
  const s = await auditPanelState();
  const p = auditPanel(s);
  s.candidates = new Proxy(s.candidates, {
    get(target, key, receiver) {
      if (key === 'length') return 0;
      if (key === 'forEach') return target.forEach.bind(target);
      return Reflect.get(target, key, receiver);
    },
  });
  p.byId('ri-strip').clientWidth = 100;
  p.calls.length = 0;
  p.byId('ri-strip').dispatch('scroll');
  assert.equal(
    p.calls.some(([type]) => type === 'range'),
    false,
  );
  p.readout.destroy();
});

test('[recent-imagery-043] a snapshot callback that destroys the panel does not change its mode field', async () => {
  const s = await auditPanelState();
  let layer;
  const p = auditPanel(s, {
    setupLayer(value) {
      layer = value;
    },
  });
  layer.getSnapshot = () => {
    p.readout.destroy();
    return { ...s, mode: 'ab' };
  };
  p.emit(null);
  assert.equal(p.readout.root.dataset.mode, 'image');
});

test('[recent-imagery-055] DETAILS without a viewport height keeps the body scroll position', async () => {
  const s = await auditPanelState();
  const p = auditPanel(s);
  const view = auditScroll(p, { height: 0 });
  p.body.scrollTop = 40;
  view.requests.length = 0;
  view.header.click();
  assert.equal(p.body.scrollTop, 40);
  assert.deepEqual(view.requests, []);
  p.readout.destroy();
});

test('[recent-imagery-055] DETAILS does not move the body when it closes', async () => {
  const s = await auditPanelState();
  const p = auditPanel(s);
  const view = auditScroll(p);
  view.header.click();
  assert.equal(p.body.scrollTop, 10);
  view.requests.length = 0;
  view.header.click();
  assert.equal(p.body.scrollTop, 10);
  assert.deepEqual(view.requests, []);
  p.readout.destroy();
});
