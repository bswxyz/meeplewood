<script>
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { revealAll } from '$lib/reveal.js';
  import DiceRoller from '$lib/DiceRoller.svelte';
  import Rulebook from '$lib/Rulebook.svelte';
  import ThemeToggle from '$lib/ThemeToggle.svelte';

  let loaded = $state(false);
  onMount(() => {
    requestAnimationFrame(() => (loaded = true));
  });

  const games = [
    {
      key: 'hollowpine', flag: true, title: 'Hollowpine', price: '£42',
      spec: '1–4 players · 45 min · ages 10+',
      note: 'Our flagship. Grow a lantern-lit trail through the forest, feed your fox, argue about the Winter deck. The one the shop is named after, basically.',
      tag: 'flagship', tagKind: 'amber'
    },
    {
      key: 'custard', title: 'Custard Thief', price: '£18',
      spec: '3–8 players · 15 min · ages 8+',
      note: 'A fast, slightly rude card game about stealing pudding. The loudest fifteen minutes we publish.',
      tag: 'in stock', tagKind: 'ok'
    },
    {
      key: 'lighthouse', title: 'Lighthouse Keepers', price: '£38',
      spec: '2–5 players · 60 min · ages 12+',
      note: 'Co-op. The storm is the opponent and it plays very well. Keep the lamp lit or go down together, warmly.',
      tag: 'in stock', tagKind: 'ok'
    },
    {
      key: 'burrow', title: 'Burrow & Borrow', price: '£27',
      spec: '2–4 players · 30 min · ages 8+',
      note: 'Cosy tile-laying with mild larceny. Build the nicest burrow, borrow the neighbours\' carrots. Return them? Unclear.',
      tag: 'reprint — aug', tagKind: 'soon'
    },
    {
      key: 'ferry', title: 'The Long Ferry', price: '£22',
      spec: '2 players · 25 min · ages 10+',
      note: 'A two-player duel about ferrying lanterns across a dark lake. Quiet, tense, and best of three. Always best of three.',
      tag: 'new', tagKind: 'ok'
    }
  ];

  const nights = [
    { when: 'Wednesdays · 6pm', what: 'Open Table', note: 'Every game on the shelf, taught by us. Bring nobody, leave with a group.' },
    { when: 'First Friday', what: 'Print & Play', note: 'A free mini-game in the newsletter. Scissors on the house.' },
    { when: 'Whenever', what: 'Rulebook Hotline', note: 'Stuck mid-game? A human answers and explains. Kindly, always.' }
  ];

  const quotes = [
    { q: 'We came in for one demo of Custard Thief. We have now been here every Wednesday for two years.', who: 'Priya — Wednesday regular' },
    { q: 'The rulebook made my dad laugh. My dad. During rules.', who: 'Sam — converted a sceptic' },
    { q: 'I called the hotline mid-game and a real human kindly told me the fox eats first. Game saved.', who: 'Ana — fed the fox' }
  ];

  const tiers = [
    {
      name: 'Drop-in', price: '£0', per: 'forever',
      perks: ['The table-talk newsletter', 'Print & Play of the month', 'Open Table invites'],
      cta: 'Pull up a chair'
    },
    {
      name: 'Regular', price: '£7', per: '/month', best: true,
      perks: ['Everything in Drop-in', 'Monthly scenario pack for any of our games', '10% off every box', 'Early playtest seats'],
      cta: 'Join the Regulars'
    },
    {
      name: 'Legend', price: '£15', per: '/month',
      perks: ['Everything in Regular', 'The annual big-box, on us', 'Your name in the next rulebook\'s credits', 'A vote on cover art'],
      cta: 'Become a Legend'
    }
  ];

  /* demo RSVP form — validates + confirms in place, sends nothing */
  let sent = $state(false);
  let formEl;
  function submitRsvp(e) {
    e.preventDefault();
    const name = formEl.querySelector('#rName');
    const email = formEl.querySelector('#rEmail');
    if (!name.checkValidity()) return name.reportValidity();
    if (!email.checkValidity()) return email.reportValidity();
    sent = true;
  }
</script>

