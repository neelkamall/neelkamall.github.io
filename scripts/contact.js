/* =========================================================
   scripts/contact.js  —  Contact info card, quick socials &
   copy-email interaction
   ========================================================= */

(function () {
  const CONTACT_ITEMS = [
    {
      icon: "mail",
      label: "Email",
      value: "neelkamal3767@gmail.com",
      href: "mailto:neelkamal3767@gmail.com",
      external: false
    },
    {
      icon: "linkedin",
      label: "LinkedIn",
      value: "/in/neel-kamal123",
      href: "https://www.linkedin.com/in/neel-kamal123",
      external: true
    },
    {
      icon: "github",
      label: "GitHub",
      value: "github.com/neelkamall",
      href: "https://github.com/neelkamall",
      external: true
    },
    {
      icon: "location",
      label: "Location",
      value: "Hyderabad, India",
      href: "#connectDetails",
      external: false
    }
  ];

  const QUICK_SOCIALS = [
    { name: "mail", label: "Email", href: "mailto:neelkamal3767@gmail.com", external: false },
    { name: "github", label: "GitHub", href: "https://github.com/neelkamall", external: true },
    { name: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/neel-kamal123", external: true },
    { name: "code", label: "Portfolio", href: "home.html", external: false }
  ];

  const ICONS = {
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    linkedin: '<path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 2a2 2 0 110 4 2 2 0 010-4z"/>',
    github: '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 00-1.3-3.2 4.2 4.2 0 00-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 00-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 00-.1 3.2A4.6 4.6 0 004 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
    location: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>',
    code: '<path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>'
  };

  const infoCard = document.getElementById("connectDetails");
  const quickSocials = document.getElementById("quickSocials");
  const copyBtn = document.getElementById("copyEmailBtn");

  const esc = (str) =>
    String(str).replace(/[&<>"]/g, (ch) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;"
    }[ch]));

  const iconSvg = (name) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.mail}</svg>`;

  function renderInfoCard() {
    if (!infoCard) return;

    infoCard.innerHTML = CONTACT_ITEMS.map((item) => {
      const attrs = item.external ? ' target="_blank" rel="noopener"' : "";
      return `
        <a href="${esc(item.href)}" class="info-row"${attrs}>
          <span class="info-icon">${iconSvg(item.icon)}</span>
          <span class="info-meta">
            <span class="info-label">${esc(item.label)}</span>
            <span class="info-value">${esc(item.value)}</span>
          </span>
        </a>
      `;
    }).join("");
  }

  function renderQuickSocials() {
    if (!quickSocials) return;

    quickSocials.innerHTML = QUICK_SOCIALS.map((item) => {
      const attrs = item.external ? ' target="_blank" rel="noopener"' : "";
      return `
        <a href="${esc(item.href)}" aria-label="${esc(item.label)}"${attrs}>
          ${iconSvg(item.name)}
        </a>
      `;
    }).join("");
  }

  function bindCopyEmail() {
    if (!copyBtn) return;

    copyBtn.addEventListener("click", async () => {
      const email = copyBtn.dataset.email || "neelkamal3767@gmail.com";
      try {
        await navigator.clipboard.writeText(email);
        copyBtn.textContent = "Copied!";
        setTimeout(() => {
          copyBtn.textContent = "Copy Email";
        }, 1800);
      } catch (e) {
        window.location.href = `mailto:${email}`;
      }
    });
  }

  renderInfoCard();
  renderQuickSocials();
  bindCopyEmail();
})();