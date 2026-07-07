// JS-driven section scrolling. Browser-native smooth anchor scrolling gets
// cancelled by any programmatic scroll — and the hero carousel writes its
// scrollLeft every animation frame — so we animate window scroll ourselves
// and re-assert the position each frame. User input (wheel/touch/keys)
// cancels the animation so we never fight the visitor.
export function scrollToSection(id: string, duration = 700) {
  const el = document.getElementById(id);
  if (!el) return;

  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  const start = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const end =
    id === "home"
      ? 0
      : Math.min(Math.max(el.getBoundingClientRect().top + start - margin, 0), max);

  history.replaceState(null, "", `#${id}`);

  let raf = 0;
  let settled = false;
  const t0 = performance.now();
  const cancelEvents = ["wheel", "touchstart", "keydown"] as const;

  const cleanup = () => {
    settled = true;
    cancelAnimationFrame(raf);
    clearTimeout(fallback);
    for (const ev of cancelEvents) window.removeEventListener(ev, onUserInput);
  };
  const onUserInput = () => cleanup();
  for (const ev of cancelEvents) {
    window.addEventListener(ev, onUserInput, { passive: true });
  }

  // if frames stall (throttled/background tab), land on the target anyway
  const fallback = setTimeout(() => {
    if (!settled) {
      cleanup();
      window.scrollTo(0, end);
    }
  }, duration + 250);

  const ease = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const step = (t: number) => {
    const p = Math.min(1, (t - t0) / duration);
    window.scrollTo(0, start + (end - start) * ease(p));
    if (p < 1) raf = requestAnimationFrame(step);
    else cleanup();
  };
  raf = requestAnimationFrame(step);
}
