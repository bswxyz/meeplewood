/* Scroll reveals + animated counters, as one Svelte action.
   The hidden initial states live behind the `.js` class in app.css,
   so without JavaScript nothing on the page is ever invisible.
   Counters prerender their final values; this action zeroes them
   for the count-up only once JS is actually running. */
export function revealAll(node) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = node.querySelectorAll('.reveal');
  const counters = node.querySelectorAll('.c-num');
  const fmt = (el, v) => {
    const dec = +(el.dataset.dec || 0);
    el.textContent = dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US');
  };

  if (reduce) {
    reveals.forEach((el) => el.classList.add('is-in'));
    counters.forEach((el) => fmt(el, parseFloat(el.dataset.to)));
    return {};
  }

  /* JS is live and motion is allowed — reset to 0 for the count-up */
  counters.forEach((el) => fmt(el, 0));

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.14, rootMargin: '0px 0px -6% 0px' }
  );
  reveals.forEach((el) => io.observe(el));

  const cio = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target;
        const to = parseFloat(el.dataset.to);
        cio.unobserve(el);
        const t0 = performance.now();
        const dur = 1300;
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / dur);
          fmt(el, to * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => cio.observe(el));

  return {
    destroy() {
      io.disconnect();
      cio.disconnect();
    }
  };
}
