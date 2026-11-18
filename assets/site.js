// ================================================================
//  站点设置 / Site settings — 只需要改这里 / edit only this block
// ================================================================
const SITE = {
  // B 站视频的 BV 号，例如 "BV1xx411c7mD"；中文界面优先显示它
  // Bilibili BV id, shown first in the Chinese view
  bilibili: "BV1NSsm6rEYg",
  // YouTube 视频 id（watch?v= 后面那串）；英文界面优先显示它
  // YouTube video id (the part after watch?v=), shown first in the English view
  youtube: "",
};
// ================================================================

const LANG_KEY = "lotus-lang";

function readLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "zh-CN" || saved === "en") return saved;
  } catch (e) { /* storage unavailable */ }
  return (navigator.language || "zh").toLowerCase().startsWith("zh") ? "zh-CN" : "en";
}

function setLang(lang) {
  document.documentElement.lang = lang;
  try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* ignore */ }
  document.querySelectorAll("[data-title-zh]").forEach((el) => {
    el.textContent = lang === "en" ? el.dataset.titleEn : el.dataset.titleZh;
  });
  document.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
}

function currentLang() {
  return document.documentElement.lang === "en" ? "en" : "zh";
}

setLang(readLang());

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".lang-toggle").forEach((btn) =>
    btn.addEventListener("click", () =>
      setLang(document.documentElement.lang === "en" ? "zh-CN" : "en")
    )
  );

  // solid nav after scrolling
  const nav = document.querySelector(".nav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("solid", window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // reveal on scroll
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
      }, { threshold: 0.12 })
    : null;
  document.querySelectorAll(".reveal").forEach((el) => (io ? io.observe(el) : el.classList.add("in")));

  initVideo();
  initPanorama();
  initPostList();
});

// ---------- video ----------
function initVideo() {
  const frame = document.getElementById("video-frame");
  if (!frame) return;
  const render = () => {
    const preferBili = currentLang() === "zh";
    let src = "";
    if (SITE.bilibili && (preferBili || !SITE.youtube)) {
      src = `https://player.bilibili.com/player.html?bvid=${encodeURIComponent(SITE.bilibili)}&autoplay=0&high_quality=1`;
    } else if (SITE.youtube) {
      src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(SITE.youtube)}`;
    }
    if (!src) return; // keep the "coming soon" poster
    if (frame.dataset.src === src) return;
    frame.dataset.src = src;
    frame.innerHTML = `<iframe src="${src}" title="Gameplay demo" loading="lazy"
      allow="fullscreen; picture-in-picture; encrypted-media" allowfullscreen
      sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"></iframe>`;
  };
  render();
  document.addEventListener("langchange", render);
}

// ---------- panorama (drag to scroll + tabs) ----------
function initPanorama() {
  const pano = document.getElementById("panorama");
  if (!pano) return;
  const img = pano.querySelector("img");

  document.querySelectorAll(".scroll-tabs button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".scroll-tabs button").forEach((b) => b.setAttribute("aria-selected", "false"));
      btn.setAttribute("aria-selected", "true");
      img.src = btn.dataset.src;
      pano.scrollLeft = 0;
    });
  });

  let down = false, startX = 0, startLeft = 0;
  pano.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse") return; // touch uses native scrolling
    down = true; startX = e.clientX; startLeft = pano.scrollLeft;
    pano.classList.add("dragging");
  });
  window.addEventListener("pointermove", (e) => {
    if (!down) return;
    pano.scrollLeft = startLeft - (e.clientX - startX);
  });
  window.addEventListener("pointerup", () => { down = false; pano.classList.remove("dragging"); });

  // vertical wheel scrolls the scroll horizontally while hovering it
  pano.addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    const max = pano.scrollWidth - pano.clientWidth;
    const atEdge = (e.deltaY < 0 && pano.scrollLeft <= 0) || (e.deltaY > 0 && pano.scrollLeft >= max - 1);
    if (atEdge) return;
    e.preventDefault();
    pano.scrollLeft += e.deltaY;
  }, { passive: false });
}

// ---------- devlog list ----------
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

async function loadPosts() {
  const res = await fetch("devlog/posts.json", { cache: "no-cache" });
  if (!res.ok) throw new Error("posts.json " + res.status);
  const posts = await res.json();
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

function initPostList() {
  const list = document.getElementById("post-list");
  if (!list) return;
  const limit = Number(list.dataset.limit || 0);
  let posts = [];
  const render = () => {
    const lang = currentLang();
    const shown = limit ? posts.slice(0, limit) : posts;
    list.innerHTML = shown.map((p) => `
      <li><a href="post.html?p=${encodeURIComponent(p.slug)}">
        <span class="post-date">${escapeHtml(p.date)}</span>
        <span>
          <p class="post-title">${escapeHtml(p.title[lang] || p.title.zh || p.title.en)}</p>
          <p class="post-sum">${escapeHtml(p.summary[lang] || p.summary.zh || p.summary.en)}</p>
        </span>
      </a></li>`).join("");
  };
  loadPosts()
    .then((p) => { posts = p; render(); })
    .catch(() => {
      list.innerHTML = `<li class="dim" style="padding:20px 4px">
        <span class="zh">开发日志加载失败。</span><span class="en">Could not load the devlog.</span></li>`;
    });
  document.addEventListener("langchange", render);
}
