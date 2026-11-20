/* =========================================================
   sidebar.js  —  sidebar inject + active link + theme toggle
   Har page pe <div id="sidebar-root"></div> hona chahiye
   aur <body data-page="home | experience | projects | skills | contact">
   Sidebar ke links alag-alag pages kholte hain (scroll nahi)
   ========================================================= */

(function () {
  const ICONS = {
    home:       '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
    experience: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18"/>',
    projects:   '<path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>',
    skills:     '<path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7L12 2z"/>',
    contact:    '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    github:     '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 00-1.3-3.2 4.2 4.2 0 00-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 00-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 00-.1 3.2A4.6 4.6 0 004 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
    linkedin:   '<path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 2a2 2 0 110 4 2 2 0 010-4z"/>',
    mail:       '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    sun:        '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon:       '<path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/>'
  };

  const svg = (name) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;

  /* logo ki image ka path (sab pages pages/ folder ke andar hain) */
  const LOGO_SRC = "../assests/logo.png";

  /* file names alag ho to yahan href badal do */
  const LINKS = [
    { id: "home",       label: "Home",       href: "home.html" },
    { id: "experience", label: "Experience", href: "experience.html" },
    { id: "projects",   label: "Projects",   href: "project.html" },
    { id: "skills",     label: "Skills",     href: "skills.html" },
    { id: "contact",    label: "Contact",    href: "contact.html" }
  ];

  const SOCIAL = [
    { name: "github",   href: "https://github.com/neelkamall",              label: "GitHub" },
    { name: "linkedin", href: "https://www.linkedin.com/in/neel-kamal123",  label: "LinkedIn" },
    { name: "mail",     href: "mailto:neelkamal3767@gmail.com",             label: "Email" }
  ];

  const root = document.getElementById("sidebar-root");
  if (!root) return;

  const page = document.body.dataset.page || "home";

  root.innerHTML = `
    <aside class="sidebar">
      <a href="home.html" class="sb-logo" aria-label="Neel Kamal - Home">
        <img src="${LOGO_SRC}" alt="NK" width="96" height="65" />
      </a>

      <nav class="sb-nav">
        ${LINKS.map(l => `
          <a href="${l.href}" class="sb-link${l.id === page ? " active" : ""}" data-id="${l.id}">
            ${svg(l.id)}<span>${l.label}</span>
          </a>`).join("")}
      </nav>

      <div class="sb-social">
        ${SOCIAL.map(s => `
          <a href="${s.href}" target="_blank" rel="noopener" aria-label="${s.label}">${svg(s.name)}</a>`).join("")}
      </div>
    </aside>

    <button class="theme-btn" id="themeBtn" aria-label="Toggle theme">
      <span class="sun">${svg("sun")}</span>
      <span class="moon">${svg("moon")}</span>
    </button>
  `;

  /* ---------- theme toggle ---------- */
  const html = document.documentElement;
  try {
    const saved = localStorage.getItem("nk-theme");
    if (saved) html.setAttribute("data-theme", saved);
  } catch (e) {}

  document.getElementById("themeBtn").addEventListener("click", () => {
    const next = html.getAttribute("data-theme") === "light" ? "dark" : "light";
    html.setAttribute("data-theme", next);
    try { localStorage.setItem("nk-theme", next); } catch (e) {}
  });
})();