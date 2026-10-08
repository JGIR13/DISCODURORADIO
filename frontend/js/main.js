/* =========================================================================
   DISCO DURO RADIO — main.js
   i18n loader + dynamic sections + persistent player mock
   ========================================================================= */

(function () {
  "use strict";

  const STORAGE_KEY = "ddr_lang";
  const SUPPORTED_LANGS = ["es", "en"];
  let currentLang = localStorage.getItem(STORAGE_KEY) || "es";
  let dict = null;

  /* ---------------------------------------------------------------------
     I18N: load lang/<lang>/<lang>.json and paint text nodes
  --------------------------------------------------------------------- */
  async function loadLang(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) lang = "es";
    try {
      const res = await fetch(`lang/${lang}/${lang}.json`, { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      dict = await res.json();
    } catch (err) {
      console.error("[DDR] No se pudo cargar el idioma:", lang, err);
      if (lang !== "es") return loadLang("es");
      return;
    }
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.setAttribute("lang", lang);
    applyTranslations();
    renderDynamicContent();
    updateLangToggleUI();
  }

  function getPath(obj, path) {
    return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
  }

  function applyTranslations() {
    if (!dict) return;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const value = getPath(dict, el.getAttribute("data-i18n"));
      if (value !== null) el.textContent = value;
    });

    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const value = getPath(dict, el.getAttribute("data-i18n-title"));
      if (value !== null) el.setAttribute("title", value);
    });

    const footerLabel = document.getElementById("footerLangLabel");
    if (footerLabel && dict.meta) footerLabel.textContent = dict.meta.dir_label;
  }

  function updateLangToggleUI() {
    document.querySelectorAll("#langtoggle button").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === currentLang);
    });
  }

  /* ---------------------------------------------------------------------
     DYNAMIC CONTENT: editorial posts, schedule grid, curators, vault
  --------------------------------------------------------------------- */
  function renderDynamicContent() {
    renderEditorial();
    renderSchedule();
    renderCurators();
    renderVault();
  }

  function renderEditorial() {
    const grid = document.getElementById("editorialGrid");
    if (!grid || !dict.editorial) return;
    grid.innerHTML = dict.editorial.posts
      .map(
        (post) => `
      <article class="post-card">
        <div class="post-head">
          <span>${escapeHTML(post.n)}</span>
          <span class="tag">${escapeHTML(post.tag)}</span>
        </div>
        <h3 class="post-title">${escapeHTML(post.title)}</h3>
        <p class="post-excerpt">${escapeHTML(post.excerpt)}</p>
        <div class="post-foot">
          <span>${escapeHTML(post.author)} · ${escapeHTML(post.date)}</span>
          <a href="#editorial">${escapeHTML(dict.editorial.read_more)}</a>
        </div>
      </article>`
      )
      .join("");
  }

  function renderSchedule() {
    const headRow = document.getElementById("scheduleHeadRow");
    const bodyRow = document.getElementById("scheduleBodyRow");
    if (!headRow || !bodyRow || !dict.schedule) return;

    headRow.innerHTML = dict.schedule.days.map((d) => `<th>${escapeHTML(d)}</th>`).join("");

    const byDay = {};
    dict.schedule.shows.forEach((show) => {
      byDay[show.day] = show;
    });

    const statusLabel = {
      live: dict.schedule.status_live,
      next: dict.schedule.status_next,
      rerun: dict.schedule.status_rerun,
    };

    bodyRow.innerHTML = dict.schedule.days
      .map((_, i) => {
        const show = byDay[i];
        if (!show) return "<td>—</td>";
        return `
        <td>
          <span class="show-time">${escapeHTML(show.time)}</span>
          <span class="show-title">${escapeHTML(show.title)}</span>
          <span class="show-host">${escapeHTML(show.host)}</span>
          <span class="tag-status ${escapeHTML(show.status)}">${escapeHTML(statusLabel[show.status] || show.status)}</span>
        </td>`;
      })
      .join("");
  }

  function renderCurators() {
    const grid = document.getElementById("curatorsGrid");
    if (!grid || !dict.schedule) return;
    grid.innerHTML = dict.schedule.curators
      .map((c) => {
        const initials = c.name
          .split(" ")
          .map((w) => w[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();
        return `
        <div class="curator-card">
          <div class="curator-avatar">${escapeHTML(initials)}</div>
          <h4>${escapeHTML(c.name)}</h4>
          <p class="curator-role">${escapeHTML(c.role)}</p>
          <p class="curator-bio">${escapeHTML(c.bio)}</p>
        </div>`;
      })
      .join("");
  }

  function renderVault() {
    const body = document.getElementById("vaultBody");
    if (!body || !dict.vault) return;
    body.innerHTML = dict.vault.entries
      .map(
        (e) => `
      <tr>
        <td class="id">${escapeHTML(e.id)}</td>
        <td class="name">${escapeHTML(e.name)}</td>
        <td>${escapeHTML(e.curator)}</td>
        <td>${escapeHTML(e.dur)}</td>
        <td>${escapeHTML(e.date)}</td>
        <td><button class="vault-play" aria-label="Play" data-track="${escapeHTML(e.name)}">▶</button></td>
      </tr>`
      )
      .join("");

    body.querySelectorAll(".vault-play").forEach((btn) => {
      btn.addEventListener("click", () => {
        const track = btn.getAttribute("data-track");
        setNowPlaying(track);
        setPlayingState(true);
        setPlayerMode("archive");
      });
    });
  }

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  /* ---------------------------------------------------------------------
     PLAYER MOCK BEHAVIOR
  --------------------------------------------------------------------- */
  let isPlaying = true;
  let progressInterval = null;

  function setPlayingState(playing) {
    isPlaying = playing;
    const btn = document.getElementById("playBtn");
    if (btn) btn.textContent = playing ? "❙❙" : "▶";
    if (playing) startProgress();
    else stopProgress();
  }

  function startProgress() {
    stopProgress();
    const bar = document.getElementById("playerProgress");
    if (!bar) return;
    let pct = parseFloat(bar.style.width) || 34;
    progressInterval = setInterval(() => {
      pct += 0.4;
      if (pct >= 100) pct = 0;
      bar.style.width = pct + "%";
    }, 300);
  }

  function stopProgress() {
    if (progressInterval) clearInterval(progressInterval);
    progressInterval = null;
  }

  function setNowPlaying(trackName) {
    const trackEl = document.querySelector(".player-meta .np-track span:last-child");
    if (trackEl) trackEl.textContent = trackName;
  }

  function setPlayerMode(mode) {
    const statusEl = document.getElementById("playerStatus");
    if (!statusEl || !dict) return;
    const label = statusEl.querySelector(".status-text");
    if (mode === "archive") {
      statusEl.classList.add("mode-archive");
      if (label) label.textContent = dict.player.archive_mode;
    } else {
      statusEl.classList.remove("mode-archive");
      if (label) label.textContent = dict.player.live;
    }
  }

  function initPlayer() {
    const playBtn = document.getElementById("playBtn");
    const heroPlayBtn = document.getElementById("heroPlayBtn");
    const volRange = document.getElementById("volRange");

    if (playBtn) {
      playBtn.addEventListener("click", () => setPlayingState(!isPlaying));
    }
    if (heroPlayBtn) {
      heroPlayBtn.addEventListener("click", () => {
        setPlayingState(true);
        document.getElementById("player").scrollIntoView({ behavior: "smooth", block: "end" });
      });
    }
    if (volRange) {
      volRange.addEventListener("input", () => {
        // visual-only feedback for the mockup
        volRange.style.opacity = 0.6 + (volRange.value / 100) * 0.4;
      });
    }

    setPlayingState(true);
  }

  /* ---------------------------------------------------------------------
     NAV: mobile burger + active link on scroll
  --------------------------------------------------------------------- */
  function initNav() {
    const burger = document.getElementById("navburger");
    const links = document.getElementById("navlinks");
    if (burger && links) {
      burger.addEventListener("click", () => links.classList.toggle("open"));
      links.querySelectorAll("a").forEach((a) =>
        a.addEventListener("click", () => links.classList.remove("open"))
      );
    }

    const sections = document.querySelectorAll("section[id], header[id]");
    const navAnchors = document.querySelectorAll(".navlinks a");
    if ("IntersectionObserver" in window && sections.length) {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              navAnchors.forEach((a) => {
                a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
              });
            }
          });
        },
        { rootMargin: "-40% 0px -50% 0px" }
      );
      sections.forEach((s) => obs.observe(s));
    }
  }

  /* ---------------------------------------------------------------------
     CLOCK (Caracas local time feel — purely decorative)
  --------------------------------------------------------------------- */
  function initClock() {
    function tick() {
      const now = new Date();
      const time = now.toLocaleTimeString("es-VE", { hour12: false });
      const text = `CCS · ${time}`;
      const a = document.getElementById("sysclock");
      const b = document.getElementById("footerClock");
      if (a) a.textContent = text;
      if (b) b.textContent = text;
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------------------------------------------------------------------
     REVEAL ON SCROLL
  --------------------------------------------------------------------- */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || !items.length) {
      items.forEach((el) => el.classList.add("in"));
      return;
    }
    const obs = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    items.forEach((el) => obs.observe(el));
  }

  /* ---------------------------------------------------------------------
     LANG TOGGLE
  --------------------------------------------------------------------- */
  function initLangToggle() {
    const toggle = document.getElementById("langtoggle");
    if (!toggle) return;
    toggle.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.getAttribute("data-lang");
        if (lang !== currentLang) loadLang(lang);
      });
    });
  }

  /* ---------------------------------------------------------------------
     BOOT
  --------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initPlayer();
    initClock();
    initLangToggle();
    loadLang(currentLang).then(initReveal);
  });
})();
