/** IntersectionObserver scroll reveal */
export function bindScrollReveal(root = document) {
  const els = root.querySelectorAll(".reveal");
  if (!els.length) return () => {};

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          io.unobserve(en.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  els.forEach((el) => io.observe(el));

  return () => {
    els.forEach((el) => io.unobserve(el));
    io.disconnect();
  };
}