<svelte:head>
  <title>Meeplewood — board games for the good kind of noise</title>
  <meta name="description" content="Meeplewood is a tabletop publisher making board games with kind rulebooks and loud endings — teachable in ten minutes, replayed for years. Roll the d20 to pick tonight's game." />
  <meta property="og:title" content="Meeplewood — board games for the good kind of noise" />
  <meta property="og:description" content="Kind rulebooks, loud endings. Five games in print, one d20 that decides what you play tonight." />
  <meta property="og:type" content="website" />
</svelte:head>

<a class="skip" href="#main">Skip to content</a>

<header class="nav">
  <a class="brand" href="{base}/" aria-label="Meeplewood home">
    <svg class="brand-mark" viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50 10a14 14 0 0 1 14 14c0 6-3 10-6.5 13 11 3 22.5 10 26.5 17.5 3 6-1.5 12.5-8.5 12.5H63.5c2.5 8 6.5 17 6.5 21H30c0-4 4-13 6.5-21H24.5c-7 0-11.5-6.5-8.5-12.5C20 47 31.5 40 42.5 37 39 34 36 30 36 24a14 14 0 0 1 14-14z" fill="currentColor" />
    </svg>
    <span class="brand-word">Meeplewood</span>
  </a>
  <nav class="nav-links" aria-label="Primary">
    <a href="#games">The games</a>
    <a href="#howtoplay">How to play</a>
    <a href="#community">Community</a>
    <a href="{base}/guide/">Guide</a>
    <a class="nav-cta" href="#club">The Table Club</a>
    <ThemeToggle />
  </nav>
</header>

