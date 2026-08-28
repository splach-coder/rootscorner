/**
 * Keep the intro out of the measuring scripts.
 *
 * The intro locks page scroll for ~1.55s after first paint, and every Playwright
 * page is a fresh session, so it opens on every run. Any script that scrolls
 * shortly after load would otherwise be measuring a page that cannot move — and
 * would report it as layout, not as a lock.
 *
 * Seeding the gate's own session key is better than sleeping past it: these
 * scripts exist to measure the steady-state page, and this removes the timing
 * coupling entirely rather than betting on a delay. The intro itself is covered
 * by intro-frames.mjs and intro-guards.mjs.
 */
export const skipIntro = (page) =>
  page.addInitScript(() => {
    try {
      sessionStorage.setItem("trc:intro", "1");
    } catch {
      /* opaque origin — the gate falls back to showing it, which is safe here */
    }
  });
