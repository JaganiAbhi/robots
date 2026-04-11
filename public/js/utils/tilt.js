/** 3D tilt on mousemove — max 10deg, perspective from parent */
export function initCardTilt(root, selector = ".tilt-card", innerSel = ".tilt-card__inner") {
  const cards = root.querySelectorAll(selector);
  const cleanups = [];

  cards.forEach((card) => {
    const inner = card.querySelector(innerSel) || card;
    const move = (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const px = (x / r.width - 0.5) * 2;
      const py = (y / r.height - 0.5) * 2;
      inner.style.transform = `rotateX(${-py * 10}deg) rotateY(${px * 10}deg)`;
    };
    const leave = () => {
      inner.style.transform = "";
    };
    card.addEventListener("mousemove", move);
    card.addEventListener("mouseleave", leave);
    cleanups.push(() => {
      card.removeEventListener("mousemove", move);
      card.removeEventListener("mouseleave", leave);
    });
  });

  return () => cleanups.forEach((fn) => fn());
}
