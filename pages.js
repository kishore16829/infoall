(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);

  const toggle = $("#menuToggle");
  const nav = $("#mainNav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("open", !expanded);
    });
  }

  document.querySelectorAll("[data-year]").forEach(node => {
    node.textContent = String(new Date().getFullYear());
  });

  const form = $("#contactForm");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = $("#formStatus");
      // IMPORTANT: replace with your real monitored email before publishing.
      const CONTACT_EMAIL = "REPLACE_WITH_YOUR_EMAIL@example.com";
      if (CONTACT_EMAIL.includes("REPLACE_WITH_YOUR_EMAIL")) {
        status.textContent = "The page is ready, but the contact email has not been configured. Edit CONTACT_EMAIL in pages.js before publishing.";
        status.className = "form-status warning";
        return;
      }

      const values = new FormData(form);
      const subject = `[InfoAll website] ${String(values.get("subject") || "General question").slice(0, 120)}`;
      const body = [
        `Name: ${String(values.get("name") || "").slice(0, 100)}`,
        `Email: ${String(values.get("email") || "").slice(0, 254)}`,
        "",
        "Message:",
        String(values.get("message") || "").slice(0, 5000)
      ].join("\n");
      const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.textContent = "Opening your email application. Review the message and send it from there.";
      status.className = "form-status success";
      window.location.href = mailto;
    });
  }
})();