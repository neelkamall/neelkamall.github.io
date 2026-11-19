/* =========================================================
   background.js  —  stars + light graph (nodes, lines, pulses)
   Mouse jahan jaayega, waha ke stars aur nodes door hat jayenge,
   mouse hatne par spring ki tarah wapas aa jayenge.
   ========================================================= */

(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  /* ---------- settings (yahan se tweak karo) ---------- */
  const CFG = {
    starRepelRadius: 150,
    starRepelForce:  2.4,
    starSpring:      0.022,

    nodeRepelRadius: 170,   // cursor ka asar kitni door tak
    nodeRepelForce:  3.2,
    nodeSpring:      0.018, // chhota = dheere wapas aayein

    linkDistance:    120,   // itni door tak lines banengi
    lineAlpha:       0.2,   // line ki brightness (0.1 = bahut halki)
    hubChance:       0.06,  // kitne nodes thode bade honge

    starDensity:     4500,  // chhota number = zyada stars
    nodeDensity:     16000, // bada number = kam nodes
    maxNodes:        90,
    maxPulses:       4
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mouse = { x: -9999, y: -9999 };

  let W = 0, H = 0, DPR = 1;
  let stars = [];
  let nodes = [];
  let pulses = [];
  let spawnTimer = 0;

  const rand  = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function palette() {
    const light = document.documentElement.getAttribute("data-theme") === "light";
    return light
      ? { star: "40,80,200",   line: "47,123,255", node: "47,123,255", pulse: "20,70,220" }
      : { star: "200,222,255", line: "80,140,255", node: "130,190,255", pulse: "190,225,255" };
  }

  /* ---------- setup ---------- */
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    build();
  }

  function build() {
    const area = W * H;
    const starCount = clamp(Math.round(area / CFG.starDensity), 100, 360);
    const nodeCount = clamp(Math.round(area / CFG.nodeDensity), 35, CFG.maxNodes);

    stars = Array.from({ length: starCount }, () => ({
      x0: rand(0, W), y0: rand(0, H),
      ox: 0, oy: 0, vx: 0, vy: 0,
      r: Math.random() < 0.12 ? rand(1.4, 2.2) : rand(0.4, 1.2),
      a: rand(0.35, 1),
      tw: rand(0.4, 1.6),
      ph: rand(0, Math.PI * 2)
    }));

    nodes = Array.from({ length: nodeCount }, () => {
      const hub = Math.random() < CFG.hubChance;
      return {
        ax: rand(0, W), ay: rand(0, H),
        dx: rand(-0.2, 0.2), dy: rand(-0.2, 0.2),
        ox: 0, oy: 0, vx: 0, vy: 0,
        x: 0, y: 0,
        hub,
        r: hub ? rand(1.8, 2.6) : rand(0.8, 1.6)
      };
    });

    pulses = [];
  }

  /* ---------- repel helper ---------- */
  function repel(x, y, radius, force) {
    const dx = x - mouse.x;
    const dy = y - mouse.y;
    const d = Math.hypot(dx, dy);
    if (d > 0 && d < radius) {
      const t = 1 - d / radius;
      const f = t * t * force;
      return [(dx / d) * f, (dy / d) * f];
    }
    return null;
  }

  /* ---------- pulse spawn ---------- */
  function spawnPulse() {
    if (pulses.length >= CFG.maxPulses) return;
    const a = nodes[(Math.random() * nodes.length) | 0];
    const near = [];
    for (const b of nodes) {
      if (b === a) continue;
      if (Math.hypot(a.x - b.x, a.y - b.y) < CFG.linkDistance) near.push(b);
    }
    if (!near.length) return;
    pulses.push({ a, b: near[(Math.random() * near.length) | 0], t: 0 });
  }

  /* ---------- frame ---------- */
  let last = performance.now();

  function frame(now) {
    const dt = Math.min((now - last) / 16.67, 3);
    last = now;
    const c = palette();

    ctx.clearRect(0, 0, W, H);

    /* ---- stars ---- */
    for (const s of stars) {
      const push = repel(s.x0 + s.ox, s.y0 + s.oy, CFG.starRepelRadius, CFG.starRepelForce);
      if (push) { s.vx += push[0]; s.vy += push[1]; }

      s.vx += -s.ox * CFG.starSpring * dt;
      s.vy += -s.oy * CFG.starSpring * dt;
      s.vx *= 0.9;
      s.vy *= 0.9;
      s.ox += s.vx * dt;
      s.oy += s.vy * dt;

      const tw = reduceMotion ? 1 : 0.6 + 0.4 * Math.sin(now * 0.001 * s.tw + s.ph);
      const x = s.x0 + s.ox, y = s.y0 + s.oy;

      ctx.beginPath();
      ctx.fillStyle = `rgba(${c.star},${s.a * tw})`;
      ctx.arc(x, y, s.r, 0, Math.PI * 2);
      ctx.fill();

      if (s.r > 1.4) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(${c.star},${0.08 * tw})`;
        ctx.arc(x, y, s.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    /* ---- nodes: update ---- */
    for (const n of nodes) {
      if (!reduceMotion) {
        n.ax += n.dx * dt;
        n.ay += n.dy * dt;
        if (n.ax < -20) n.ax = W + 20;
        if (n.ax > W + 20) n.ax = -20;
        if (n.ay < -20) n.ay = H + 20;
        if (n.ay > H + 20) n.ay = -20;
      }

      const push = repel(n.ax + n.ox, n.ay + n.oy, CFG.nodeRepelRadius, CFG.nodeRepelForce);
      if (push) { n.vx += push[0]; n.vy += push[1]; }

      n.vx += -n.ox * CFG.nodeSpring * dt;
      n.vy += -n.oy * CFG.nodeSpring * dt;
      n.vx *= 0.9;
      n.vy *= 0.9;
      n.ox += n.vx * dt;
      n.oy += n.vy * dt;

      n.x = n.ax + n.ox;
      n.y = n.ay + n.oy;
    }

    /* ---- lines ---- */
    ctx.lineWidth = 0.8;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < CFG.linkDistance) {
          ctx.strokeStyle = `rgba(${c.line},${(1 - d / CFG.linkDistance) * CFG.lineAlpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    /* ---- pulses (lines pe chalte chhote glowing dots) ---- */
    if (!reduceMotion) {
      spawnTimer += dt;
      if (spawnTimer > 40) { spawnTimer = 0; spawnPulse(); }

      for (let k = pulses.length - 1; k >= 0; k--) {
        const p = pulses[k];
        p.t += 0.016 * dt;
        if (p.t >= 1) { pulses.splice(k, 1); continue; }

        const x = p.a.x + (p.b.x - p.a.x) * p.t;
        const y = p.a.y + (p.b.y - p.a.y) * p.t;
        const fade = Math.sin(p.t * Math.PI);

        ctx.beginPath();
        ctx.fillStyle = `rgba(${c.pulse},${0.18 * fade})`;
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `rgba(${c.pulse},${0.8 * fade})`;
        ctx.arc(x, y, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    /* ---- nodes: draw ---- */
    for (const n of nodes) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(${c.node},${n.hub ? 0.14 : 0.08})`;
      ctx.arc(n.x, n.y, n.r * 2.6, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = `rgba(${c.node},${n.hub ? 0.75 : 0.6})`;
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(frame);
  }

  /* ---------- mouse / touch ---------- */
  window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  window.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    if (t) { mouse.x = t.clientX; mouse.y = t.clientY; }
  }, { passive: true });
  const away = () => { mouse.x = -9999; mouse.y = -9999; };
  window.addEventListener("mouseleave", away);
  window.addEventListener("touchend", away);
  document.addEventListener("mouseleave", away);

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  resize();
  requestAnimationFrame(frame);
})();