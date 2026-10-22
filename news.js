(() => {
  "use strict";

  const API = "/api/travel-news";
  const HEALTH_API = "/api/health";
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const PAGE_SIZE = 10; // GNews free tier returns at most 10 articles per request.
  const labels = {
    all: "Top stories", india: "India", world: "World", destinations: "Destinations",
    flights: "Flights", trains: "Trains", buses: "Road & bus", hotels: "Hotels",
    adventure: "Adventure", tips: "Travel tips"
  };
  const state = {
    category: "all", query: "", page: 1, total: 0, articles: [], saved: [],
    loading: false, controller: null, savedMode: false, sort: "newest"
  };
  let toastTimer;

  function safeRead(key, fallback) {
    try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
    catch { return fallback; }
  }
  function safeWrite(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { showToast("Browser storage is unavailable."); }
  }
  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }
  function escapeText(value) {
    return String(value ?? "").replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[ch]));
  }
  function validHttpUrl(value) {
    try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:" ? url.href : ""; }
    catch { return ""; }
  }
  function normalizeArticle(raw) {
    if (!raw || typeof raw !== "object") return null;
    const url = validHttpUrl(raw.url || raw.link);
    const title = String(raw.title || "").trim();
    if (!url || !title) return null;
    return {
      title, url,
      description: String(raw.description || raw.content || "Open the original publisher for the complete report.").trim(),
      image: validHttpUrl(raw.image || raw.urlToImage || ""),
      source: String(raw.source?.name || raw.source || "News publisher").trim(),
      publishedAt: raw.publishedAt || raw.published_at || null,
      category: labels[raw.category] ? raw.category : classifyCategory(`${title} ${raw.description || ""}`)
    };
  }
  function classifyCategory(text) {
    const s = String(text).toLowerCase();
    if (/\b(railway|railways|train|metro rail)\b/.test(s)) return "trains";
    if (/\b(airline|flight|airport|aviation)\b/.test(s)) return "flights";
    if (/\b(bus|highway|road trip|road transport)\b/.test(s)) return "buses";
    if (/\b(hotel|resort|hospitality)\b/.test(s)) return "hotels";
    if (/\b(trek|hiking|adventure|camping)\b/.test(s)) return "adventure";
    if (/\b(tips|safety|packing|budget travel)\b/.test(s)) return "tips";
    if (/\b(india|indian)\b/.test(s)) return "india";
    if (/\b(country|countries|international|global|worldwide)\b/.test(s)) return "world";
    return "destinations";
  }
  function dateLabel(value) {
    if (!value) return "Recent";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Recent";
    const days = Math.floor((Date.now() - date.getTime()) / 86400000);
    if (days <= 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined });
  }
  function safeImage(image, title) {
    if (image) return `<img class="card-image" src="${escapeText(image)}" alt="${escapeText(title)}" loading="lazy" referrerpolicy="no-referrer">`;
    return `<div class="image-placeholder" aria-label="No article image available">✈</div>`;
  }
  function isSaved(article) { return state.saved.some(item => item.url === article.url); }
  function updateSavedCount() { $("#savedCount").textContent = String(state.saved.length); }
  function persistSaved() { safeWrite("infoall-news-saved-v2", state.saved); updateSavedCount(); }
  function renderCard(article, index = 0) {
    const saved = isSaved(article);
    return `<article class="news-card" style="animation-delay:${Math.min(index,8)*45}ms">
      <div class="card-image-wrap">${safeImage(article.image, article.title)}
        <span class="card-category">${escapeText(labels[article.category] || "Travel")}</span>
        <button class="bookmark-btn ${saved ? "saved" : ""}" data-save="${escapeText(article.url)}" type="button" aria-label="${saved ? "Remove saved story" : "Save story"}" title="${saved ? "Remove bookmark" : "Save for later"}">${saved ? "♥" : "♡"}</button>
      </div>
      <div class="card-body"><div class="card-meta"><span class="source">${escapeText(article.source)}</span><span>·</span><time>${escapeText(dateLabel(article.publishedAt))}</time></div>
      <h3 class="card-title"><a href="${escapeText(article.url)}" target="_blank" rel="noopener noreferrer">${escapeText(article.title)}</a></h3>
      <p class="card-description">${escapeText(article.description)}</p>
      <div class="card-footer"><span>InfoAll travel desk</span><a class="read-link" href="${escapeText(article.url)}" target="_blank" rel="noopener noreferrer">Read story ↗</a></div></div></article>`;
  }
  function sorted(list) {
    const result = [...list];
    if (state.sort === "oldest") result.sort((a,b) => new Date(a.publishedAt || 0) - new Date(b.publishedAt || 0));
    if (state.sort === "newest") result.sort((a,b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
    if (state.sort === "source") result.sort((a,b) => a.source.localeCompare(b.source));
    return result;
  }
  function render() {
    const articles = state.articles;
    $("#newsGrid").innerHTML = sorted(articles).map(renderCard).join("");
    $("#newsGrid").hidden = articles.length === 0;
    $("#emptyBox").hidden = articles.length !== 0 || state.loading;
    $("#storyCount").textContent = String(articles.length);
    $("#currentCategory").textContent = labels[state.category] || "Top stories";
    $("#feedTitle").textContent = state.savedMode ? "Your saved stories" : (state.query ? `Results for “${state.query}”` : `${labels[state.category] || "Top"} travel stories`);
    $("#feedDescription").textContent = state.savedMode ? "Your locally saved reading list." : `${articles.length} ${articles.length === 1 ? "story" : "stories"} loaded${state.total ? ` · ${state.total} results reported by provider` : ""}.`;
    $("#filterPills").hidden = !state.query && state.category === "all";
    $("#filterText").textContent = [state.query ? `Search: ${state.query}` : "", state.category !== "all" ? `Category: ${labels[state.category]}` : ""].filter(Boolean).join(" · ");
    $("#loadMoreBtn").hidden = state.savedMode || state.loading || articles.length === 0 || articles.length >= state.total || articles.length < PAGE_SIZE;
    $("#loadingBox").hidden = !state.loading;
    $("#feedTitle").closest(".section-heading").hidden = state.savedMode;
  }
  async function loadNews({ append = false } = {}) {
    if (state.loading) return;
    if (state.controller) state.controller.abort();
    const controller = new AbortController();
    state.controller = controller;
    state.loading = true;
    $("#errorBox").hidden = true;
    $("#emptyBox").hidden = true;
    $("#statusText").textContent = "Fetching news from the server…";
    if (!append) { state.page = 1; state.articles = []; }
    render();
    const params = new URLSearchParams({ category: state.category, q: state.query, page: String(append ? state.page + 1 : 1), pageSize: String(PAGE_SIZE) });
    try {
      const response = await fetch(`${API}?${params.toString()}`, { headers: { Accept: "application/json" }, signal: controller.signal, cache: "no-store" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `News API request failed (HTTP ${response.status}).`);
      if (!Array.isArray(data.articles)) throw new Error("The server response did not contain an articles array.");
      const incoming = data.articles.map(normalizeArticle).filter(Boolean);
      if (append) {
        const known = new Set(state.articles.map(a => a.url));
        state.articles.push(...incoming.filter(a => !known.has(a.url)));
        state.page += 1;
      } else {
        state.articles = incoming;
        state.page = 1;
      }
      state.total = Number(data.totalResults) || state.articles.length;
      $("#updatedText").textContent = `Updated ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
      $("#statusText").textContent = "News feed connected";
      render();
      if (!incoming.length && append) showToast("No more stories were returned.");
    } catch (error) {
      if (error.name === "AbortError") return;
      $("#errorText").textContent = error.message || "Unexpected error while loading news.";
      $("#errorBox").hidden = false;
      $("#statusText").textContent = "News connection needs attention";
      if (!append) { state.articles = []; render(); }
      console.error("InfoAll news:", error);
    } finally {
      state.loading = false;
      $("#loadingBox").hidden = true;
      render();
    }
  }
  async function checkHealth() {
    const indicator = $("#healthIndicator");
    $("#healthTitle").textContent = "Checking service";
    $("#healthDetail").textContent = "Verifying server connection…";
    indicator.className = "health-indicator";
    try {
      const response = await fetch(HEALTH_API, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Server health check failed");
      indicator.className = "health-indicator ok";
      $("#healthTitle").textContent = "Server online";
      $("#healthDetail").textContent = data.newsApiConfigured ? "News API key detected" : "Server online · news API key missing";
      if (!data.newsApiConfigured) $("#healthDetail").textContent = "Add GNEWS_API_KEY to .env and restart";
    } catch (error) {
      indicator.className = "health-indicator bad";
      $("#healthTitle").textContent = "Server not reachable";
      $("#healthDetail").textContent = "Run node server.js and open via localhost";
    }
  }
  function setCategory(category) {
    state.category = labels[category] ? category : "all";
    state.query = "";
    state.savedMode = false;
    $("#searchInput").value = "";
    $$(".category").forEach(button => button.classList.toggle("active", button.dataset.category === state.category));
    $("#savedSection").hidden = true;
    $("#newsGrid").hidden = false;
    loadNews();
  }
  function searchTopic(topic) {
    state.query = topic;
    state.category = "all";
    state.savedMode = false;
    $("#searchInput").value = topic;
    $$(".category").forEach(button => button.classList.toggle("active", button.dataset.category === "all"));
    $("#savedSection").hidden = true;
    loadNews();
  }
  function toggleSave(url) {
    const article = [...state.articles, ...state.saved].find(item => item.url === url);
    if (!article) return;
    if (isSaved(article)) {
      state.saved = state.saved.filter(item => item.url !== url);
      showToast("Removed from saved stories.");
    } else {
      state.saved.unshift(article);
      showToast("Story saved for later.");
    }
    persistSaved();
    render();
    if (state.savedMode) renderSaved();
  }
  function renderSaved() {
    $("#savedGrid").innerHTML = state.saved.map(renderCard).join("");
    $("#savedEmpty").hidden = state.saved.length > 0;
    $("#savedGrid").hidden = state.saved.length === 0;
    $("#savedCount").textContent = String(state.saved.length);
  }
  function showSaved() {
    state.savedMode = true;
    $("#savedSection").hidden = false;
    $("#savedSection").scrollIntoView({ behavior: "smooth", block: "start" });
    renderSaved();
  }
  function showNews() {
    state.savedMode = false;
    $("#savedSection").hidden = true;
    $("#feedTitle").closest(".section-heading").hidden = false;
    $("#newsGrid").hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function toggleTheme() {
    const dark = document.body.classList.toggle("dark-mode");
    safeWrite("infoall-news-theme-v2", dark ? "dark" : "light");
    $("#themeBtn").textContent = dark ? "☀" : "☾";
  }
  function bindEvents() {
    $("#searchForm").addEventListener("submit", event => {
      event.preventDefault();
      state.query = $("#searchInput").value.trim().slice(0, 150);
      state.category = "all";
      state.savedMode = false;
      $$(".category").forEach(button => button.classList.toggle("active", button.dataset.category === "all"));
      $("#savedSection").hidden = true;
      loadNews();
    });
    $("#categoryNav").addEventListener("click", event => {
      const button = event.target.closest("[data-category]");
      if (button) setCategory(button.dataset.category);
    });
    document.addEventListener("click", event => {
      const bookmark = event.target.closest("[data-save]");
      if (bookmark) toggleSave(bookmark.dataset.save);
      const topic = event.target.closest("[data-topic]");
      if (topic) searchTopic(topic.dataset.topic);
    });
    $("#refreshBtn").addEventListener("click", () => loadNews());
    $("#retryBtn").addEventListener("click", () => { checkHealth(); loadNews(); });
    $("#healthRetry").addEventListener("click", checkHealth);
    $("#loadMoreBtn").addEventListener("click", () => loadNews({ append: true }));
    $("#clearFilters").addEventListener("click", () => setCategory("all"));
    $("#resetBtn").addEventListener("click", () => setCategory("all"));
    $("#sortSelect").addEventListener("change", event => { state.sort = event.target.value; render(); });
    $("#themeBtn").addEventListener("click", toggleTheme);
    $("#savedBtn").addEventListener("click", showSaved);
    $("#viewSavedBtn").addEventListener("click", showSaved);
    $("#closeSavedBtn").addEventListener("click", showNews);
  }
  function init() {
    $("#year").textContent = String(new Date().getFullYear());
    state.saved = safeRead("infoall-news-saved-v2", []).filter(item => item && item.url && item.title);
    updateSavedCount();
    if (safeRead("infoall-news-theme-v2", "light") === "dark") { document.body.classList.add("dark-mode"); $("#themeBtn").textContent = "☀"; }
    bindEvents();
    checkHealth();
    loadNews();
  }
  document.addEventListener("DOMContentLoaded", init);
})();