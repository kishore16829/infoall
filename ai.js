
/* =========================================================
   INFOALL AI — COMPLETE FRONTEND JAVASCRIPT
   File: ai.js
   ========================================================= */

"use strict";

/* =========================
   CONFIGURATION
========================= */

const API_URL = "/api/chat";

const STORAGE_KEYS = {
    chats: "infoall_ai_chats_v3",
    activeChat: "infoall_ai_active_chat_v3",
    settings: "infoall_ai_settings_v3",
    theme: "infoall_ai_theme_v3"
};

const DEFAULT_SETTINGS = {
    language: "en",
    appearance: "dark",
    responseStyle: "balanced",
    responseLength: "medium",
    currency: "INR"
};

const LANGUAGE_NAMES = {
    en: "English",
    ta: "Tamil",
    hi: "Hindi",
    ml: "Malayalam",
    te: "Telugu",
    kn: "Kannada",
    fr: "French",
    es: "Spanish",
    de: "German",
    ar: "Arabic",
    ja: "Japanese"
};

/* =========================
   DOM ELEMENTS
========================= */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const elements = {
    sidebar: $("#sidebar"),
    sidebarOverlay: $("#sidebarOverlay"),
    menuButton: $("#menuButton"),

    newChatButton: $("#newChatButton"),
    historyList: $("#historyList"),

    welcomeScreen: $("#welcomeScreen"),
    messages: $("#messages"),

    chatForm: $("#chatForm"),
    messageInput: $("#messageInput"),
    sendButton: $("#sendButton"),
    stopButton: $("#stopButton"),

    themeButton: $("#themeButton"),
    settingsButton: $("#settingsButton"),

    settingsOverlay: $("#settingsOverlay"),
    settingsPanel: $("#settingsPanel"),
    closeSettings: $("#closeSettings"),
    saveSettings: $("#saveSettings"),
    resetSettings: $("#resetSettings"),

    languageSelect: $("#languageSelect"),
    appearanceSelect: $("#appearanceSelect"),
    responseStyleSelect: $("#responseStyleSelect"),
    responseLengthSelect: $("#responseLengthSelect"),
    currencySelect: $("#currencySelect"),

    toast: $("#toast"),
    chatTitle: $("#chatTitle")
};

/* =========================
   APPLICATION STATE
========================= */

let chats = [];
let activeChatId = null;

let settings = { ...DEFAULT_SETTINGS };

let currentController = null;
let isGenerating = false;
let toastTimeout = null;

/* =========================
   UTILITIES
========================= */

function createId() {
    if (crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function escapeHTML(value = "") {
    return String(value).replace(/[&<>"']/g, (character) => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[character];
    });
}

function formatTime(timestamp) {
    return new Intl.DateTimeFormat(
        settings.language || "en",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    ).format(new Date(timestamp));
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    const today = new Date();

    if (date.toDateString() === today.toDateString()) {
        return "Today";
    }

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
    }

    return new Intl.DateTimeFormat(
        settings.language || "en",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    ).format(date);
}

function showToast(message) {
    if (!elements.toast) return;

    elements.toast.textContent = message;
    elements.toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
        elements.toast.classList.remove("show");
    }, 2600);
}

function saveChats() {
    try {
        localStorage.setItem(
            STORAGE_KEYS.chats,
            JSON.stringify(chats)
        );

        localStorage.setItem(
            STORAGE_KEYS.activeChat,
            activeChatId || ""
        );
    } catch (error) {
        console.error("Unable to save chats:", error);
        showToast("Storage is full. Delete some old chats.");
    }
}

function saveSettings() {
    localStorage.setItem(
        STORAGE_KEYS.settings,
        JSON.stringify(settings)
    );
}

function getActiveChat() {
    return chats.find(chat => chat.id === activeChatId) || null;
}

/* Compatibility helper */

function activeChat() {
    return getActiveChat();
}

/* =========================
   LOAD SAVED DATA
========================= */