<main id="main" use:revealAll>
  <!-- ============ hero — the Decider d20 ============ -->
  <section class="hero" class:loaded aria-labelledby="hero-title">
    <div class="wrap hero-grid">
      <div class="hero-copy">
        <p class="eyebrow mono">[ Tabletop publisher · Est. 2019 ]</p>
        <h1 id="hero-title" class="hero-title">
          <span class="line"><span>Pull up a chair —</span></span>
          <span class="line"><span>the dice are</span></span>
          <span class="line"><span><em>already warm.</em></span></span>
        </h1>
        <p class="hero-sub">Meeplewood makes board games with kind rulebooks and loud endings.
          Ten minutes to teach, years of replays, and all arguments strictly affectionate.</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#games">Browse the games</a>
          <a class="btn btn-ghost" href="#howtoplay">Learn one in four flips &rarr;</a>
        </div>
        <dl class="hero-facts">
          <div><dt class="mono">Games in print</dt><dd>5</dd></div>
          <!-- final values ship in the markup so the no-JS page never reads "0";
               reveal.js zeroes them and counts up only when JS actually runs -->
          <div><dt class="mono">Teach time</dt><dd><span class="c-num" data-to="10">10</span> min</dd></div>
          <div><dt class="mono">Tables joined</dt><dd><span class="c-num" data-to="48210">48,210</span></dd></div>
        </dl>
      </div>
      <div class="hero-dice">
        <DiceRoller />
      </div>
    </div>
    <p class="hero-scroll mono wrap" aria-hidden="true">scroll — the table is set</p>
  </section>

  <!-- ============ the games — the shelf ============ -->
  <section id="games" class="games" aria-labelledby="games-title">
    <span class="wm" aria-hidden="true">GAME NIGHT</span>
    <div class="wrap">
      <div class="sec-head">
        <p class="kicker mono reveal">[ The games ]</p>
        <h2 id="games-title" class="reveal">Five boxes, zero homework.</h2>
        <p class="lede reveal">Everything we publish passes the same test: a new player is having fun
          within ten minutes, and the rulebook never once sounds like a tax form.</p>
      </div>
      <div class="game-grid">
        {#each games as g, i}
          <article class="game reveal" class:game--flag={g.flag}>
            <div class="game-art">
              {#if g.key === 'hollowpine'}
                <svg viewBox="0 0 200 120" aria-hidden="true">
                  <rect width="200" height="120" fill="var(--teal-deep)" />
                  <circle cx="162" cy="26" r="13" fill="var(--linen-fixed)" opacity=".9" />
                  <circle cx="38" cy="18" r="1.6" fill="var(--linen-fixed)" opacity=".7" /><circle cx="70" cy="30" r="1.3" fill="var(--linen-fixed)" opacity=".5" /><circle cx="120" cy="14" r="1.4" fill="var(--linen-fixed)" opacity=".6" />
                  <path d="M56 100 L76 58 L70 58 L86 30 L102 58 L96 58 L116 100 Z" fill="var(--teal-bright)" />
                  <path d="M20 100 L34 72 L30 72 L42 52 L54 72 L50 72 L64 100 Z" fill="#1c7a75" />
                  <path d="M118 100 L134 66 L129 66 L143 42 L157 66 L152 66 L168 100 Z" fill="#1c7a75" />
                  <rect x="0" y="100" width="200" height="20" fill="#0e4a48" />
                  <circle cx="92" cy="92" r="4" fill="#e0a13a" /><rect x="90.5" y="80" width="3" height="9" rx="1.5" fill="#e0a13a" opacity=".8" />
                </svg>
              {:else if g.key === 'custard'}
                <svg viewBox="0 0 200 120" aria-hidden="true">
                  <rect width="200" height="120" fill="#e0a13a" />
                  <circle cx="100" cy="66" r="36" fill="#f3ecdf" />
                  <circle cx="100" cy="66" r="27" fill="#d98e22" />
                  <path d="M100 66 L100 32 A34 34 0 0 1 129 49 Z" fill="#f3ecdf" stroke="#b97417" stroke-width="2" transform="rotate(14 100 66) translate(12 -14)" />
                  <path d="M30 30 q10 -12 22 -2 q-4 8 -12 8 q3 6 -2 10" fill="none" stroke="#16130f" stroke-width="3" stroke-linecap="round" />
                  <circle cx="45" cy="26" r="2.4" fill="#16130f" />
                  <path d="M150 96 l8 -5 M162 92 l7 -6 M172 84 l6 -7" stroke="#b97417" stroke-width="3" stroke-linecap="round" />
                </svg>
              {:else if g.key === 'lighthouse'}
                <svg viewBox="0 0 200 120" aria-hidden="true">
                  <rect width="200" height="120" fill="#123c44" />
                  <path d="M100 22 L170 8 L170 36 Z" fill="#e0a13a" opacity=".55" />
                  <path d="M100 22 L30 8 L30 36 Z" fill="#e0a13a" opacity=".3" />
                  <path d="M92 38 L108 38 L114 96 L86 96 Z" fill="#f3ecdf" />
                  <rect x="88" y="52" width="24" height="9" fill="#1f8a8a" transform="skewX(-2)" />
                  <rect x="87" y="72" width="27" height="9" fill="#1f8a8a" transform="skewX(2)" />
                  <rect x="94" y="16" width="12" height="14" rx="2" fill="#e0a13a" />
                  <path d="M0 104 q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 V120 H0 Z" fill="#0d2c32" />
                </svg>
              {:else if g.key === 'burrow'}
                <svg viewBox="0 0 200 120" aria-hidden="true">
                  <rect width="200" height="120" fill="#f3ecdf" />
                  <path d="M0 120 Q60 44 130 78 Q170 96 200 88 L200 120 Z" fill="#e0a13a" opacity=".85" />
                  <ellipse cx="92" cy="92" rx="20" ry="13" fill="#16130f" />
                  <path d="M84 84 q-2 -18 6 -24 q4 8 2 22 M100 84 q2 -18 -6 -24 q-4 8 -2 22" fill="#f3ecdf" stroke="#16130f" stroke-width="2.4" stroke-linejoin="round" transform="translate(0 -4)" />
                  <path d="M150 66 l8 18 l-16 0 Z" fill="#d1571b" /><path d="M150 66 q-4 -8 2 -12" fill="none" stroke="#1f8a8a" stroke-width="3" stroke-linecap="round" />
                  <circle cx="40" cy="26" r="12" fill="#e0a13a" opacity=".5" />
                </svg>
              {:else}
                <svg viewBox="0 0 200 120" aria-hidden="true">
                  <rect width="200" height="120" fill="#1c3a4a" />
                  <circle cx="42" cy="26" r="11" fill="#f3ecdf" opacity=".85" />
                  <path d="M52 78 L148 78 L136 96 L64 96 Z" fill="#f3ecdf" />
                  <rect x="86" y="58" width="30" height="20" rx="3" fill="#e0a13a" />
                  <rect x="94" y="63" width="6" height="6" fill="#1c3a4a" /><rect x="104" y="63" width="6" height="6" fill="#1c3a4a" />
                  <rect x="98" y="42" width="5" height="16" fill="#f3ecdf" />
                  <path d="M0 100 q25 -7 50 0 t50 0 t50 0 t50 0 V120 H0 Z" fill="#122a36" />
                  <path d="M20 108 q20 -5 40 0 M120 110 q20 -5 40 0" stroke="#2f9e98" stroke-width="2" fill="none" opacity=".6" />
                </svg>
              {/if}
            </div>
            <div class="game-info">
              <div class="game-top">
                <h3>{g.title}</h3>
                <span class="game-price mono">{g.price}</span>
              </div>
              <p class="game-spec mono">{g.spec}</p>
              <p class="game-note">{g.note}</p>
              <span class="game-tag mono tag--{g.tagKind}">{g.tag}</span>
            </div>
          </article>
        {/each}
      </div>
      <p class="games-fine mono reveal">Free replacement meeples, forever. Dogs eat pieces. We know. We plan for it.</p>
    </div>
  </section>

  <!-- ============ how to play — the page-flip rulebook ============ -->
  <section id="howtoplay" class="howto" aria-labelledby="howto-title">
    <div class="wrap">
      <div class="sec-head">
        <p class="kicker kicker--amber mono reveal">[ How to play ]</p>
        <h2 id="howto-title" class="reveal">Rules, explained kindly.</h2>
        <p class="lede reveal">Here's the entire Hollowpine rulebook — four spreads, no appendix,
          nothing in nine-point legalese. Flip through it. Time yourself. We'll wait.</p>
      </div>
      <div class="reveal">
        <Rulebook />
      </div>
    </div>
  </section>

  <!-- ============ community — the long table ============ -->
  <section id="community" class="community" aria-labelledby="community-title">
    <div class="wrap">
      <div class="sec-head">
        <p class="kicker mono reveal">[ Community ]</p>
        <h2 id="community-title" class="reveal">The long table.</h2>
        <p class="lede reveal">A publisher is just a shop until people sit down. There's a long table
          in ours, the kettle is usually on, and Wednesdays get loud in the best way.</p>
      </div>
      <div class="comm-grid">
        <div class="comm-nights">
          {#each nights as n}
            <div class="night reveal">
              <span class="night-when mono">{n.when}</span>
              <div>
                <h3>{n.what}</h3>
                <p>{n.note}</p>
              </div>
            </div>
          {/each}
        </div>
        <div class="comm-quotes">
          {#each quotes as t, i}
            <blockquote class="quote reveal" style="transition-delay:{i * 90}ms">
              <p>&ldquo;{t.q}&rdquo;</p>
              <footer class="mono">— {t.who}</footer>
            </blockquote>
          {/each}
        </div>
      </div>

      <div id="table" class="rsvp reveal" aria-live="polite">
        {#if sent}
          <div class="rsvp-done">
            <strong>You&rsquo;re on the table list.</strong>
            <span class="mono">demo only — nothing was sent. wednesdays, 6pm, the kettle&rsquo;s on.</span>
          </div>
        {:else}
          <form bind:this={formEl} onsubmit={submitRsvp} novalidate>
            <div class="rsvp-head">
              <h3>Save a seat on Wednesday</h3>
              <p>First visit? We&rsquo;ll have a game set up and a chair with your name on it. Figuratively. Unless you&rsquo;re a Legend tier member.</p>
            </div>
            <div class="rsvp-fields">
              <div class="field">
                <label class="mono" for="rName">Name</label>
                <input id="rName" name="name" type="text" required autocomplete="name" placeholder="Your name" />
              </div>
              <div class="field">
                <label class="mono" for="rEmail">Email</label>
                <input id="rEmail" name="email" type="email" required autocomplete="email" placeholder="you@example.com" />
              </div>
              <div class="field">
                <label class="mono" for="rVibe">Tonight&rsquo;s vibe</label>
                <select id="rVibe" name="vibe">
                  <option>Surprise me</option>
                  <option>Something strategic</option>
                  <option>Something loud</option>
                  <option>Everyone on one team</option>
                </select>
              </div>
              <button class="btn btn-primary" type="submit">Save my seat</button>
            </div>
            <p class="rsvp-fine mono">Demo form — no message is sent anywhere. See the README.</p>
          </form>
        {/if}
      </div>
    </div>
  </section>

  <!-- ============ the table club — pricing ============ -->
  <section id="club" class="club" aria-labelledby="club-title">
    <div class="wrap">
      <div class="sec-head">
        <p class="kicker kicker--amber mono reveal">[ The Table Club ]</p>
        <h2 id="club-title" class="reveal">Membership, three sizes.</h2>
        <p class="lede reveal">The club keeps the lights on and the open tables free. In exchange you
          get first roll at everything we make.</p>
      </div>
      <div class="tier-grid">
        {#each tiers as t, i}
          <article class="tier reveal" class:tier--best={t.best}>
            {#if t.best}<span class="tier-badge mono">most tables pick this</span>{/if}
            <h3>{t.name}</h3>
            <p class="tier-price"><strong>{t.price}</strong><span class="mono">{t.per}</span></p>
            <ul class="tier-perks">
              {#each t.perks as p}<li>{p}</li>{/each}
            </ul>
            <a class="btn btn-block {t.best ? 'btn-primary' : 'btn-ghost'}" href="#table">{t.cta}</a>
          </article>
        {/each}
      </div>
      <p class="club-fine mono reveal">Demo pricing — this is a design showcase, not a working checkout.</p>
    </div>
  </section>
</main>

<footer class="footer">
  <div class="wrap foot-top">
    <span class="foot-brand">Meeplewood</span>
    <nav class="foot-links" aria-label="Footer">
      <a href="#games">The games</a><a href="#howtoplay">How to play</a><a href="#community">Community</a><a href="#club">The Table Club</a><a href="{base}/guide/">Guide</a>
    </nav>
  </div>
  <div class="wrap foot-bottom mono">
    <span>© 2026 Meeplewood — a design-showcase concept, not a real publisher. The games, the club and the fox are fiction.</span>
    <span>Designed &amp; built by Parable · <a href="{base}/guide/">How this was built &rarr;</a></span>
  </div>
</footer>

<style>
  /* ---------- hero ---------- */
  .hero { padding: clamp(2.6rem, 6vw, 5rem) 0 clamp(2.4rem, 5vw, 4rem); position: relative; z-index: 1; }
  .hero-grid { display: grid; grid-template-columns: 1.1fr .9fr; gap: clamp(1.5rem, 4vw, 3.5rem); align-items: center; }
  @media (max-width: 900px) { .hero-grid { grid-template-columns: 1fr; } .hero-dice { justify-self: center; } }

  .hero-title { font-size: clamp(2.5rem, 7vw, 4.9rem); margin: .2rem 0 0; }
  .hero-sub { color: var(--dim); max-width: 46ch; margin: 1.4rem 0 0; font-size: clamp(1rem, 1.4vw, 1.12rem); }
  .hero-actions { display: flex; flex-wrap: wrap; gap: .7rem; margin: 1.8rem 0 0; }
  .hero-facts { display: flex; flex-wrap: wrap; gap: 1.8rem; margin: 2.2rem 0 0; padding-top: 1.3rem; border-top: 1px solid var(--line); }
  .hero-facts div { display: flex; flex-direction: column; gap: .15rem; }
  .hero-facts dt { font-size: .66rem; letter-spacing: .16em; text-transform: uppercase; color: var(--faint); }
  .hero-facts dd { margin: 0; font-family: var(--font-d); font-weight: 600; font-size: 1.45rem; }
  .hero-scroll { margin: clamp(1.6rem, 4vw, 2.8rem) auto 0; font-size: .7rem; letter-spacing: .18em; text-transform: uppercase; color: var(--faint); }

  /* ---------- games ---------- */
  .games { padding: clamp(3.6rem, 8vw, 6.5rem) 0; background: var(--bg-2); border-block: 1px solid var(--line); position: relative; overflow: hidden; }
  .wm {
    position: absolute; top: 2%; right: -3%; z-index: 0; pointer-events: none; user-select: none;
    font-family: var(--font-d); font-weight: 600; font-size: clamp(4.5rem, 16vw, 13rem);
    color: var(--ink); opacity: .04; letter-spacing: .02em; white-space: nowrap;
  }
  .games .wrap { position: relative; z-index: 1; }
  .game-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.1rem; }
  @media (max-width: 960px) { .game-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 600px) { .game-grid { grid-template-columns: 1fr; } }
  .game {
    border: 1px solid var(--line); border-radius: 18px; background: var(--panel); overflow: hidden;
    transition: opacity .8s var(--ease-page), transform .45s var(--ease), border-color .3s, box-shadow .3s;
  }
  .game:hover { transform: translateY(-5px) rotate(-.4deg); border-color: color-mix(in oklab, var(--accent) 45%, var(--line)); box-shadow: var(--shadow); }
  .game--flag { grid-column: span 2; }
  @media (max-width: 600px) { .game--flag { grid-column: auto; } }
  .game-art { aspect-ratio: 16 / 8; border-bottom: 1px solid var(--line); }
  .game--flag .game-art { aspect-ratio: 16 / 6.4; }
  @media (max-width: 600px) { .game--flag .game-art { aspect-ratio: 16 / 8; } }
  .game-art svg { width: 100%; height: 100%; display: block; object-fit: cover; }
  .game-info { padding: 1.05rem 1.15rem 1.25rem; }
  .game-top { display: flex; align-items: baseline; justify-content: space-between; gap: .6rem; }
  .game-top h3 { font-size: 1.28rem; }
  .game-price { font-size: .95rem; color: var(--amber); font-weight: 700; }
  .game-spec { margin: .45rem 0 .1rem; font-size: .7rem; color: var(--faint); }
  .game-note { color: var(--dim); font-size: .9rem; margin: .5rem 0 .9rem; }
  .game-tag { display: inline-block; font-size: .66rem; letter-spacing: .08em; text-transform: uppercase; padding: .2rem .6rem; border-radius: 999px; border: 1px solid var(--line); color: var(--dim); }
  .tag--ok { color: var(--accent); border-color: color-mix(in oklab, var(--accent) 45%, var(--line)); }
  .tag--amber { color: var(--amber); border-color: color-mix(in oklab, var(--amber-bg) 55%, var(--line)); }
  .tag--soon { color: var(--dim); }
  .games-fine { margin: 1.6rem 0 0; font-size: .72rem; color: var(--faint); }

  /* ---------- how to play ---------- */
  .howto { padding: clamp(3.6rem, 8vw, 6.5rem) 0; position: relative; z-index: 1; }

  /* ---------- community ---------- */
  .community { padding: clamp(3.6rem, 8vw, 6.5rem) 0; background: var(--bg-2); border-block: 1px solid var(--line); position: relative; z-index: 1; }
  .comm-grid { display: grid; grid-template-columns: 1.1fr .9fr; gap: clamp(1.4rem, 4vw, 3rem); align-items: start; }
  @media (max-width: 860px) { .comm-grid { grid-template-columns: 1fr; } }
  .night {
    display: grid; grid-template-columns: 9.5rem 1fr; gap: 1rem; align-items: start;
    padding: 1.3rem 0; border-top: 1px solid var(--line);
  }
  .night:last-child { border-bottom: 1px solid var(--line); }
  .night-when { font-size: .68rem; letter-spacing: .1em; text-transform: uppercase; color: var(--amber); padding-top: .4rem; }
  .night h3 { font-size: 1.2rem; }
  .night p { color: var(--dim); margin: .3rem 0 0; font-size: .92rem; }
  @media (max-width: 480px) { .night { grid-template-columns: 1fr; gap: .3rem; } }

  .comm-quotes { display: grid; gap: .9rem; }
  .quote {
    margin: 0; padding: 1.1rem 1.25rem; border: 1px solid var(--line); border-radius: 16px;
    background: var(--panel); box-shadow: var(--shadow);
  }
  .quote:nth-child(2) { transform: rotate(.6deg); }
  .quote:nth-child(3) { transform: rotate(-.5deg); }
  .quote p { margin: 0; color: var(--ink); font-size: .95rem; font-style: italic; }
  .quote footer { margin-top: .55rem; font-size: .66rem; letter-spacing: .1em; text-transform: uppercase; color: var(--faint); }

  .rsvp { margin-top: clamp(2rem, 5vw, 3rem); border: 1px solid var(--line); border-radius: 20px; background: var(--panel); padding: clamp(1.2rem, 3vw, 2rem); box-shadow: var(--shadow); scroll-margin-top: 6rem; }
  .rsvp-head h3 { font-size: 1.45rem; }
  .rsvp-head p { color: var(--dim); margin: .4rem 0 1.1rem; max-width: 60ch; }
  .rsvp-fields { display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: .8rem; align-items: end; }
  @media (max-width: 860px) { .rsvp-fields { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 540px) { .rsvp-fields { grid-template-columns: 1fr; } }
  .field label { display: block; font-size: .64rem; letter-spacing: .12em; text-transform: uppercase; color: var(--faint); margin-bottom: .35rem; }
  .field input, .field select {
    width: 100%; padding: .68rem .85rem; border: 1.5px solid var(--line); border-radius: 12px;
    background: var(--bg); color: var(--ink); font: inherit; font-size: .92rem;
  }
  .field input::placeholder { color: var(--faint); }
  .rsvp-fine { margin: .9rem 0 0; font-size: .68rem; color: var(--faint); }
  .rsvp-done { text-align: center; padding: 1.6rem .5rem; }
  .rsvp-done strong { font-family: var(--font-d); font-weight: 600; font-size: 1.5rem; display: block; }
  .rsvp-done .mono { display: block; margin-top: .5rem; font-size: .7rem; color: var(--faint); }

  /* ---------- the table club ---------- */
  .club { padding: clamp(3.6rem, 8vw, 6.5rem) 0; position: relative; z-index: 1; }
  .tier-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.1rem; align-items: stretch; }
  @media (max-width: 900px) { .tier-grid { grid-template-columns: 1fr; max-width: 460px; margin-inline: auto; } }
  .tier {
    position: relative; display: flex; flex-direction: column;
    border: 1.5px solid var(--line); border-radius: 20px; background: var(--panel);
    padding: 1.5rem 1.4rem 1.4rem;
    transition: opacity .8s var(--ease-page), transform .45s var(--ease), border-color .3s;
  }
  .tier:hover { transform: translateY(-4px); }
  .tier--best { border-color: color-mix(in oklab, var(--amber-bg) 70%, var(--line)); box-shadow: var(--shadow); }
  .tier-badge {
    position: absolute; top: -0.72rem; left: 50%; transform: translateX(-50%);
    background: var(--amber-bg); color: var(--night-fixed);
    font-size: .62rem; letter-spacing: .1em; text-transform: uppercase; font-weight: 700;
    padding: .22rem .7rem; border-radius: 999px; white-space: nowrap;
  }
  .tier h3 { font-size: 1.3rem; }
  .tier-price { margin: .5rem 0 .9rem; }
  .tier-price strong { font-family: var(--font-d); font-weight: 600; font-size: 2.1rem; color: var(--ink); }
  .tier-price .mono { color: var(--faint); font-size: .74rem; margin-left: .25rem; }
  .tier-perks { list-style: none; margin: 0 0 1.3rem; padding: 0; display: grid; gap: .45rem; flex: 1; }
  .tier-perks li { position: relative; padding-left: 1.35rem; color: var(--dim); font-size: .9rem; }
  .tier-perks li::before { content: "⚄"; position: absolute; left: 0; top: -.05em; color: var(--accent); }
  .club-fine { margin: 1.5rem 0 0; text-align: center; font-size: .68rem; color: var(--faint); }

  @media (prefers-reduced-motion: reduce) {
    .game, .tier { transition: none; }
    .game:hover, .tier:hover { transform: none; }
  }
</style>
