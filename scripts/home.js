/* =========================================================
   home.js  —  Home + About page interactions
   1) Globe scene ka 3D mouse tilt
   2) Photo ka 3D mouse tilt
   3) Stats counter (1+, 5+)
   4) About section ka scroll reveal
   ========================================================= */

(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------- 1) globe scene tilt ---------- */
  const scene = document.getElementById("scene");

  if (scene && !reduceMotion) {
    const MAX = 12; // degrees

    window.addEventListener("mousemove", (e) => {
      const r = scene.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;

      // -1 se +1 ke beech (screen ke half-size ke hisaab se)
      const nx = clamp((e.clientX - cx) / (window.innerWidth / 2), -1, 1);
      const ny = clamp((e.clientY - cy) / (window.innerHeight / 2), -1, 1);

      scene.style.setProperty("--ry", (nx * MAX).toFixed(2) + "deg");
      scene.style.setProperty("--rx", (-ny * MAX).toFixed(2) + "deg");
    }, { passive: true });

    document.addEventListener("mouseleave", () => {
      scene.style.setProperty("--rx", "0deg");
      scene.style.setProperty("--ry", "0deg");
    });
  }

  /* ---------- 2) photo tilt (sirf photo ke upar hover karne par) ---------- */
  const photo = document.getElementById("photoWrap");

  if (photo && !reduceMotion) {
    const MAXP = 14;

    photo.addEventListener("mousemove", (e) => {
      const r = photo.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;   // -0.5 .. 0.5
      const ny = (e.clientY - r.top) / r.height - 0.5;

      photo.style.setProperty("--pry", (nx * MAXP * 2).toFixed(2) + "deg");
      photo.style.setProperty("--prx", (-ny * MAXP * 2).toFixed(2) + "deg");
    });

    photo.addEventListener("mouseleave", () => {
      photo.style.setProperty("--prx", "0deg");
      photo.style.setProperty("--pry", "0deg");
    });
  }

  /* ---------- 3) counter ---------- */
  function countUp(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    if (isNaN(target)) return;

    if (reduceMotion) { el.textContent = target + suffix; return; }

    const duration = 1200;
    const start = performance.now();

    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);            // ease-out
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- 4) reveal + counter trigger ---------- */
  const reveals = document.querySelectorAll(".reveal");
  const counters = document.querySelectorAll("[data-count]");

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("in");

        // is block ke andar jitne counters hain sab chalao
        entry.target.querySelectorAll("[data-count]").forEach(countUp);

        io.unobserve(entry.target);
      });
    }, { threshold: 0.25 });

    reveals.forEach((el) => io.observe(el));
  } else {
    // purane browser: seedha sab dikha do
    reveals.forEach((el) => el.classList.add("in"));
    counters.forEach(countUp);
  }
})();