function loadData() {
    try {
        const savedChats = JSON.parse(
            localStorage.getItem(STORAGE_KEYS.chats) || "[]"
        );

        if (Array.isArray(savedChats)) {
            chats = savedChats.filter(chat =>
                chat &&
                typeof chat.id === "string" &&
                Array.isArray(chat.messages)
            );
        }
    } catch {
        chats = [];
    }

    try {
        const savedSettings = JSON.parse(
            localStorage.getItem(STORAGE_KEYS.settings) || "{}"
        );

        settings = {
            ...DEFAULT_SETTINGS,
            ...savedSettings
        };
    } catch {
        settings = { ...DEFAULT_SETTINGS };
    }

    activeChatId =
        localStorage.getItem(STORAGE_KEYS.activeChat) || null;

    if (!chats.some(chat => chat.id === activeChatId)) {
        activeChatId = chats[0]?.id || null;
    }

    if (elements.languageSelect) {
        elements.languageSelect.value = settings.language;
    }

    if (elements.appearanceSelect) {
        elements.appearanceSelect.value = settings.appearance;
    }

    if (elements.responseStyleSelect) {
        elements.responseStyleSelect.value = settings.responseStyle;
    }

    if (elements.responseLengthSelect) {
        elements.responseLengthSelect.value = settings.responseLength;
    }

    if (elements.currencySelect) {
        elements.currencySelect.value = settings.currency;
    }
}

/* =========================
   TRANSLATIONS
========================= */

const translations = {
    en: {
        newChat: "New chat",
        history: "Recent chats",
        welcome: "Where would you like to go?",
        subtitle: "Plan smarter journeys with InfoAll AI.",
        placeholder: "Ask anything about your next trip...",
        settings: "Settings",
        language: "Language",
        appearance: "Appearance",
        style: "Response style",
        length: "Answer length",
        currency: "Currency",
        save: "Save settings",
        reset: "Reset",
        copy: "Copy",
        regenerate: "Regenerate",
        delete: "Delete",
        rename: "Rename",
        thinking: "Thinking...",
        error: "Something went wrong. Please try again.",
        empty: "No conversations yet",
        today: "Today",
        tripIdeas: "Discover destinations",
        itinerary: "Plan an itinerary",
        budget: "Travel budget",
        weather: "Travel weather"
    },

    ta: {
        newChat: "புதிய உரையாடல்",
        history: "சமீபத்திய உரையாடல்கள்",
        welcome: "எங்கு செல்ல விரும்புகிறீர்கள்?",
        subtitle: "InfoAll AI மூலம் உங்கள் பயணத்தைத் திட்டமிடுங்கள்.",
        placeholder: "உங்கள் பயணம் குறித்து எதையும் கேளுங்கள்...",
        settings: "அமைப்புகள்",
        language: "மொழி",
        appearance: "தோற்றம்",
        style: "பதில் நடை",
        length: "பதில் நீளம்",
        currency: "நாணயம்",
        save: "அமைப்புகளைச் சேமி",
        reset: "மீட்டமை",
        copy: "நகலெடு",
        regenerate: "மீண்டும் உருவாக்கு",
        delete: "நீக்கு",
        rename: "பெயர் மாற்று",
        thinking: "சிந்திக்கிறது...",
        error: "பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.",
        empty: "உரையாடல்கள் இல்லை",
        today: "இன்று",
        tripIdeas: "பயண இடங்களைக் கண்டறி",
        itinerary: "பயணத் திட்டம்",
        budget: "பயணச் செலவு",
        weather: "பயண வானிலை"
    },

    hi: {
        newChat: "नई चैट",
        history: "हाल की चैट",
        welcome: "आप कहाँ जाना चाहेंगे?",
        subtitle: "InfoAll AI के साथ अपनी यात्रा की योजना बनाएं।",
        placeholder: "अपनी यात्रा के बारे में कुछ भी पूछें...",
        settings: "सेटिंग्स",
        language: "भाषा",
        appearance: "दिखावट",
        style: "उत्तर शैली",
        length: "उत्तर की लंबाई",
        currency: "मुद्रा",
        save: "सेटिंग्स सहेजें",
        reset: "रीसेट",
        copy: "कॉपी",
        regenerate: "फिर से बनाएं",
        delete: "हटाएं",
        rename: "नाम बदलें",
        thinking: "सोच रहा है...",
        error: "कुछ गलत हुआ। फिर से प्रयास करें।",
        empty: "अभी कोई चैट नहीं",
        today: "आज",
        tripIdeas: "यात्रा स्थान खोजें",
        itinerary: "यात्रा योजना",
        budget: "यात्रा बजट",
        weather: "यात्रा मौसम"
    }
};

