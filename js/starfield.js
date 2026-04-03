/** Canvas starfield — 150 stars, slow drift */
export function initStarfield() {
  const canvas = document.getElementById("starfield");
  if (!canvas) return () => {};

  const ctx = canvas.getContext("2d");
  const stars = [];
  const N = 150;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function initStars() {
    stars.length = 0;
    for (let i = 0; i < N; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 0.8 + 0.2,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.12,
        r: Math.random() * 1.2 + 0.3,
      });
    }
  }

  resize();
  initStars();

  let raf = 0;
  function loop() {
    ctx.fillStyle = "#050018";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (const s of stars) {
      s.x += s.vx;
      s.y += s.vy;
      if (s.x < 0) s.x = canvas.width;
      if (s.x > canvas.width) s.x = 0;
      if (s.y < 0) s.y = canvas.height;
      if (s.y > canvas.height) s.y = 0;
      ctx.beginPath();
      ctx.fillStyle = `rgba(240,246,255,${0.3 + s.z * 0.7})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame(loop);

  const onResize = () => {
    resize();
    initStars();
  };
  window.addEventListener("resize", onResize);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
  };
}
