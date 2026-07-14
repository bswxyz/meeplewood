<script>
  import { onMount } from 'svelte';

  /* ============================================================
     THE DECIDER — a real d20 built from twenty <div> faces.
     Icosahedron vertices come from three golden rectangles; each
     face gets one matrix3d that lays a flat triangle onto the
     solid. Rolling = a quaternion tumble that decelerates, then
     slerps into the target face with the house "settle" ease.
     No 3D library. Reduced motion: static die, instant answer.
     ============================================================ */

  const EDGE = 104; /* px — must match --edge in the styles below */
  const PHI = (1 + Math.sqrt(5)) / 2;
  const S = EDGE / 2;

  /* ---------- tiny vector kit ---------- */
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
  const norm = (v) => {
    const l = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / l, v[1] / l, v[2] / l];
  };
  const neg = (v) => [-v[0], -v[1], -v[2]];

  /* ---------- geometry: 12 vertices, 20 faces ---------- */
  const V = [
    [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
    [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
    [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1]
  ].map((p) => [p[0] * S, p[1] * S, p[2] * S]);

  const d2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
  const E2 = EDGE * EDGE;
  const near = (x) => Math.abs(x - E2) < 1e-6 * E2;

  const tris = [];
  for (let i = 0; i < 12; i++)
    for (let j = i + 1; j < 12; j++)
      for (let k = j + 1; k < 12; k++)
        if (near(d2(V[i], V[j])) && near(d2(V[j], V[k])) && near(d2(V[i], V[k])))
          tris.push([i, j, k]);

  const m5 = (x) => x.toFixed(5);
  const faces = tris.map(([ia, ib, ic]) => {
    let A = V[ia], B = V[ib], C = V[ic];
    const G = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3, (A[2] + B[2] + C[2]) / 3];
    let n = norm(cross(sub(B, A), sub(C, A)));
    if (dot(n, G) < 0) n = neg(n);            /* outward */
    let u = norm(sub(B, C));                  /* local x — along the base */
    const v = norm(sub(G, A));                /* local y — apex down to centroid */
    if (dot(cross(u, v), n) < 0) u = neg(u);  /* keep the numbers unmirrored */
    const transform =
      `matrix3d(${m5(u[0])},${m5(u[1])},${m5(u[2])},0,` +
      `${m5(v[0])},${m5(v[1])},${m5(v[2])},0,` +
      `${m5(n[0])},${m5(n[1])},${m5(n[2])},0,` +
      `${m5(G[0])},${m5(G[1])},${m5(G[2])},1)`;
    return { n, v, transform };
  });

  /* d20 numbering: antipodal faces sum to 21 */
  const nums = new Array(20).fill(0);
  {
    const used = new Array(20).fill(false);
    let k = 0;
    for (let i = 0; i < 20; i++) {
      if (used[i]) continue;
      const j = faces.findIndex((f, jj) => !used[jj] && jj !== i && dot(f.n, faces[i].n) < -0.999);
      used[i] = used[j] = true;
      k += 1;
      nums[i] = k;
      nums[j] = 21 - k;
    }
  }

  /* ---------- quaternions ---------- */
  const qAxis = (axis, ang) => {
    const a = norm(axis), h = ang / 2, s = Math.sin(h);
    return [Math.cos(h), a[0] * s, a[1] * s, a[2] * s];
  };
  const qMul = (a, b) => [
    a[0] * b[0] - a[1] * b[1] - a[2] * b[2] - a[3] * b[3],
    a[0] * b[1] + a[1] * b[0] + a[2] * b[3] - a[3] * b[2],
    a[0] * b[2] - a[1] * b[3] + a[2] * b[0] + a[3] * b[1],
    a[0] * b[3] + a[1] * b[2] - a[2] * b[1] + a[3] * b[0]
  ];
  const qRotVec = (q, v) => {
    const [w, x, y, z] = q;
    const tx = 2 * (y * v[2] - z * v[1]);
    const ty = 2 * (z * v[0] - x * v[2]);
    const tz = 2 * (x * v[1] - y * v[0]);
    return [
      v[0] + w * tx + (y * tz - z * ty),
      v[1] + w * ty + (z * tx - x * tz),
      v[2] + w * tz + (x * ty - y * tx)
    ];
  };
  const qSlerp = (a, b, t) => {
    let d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
    let bb = b;
    if (d < 0) { d = -d; bb = [-b[0], -b[1], -b[2], -b[3]]; }
    if (d > 0.9995) {
      const r = a.map((c, i) => c + (bb[i] - c) * t);
      const l = Math.hypot(r[0], r[1], r[2], r[3]);
      return r.map((c) => c / l);
    }
    const th = Math.acos(Math.min(1, d));
    const s = Math.sin(th);
    return a.map((c, i) => (Math.sin((1 - t) * th) / s) * c + (Math.sin(t * th) / s) * bb[i]);
  };
  const qToCss = (q) => {
    const w = Math.min(1, Math.max(-1, q[0]));
    const ang = 2 * Math.acos(w);
    const s = Math.sqrt(Math.max(0, 1 - w * w));
    if (s < 1e-4) return 'rotate3d(1,0,0,0deg)';
    return `rotate3d(${m5(q[1] / s)},${m5(q[2] / s)},${m5(q[3] / s)},${((ang * 180) / Math.PI).toFixed(3)}deg)`;
  };

  /* presentation tilt so the die never sits dead-flat */
  const TILT = qMul(qAxis([1, 0, 0], -0.16), qAxis([0, 1, 0], 0.12));
  const faceTarget = (i, twist) => {
    const nf = faces[i].n;
    const d = nf[2]; /* dot with +z */
    let qa;
    if (d > 0.9999) qa = [1, 0, 0, 0];
    else if (d < -0.9999) qa = qAxis([1, 0, 0], Math.PI);
    else qa = qAxis(cross(nf, [0, 0, 1]), Math.acos(Math.min(1, Math.max(-1, d))));
    /* in-plane fix: qa aligns the normal but leaves the number at an
       arbitrary spin. Rotate the face's local +y (glyph-down, CSS y
       points down) onto world +y so it reads upright, then twist. */
    const w = qRotVec(qa, faces[i].v);
    const upright = Math.PI / 2 - Math.atan2(w[1], w[0]);
    return qMul(TILT, qMul(qAxis([0, 0, 1], twist + upright), qa));
  };

  /* ---------- what the die tells you to play ---------- */
  const SUGGEST = [
    'A one. The die is testing you. Custard Thief — nobody can sulk during Custard Thief.',
    'Custard Thief — fifteen loud minutes, then play it four more times.',
    'Custard Thief, and the loser brews the tea.',
    'Burrow & Borrow — cosy tiles, mild larceny, zero reading required.',
    'Burrow & Borrow — teach it to the person who "doesn\'t do board games."',
    'Burrow & Borrow, house rule: you must narrate your rabbit\'s feelings.',
    'The Long Ferry — just two of you tonight? Perfect crossing weather.',
    'The Long Ferry — best played slightly too competitively.',
    'The Long Ferry. Rematch mandatory.',
    'Lighthouse Keepers — everyone on the same side, for once.',
    'Lighthouse Keepers — you will lose your first storm. Beautifully.',
    'Lighthouse Keepers, lights low. Storm sounds optional but encouraged.',
    'Hollowpine — the full forest. Clear the table, this one sprawls.',
    'Hollowpine — and someone new picks the first clearing this time.',
    'Hollowpine — try the Lantern opening. Trust us.',
    'Hollowpine with the Winter deck shuffled in. Longer, braver, worth it.',
    'Hollowpine, tournament rules: the winner teaches next week.',
    'An eighteen! Bold night. Hollowpine, Winter deck, no takebacks.',
    'Nineteen — pull out whichever box has the most dust on it. It misses you.',
    'A natural 20 — teach somebody their very first game tonight. Any box. That\'s the good stuff.'
  ];

  /* ---------- state ---------- */
  const startFace = nums.indexOf(20);
  let base = faceTarget(startFace, 0.28);       /* settled orientation (plain) */
  let orient = $state(base);                    /* displayed orientation */
  let rolling = $state(false);
  let result = $state(0);
  let line = $state('Can\'t pick tonight\'s game? The die has opinions. Click it.');

  const stageT = $derived(qToCss(orient));

  /* per-face lambert shading, relit every frame */
  const L = norm([-0.4, -0.65, 0.7]);
  const C1 = [16, 74, 74];
  const C2 = [74, 191, 183];
  const shades = $derived(
    faces.map((f) => {
      const wn = qRotVec(orient, f.n);
      const lam = Math.max(0, wn[0] * L[0] + wn[1] * L[1] + wn[2] * L[2]);
      const s = 0.22 + 0.78 * lam;
      return `rgb(${Math.round(C1[0] + (C2[0] - C1[0]) * s)},${Math.round(C1[1] + (C2[1] - C1[1]) * s)},${Math.round(C1[2] + (C2[2] - C1[2]) * s)})`;
    })
  );

  /* ---------- rolling ---------- */
  let reduce = false;
  let rollRaf = 0;
  let restartIdle = () => {};
  const easeSettle = (p) => {
    const c = 1.35, t = p - 1;
    return 1 + (c + 1) * t * t * t + c * t * t;
  };

  function roll() {
    if (rolling) return;
    const pick = Math.floor(Math.random() * 20);
    const twist = (Math.random() - 0.5) * 1.0;
    const target = faceTarget(pick, twist);
    const done = () => {
      base = target;
      orient = target;
      result = nums[pick];
      line = SUGGEST[nums[pick] - 1];
      rolling = false;
      restartIdle();
    };
    if (reduce) { done(); return; }
    rolling = true;
    const q0 = orient;
    const axisA = norm([Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5]);
    const spin = (2 + Math.random() * 1.5) * Math.PI * 2;
    const tA = 780, tB = 640;
    let qMid = q0;
    const t0 = performance.now();
    const step = (now) => {
      const el = now - t0;
      if (el <= tA) {
        const p = el / tA;
        qMid = qMul(qAxis(axisA, spin * (1 - Math.pow(1 - p, 2.2))), q0);
        orient = qMid;
      } else if (el <= tA + tB) {
        orient = qSlerp(qMid, target, easeSettle((el - tA) / tB));
      } else {
        done();
        return;
      }
      rollRaf = requestAnimationFrame(step);
    };
    rollRaf = requestAnimationFrame(step);
  }

  /* ---------- idle wobble: ~30fps, paused off-screen, killed on reduce ---------- */
  let sceneEl;
  onMount(() => {
    reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    let visible = true;
    let idleRaf = 0;
    let last = 0;
    const AX1 = norm([1, 0.35, 0]);
    const AX2 = norm([0, 1, 0.3]);
    const idle = (t) => {
      if (!visible || rolling) { idleRaf = 0; return; }
      if (t - last >= 33) {
        last = t;
        orient = qMul(
          qAxis(AX1, Math.sin(t * 0.0011) * 0.05),
          qMul(qAxis(AX2, Math.sin(t * 0.0007 + 2) * 0.06), base)
        );
      }
      idleRaf = requestAnimationFrame(idle);
    };
    const start = () => { if (!idleRaf) idleRaf = requestAnimationFrame(idle); };
    restartIdle = start;
    const io = new IntersectionObserver((es) => {
      visible = es[0].isIntersecting;
      if (visible && !rolling) start();
    }, { threshold: 0 });
    io.observe(sceneEl);
    start();
    return () => {
      io.disconnect();
      if (idleRaf) cancelAnimationFrame(idleRaf);
      if (rollRaf) cancelAnimationFrame(rollRaf);
    };
  });
</script>

<div class="dice-wrap">
  <button
    class="die-btn"
    type="button"
    onclick={roll}
    aria-label="Roll the die for tonight's game suggestion"
  >
    <span class="die-scene" bind:this={sceneEl} aria-hidden="true">
      <span class="die-shadow" class:airborne={rolling}></span>
      <span class="die-stage" style:transform={stageT}>
        {#each faces as f, i}
          <span class="face" style:transform={f.transform} style:background={shades[i]}>
            <span class="face-num" class:scored={nums[i] === 6 || nums[i] === 9}>{nums[i]}</span>
          </span>
        {/each}
      </span>
    </span>
  </button>
  <p class="die-cap mono">The Decider — d20 · click to roll</p>
  <p class="die-out" aria-live="polite">
    {#if rolling}
      <span class="die-wait mono">tumbling&hellip;</span>
    {:else}
      {#if result}<strong class="die-num">{result}</strong>{/if}
      <span class="die-line">{line}</span>
    {/if}
  </p>
</div>

<style>
  .dice-wrap { display: grid; justify-items: center; gap: .4rem; text-align: center; }

  .die-btn {
    display: block; padding: .6rem; margin: 0;
    background: transparent; border: 0; cursor: pointer; border-radius: 28px;
    transition: background .3s;
  }
  .die-btn:hover { background: var(--line-2); }

  .die-scene {
    --edge: 104px; /* must match EDGE in the script */
    display: block; position: relative;
    width: 236px; height: 236px;
    perspective: 850px;
  }
  .die-stage {
    position: absolute; inset: 0;
    transform-style: preserve-3d;
    will-change: transform;
  }
  .face {
    position: absolute; left: 50%; top: 50%; display: block;
    width: var(--edge);
    height: calc(var(--edge) * 0.86603);
    margin-left: calc(var(--edge) * -0.5);
    margin-top: calc(var(--edge) * -0.57735);
    transform-origin: 50% 66.6667%;
    clip-path: polygon(50% 0, 100% 100%, 0 100%);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }
  .face-num {
    position: absolute; left: 50%; top: 66.6667%;
    transform: translate(-50%, -54%);
    font-family: var(--font-d); font-weight: 600; font-size: 21px; line-height: 1;
    color: var(--linen-fixed);
    text-shadow: 0 1px 3px rgba(10, 30, 30, .45);
    user-select: none;
  }
  .face-num.scored { text-decoration: underline; text-underline-offset: 2px; }

  .die-shadow {
    position: absolute; left: 50%; bottom: 2px;
    width: 150px; height: 26px; transform: translateX(-50%);
    background: radial-gradient(closest-side, rgba(10, 10, 8, .3), transparent 70%);
    transition: transform .5s var(--ease), opacity .5s;
  }
  .die-shadow.airborne { transform: translateX(-50%) scale(.72); opacity: .55; }

  .die-cap { margin: 0; font-size: .68rem; letter-spacing: .16em; text-transform: uppercase; color: var(--faint); }

  .die-out {
    margin: .5rem 0 0; min-height: 4.6rem; max-width: 34ch;
    display: grid; justify-items: center; align-content: start; gap: .15rem;
  }
  .die-wait { font-size: .78rem; color: var(--faint); letter-spacing: .12em; }
  .die-num { font-family: var(--font-d); font-weight: 600; font-size: 2rem; line-height: 1; color: var(--accent); }
  .die-line { color: var(--dim); font-size: .92rem; line-height: 1.45; }

  @media (max-width: 420px) {
    /* Shrink the whole projected die, never --edge: the face matrix3d
       translations are baked from EDGE=104 in JS, so changing --edge
       alone splits the faces apart. Scale the (non-preserve-3d)
       perspective element instead: 88/104 = .84615. */
    .die-scene { width: 200px; height: 200px; transform: scale(.84615); }
  }

  @media (prefers-reduced-motion: reduce) {
    .die-stage { will-change: auto; }
    .die-shadow { transition: none; }
  }
</style>