function translate(key) {
    const language = translations[settings.language];

    return language?.[key] ||
        translations.en[key] ||
        key;
}

function setTranslatedText(selector, key) {
    const element = $(selector);

    if (element) {
        element.textContent = translate(key);
    }
}

/*
  For reliable translation, elements should have
  data-i18n="key" attributes in ai.html.
*/

function applyTranslations() {
    $$("[data-i18n]").forEach(element => {
        const key = element.dataset.i18n;

        if (key) {
            element.textContent = translate(key);
        }
    });

    $$("[data-i18n-placeholder]").forEach(element => {
        const key = element.dataset.i18nPlaceholder;

        if (key) {
            element.placeholder = translate(key);
        }
    });

    if (elements.messageInput) {
        elements.messageInput.placeholder =
            translate("placeholder");
    }

    if (elements.newChatButton) {
        const label = elements.newChatButton.querySelector(
            "[data-i18n='newChat']"
        );

        if (label) {
            label.textContent = translate("newChat");
        }
    }

    document.documentElement.lang = settings.language;
    document.documentElement.dir =
        settings.language === "ar" ? "rtl" : "ltr";
}

/* =========================
   THEME
========================= */

function applyTheme() {
    const appearance = settings.appearance;

    let theme = appearance;

    if (appearance === "system") {
        theme = window.matchMedia(
            "(prefers-color-scheme: light)"
        ).matches ? "light" : "dark";
    }

    document.documentElement.dataset.theme = theme;
    document.body.dataset.theme = theme;

    localStorage.setItem(
        STORAGE_KEYS.theme,
        appearance
    );

    if (elements.themeButton) {
        elements.themeButton.setAttribute(
            "aria-label",
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
        );
    }
}

function toggleTheme() {
    const current = document.documentElement.dataset.theme;

    settings.appearance =
        current === "dark" ? "light" : "dark";

    if (elements.appearanceSelect) {
        elements.appearanceSelect.value = settings.appearance;
    }

    saveSettings();
    applyTheme();
}

/* =========================
   CHAT MANAGEMENT
========================= */

