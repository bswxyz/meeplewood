<script>
  import { base } from '$app/paths';
  import ThemeToggle from '$lib/ThemeToggle.svelte';

  const codeFaces = `// each face of the d20 is one <div>, laid onto the solid by hand.
// icosahedron vertices come from three golden rectangles; faces are
// every triple of vertices exactly one edge apart. Then, per face:
const G = centroid(A, B, C);
let n = norm(cross(sub(B, A), sub(C, A)));   // outward normal -> CSS z
if (dot(n, G) < 0) n = neg(n);
let u = norm(sub(B, C));                     // local x — along the base
const v = norm(sub(G, A));                   // local y — apex to centroid
if (dot(cross(u, v), n) < 0) u = neg(u);     // keep the number unmirrored

face.transform = \`matrix3d(
  \${u[0]}, \${u[1]}, \${u[2]}, 0,
  \${v[0]}, \${v[1]}, \${v[2]}, 0,
  \${n[0]}, \${n[1]}, \${n[2]}, 0,
  \${G[0]}, \${G[1]}, \${G[2]}, 1)\`;`;

  const codeRoll = `// rolling = two phases on one quaternion.
// A: a free tumble around a random axis, decelerating…
qMid = qMul(qAxis(axisA, spin * (1 - Math.pow(1 - p, 2.2))), q0);
// B: …then slerp into the face the roll picked, with the house
// "settle" ease — it overshoots slightly, like a real die's last wobble.
orient = qSlerp(qMid, target, easeSettle(p));`;

  const codeConfig = `// svelte.config.js
import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    adapter: adapter({ pages: 'docs', assets: 'docs', fallback: null }),
    paths: {
      base: process.env.NODE_ENV === 'production' ? '/meeplewood' : ''
    }
  }
};`;

  const codeShip = `npm run build          # prerenders every route into docs/
git add docs && git commit -m "build"
git push               # then: Settings -> Pages -> main /docs`;
</script>

<svelte:head>
  <title>How Meeplewood was built — Parable build guide</title>
  <meta name="description" content="A build guide for Meeplewood: the idea, the SvelteKit static stack, a real d20 built from twenty divs with matrix3d and quaternions, the page-flip rulebook, and how to ship it on GitHub Pages." />
</svelte:head>

<a class="skip" href="#doc">Skip to content</a>

