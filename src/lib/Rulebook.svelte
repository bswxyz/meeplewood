<script>
  /* ============================================================
     THE TEN-MINUTE TEACH — a rulebook that flips like paper.
     Three CSS-3D sheets over two base pages = four spreads.
     Each sheet rotates on its spine (transform-origin: left);
     the moving sheet borrows a high z-index for the duration.
     Reduced motion: pages swap with no flip (CSS kills the
     transition). Without JS the first spread reads fully.
     ============================================================ */

  const LAST = 3; /* spread index 0..3 */
  let current = $state(0);
  let moving = $state(-1);
  let movingTimer;

  function go(dir) {
    const nxt = current + dir;
    if (nxt < 0 || nxt > LAST) return;
    moving = dir > 0 ? current : current - 1;
    current = nxt;
    clearTimeout(movingTimer);
    movingTimer = setTimeout(() => (moving = -1), 900);
  }

  const zFor = (i) => (i === moving ? 40 : i < current ? 10 + i : 30 - i);

  const baseLeft = {
    cover: true,
    title: 'Four flips. Whole game.',
    body: 'This is the actual Hollowpine rulebook, shrunk to fit the table. Flip through — you\'ll be teaching it yourself by the last page.'
  };
  const baseRight = {
    finale: true,
    title: 'That\'s the whole game.',
    body: 'Ten minutes of teach, forty-five of play. If anything wobbles mid-game, the Rulebook Hotline answers. Kindly.'
  };

  const sheets = [
    {
      front: {
        no: '01', title: 'Set the table', art: 'board',
        items: [
          'Unfold the forest board — mossy side up.',
          'Shuffle the trail deck, deal five cards each.',
          'Everyone takes a fox and three acorns. Yes, the wooden ones.'
        ]
      },
      back: {
        no: '02', title: 'On your turn', art: 'turn',
        items: [
          'Do exactly one thing:',
          'Wander — move your fox up to two clearings.',
          'Plant — play a trail card in front of you.',
          'Forage — take two acorns from the supply.'
        ]
      }
    },
    {
      front: {
        no: '03', title: 'Grow your trail', art: 'trail',
        items: [
          'Trail cards chain left to right.',
          'Match a card\'s season to its neighbour to spark a combo.',
          'Combos fire left to right. Narrate them proudly.'
        ]
      },
      back: {
        no: '04', title: 'The fox eats first', art: 'fox',
        items: [
          'At the end of every round, feed your fox one acorn.',
          'A hungry fox forgives you once — then eats your rightmost card.',
          'This is the rule everyone forgets. Not you, though.'
        ]
      }
    },
    {
      front: {
        no: '05', title: 'Score the seasons', art: 'score',
        items: [
          'The game ends after the fourth season.',
          'Score lanterns, your longest unbroken trail, and one point per well-fed fox.',
          'Ties go to whoever fed their fox most.'
        ]
      },
      back: {
        no: '06', title: 'Winning, kindly', art: 'win',
        items: [
          'The winner shuffles for the next game.',
          'The loser picks what it is.',
          'Everybody helps put the meeples back. House rules of this house.'
        ]
      }
    }
  ];
</script>