function createChat() {
    const chat = {
        id: createId(),
        title: "New conversation",
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    chats.unshift(chat);
    activeChatId = chat.id;

    saveChats();
    renderHistory();
    renderChat(chat);

    closeSidebar();

    if (elements.messageInput) {
        elements.messageInput.focus();
    }

    return chat;
}

function ensureActiveChat() {
    let chat = getActiveChat();

    if (!chat) {
        chat = createChat();
    }

    return chat;
}

function selectChat(id) {
    const chat = chats.find(item => item.id === id);

    if (!chat) return;

    activeChatId = id;

    saveChats();
    renderHistory();
    renderChat(chat);
    closeSidebar();
}

function deleteChat(id) {
    const chat = chats.find(item => item.id === id);

    if (!chat) return;

    const confirmed = confirm(
        `Delete "${chat.title}"? This cannot be undone.`
    );

    if (!confirmed) return;

    chats = chats.filter(item => item.id !== id);

    if (activeChatId === id) {
        activeChatId = chats[0]?.id || null;
    }

    saveChats();
    renderHistory();

    if (activeChatId) {
        renderChat(getActiveChat());
    } else {
        showWelcome();
    }

    showToast("Conversation deleted");
}

function renameChat(id) {
    const chat = chats.find(item => item.id === id);

    if (!chat) return;

    const newTitle = prompt(
        "Enter a new conversation name:",
        chat.title
    );

    if (!newTitle || !newTitle.trim()) return;

    chat.title = newTitle.trim().slice(0, 80);
    chat.updatedAt = Date.now();

    saveChats();
    renderHistory();

    if (id === activeChatId && elements.chatTitle) {
        elements.chatTitle.textContent = chat.title;
    }
}

function updateChatTitle(chat) {
    if (!chat || chat.messages.length === 0) return;

    const firstUserMessage = chat.messages.find(
        message => message.role === "user"
    );

    if (!firstUserMessage) return;

    if (
        !chat.title ||
        chat.title === "New conversation" ||
        chat.title === "New chat"
    ) {
        chat.title = firstUserMessage.content
            .trim()
            .slice(0, 38);

        if (firstUserMessage.content.length > 38) {
            chat.title += "...";
        }
    }
}

/* =========================
   HISTORY RENDERING
========================= */

function renderHistory() {
    if (!elements.historyList) return;

    elements.historyList.innerHTML = "";

    if (chats.length === 0) {
        const empty = document.createElement("div");

        empty.className = "history-empty";
        empty.textContent = translate("empty");

        elements.historyList.appendChild(empty);
        return;
    }

    const sortedChats = [...chats].sort(
        (a, b) => b.updatedAt - a.updatedAt
    );

    let currentDate = "";

    sortedChats.forEach(chat => {
        const dateLabel = formatDate(chat.updatedAt);

        if (dateLabel !== currentDate) {
            currentDate = dateLabel;

            const groupLabel = document.createElement("div");
            groupLabel.className = "history-date";
            groupLabel.textContent = dateLabel;

            elements.historyList.appendChild(groupLabel);
        }

        const item = document.createElement("div");
        item.className = "history-item";

        if (chat.id === activeChatId) {
            item.classList.add("active");
        }

        const selectButton = document.createElement("button");
        selectButton.className = "history-select";
        selectButton.type = "button";
        selectButton.title = chat.title;
        selectButton.textContent = chat.title;

        selectButton.addEventListener("click", () => {
            selectChat(chat.id);
        });

        const menuButton = document.createElement("button");
        menuButton.className = "history-menu";
        menuButton.type = "button";
        menuButton.textContent = "⋯";
        menuButton.setAttribute("aria-label", "Conversation options");

        menuButton.addEventListener("click", event => {
            event.stopPropagation();

            showChatMenu(chat.id, menuButton);
        });

        item.append(selectButton, menuButton);
        elements.historyList.appendChild(item);
    });
}

function showChatMenu(id, anchor) {
    const existing = $(".chat-context-menu");

    if (existing) {
        existing.remove();
    }

    const menu = document.createElement("div");
    menu.className = "chat-context-menu";

    const renameButton = document.createElement("button");
    renameButton.textContent = translate("rename");

    renameButton.addEventListener("click", () => {
        menu.remove();
        renameChat(id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = translate("delete");
    deleteButton.className = "danger";

    deleteButton.addEventListener("click", () => {
        menu.remove();
        deleteChat(id);
    });

    menu.append(renameButton, deleteButton);

    const parent = anchor.closest(".history-item");

    if (parent) {
        parent.appendChild(menu);
    }

    setTimeout(() => {
        document.addEventListener("click", function closeMenu(event) {
            if (!menu.contains(event.target)) {
                menu.remove();
                document.removeEventListener("click", closeMenu);
            }
        });
    }, 0);
}

/* =========================
   MARKDOWN RENDERING
========================= */

function renderMarkdown(text) {
    // Parse a practical subset of Markdown. Escape all source text first so model
    // output cannot inject arbitrary HTML into the chat interface.
    const source = String(text ?? "").replace(/\r\n?/g, "\n");
    const lines = source.split("\n");
    const output = [];

    const inline = (value) => {
        let safe = escapeHTML(value);
        safe = safe.replace(/`([^`]+)`/g, "<code>$1</code>");
        safe = safe.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
        safe = safe.replace(/__(.+?)__/g, "<strong>$1</strong>");
        safe = safe.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, "<em>$1</em>");
        safe = safe.replace(/(?<!_)_([^_\n]+)_(?!_)/g, "<em>$1</em>");
        safe = safe.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
            (_, label, url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`);
        return safe;
    };

    const isUnordered = (line) => /^\s*[-*+]\s+/.test(line);
    const isOrdered = (line) => /^\s*\d+[.)]\s+/.test(line);
    const isQuote = (line) => /^\s*>\s?/.test(line);
    const isTableDivider = (line) => /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
    const isTableRow = (line) => line.includes("|");
    const isSpecial = (line) =>
        /^\s{0,3}#{1,4}\s+/.test(line) ||
        isUnordered(line) || isOrdered(line) || isQuote(line) ||
        /^\s*([-*_]\s*){3,}$/.test(line) ||
        /^\s*```/.test(line);

    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        if (!line.trim()) { i++; continue; }

        // Fenced code block
        if (/^\s*```/.test(line)) {
            const language = line.trim().slice(3).trim() || "Code";
            const codeLines = [];
            i++;
            while (i < lines.length && !/^\s*```/.test(lines[i])) {
                codeLines.push(lines[i]);
                i++;
            }
            if (i < lines.length) i++;
            output.push(`<pre class="code-block"><div class="code-header"><span>${escapeHTML(language)}</span><button type="button" class="copy-code">Copy</button></div><code>${escapeHTML(codeLines.join("\n"))}</code></pre>`);
            continue;
        }

        // Headings
        const heading = line.match(/^\s{0,3}(#{1,4})\s+(.+?)\s*#*\s*$/);
        if (heading) {
            const level = Math.min(4, heading[1].length + 1);
            output.push(`<h${level}>${inline(heading[2])}</h${level}>`);
            i++;
            continue;
        }

        // Horizontal rule
        if (/^\s*([-*_]\s*){3,}$/.test(line)) {
            output.push("<hr>");
            i++;
            continue;
        }

        // Tables (header row + Markdown divider + body rows)
        if (i + 1 < lines.length && isTableRow(line) && isTableDivider(lines[i + 1])) {
            const cells = (row) => row.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(cell => cell.trim());
            const headers = cells(line);
            i += 2;
            const rows = [];
            while (i < lines.length && lines[i].trim() && isTableRow(lines[i])) {
                rows.push(cells(lines[i]));
                i++;
            }
            output.push(`<div class="table-scroll"><table><thead><tr>${headers.map(cell => `<th>${inline(cell)}</th>`).join("")}</tr></thead><tbody>${rows.map(row => `<tr>${headers.map((_, index) => `<td>${inline(row[index] || "")}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
            continue;
        }

        // Consecutive list items
        if (isUnordered(line) || isOrdered(line)) {
            const ordered = isOrdered(line);
            const tag = ordered ? "ol" : "ul";
            const items = [];
            while (i < lines.length && (ordered ? isOrdered(lines[i]) : isUnordered(lines[i]))) {
                const item = lines[i].replace(ordered ? /^\s*\d+[.)]\s+/ : /^\s*[-*+]\s+/, "");
                items.push(`<li>${inline(item)}</li>`);
                i++;
            }
            output.push(`<${tag}>${items.join("")}</${tag}>`);
            continue;
        }

        // Consecutive blockquotes
        if (isQuote(line)) {
            const quoteLines = [];
            while (i < lines.length && isQuote(lines[i])) {
                quoteLines.push(inline(lines[i].replace(/^\s*>\s?/, "")));
                i++;
            }
            output.push(`<blockquote><p>${quoteLines.join("<br>")}</p></blockquote>`);
            continue;
        }

        // Paragraph: collect plain lines until a blank or block element.
        const paragraph = [line.trim()];
        i++;
        while (i < lines.length && lines[i].trim() && !isSpecial(lines[i]) &&
               !(i + 1 < lines.length && isTableRow(lines[i]) && isTableDivider(lines[i + 1]))) {
            paragraph.push(lines[i].trim());
            i++;
        }
        output.push(`<p>${paragraph.map(inline).join("<br>")}</p>`);
    }

    return output.join("");
}
/* =========================
   MESSAGE RENDERING
========================= */

function showWelcome() {
    if (elements.welcomeScreen) {
        elements.welcomeScreen.hidden = false;
    }

    if (elements.messages) {
        elements.messages.innerHTML = "";
    }

    if (elements.chatTitle) {
        elements.chatTitle.textContent = "InfoAll AI";
    }
}

function renderChat(chat) {
    if (!chat) {
        showWelcome();
        return;
    }

    if (elements.welcomeScreen) {
        elements.welcomeScreen.hidden =
            chat.messages.length > 0;
    }

    if (elements.chatTitle) {
        elements.chatTitle.textContent =
            chat.title || "InfoAll AI";
    }

    if (!elements.messages) return;

    elements.messages.innerHTML = "";

    chat.messages.forEach((message, index) => {
        appendMessage(
            message.role,
            message.content,
            {
                timestamp: message.timestamp,
                index
            }
        );
    });

    scrollToBottom();
}

function appendMessage(role, content, options = {}) {
    if (!elements.messages) return null;

    if (elements.welcomeScreen) {
        elements.welcomeScreen.hidden = true;
    }

    const message = document.createElement("article");

    message.className = `message message-${role}`;

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.textContent = role === "assistant" ? "✦" : "Y";

    const body = document.createElement("div");
    body.className = "message-body";

    const header = document.createElement("div");
    header.className = "message-header";

    const name = document.createElement("span");
    name.className = "message-name";
    name.textContent =
        role === "assistant" ? "InfoAll AI" : "You";

    const time = document.createElement("span");
    time.className = "message-time";
    time.textContent = options.timestamp
        ? formatTime(options.timestamp)
        : formatTime(Date.now());

    header.append(name, time);

    const contentElement = document.createElement("div");
    contentElement.className = "message-content";

    contentElement.innerHTML =
        role === "assistant"
            ? renderMarkdown(content)
            : `<p>${escapeHTML(content).replace(/\n/g, "<br>")}</p>`;

    body.append(header, contentElement);

    if (role === "assistant") {
        const actions = document.createElement("div");
        actions.className = "message-actions";

        const copyButton = document.createElement("button");
        copyButton.type = "button";
        copyButton.textContent = "Copy";
        copyButton.title = "Copy response";

        copyButton.addEventListener("click", () => {
            copyText(content);
        });

        actions.appendChild(copyButton);

        if (options.index === getActiveChat()?.messages.length - 1) {
            const regenerateButton = document.createElement("button");

            regenerateButton.type = "button";
            regenerateButton.textContent = "Regenerate";

            regenerateButton.addEventListener("click", () => {
                regenerateResponse();
            });

            actions.appendChild(regenerateButton);
        }

        body.appendChild(actions);
    }

    message.append(avatar, body);
    elements.messages.appendChild(message);

    message.querySelectorAll(".copy-code").forEach(button => {
        button.addEventListener("click", () => {
            const code = button
                .closest(".code-block")
                ?.querySelector("code")
                ?.textContent || "";

            copyText(code);
        });
    });

    return message;
}

function addThinkingIndicator() {
    if (!elements.messages) return null;

    const indicator = document.createElement("div");
    indicator.className = "thinking-indicator";
    indicator.innerHTML = `
        <span class="thinking-dot"></span>
        <span class="thinking-dot"></span>
        <span class="thinking-dot"></span>
        <span>${escapeHTML(translate("thinking"))}</span>
    `;

    elements.messages.appendChild(indicator);
    scrollToBottom();

    return indicator;
}

function scrollToBottom() {
    if (!elements.messages) return;

    requestAnimationFrame(() => {
        elements.messages.scrollTop =
            elements.messages.scrollHeight;
    });
}

/* =========================
   COPY
========================= */

async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast("Copied to clipboard");
    } catch {
        const textarea = document.createElement("textarea");

        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();

        document.execCommand("copy");
        textarea.remove();

        showToast("Copied to clipboard");
    }
}

