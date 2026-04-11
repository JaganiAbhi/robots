/**
 * Custom cursor: glowing orb + ring with lerp follow
 */
export function initCursor() {
  const orb = document.getElementById("cursor-orb");
  const glow = document.getElementById("cursor-glow");
  if (!orb || !glow) return () => {};

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let ox = mx;
  let oy = my;
  let gx = mx;
  let gy = my;
  const lerpOrb = 0.35;
  const lerpGlow = 0.12;

  function onMove(e) {
    mx = e.clientX;
    my = e.clientY;
  }

  let raf = 0;
  function tick() {
    ox += (mx - ox) * lerpOrb;
    oy += (my - oy) * lerpOrb;
    gx += (mx - gx) * lerpGlow;
    gy += (my - gy) * lerpGlow;
    orb.style.transform = `translate(${ox}px, ${oy}px)`;
    glow.style.transform = `translate(${gx}px, ${gy}px)`;
    raf = requestAnimationFrame(tick);
  }

  window.addEventListener("mousemove", onMove);
  raf = requestAnimationFrame(tick);

  return () => {
    window.removeEventListener("mousemove", onMove);
    cancelAnimationFrame(raf);
  };
}
