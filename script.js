// Hilta hua particles wala background
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');

let particles = [];
const mouse = { x: -999, y: -999 };

// Screen ka size set karo aur particles banao
function setup() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particles = [];
  for (let i = 0; i < 90; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,   // left-right speed
      vy: (Math.random() - 0.5) * 0.5,   // up-down speed
      r: Math.random() * 1.6 + 0.6       // size
    });
  }
}

window.addEventListener('resize', setup);
window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });

// Har frame me: particles hilao, dots aur unke beech ki lines draw karo
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;   // kinare se wapas
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(130, 180, 255, 0.85)';
    ctx.fill();
  }

  // Paas wale dots ke beech line
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
      if (d < 130) {
        ctx.strokeStyle = `rgba(96, 150, 255, ${0.25 * (1 - d / 130)})`;
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