/* =========================
   CHAT API
========================= */

function setBusy(busy) {
    isGenerating = busy;

    if (elements.sendButton) {
        elements.sendButton.disabled = busy;
    }

    if (elements.stopButton) {
        elements.stopButton.hidden = !busy;
    }

    if (elements.messageInput) {
        elements.messageInput.disabled = busy;
    }
}

async function requestAI(chat) {
    const conversation = chat.messages
        .slice(-24)
        .map(message => ({
            role: message.role,
            content: message.content
        }));

    currentController = new AbortController();

    const response = await fetch(API_URL, {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            messages: conversation,

            preferences: {
                language: settings.language,
                languageName:
                    LANGUAGE_NAMES[settings.language] || "English",

                currency: settings.currency,
                style: settings.responseStyle,
                length: settings.responseLength
            }
        }),

        signal: currentController.signal
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            data.error ||
            `Server error: ${response.status}`
        );
    }

    const answer =
        data.reply ||
        data.message ||
        data.content ||
        data.choices?.[0]?.message?.content;

    if (!answer) {
        throw new Error("The AI returned an empty response.");
    }

    return answer;
}

/* =========================
   SEND MESSAGE
========================= */

async function sendMessage(text) {
    const content = String(text || "").trim();

    if (!content || isGenerating) return;

    const chat = ensureActiveChat();

    const userMessage = {
        role: "user",
        content,
        timestamp: Date.now()
    };

    chat.messages.push(userMessage);
    chat.updatedAt = Date.now();

    updateChatTitle(chat);

    saveChats();
    renderHistory();

    appendMessage("user", content);

    if (elements.messageInput) {
        elements.messageInput.value = "";
        autoResizeInput();
    }

    setBusy(true);

    const thinking = addThinkingIndicator();

    try {
        const answer = await requestAI(chat);

        thinking?.remove();

        const assistantMessage = {
            role: "assistant",
            content: answer,
            timestamp: Date.now()
        };

        chat.messages.push(assistantMessage);
        chat.updatedAt = Date.now();

        updateChatTitle(chat);

        saveChats();
        renderHistory();

        appendMessage(
            "assistant",
            answer,
            {
                index: chat.messages.length - 1,
                timestamp: assistantMessage.timestamp
            }
        );

        scrollToBottom();

    } catch (error) {
        thinking?.remove();

        if (error.name === "AbortError") {
            showToast("Generation stopped");
        } else {
            console.error("AI request error:", error);

            appendMessage(
                "assistant",
                `**Unable to get a response.**\n\n${error.message || translate("error")}\n\nPlease check that your Node.js server is running and your API key is configured.`
            );
        }

    } finally {
        currentController = null;
        setBusy(false);

        if (elements.messageInput) {
            elements.messageInput.focus();
        }
    }
}

