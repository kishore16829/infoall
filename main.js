/* INFOALL — premium homepage interactions, no framework required */
(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const storage = {
    get(key, fallback) {
      try { const value = localStorage.getItem(key); return value === null ? fallback : JSON.parse(value); }
      catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); return true; }
      catch { return false; }
    }
  };

  let toastTimer;
  function toast(message) {
    const node = $("#infoAllToast");
    if (!node) return;
    node.textContent = message;
    node.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove("show"), 2800);
  }

  // Persistent light/dark appearance.
  const themeButton = $("#themeToggle");
  const savedTheme = storage.get("infoall-theme", null);
  const initialTheme = savedTheme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  root.dataset.theme = initialTheme;
  function paintThemeButton() {
    if (!themeButton) return;
    const dark = root.dataset.theme === "dark";
    themeButton.innerHTML = dark
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 15.2A8.6 8.6 0 0 1 8.8 3.5 8.7 8.7 0 1 0 20.5 15.2Z"/></svg>';
    themeButton.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    themeButton.setAttribute("aria-pressed", String(dark));
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = dark ? "#111b1c" : "#f7f6f1";
  }
  paintThemeButton();
  themeButton?.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    storage.set("infoall-theme", root.dataset.theme);
    paintThemeButton();
  });

  // Dismissable announcement.
  $("#announcementClose")?.addEventListener("click", () => {
    const bar = $("#announcementBar");
    if (bar) bar.hidden = true;
  });

  // Mobile drawer with Escape, overlay and link-close support.
  const menu = $("#mobileNav");
  const overlay = $("#mobileNavOverlay");
  const menuButton = $("#mobileMenuButton");
  const closeButton = $("#mobileNavClose");
  let previousFocus = null;
  function setMenu(open) {
    if (!menu || !overlay || !menuButton) return;
    if (open) previousFocus = document.activeElement;
    menu.classList.toggle("is-open", open);
    overlay.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", String(!open));
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("menu-open", open);
    if (open) closeButton?.focus();
    else previousFocus?.focus?.();
  }
  menuButton?.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
  closeButton?.addEventListener("click", () => setMenu(false));
  overlay?.addEventListener("click", () => setMenu(false));
  $$(".mobile-nav-links a").forEach(link => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      setMenu(false);
      closeSuggestions();
    }
  });

  // Header state, scroll progress, back-to-top.
  const header = $("#siteHeader");
  const progress = $("#scrollProgressBar");
  let scrollQueued = false;
  function onScroll() {
    const y = window.scrollY || 0;
    header?.classList.toggle("is-scrolled", y > 12);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = `${max > 0 ? Math.min(100, y / max * 100) : 0}%`;
    }
    scrollQueued = false;
  }
  window.addEventListener("scroll", () => {
    if (!scrollQueued) {
      window.requestAnimationFrame(onScroll);
      scrollQueued = true;
    }
  }, { passive: true });
  onScroll();
  $("#backToTop")?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }));
  $("#headerSearchButton")?.addEventListener("click", () => {
    $("#searchDestination")?.focus({ preventScroll: true });
    $("#travelSearch")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
  });

  // Date constraints and travel-search mode.
  const destinationInput = $("#searchDestination");
  const startDate = $("#travelStartDate");
  const endDate = $("#travelEndDate");
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const todayISO = today.toISOString().slice(0, 10);
  if (startDate) startDate.min = todayISO;
  if (endDate) endDate.min = todayISO;
  startDate?.addEventListener("change", () => {
    if (!endDate) return;
    endDate.min = startDate.value || todayISO;
    if (endDate.value && startDate.value && endDate.value < startDate.value) endDate.value = startDate.value;
  });

  const tripTabs = $$(".search-tab[data-trip-type]");
  const submitLabel = $("#travelSearchSubmit span");
  let tripMode = "explore";
  const modeLabels = { explore: "Explore", flight: "Find flights", hotel: "Find stays", train: "Find trains", bus: "Find buses" };
  tripTabs.forEach(tab => tab.addEventListener("click", () => {
    tripMode = tab.dataset.tripType || "explore";
    tripTabs.forEach(item => {
      const active = item === tab;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });
    if (submitLabel) submitLabel.textContent = modeLabels[tripMode] || "Explore";
  }));

  // Destination suggestions; keyboard navigation is supported.
  const suggestions = $("#destinationSuggestions");
  const places = [
    { name: "Munnar", detail: "Kerala · Nature", category: "nature" },
    { name: "Varkala", detail: "Kerala · Coast", category: "coast" },
    { name: "Jaipur", detail: "Rajasthan · Culture", category: "culture" },
    { name: "Goa", detail: "India · Coast", category: "coast" },
    { name: "Manali", detail: "Himachal Pradesh · Mountains", category: "nature" },
    { name: "Bali", detail: "Indonesia · Island life", category: "culture" },
    { name: "Swiss Alps", detail: "Switzerland · Mountains", category: "nature" },
    { name: "Maldives", detail: "Indian Ocean · Islands", category: "coast" },
    { name: "Tokyo", detail: "Japan · City", category: "culture" },
    { name: "Kyoto", detail: "Japan · Culture", category: "culture" }
  ];
  let activeSuggestion = -1;
  function closeSuggestions() {
    if (!suggestions) return;
    suggestions.classList.remove("open");
    suggestions.innerHTML = "";
    activeSuggestion = -1;
  }
  function renderSuggestions(query) {
    if (!suggestions) return;
    const normalized = query.trim().toLowerCase();
    const matches = places.filter(place => !normalized || `${place.name} ${place.detail}`.toLowerCase().includes(normalized)).slice(0, 6);
    suggestions.innerHTML = "";
    if (!matches.length) { closeSuggestions(); return; }
    matches.forEach(place => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "suggestion-option";
      button.setAttribute("role", "option");
      button.setAttribute("aria-selected", "false");
      const icon = document.createElement("span");
      icon.textContent = "⌖";
      const name = document.createElement("strong");
      name.textContent = place.name;
      const detail = document.createElement("small");
      detail.textContent = ` — ${place.detail}`;
      button.append(icon, name, detail);
      button.addEventListener("click", () => choosePlace(place.name));
      suggestions.append(button);
    });
    suggestions.classList.add("open");
    activeSuggestion = -1;
  }
  function choosePlace(name) {
    if (destinationInput) destinationInput.value = name;
    closeSuggestions();
    destinationInput?.focus();
  }
  destinationInput?.addEventListener("focus", () => renderSuggestions(destinationInput.value));
  destinationInput?.addEventListener("input", () => renderSuggestions(destinationInput.value));
  destinationInput?.addEventListener("keydown", event => {
    const items = $$(".suggestion-option", suggestions || document);
    if (event.key === "ArrowDown" && items.length) {
      event.preventDefault();
      activeSuggestion = (activeSuggestion + 1) % items.length;
      items.forEach((item, i) => item.setAttribute("aria-selected", String(i === activeSuggestion)));
      items[activeSuggestion].scrollIntoView({ block: "nearest" });
    } else if (event.key === "ArrowUp" && items.length) {
      event.preventDefault();
      activeSuggestion = (activeSuggestion - 1 + items.length) % items.length;
      items.forEach((item, i) => item.setAttribute("aria-selected", String(i === activeSuggestion)));
      items[activeSuggestion].scrollIntoView({ block: "nearest" });
    } else if (event.key === "Enter" && activeSuggestion >= 0 && items[activeSuggestion]) {
      event.preventDefault();
      items[activeSuggestion].click();
    } else if (event.key === "Escape") {
      closeSuggestions();
    }
  });
  document.addEventListener("click", event => {
    if (!event.target.closest(".destination-field")) closeSuggestions();
  });
  $$(".popular-destination").forEach(button => button.addEventListener("click", () => choosePlace(button.dataset.destination || button.textContent.trim())));

  $("#travelSearchForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const destination = destinationInput?.value.trim();
    if (!destination) {
      destinationInput?.focus();
      toast("Enter a destination to continue.");
      return;
    }
    if (startDate?.value && endDate?.value && endDate.value < startDate.value) {
      toast("Your return date must be on or after departure.");
      endDate.focus();
      return;
    }
    const params = new URLSearchParams({
      destination,
      origin: $("#searchOrigin")?.value.trim() || "",
      departure: startDate?.value || "",
      return: endDate?.value || "",
      travellers: $("#travellerCount")?.value || "2",
      mode: tripMode
    });
    const history = storage.get("infoall-search-history", []);
    const safeHistory = Array.isArray(history) ? history : [];
    const nextHistory = safeHistory.filter(item => item.destination?.toLowerCase() !== destination.toLowerCase());
    nextHistory.unshift({ destination, mode: tripMode, at: Date.now() });
    storage.set("infoall-search-history", nextHistory.slice(0, 6));
    // Sends search context to the existing destinations page; it does not claim a booking.
    window.location.href = `place.html?${params.toString()}`;
  });

  // Destination collection filters and saved places.
  const destinationGrid = $("#destinationGrid");
  const cards = $$(".destination-card", destinationGrid || document);
  const emptyState = $("#destinationEmpty");
  const count = $("#destinationCount");
  const savedKey = "infoall.savedPlaces";
  const getSaved = () => {
    const value = storage.get(savedKey, []);
    return Array.isArray(value) ? value : [];
  };
  function updateSavedUI() {
    const saved = getSaved();
    $$("[data-save]").forEach(button => {
      const isSaved = saved.includes(button.dataset.save);
      button.classList.toggle("saved", isSaved);
      button.setAttribute("aria-pressed", String(isSaved));
      button.textContent = isSaved ? "♥" : "♡";
      button.setAttribute("aria-label", `${isSaved ? "Remove" : "Save"} ${button.dataset.save.replaceAll("-", " ")}`);
    });
    if (count) count.textContent = String(cards.filter(card => !card.hidden).length).padStart(2, "0");
  }
  let activeFilter = "all";
  function applyDestinationFilter() {
    let visible = 0;
    cards.forEach(card => {
      const matches = activeFilter === "all" || card.dataset.category?.split(" ").includes(activeFilter);
      card.hidden = !matches;
      if (matches) visible++;
    });
    $$(".filter-chip").forEach(button => {
      const active = button.dataset.filter === activeFilter;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    if (emptyState) emptyState.hidden = visible !== 0;
    if (count) count.textContent = String(visible).padStart(2, "0");
  }
  $$(".filter-chip").forEach(button => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter || "all";
    applyDestinationFilter();
  }));
  $$("[data-save]").forEach(button => button.addEventListener("click", () => {
    const id = button.dataset.save;
    const saved = getSaved();
    const exists = saved.includes(id);
    storage.set(savedKey, exists ? saved.filter(item => item !== id) : [...saved, id]);
    updateSavedUI();
    toast(exists ? "Removed from your saved places." : "Saved to your travel collection.");
  }));
  updateSavedUI();
  applyDestinationFilter();

  // Progressive reveal, with a no-observer fallback.
  const revealItems = $$(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  // Newsletter is deliberately front-end only until a mailing provider is connected.
  $("#newsletterForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const email = $("#newsletterEmail")?.value.trim();
    if (!email) return;
    toast("Thanks for your interest! Newsletter signup is not connected yet.");
    event.currentTarget.reset();
  });

  // Current year and active navigation state.
  const year = $("#currentYear");
  if (year) year.textContent = String(new Date().getFullYear());
  const sections = ["home", "explore", "experiences", "services", "stories"].map(id => document.getElementById(id)).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      $$(".desktop-nav .nav-link").forEach(link => link.classList.toggle("active", link.hash === `#${visible.target.id}`));
    }, { rootMargin: "-25% 0px -60% 0px", threshold: [0, .2, .5] });
    sections.forEach(section => sectionObserver.observe(section));
  }
})();
