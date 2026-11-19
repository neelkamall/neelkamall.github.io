/* =========================================================
   scripts/skills.js  —  Orbital (default) + Categories view
   switcher, orbital motion, category cards & 3D tilt
   ========================================================= */

(function () {
  const SKILLS_DATA = [
    {
      num: "01",
      icon: "code",
      title: "Backend Development",
      desc: "Building APIs, handling authentication, business logic and server-side applications.",
      tags: ["Node.js", "Express.js", "FastAPI", "REST APIs", "JWT", "Bcrypt"],
      footerLabel: "CORE SPECIALIZATION"
    },
    {
      num: "02",
      icon: "command",
      title: "Programming Languages",
      desc: "Writing clean code, solving problems and understanding programming fundamentals.",
      tags: ["Python", "JavaScript", "Java", "SQL"],
      footerLabel: "LANGUAGES"
    },
    {
      num: "03",
      icon: "database",
      title: "Database & Storage",
      desc: "Data modelling, database operations, CRUD functionality and data management.",
      tags: ["PostgreSQL", "MySQL", "MongoDB"],
      footerLabel: "DATA MANAGEMENT"
    },
    {
      num: "04",
      icon: "sparkle",
      title: "AI Integration",
      desc: "Integrating AI capabilities into applications and exploring intelligent backend systems.",
      tags: ["LLM APIs", "AI Integration", "Prompt Engineering", "RAG Fundamentals"],
      footerLabel: "AI & EMERGING TECH"
    },
    {
      num: "05",
      icon: "gear",
      title: "Tools & Workflow",
      desc: "Development workflow, API testing, version control and project management.",
      tags: ["Git", "GitHub", "Postman", "VS Code", "REST Client"],
      footerLabel: "DEVELOPMENT TOOLS"
    },
    
  ];

  const EXPLORING_DATA = [
    { topic: "Advanced FastAPI", status: "LEARNING" },
    { topic: "Data Structures & Algorithms", status: "LEARNING" },
    { topic: "Agentic AI", status: "EXPLORING" },
    { topic: "Advanced RAG", status: "EXPLORING" }
  ];

  const ICONS = {
    code: '<path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>',
    command: '<path d="M18 3a3 3 0 00-3 3v12a3 3 0 103-3H6a3 3 0 103 3V6a3 3 0 10-3 3h12"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>',
    sparkle: '<path d="M12 3v18M4.9 7.5l14.2 9M19.1 7.5L4.9 16.5"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>',
    layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
    arrowUpRight: '<path d="M7 17L17 7M8 7h9v9"/>'
  };

  const orbitalView = document.getElementById("orbitalView");
  const categoriesView = document.getElementById("categoriesView");
  const orbitNodesEl = document.getElementById("orbitNodes");
  const orbitalHint = document.getElementById("orbitalHint");
  const grid = document.getElementById("skillsGrid");
  const exploringList = document.getElementById("exploringList");
  const viewBtns = document.querySelectorAll(".view-btn");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const esc = (str) =>
    String(str).replace(/[&<>"]/g, (ch) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;"
    }[ch]));

  const iconSvg = (name, cls = "") =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.code}</svg>`;

  /* ---------- switch between Orbital (default) & Categories ---------- */
  function setView(mode) {
    const isOrbital = mode !== "categories";

    viewBtns.forEach((btn) => {
      const active = btn.dataset.view === (isOrbital ? "orbital" : "categories");
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-selected", String(active));
    });

    if (orbitalView) orbitalView.hidden = !isOrbital;
    if (categoriesView) categoriesView.hidden = isOrbital;
  }

  viewBtns.forEach((btn) => {
    btn.addEventListener("click", () => setView(btn.dataset.view));
  });

  /* ---------- build Orbital pills & motion ---------- */
  const orbitItems = [];
  let hoveredPill = null;

  function buildOrbital() {
    if (!orbitNodesEl) return;

    const ringConfigs = [
      { radius: 120, speed: 0.00024, dir: 1 },
      { radius: 195, speed: 0.00017, dir: -1 },
      { radius: 265, speed: 0.00012, dir: 1 }
    ];

    const flatSkills = [];
    SKILLS_DATA.forEach((cat, catIdx) => {
      cat.tags.forEach((tag, tagIdx) => {
        const ring = ringConfigs[(catIdx + tagIdx) % ringConfigs.length];
        flatSkills.push({
          label: tag,
          category: cat.title,
          radius: ring.radius,
          speed: ring.speed * ring.dir,
          angle: 0
        });
      });
    });

    // Distribute angles evenly within each ring
    [120, 195, 265].forEach((r) => {
      const group = flatSkills.filter((item) => item.radius === r);
      group.forEach((item, idx) => {
        item.angle = (idx / group.length) * Math.PI * 2;
      });
    });

    orbitNodesEl.innerHTML = flatSkills
      .map(
        (item, i) =>
          `<button type="button" class="orbit-pill" data-idx="${i}" title="${esc(item.category)}">${esc(item.label)}</button>`
      )
      .join("");

    const pills = orbitNodesEl.querySelectorAll(".orbit-pill");
    pills.forEach((pill, i) => {
      const data = flatSkills[i];
      orbitItems.push({ el: pill, data });

      const showInfo = () => {
        hoveredPill = pill;
        pills.forEach((p) => p.classList.toggle("active", p === pill));
        if (orbitalHint) {
          orbitalHint.textContent = `${data.label} — ${data.category}`;
        }
      };

      const clearInfo = () => {
        if (hoveredPill === pill) hoveredPill = null;
        pill.classList.remove("active");
        if (orbitalHint && !hoveredPill) {
          orbitalHint.textContent = "Hover or tap any skill pill to inspect its category.";
        }
      };

      pill.addEventListener("mouseenter", showInfo);
      pill.addEventListener("focus", showInfo);
      pill.addEventListener("mouseleave", clearInfo);
      pill.addEventListener("blur", clearInfo);
      pill.addEventListener("click", showInfo);
    });

    const scaleRadius = () => (window.innerWidth <= 760 ? 0.66 : 1);

    const updatePositions = (now, dt) => {
      const s = scaleRadius();
      orbitItems.forEach(({ el, data }) => {
        if (!reduceMotion && !hoveredPill) {
          data.angle += data.speed * dt * 16.67;
        }
        const rx = data.radius * s;
        const ry = data.radius * 0.78 * s;
        const x = Math.cos(data.angle) * rx;
        const y = Math.sin(data.angle) * ry;
        el.style.setProperty("--ox", x.toFixed(1) + "px");
        el.style.setProperty("--oy", y.toFixed(1) + "px");
      });
    };

    updatePositions(performance.now(), 1);

    if (!reduceMotion) {
      let last = performance.now();
      const tick = (now) => {
        const dt = Math.min((now - last) / 16.67, 3);
        last = now;
        if (!orbitalView.hidden) {
          updatePositions(now, dt);
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }

    window.addEventListener("resize", () => updatePositions(performance.now(), 0), { passive: true });
  }

  /* ---------- build Categories cards + exploring ---------- */
  function renderCategories() {
    if (grid) {
      grid.innerHTML = SKILLS_DATA.map(
        (item) => `
          <article class="skill-card">
            <div>
              <div class="card-top">
                <span class="card-icon">${iconSvg(item.icon)}</span>
                <span class="card-num">${esc(item.num)}</span>
              </div>

              <div class="card-body">
                <h2 class="card-title">${esc(item.title)}</h2>
                <p class="card-desc">${esc(item.desc)}</p>
                <div class="skill-tags">
                  ${item.tags.map((tag) => `<span class="skill-tag">${esc(tag)}</span>`).join("")}
                </div>
              </div>
            </div>

            <div class="card-foot">
              <span>${esc(item.footerLabel)}</span>
              ${iconSvg("arrowUpRight", "card-arrow")}
            </div>
          </article>
        `
      ).join("");

      if (!reduceMotion) {
        grid.querySelectorAll(".skill-card").forEach((card) => {
          card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const nx = (e.clientX - rect.left) / rect.width - 0.5;
            const ny = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.setProperty("--ry", (nx * 6).toFixed(2) + "deg");
            card.style.setProperty("--rx", (-ny * 6).toFixed(2) + "deg");
          });
          card.addEventListener("mouseleave", () => {
            card.style.setProperty("--rx", "0deg");
            card.style.setProperty("--ry", "0deg");
          });
        });
      }
    }

    if (exploringList) {
      exploringList.innerHTML = EXPLORING_DATA.map(
        (row) => `
          <li class="exploring-item">
            <span class="exploring-topic">${esc(row.topic)}</span>
            <span class="exploring-badge">${esc(row.status)}</span>
          </li>
        `
      ).join("");
    }
  }

  buildOrbital();
  renderCategories();
  setView("orbital");
})();