/* =========================
   STOP GENERATION
========================= */

function stopGeneration() {
    if (currentController) {
        currentController.abort();
    }
}

/* =========================
   REGENERATE
========================= */

async function regenerateResponse() {
    if (isGenerating) return;

    const chat = getActiveChat();

    if (!chat || chat.messages.length === 0) return;

    const lastMessage = chat.messages.at(-1);

    if (lastMessage.role === "assistant") {
        chat.messages.pop();
    }

    const lastUserMessage = [...chat.messages]
        .reverse()
        .find(message => message.role === "user");

    if (!lastUserMessage) return;

    saveChats();
    renderChat(chat);

    setBusy(true);

    const thinking = addThinkingIndicator();

    try {
        const answer = await requestAI(chat);

        thinking?.remove();

        const assistantMessage = {
            role: "assistant",
            content: answer,
            timestamp: Date.now()
        };

        chat.messages.push(assistantMessage);
        chat.updatedAt = Date.now();

        saveChats();
        renderChat(chat);

    } catch (error) {
        thinking?.remove();

        if (error.name !== "AbortError") {
            showToast(error.message || translate("error"));
        }

    } finally {
        currentController = null;
        setBusy(false);
    }
}

/* =========================
   INPUT RESIZING
========================= */

function autoResizeInput() {
    if (!elements.messageInput) return;

    elements.messageInput.style.height = "auto";

    elements.messageInput.style.height =
        `${Math.min(elements.messageInput.scrollHeight, 180)}px`;
}

