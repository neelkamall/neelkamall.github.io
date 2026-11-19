/* ===== 1. Hilta hua particles background ===== */
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let particles = [];
const mouse = { x: -999, y: -999 };

function setup() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const count = Math.min(100, Math.floor((canvas.width * canvas.height) / 14000));
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 1.6 + 0.6
    });
  }
}

window.addEventListener('resize', setup);
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    // Mouse ke paas aane par dots door bhaagte hain
    const dx = p.x - mouse.x;
    const dy = p.y - mouse.y;
    const d = Math.hypot(dx, dy);
    if (d < 120 && d > 0) {
      p.x += (dx / d) * 1.5;
      p.y += (dy / d) * 1.5;
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(130, 180, 255, 0.85)';
    ctx.fill();
  }

  // Paas wale dots ke beech line
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
      if (dist < 130) {
        ctx.strokeStyle = `rgba(96, 150, 255, ${0.25 * (1 - dist / 130)})`;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animate);
}

setup();
animate();

/* ===== 2. Scroll karne par cheezein dheere se aayein + skill bars bharein ===== */
const revealer = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      e.target.querySelectorAll('.bar i').forEach((b) => {
        b.style.width = b.dataset.w + '%';
      });
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.rv').forEach((el) => revealer.observe(el));

/* ===== 3. Menu me jo section dikh raha hai wo highlight ho ===== */
const navLinks = document.querySelectorAll('nav a');
const spy = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      navLinks.forEach((a) => {
        a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id);
      });
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('section').forEach((s) => spy.observe(s));

/* ===== 4. Projects ka filter (All / Web Apps / AI) ===== */
const buttons = document.querySelectorAll('.filters button');
buttons.forEach((btn) => {
  btn.addEventListener('click', () => {
    buttons.forEach((b) => b.classList.remove('on'));
    btn.classList.add('on');
    document.querySelectorAll('.proj').forEach((card) => {
      const show = btn.dataset.f === 'all' || card.dataset.t === btn.dataset.f;
      card.classList.toggle('hide', !show);
    });
  });
});