{#snippet pageArt(kind)}
  {#if kind === 'board'}
    <svg viewBox="0 0 120 44" aria-hidden="true"><rect x="10" y="6" width="100" height="32" rx="6" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="34" cy="22" r="6" fill="currentColor" opacity=".35"/><circle cx="60" cy="22" r="6" fill="currentColor" opacity=".55"/><circle cx="86" cy="22" r="6" fill="currentColor" opacity=".35"/><path d="M40 22h14M66 22h14" stroke="currentColor" stroke-width="2" stroke-dasharray="3 3"/></svg>
  {:else if kind === 'turn'}
    <svg viewBox="0 0 120 44" aria-hidden="true"><path d="M60 8a14 14 0 1 1-13 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M44 8l3 8 8-3" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
  {:else if kind === 'trail'}
    <svg viewBox="0 0 120 44" aria-hidden="true"><rect x="14" y="12" width="20" height="26" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="42" y="8" width="20" height="26" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="70" y="12" width="20" height="26" rx="3" fill="currentColor" opacity=".3"/><path d="M96 20l10 5-10 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
  {:else if kind === 'fox'}
    <svg viewBox="0 0 120 44" aria-hidden="true"><path d="M46 34c0-10 6-18 14-18s14 8 14 18z" fill="currentColor" opacity=".35"/><path d="M50 18l-4-8 8 4M70 18l4-8-8 4" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/><circle cx="56" cy="26" r="1.8" fill="currentColor"/><circle cx="64" cy="26" r="1.8" fill="currentColor"/></svg>
  {:else if kind === 'score'}
    <svg viewBox="0 0 120 44" aria-hidden="true"><path d="M60 6l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M20 34h18M82 34h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity=".5"/></svg>
  {:else}
    <svg viewBox="0 0 120 44" aria-hidden="true"><path d="M40 12h40v6c0 10-8 16-20 16s-20-6-20-16z" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M55 34v4h10v-4M50 42h20" stroke="currentColor" stroke-width="2.2" fill="none"/></svg>
  {/if}
{/snippet}

{#snippet pageFace(p, pageNo)}
  <div class="pg-inner">
    <span class="pg-no mono">rule {p.no}</span>
    <strong class="pg-title">{p.title}</strong>
    <span class="pg-art">{@render pageArt(p.art)}</span>
    <ul class="pg-list">
      {#each p.items as it}<li>{it}</li>{/each}
    </ul>
    <span class="pg-foot mono">hollowpine · rules · p.{pageNo}</span>
  </div>
{/snippet}

<div class="book-scene">
  <div class="book" role="group" aria-label="Hollowpine rulebook, spread {current + 1} of {LAST + 1}">
    <div class="page-base left">
      <div class="pg-inner cover">
        <svg class="cover-tree" viewBox="0 0 60 72" aria-hidden="true">
          <path d="M30 4 L44 26 H36 L50 46 H10 L24 26 H16 Z" fill="var(--accent)"/>
          <rect x="26" y="46" width="8" height="12" rx="2" fill="var(--amber-bg)"/>
          <circle cx="46" cy="12" r="4" fill="var(--amber-bg)"/>
        </svg>
        <span class="pg-no mono">hollowpine — the rulebook</span>
        <strong class="pg-title">{baseLeft.title}</strong>
        <span class="pg-body">{baseLeft.body}</span>
        <span class="pg-foot mono">hollowpine · rules · cover</span>
      </div>
    </div>
    <div class="page-base right">
      <div class="pg-inner finale">
        <strong class="pg-title">{baseRight.title}</strong>
        <span class="pg-body">{baseRight.body}</span>
        <span class="pg-stat"><strong class="mono">10 min</strong> teach &middot; <strong class="mono">45 min</strong> play</span>
        <a class="pg-link" href="#games" tabindex={current === LAST ? 0 : -1}>Meet the rest of the shelf &rarr;</a>
        <span class="pg-foot mono">hollowpine · rules · p.7</span>
      </div>
    </div>
    <div class="sheets">
      {#each sheets as sh, i}
        <div class="sheet" class:flipped={i < current} style:z-index={zFor(i)}>
          <div class="pg front">{@render pageFace(sh.front, i * 2 + 1)}</div>
          <div class="pg back">{@render pageFace(sh.back, i * 2 + 2)}</div>
        </div>
      {/each}
    </div>
  </div>

  <div class="book-ctrl">
    <button class="flip-btn" type="button" onclick={() => go(-1)} disabled={current === 0} aria-label="Previous spread">&larr; Flip back</button>
    <span class="flip-count mono" aria-live="polite">spread {current + 1} / {LAST + 1}</span>
    <button class="flip-btn" type="button" onclick={() => go(1)} disabled={current === LAST} aria-label="Next spread">Flip on &rarr;</button>
  </div>
</div>

<style>
  .book-scene { perspective: 1800px; }

  .book {
    position: relative;
    display: grid; grid-template-columns: 1fr 1fr;
    max-width: 780px; margin-inline: auto;
    aspect-ratio: 16 / 10.5;
    transform-style: preserve-3d;
    filter: drop-shadow(0 26px 30px rgba(20, 14, 6, .22));
  }
  .page-base, .pg {
    background:
      linear-gradient(115deg, var(--line-2), transparent 30%),
      var(--panel);
    border: 1px solid var(--line);
  }
  .page-base.left { border-radius: 12px 3px 3px 12px; border-right-color: var(--line-2); }
  .page-base.right { border-radius: 3px 12px 12px 3px; }

  .sheets {
    position: absolute; inset: 0 0 0 50%;
    transform-style: preserve-3d;
  }
  .sheet {
    position: absolute; inset: 0;
    transform-origin: left center;
    transform-style: preserve-3d;
    transition: transform .95s var(--ease-page);
  }
  .sheet.flipped { transform: rotateY(-180deg); }
  .pg {
    position: absolute; inset: 0; display: block;
    backface-visibility: hidden; -webkit-backface-visibility: hidden;
    border-radius: 3px 12px 12px 3px;
    overflow: hidden;
  }
  .pg.back {
    transform: rotateY(180deg);
    border-radius: 12px 3px 3px 12px;
    background:
      linear-gradient(245deg, var(--line-2), transparent 30%),
      var(--panel);
  }

  .pg-inner {
    display: flex; flex-direction: column; align-items: flex-start; gap: .45rem;
    height: 100%; padding: clamp(.7rem, 2.6vw, 1.6rem) clamp(.75rem, 3vw, 1.8rem);
  }
  .pg-inner.cover { justify-content: center; }
  .pg-inner.finale { justify-content: center; }
  .cover-tree { width: clamp(38px, 7vw, 58px); }
  .pg-no { font-size: .6rem; letter-spacing: .18em; text-transform: uppercase; color: var(--accent); }
  .pg-title { font-family: var(--font-d); font-weight: 600; font-size: clamp(.95rem, 2.4vw, 1.45rem); line-height: 1.1; color: var(--ink); }
  .pg-body { color: var(--dim); font-size: clamp(.72rem, 1.7vw, .95rem); line-height: 1.5; }
  .pg-art { color: var(--accent); width: min(100%, 170px); }
  .pg-art :global(svg) { width: 100%; height: auto; display: block; }
  .pg-list { margin: 0; padding-left: 1rem; color: var(--dim); font-size: clamp(.66rem, 1.6vw, .88rem); line-height: 1.45; display: grid; gap: .25rem; }
  .pg-list li::marker { color: var(--amber); }
  .pg-stat { color: var(--dim); font-size: clamp(.7rem, 1.7vw, .9rem); }
  .pg-stat strong { color: var(--amber); font-size: 1.05em; }
  .pg-link { color: var(--accent); font-weight: 700; font-size: clamp(.72rem, 1.7vw, .92rem); text-decoration: none; }
  .pg-link:hover { text-decoration: underline; }
  .pg-foot { margin-top: auto; font-size: .56rem; letter-spacing: .14em; text-transform: uppercase; color: var(--faint); }

  .book-ctrl {
    display: flex; align-items: center; justify-content: center; gap: 1rem;
    margin-top: 1.4rem; flex-wrap: wrap;
  }
  .flip-btn {
    font-family: var(--font-d); font-weight: 600; font-size: .88rem;
    color: var(--ink); background: transparent;
    border: 1.5px solid var(--line); border-radius: 999px;
    padding: .55rem 1.1rem; cursor: pointer;
    transition: border-color .25s, color .25s, transform .35s var(--ease);
  }
  .flip-btn:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); transform: translateY(-2px); }
  .flip-btn:disabled { opacity: .35; cursor: default; }
  .flip-count { font-size: .68rem; letter-spacing: .14em; text-transform: uppercase; color: var(--faint); }

  @media (max-width: 560px) {
    .book { aspect-ratio: 16 / 12; }
  }

  @media (prefers-reduced-motion: reduce) {
    .sheet { transition: none; }
    .flip-btn { transition: none; }
  }
</style>