/* =========================
   SIDEBAR
========================= */

function openSidebar() {
    elements.sidebar?.classList.add("open");
    elements.sidebarOverlay?.classList.add("show");
    document.body.classList.add("sidebar-open");
}

function closeSidebar() {
    elements.sidebar?.classList.remove("open");
    elements.sidebarOverlay?.classList.remove("show");
    document.body.classList.remove("sidebar-open");
}

/* =========================
   SETTINGS
========================= */

function openSettings() {
    if (!elements.settingsOverlay) return;

    elements.settingsOverlay.classList.add("open");
    elements.settingsOverlay.setAttribute("aria-hidden", "false");

    document.body.classList.add("settings-open");
}

function closeSettings() {
    if (!elements.settingsOverlay) return;

    elements.settingsOverlay.classList.remove("open");
    elements.settingsOverlay.setAttribute("aria-hidden", "true");

    document.body.classList.remove("settings-open");
}

function readSettingsFromForm() {
    settings.language =
        elements.languageSelect?.value || "en";

    settings.appearance =
        elements.appearanceSelect?.value || "dark";

    settings.responseStyle =
        elements.responseStyleSelect?.value || "balanced";

    settings.responseLength =
        elements.responseLengthSelect?.value || "medium";

    settings.currency =
        elements.currencySelect?.value || "INR";

    saveSettings();
    applyTheme();
    applyTranslations();

    closeSettings();

    renderHistory();

    if (getActiveChat()) {
        renderChat(getActiveChat());
    }

    showToast("Settings saved");
}