<main id="doc" class="doc">
  <div class="doc-bar">
    <a class="doc-back" href="{base}/">&larr; Back to Meeplewood</a>
    <ThemeToggle />
  </div>

  <p class="eyebrow mono">[ Parable build guide ]</p>
  <h1>How Meeplewood was built</h1>
  <p class="lede">A board-game publisher whose hero is an honest-to-goodness <strong>d20 built out of
    twenty <code>&lt;div&gt;</code>s</strong> — icosahedron math, one <code>matrix3d</code> per face,
    rolled with quaternions, settled with an overshoot ease. Plus a rulebook that flips like paper.
    No 3D library anywhere.</p>

  <div class="tag-row" aria-label="Stack summary">
    <span>SvelteKit + adapter-static</span><span>Svelte 5 runes</span><span>CSS 3D · no libraries</span><span>Fredoka / Nunito / Space Mono</span><span>light + dark</span><span>reduced-motion aware</span>
  </div>

  <h2>The idea</h2>
  <p>Every game night starts with the same argument: <em>what do we play?</em> So the site opens by
    settling it — a clickable d20 that tumbles, lands, and tells you which box to pull off the shelf.
    The second signature follows the same logic. A publisher that brags about "kind rulebooks" should
    prove it, so the how-to-play section <strong>is</strong> the rulebook: four spreads you flip
    through in CSS 3D, short enough to time yourself reading.</p>

  <h2>The stack</h2>
  <p>SvelteKit with <code>@sveltejs/adapter-static</code>, fully prerendered — no server, no fallback
    page, every route is plain HTML the moment it loads. Svelte 5 runes (<code>$state</code>,
    <code>$derived</code>) drive the die's orientation and the book's spread index. The build lands in
    <code>docs/</code> so GitHub Pages can serve it straight off the main branch. Type is Fredoka for
    display (round, friendly, slightly toy-like), Nunito for body, and Space Mono for the table-talk
    metadata — player counts, teach times, page numbers.</p>

  <h2>Signature technique — a d20 from twenty divs</h2>
  <p>An icosahedron's 12 vertices are just the corners of three mutually-perpendicular golden
    rectangles: <code>(0, ±1, ±φ)</code> and its two rotations. Its 20 faces are every triple of
    vertices exactly one edge apart — cheap to find by brute force at init. Each face then needs a
    single CSS transform that lays a flat triangle onto the solid, which is one change-of-basis
    matrix: local x along the triangle's base, local y from apex to centroid, z the outward
    normal, translation to the centroid.</p>
  <pre><code>{codeFaces}</code></pre>
  <p>Each face element is a <code>clip-path</code> triangle whose <code>transform-origin</code> sits
    on the triangle's centroid (<code>50% 66.667%</code>), so the matrix drops it exactly into place
    inside a <code>preserve-3d</code> stage. The stage itself carries one rotation — a quaternion,
    rendered to CSS as <code>rotate3d()</code>.</p>
  <pre><code>{codeRoll}</code></pre>
  <p>Because the roll picks its face <em>first</em>, the suggestion is honest: the die aligns that
    face's normal to the viewer (plus a random readable twist), and antipodal faces are numbered to
    sum to 21, like a real d20. Faces are relit every frame with a fixed light direction —
    <code>brightness = max(0, n&middot;L)</code> — so the facets shade correctly as it tumbles.</p>

  <h2>Details that matter</h2>
  <ul>
    <li><strong>The idle wobble is cheap.</strong> ~30fps, two small sine oscillations, and an
      <code>IntersectionObserver</code> stops it entirely the moment the die scrolls off-screen.</li>
    <li><strong>Reduced motion keeps the feature.</strong> Under <code>prefers-reduced-motion</code>
      there is no tumble and no wobble — one static frame — but clicking still snaps to a face and
      still answers "what do we play?". The page-flip becomes an instant page-swap the same way.</li>
    <li><strong>Nothing hides without JavaScript.</strong> The face matrices are computed at component
      init, so the prerendered HTML ships a fully-formed 3D die. Reveals and the hero's clipped lines
      are gated behind a <code>.js</code> class set synchronously in <code>&lt;head&gt;</code>.</li>
    <li><strong>The book cheats with z-index, honestly.</strong> Three sheets over two base pages make
      four spreads; whichever sheet is mid-flip borrows <code>z-index: 40</code> for 900ms so it never
      clips through its neighbours.</li>
    <li><strong>One ease to rule them.</strong> The house curve <code>cubic-bezier(.26, 1.5, .38, .96)</code>
      — "settle" — overshoots and rests, like a die's last wobble. Buttons, reveals and the roll's
      final slerp all share it.</li>
    <li><strong>Theme is one attribute.</strong> Light linen / dark board-night flip on
      <code>:root[data-theme]</code>, persisted to <code>localStorage</code>, bootstrapped inline in
      <code>&lt;head&gt;</code> before first paint. The box art keeps fixed print colours so the
      "shelf" looks like ink, not UI.</li>
  </ul>

  <div class="callout"><p>The RSVP form is a demo — it validates and confirms in place but sends
    nothing. Wire it to a real endpoint (Formspree, a serverless function, your shop's mailer) before
    promising anyone a chair.</p></div>

  <h2>Ship it on GitHub Pages</h2>
  <p>The adapter writes the whole prerendered site into <code>docs/</code>, and the base path flips to
    the repo name for production builds:</p>
  <pre><code>{codeConfig}</code></pre>
  <pre><code>{codeShip}</code></pre>
  <p>A <code>.nojekyll</code> file rides along in <code>static/</code> so Pages serves the
    <code>_app</code> directory untouched. Internal links go through SvelteKit's <code>base</code>
    helper, so the same build works at the domain root or a project subpath.</p>

  <a class="doc-back" href="{base}/" style="margin-top:2.6rem">&larr; Back to Meeplewood</a>
</main>

<style>
  .doc { width: min(100% - 2.4rem, 800px); margin: 1.6rem auto 5rem; position: relative; z-index: 1; }
  .doc-bar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 2rem; }
  .doc-back {
    display: inline-flex; align-items: center; gap: .4rem;
    color: var(--dim); text-decoration: none; font-size: .88rem; font-weight: 700;
    padding: .4rem .8rem; border: 1.5px solid var(--line); border-radius: 999px;
    transition: color .25s, border-color .25s;
  }
  .doc-back:hover { color: var(--accent); border-color: var(--accent); }
  h1 { font-size: clamp(2.1rem, 5vw, 3.2rem); margin: .3rem 0 .4rem; }
  .lede { margin-bottom: 2.2rem; }
  .lede strong, p strong { color: var(--ink); font-weight: 700; }
  h2 { font-size: clamp(1.35rem, 3vw, 1.8rem); margin: 2.6rem 0 .6rem; }
  p { color: var(--dim); margin: .7rem 0; }
  ul { color: var(--dim); padding-left: 1.15rem; margin: .7rem 0; }
  li { margin: .4rem 0; }
  li::marker { color: var(--amber); }
  pre {
    background: var(--panel); border: 1px solid var(--line); border-radius: 14px;
    padding: 1rem 1.15rem; overflow-x: auto; margin: 1rem 0;
  }
  code { font-family: var(--font-m); font-size: .8rem; color: var(--ink); }
  pre code { line-height: 1.65; display: block; white-space: pre; }
  .tag-row { display: flex; flex-wrap: wrap; gap: .5rem; margin: 1.3rem 0 0; }
  .tag-row span {
    font-family: var(--font-m); font-size: .68rem; padding: .3rem .65rem;
    border: 1px solid var(--line); border-radius: 999px; color: var(--dim);
  }
  .callout {
    border-left: 3px solid var(--amber-bg);
    background: color-mix(in oklab, var(--amber-bg) 9%, transparent);
    padding: .9rem 1.1rem; border-radius: 0 12px 12px 0; margin: 1.5rem 0;
  }
  .callout p { margin: 0; color: var(--ink); }
</style>
