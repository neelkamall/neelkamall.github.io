/* =========================================================
   scripts/experience.js  —  Experience cards rendering & tilt
   ========================================================= */

(function () {
  const EXPERIENCE_DATA = [
    {
      role: "Developer Intern",
      company: "Teckat (Client: SAIL)",
      location: "Ranchi",
      period: "Nov 2025 – June 2026",
      points: [
        "Placed by Teckat onsite at SAIL's Research & Development Centre for Iron and Steel (RDCIS) as a backend developer.",
        "Secured endpoints using JWT authentication (access/refresh tokens) and bcrypt password hashing.",
        "Designed MVC-compliant REST APIs with Node.js, Express.js, and MongoDB Mongoose models.",
        "Added Zod request validation on API endpoints and managed related-data cleanup using cascade deletes in Mongoose.",
        "Optimized backend code performance and thoroughly tested API endpoints using Postman."
      ],
      tags: ["Node.js", "Express.js", "MongoDB", "Mongoose", "JWT", "Bcrypt", "Zod", "Postman"]
    },
    {
      role: "Web & App Development Intern",
      company: "Teckat",
      location: "Jamshedpur",
      period: "May 2025 – July 2025",
      points: [
        "Developed backend modules in JavaScript and Node.js, implementing core server-side application logic.",
        "Built REST API endpoints with Express.js and performed efficient CRUD operations on MongoDB databases.",
        "Tested API endpoints using Postman, tracked bugs, and collaborated on standard backend development workflows."
      ],
      tags: ["JavaScript", "Node.js", "Express.js", "MongoDB", "REST APIs", "Postman"]
    }
  ];

  const timeline = document.getElementById("expTimeline");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const esc = (str) =>
    String(str).replace(/[&<>"]/g, (ch) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;"
    }[ch]));

  function renderTimeline() {
    if (!timeline) return;

    timeline.innerHTML = EXPERIENCE_DATA.map((item) => `
      <article class="exp-card">
        <span class="exp-dot" aria-hidden="true"></span>

        <div class="exp-top">
          <div>
            <h2 class="exp-role">${esc(item.role)}</h2>
            <div class="exp-company-row">
              <span>${esc(item.company)}</span>
              <span class="exp-loc">• ${esc(item.location)}</span>
            </div>
          </div>
          <span class="exp-period">${esc(item.period)}</span>
        </div>

        <ul class="exp-points">
          ${item.points.map((pt) => `<li>${esc(pt)}</li>`).join("")}
        </ul>

        <div class="exp-tags">
          ${item.tags.map((tag) => `<span class="exp-tag">${esc(tag)}</span>`).join("")}
        </div>
      </article>
    `).join("");
  }

  function bindTilt() {
    if (reduceMotion || !timeline) return;

    timeline.querySelectorAll(".exp-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;

        card.style.setProperty("--ry", (nx * 4.5).toFixed(2) + "deg");
        card.style.setProperty("--rx", (-ny * 4.5).toFixed(2) + "deg");
      });

      card.addEventListener("mouseleave", () => {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });
  }

  renderTimeline();
  bindTilt();
})();