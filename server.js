/**
 * InfoAll combined server: existing AI chat + new travel news API.
 * Requires Node.js 18+, Express, dotenv, and the existing ./chat.js module.
 * Keep this file in the same folder as your website and .env file.
 */
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createTravelReply } from "./chat.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.disable("x-powered-by");
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname, {
  extensions: ["html"],
  setHeaders(res, filePath) {
    if (filePath.endsWith(".html")) res.setHeader("Cache-Control", "no-cache");
  }
}));

const CATEGORY_QUERIES = {
  all: "(travel OR tourism OR airline OR railway OR destination)",
  india: "(India travel OR India tourism OR Indian airlines OR Indian railways)",
  world: "(international travel OR world tourism OR global airlines)",
  destinations: "(travel destinations OR tourism OR holiday destinations)",
  flights: "(airlines OR flights OR airports OR aviation)",
  trains: "(railways OR trains OR railway updates OR metro rail)",
  buses: "(bus transport OR highways OR road travel)",
  hotels: "(hotels OR resorts OR hospitality travel)",
  adventure: "(adventure travel OR trekking OR hiking OR camping)",
  tips: "(travel tips OR budget travel OR travel safety)"
};
const ALLOWED_CATEGORIES = new Set(Object.keys(CATEGORY_QUERIES));

// Health endpoint preserves fields used by the existing InfoAll AI page
// and adds a flag for the travel-news API.
app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    status: "online",
    service: "InfoAll",
    message: "InfoAll server is running successfully.",
    newsApiConfigured: Boolean(process.env.GNEWS_API_KEY),
    time: new Date().toISOString()
  });
});

// Existing AI chat endpoint — retained from your original server.
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, preferences = {} } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Please provide a valid conversation." });
    }
    const validMessages = messages
      .filter(message =>
        message &&
        ["user", "assistant"].includes(message.role) &&
        typeof message.content === "string" &&
        message.content.trim().length > 0
      )
      .slice(-30);

    if (validMessages.length === 0) {
      return res.status(400).json({ error: "No valid messages were provided." });
    }

    const reply = await createTravelReply(validMessages, preferences);
    return res.json({ success: true, reply });
  } catch (error) {
    console.error("AI Chat Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Sorry, the AI assistant is temporarily unavailable."
    });
  }
});

// New live travel news endpoint. API key stays on the server.
app.get("/api/travel-news", async (req, res) => {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: "GNEWS_API_KEY is missing. Add it to the .env file beside server.js, then restart the server."
    });
  }

  const categoryInput = String(req.query.category || "all").toLowerCase();
  const category = ALLOWED_CATEGORIES.has(categoryInput) ? categoryInput : "all";
  const query = String(req.query.q || "").trim().replace(/\s+/g, " ").slice(0, 150);
  const page = Math.max(1, Math.min(10, Number.parseInt(req.query.page, 10) || 1));
  const searchQuery = query || CATEGORY_QUERIES[category];

  try {
    const apiUrl = new URL("https://gnews.io/api/v4/search");
    apiUrl.search = new URLSearchParams({
      q: searchQuery,
      lang: "en",
      max: "10",
      page: String(page),
      sortby: "publishedAt",
      apikey: apiKey
    }).toString();

    const upstream = await fetch(apiUrl, {
      headers: { Accept: "application/json", "User-Agent": "InfoAllTravelNews/1.0" },
      signal: AbortSignal.timeout(15000)
    });
    const payload = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      console.error("[GNews]", upstream.status, payload.errors || payload.message || "Request failed");
      if (upstream.status === 401) {
        return res.status(502).json({ error: "GNews rejected the API key. Check GNEWS_API_KEY in .env." });
      }
      if (upstream.status === 403) {
        return res.status(502).json({ error: "GNews denied this request. Check your plan and API access." });
      }
      if (upstream.status === 429) {
        return res.status(429).json({ error: "The news provider rate limit was reached. Wait and try again later." });
      }
      return res.status(502).json({ error: "The news provider returned an error. Check the terminal running server.js." });
    }

    const articles = (Array.isArray(payload.articles) ? payload.articles : []).map(item => ({
      title: item.title || "",
      description: item.description || item.content || "",
      url: item.url || "",
      image: item.image || "",
      source: item.source?.name || "News publisher",
      publishedAt: item.publishedAt || null,
      category
    })).filter(item => item.title && item.url);

    res.set("Cache-Control", "public, max-age=180");
    return res.json({
      ok: true,
      articles,
      totalResults: Number(payload.totalArticles) || articles.length,
      page,
      pageSize: 10,
      category,
      query: query || null,
      provider: "GNews"
    });
  } catch (error) {
    console.error("[Travel news error]", error);
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      return res.status(504).json({ error: "The news provider took too long to respond. Please retry." });
    }
    return res.status(500).json({ error: "The server could not fetch travel news. Check internet access and Node.js version." });
  }
});

// Preserve existing website routes.
app.get("/", (_req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.get("/ai", (_req, res) => res.sendFile(path.join(__dirname, "ai.html")));

app.use("/api", (req, res) => {
  res.status(404).json({ error: `Unknown API endpoint: ${req.method} ${req.originalUrl}` });
});
app.use((req, res) => {
  res.status(404).json({ error: "The requested resource was not found." });
});
app.use((err, _req, res, _next) => {
  console.error("[Express error]", err);
  res.status(500).json({ error: "Unexpected server error." });
});

app.listen(PORT, () => {
  console.log("-----------------------------------");
  console.log("       INFOALL SERVER");
  console.log("-----------------------------------");
  console.log(`Website:       http://localhost:${PORT}`);
  console.log(`News page:     http://localhost:${PORT}/news.html`);
  console.log(`AI page:       http://localhost:${PORT}/ai.html`);
  console.log(`Health:        http://localhost:${PORT}/api/health`);
  console.log(`Travel news:   http://localhost:${PORT}/api/travel-news`);
  console.log(`GNews API key: ${process.env.GNEWS_API_KEY ? "detected" : "MISSING — add GNEWS_API_KEY to .env"}`);
  console.log("-----------------------------------");
});