function resetSettings() {
    settings = { ...DEFAULT_SETTINGS };

    if (elements.languageSelect) {
        elements.languageSelect.value = settings.language;
    }

    if (elements.appearanceSelect) {
        elements.appearanceSelect.value = settings.appearance;
    }

    if (elements.responseStyleSelect) {
        elements.responseStyleSelect.value =
            settings.responseStyle;
    }

    if (elements.responseLengthSelect) {
        elements.responseLengthSelect.value =
            settings.responseLength;
    }

    if (elements.currencySelect) {
        elements.currencySelect.value = settings.currency;
    }

    saveSettings();
    applyTheme();
    applyTranslations();

    showToast("Settings reset");
}

/* =========================
   PROMPT SUGGESTIONS
========================= */

function setupPromptCards() {
    $$(".prompt-card, [data-prompt]").forEach(card => {
        card.addEventListener("click", () => {
            const prompt =
                card.dataset.prompt ||
                card.querySelector(".prompt-text")?.textContent ||
                card.textContent;

            if (elements.messageInput) {
                elements.messageInput.value = prompt.trim();
                autoResizeInput();
                elements.messageInput.focus();
            }
        });
    });
}

/* =========================
   SEARCH CHATS
========================= */

function setupChatSearch() {
    const searchInput = $("#chatSearch");

    if (!searchInput) return;

    searchInput.addEventListener("input", () => {
        const query = searchInput.value
            .trim()
            .toLowerCase();

        $$(".history-item").forEach(item => {
            const title =
                item.querySelector(".history-select")
                    ?.textContent.toLowerCase() || "";

            item.hidden = !title.includes(query);
        });
    });
}

/* =========================
   EVENT LISTENERS
========================= */

function setupEvents() {
    elements.newChatButton?.addEventListener(
        "click",
        createChat
    );

    elements.chatForm?.addEventListener("submit", event => {
        event.preventDefault();

        sendMessage(elements.messageInput?.value || "");
    });

    elements.messageInput?.addEventListener(
        "input",
        autoResizeInput
    );

    elements.messageInput?.addEventListener(
        "keydown",
        event => {
            if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.isComposing
            ) {
                event.preventDefault();

                if (!isGenerating) {
                    sendMessage(elements.messageInput.value);
                }
            }
        }
    );

    elements.stopButton?.addEventListener(
        "click",
        stopGeneration
    );

    elements.themeButton?.addEventListener(
        "click",
        toggleTheme
    );

    elements.settingsButton?.addEventListener(
        "click",
        openSettings
    );

    elements.closeSettings?.addEventListener(
        "click",
        closeSettings
    );

    elements.saveSettings?.addEventListener(
        "click",
        readSettingsFromForm
    );

    elements.resetSettings?.addEventListener(
        "click",
        resetSettings
    );

    elements.settingsOverlay?.addEventListener(
        "click",
        event => {
            if (event.target === elements.settingsOverlay) {
                closeSettings();
            }
        }
    );

    elements.menuButton?.addEventListener(
        "click",
        openSidebar
    );

    elements.sidebarOverlay?.addEventListener(
        "click",
        closeSidebar
    );

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeSettings();
            closeSidebar();
        }

        // Ctrl + Shift + O: new chat
        if (
            (event.ctrlKey || event.metaKey) &&
            event.shiftKey &&
            event.key.toLowerCase() === "o"
        ) {
            event.preventDefault();
            createChat();
        }

        // Ctrl + /: focus message box
        if (
            (event.ctrlKey || event.metaKey) &&
            event.key === "/"
        ) {
            event.preventDefault();
            elements.messageInput?.focus();
        }
    });

    setupPromptCards();
    setupChatSearch();
}

/* =========================
   INITIALIZATION
========================= */

function initializeApp() {
    loadData();

    applyTheme();
    applyTranslations();

    renderHistory();

    if (activeChatId) {
        renderChat(getActiveChat());
    } else {
        showWelcome();
    }

    setupEvents();

    if (elements.messageInput) {
        autoResizeInput();
    }

    console.log("InfoAll AI initialized successfully.");
}

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);