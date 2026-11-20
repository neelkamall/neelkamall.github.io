/* =========================================================
   project.js  —  cards render, filter, 3D tilt
   Naya project add karna ho to sirf PROJECTS array mein
   ek object add karo. Order wahi rahega jo array mein hai.
   ========================================================= */

(function () {
  /* ---------------- DATA (yahan edit karo) ----------------
     category : ["web" | "ai"]  (ek ya dono)
     status   : badge ka text. "In Progress" likhoge to orange badge
                + thumbnail ke left side pe orange banner aa jayega
     art      : "social" | "shop" | "blog" | "analyst" | ""
     image    : "" rakho to art dikhega,
                real screenshot ho to "../assests/beast.png" likho
                (image di to art ki jagah wahi dikhegi)
     code/demo: apna link. "" rakho to wo link hide ho jayega
  ---------------------------------------------------------- */
  const PROJECTS = [
    {
      title: "Beast",
      desc: "A social media backend built with FastAPI and PostgreSQL. Users can register, log in, create posts, comment and like, with secure token-based authentication. On top of the core platform, AI features are integrated through an LLM API.",
      points: [
        "JWT auth with access and refresh tokens",
        "Users, posts, comments and likes with clean controller / router / middleware structure",
        "AI integration using an LLM API"
      ],
      tags: ["Python", "FastAPI", "PostgreSQL", "JWT", "LLM API"],
      category: ["web"], status: "Backend", accent: "#8b5cff", art: "social", image: "",
      code: "https://github.com/neelkamall/Beast", demo: ""
    },
    {
      title: "Bazario",
      desc: "The backend of an e-commerce application, built with Node.js, Express and MongoDB. It exposes a REST API for products, carts and orders with full CRUD operations, and users can sign up and log in securely.",
      points: [
        "REST API with full CRUD for products and orders",
        "JWT authentication with bcrypt password hashing",
        "Cart and order management for logged-in users"
      ],
      tags: ["Node.js", "Express", "MongoDB", "REST API", "JWT", "bcrypt"],
      category: ["web"], status: "Backend", accent: "#2f7bff", art: "shop", image: "",
      code: "https://github.com/neelkamall/Bazario-Backend", demo: ""
    },
    {
      title: "Blogger",
      desc: "The backend of a blogging application, built with Node.js, Express and MongoDB. Users can sign up, log in, and create, read, update and delete blog posts and comments through a REST API.",
      points: [
        "REST API with full CRUD for blog posts and comments",
        "JWT authentication with bcrypt password hashing",
        "Users can create, edit and delete their own posts"
      ],
      tags: ["Node.js", "Express", "MongoDB", "REST API", "JWT", "bcrypt"],
      category: ["web"], status: "Backend", accent: "#19c6d3", art: "blog", image: "",
      code: "https://github.com/neelkamall", demo: ""
    },
    {
      title: "AI Data Analyst",
      desc: "An AI data analyst agent that is currently under development. Upload a CSV or Excel file, ask questions in plain English, and the agent uses an LLM with tool calling to analyze the data and return answers and insights.",
      points: [
        "Upload CSV / Excel files and ask questions in natural language",
        "LLM with tool calling decides how to analyze the data",
        "Planned next: PDF and image inputs"
      ],
      tags: ["Python", "FastAPI", "Gemini API", "Tool Calling", "Agentic AI"],
      category: ["ai"], status: "In Progress", accent: "#19d3a0", art: "analyst", image: "",
      code: "", demo: ""
    }
  ];

  const grid    = document.getElementById("grid");
  const filters = document.getElementById("filters");
  const empty   = document.getElementById("empty");
  const reduce  = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ICON_ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const ICON_OPEN  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M8 7h9v9"/></svg>';

  const I_HEART   = '<svg class="heart" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-9.5-9.2C1 8.2 3 5 6.3 5c2 0 3.5 1.1 5.7 3.4C14.200 6.100 15.700 5 17.700 5 21 5 23 8.200 21.500 11.800 19.500 16.400 12 21 12 21z"/></svg>';
  const I_COMMENT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 01-11.700 7.100L3 21l1.900-5.600A8 8 0 1121 12z"/></svg>';
  const I_SHARE   = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>';
  const I_CART    = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.700 12.400a2 2 0 002 1.600h8.600a2 2 0 002-1.500L22 7H6"/></svg>';

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const isWip = (p) => /progress/i.test(p.status);

  /* ---------------- themed art ---------------- */
  const post = () => `
    <div class="post">
      <div class="post-head"><span class="av"></span><span class="ln w40"></span></div>
      <div class="img"></div>
      <div class="acts">${I_HEART}${I_COMMENT}${I_SHARE}<span class="ln w20"></span></div>
    </div>`;

  const prod = () => `
    <div class="prod">
      <div class="img"><i></i></div>
      <span class="ln w70"></span>
      <div class="prow"><span class="price"></span><span class="addbtn"></span></div>
    </div>`;

  const row = () => `
    <div class="row">
      <div class="img"></div>
      <div class="lns"><span class="ln strong w90"></span><span class="ln w55"></span></div>
    </div>`;

  const kpi = () => `
    <div class="kpi"><span class="ln w55"></span><span class="ln strong w70"></span><span class="up"></span></div>`;

  const ART = {
    social: () => `
      <div class="art">
        <div class="stories"><i></i><i></i><i></i><i></i><i></i><i></i></div>
        <div class="feed">${post()}${post()}</div>
      </div>`,

    shop: () => `
      <div class="art">
        <div class="shopbar">
          <span class="logo"></span><span class="search"></span>
          <span class="cart">${I_CART}<b>2</b></span>
        </div>
        <div class="products">${prod()}${prod()}${prod()}</div>
      </div>`,

    blog: () => `
      <div class="art">
        <div class="blogtop">
          <span class="chip on"></span><span class="chip"></span><span class="chip"></span>
          <span class="brand"></span>
        </div>
        <div class="blogmain">
          <div class="bigpost">
            <div class="img"></div>
            <span class="ln strong w90"></span>
            <div class="by"><span class="av"></span><span class="ln w40"></span></div>
          </div>
          <div class="postlist">${row()}${row()}${row()}</div>
        </div>
      </div>`,

    analyst: () => `
      <div class="art">
        <div class="kpis">${kpi()}${kpi()}${kpi()}</div>
        <div class="chartrow">
          <div class="bars">
            <i style="--h:35%"></i><i style="--h:55%"></i><i style="--h:42%"></i>
            <i style="--h:70%"></i><i style="--h:58%"></i><i style="--h:85%"></i><i style="--h:68%"></i>
          </div>
          <svg viewBox="0 0 100 40" preserveAspectRatio="none">
            <polyline points="2,30 18,22 34,26 50,14 66,18 82,6 98,10"/>
          </svg>
        </div>
        <div class="askbar"><span class="spark">✦</span><span class="ln"></span><span class="send"></span></div>
      </div>`
  };

  /* ---------------- render ---------------- */
  function thumb(p) {
    let inner;
    if (p.image) {
      inner = `<img src="${esc(p.image)}" alt="${esc(p.title)} preview" loading="lazy" />`;
    } else if (ART[p.art]) {
      inner = `<span class="glow"></span><span class="dots"><i></i><i></i><i></i></span>${ART[p.art]()}`;
    } else {
      inner = `<span class="glow"></span>
               <span class="dots"><i></i><i></i><i></i></span>
               <span class="bar b1"></span><span class="bar b2"></span><span class="bar b3"></span>
               <span class="block"></span>`;
    }
    const wip = isWip(p);
    return `<div class="thumb${wip ? " wip" : ""}">${inner}<span class="status${wip ? " wip" : ""}">${esc(p.status)}</span></div>`;
  }

  function card(p, i) {
    const links = [
      p.code ? `<a href="${esc(p.code)}" target="_blank" rel="noopener">View Code ${ICON_ARROW}</a>` : "",
      p.demo ? `<a href="${esc(p.demo)}" target="_blank" rel="noopener">Live Demo ${ICON_OPEN}</a>` : ""
    ].join("");

    return `
      <article class="card${isWip(p) ? " is-wip" : ""}" style="--i:${i};--accent:${esc(p.accent)}">
        ${thumb(p)}
        <h3>${esc(p.title)}</h3>
        <p class="desc">${esc(p.desc)}</p>
        <ul class="points">${p.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
        <div class="tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
        <div class="links">${links}</div>
      </article>`;
  }

  function render(filter) {
    const list = filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category.includes(filter));
    grid.innerHTML = list.map(card).join("");
    empty.hidden = list.length > 0;
    bindTilt();
  }

  /* ---------------- filters ---------------- */
  filters.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter");
    if (!btn) return;
    filters.querySelectorAll(".filter").forEach((b) => b.classList.toggle("active", b === btn));
    render(btn.dataset.filter);
  });

  /* ---------------- 3D tilt ---------------- */
  function bindTilt() {
    if (reduce) return;
    grid.querySelectorAll(".card").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--ry", (nx * 8).toFixed(2) + "deg");
        el.style.setProperty("--rx", (-ny * 8).toFixed(2) + "deg");
      });
      el.addEventListener("mouseleave", () => {
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      });
    });
  }

  render("all");
})();