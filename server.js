require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   STATIC FILES
========================= */

app.use(express.static(__dirname));

/* =========================
   HOME
========================= */

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

/* =========================
   HEALTH CHECK
========================= */

app.get("/api/health", (req, res) => {
    res.json({
        status: "online",
        message: "Server running successfully"
    });
});

/* =========================
   WEATHER API
========================= */

app.get("/api/weather", async (req, res) => {

    try {

        const city = req.query.city;

        if (!city) {
            return res.status(400).json({
                error: "City required"
            });
        }

        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_KEY}&units=metric`
        );

        res.json(response.data);

    } catch (error) {

        res.status(500).json({
            error: "Weather API failed"
        });

    }

});

/* =========================
   AI CHAT
========================= */

app.post("/chat", async (req, res) => {

    try {

        const message = req.body.message;

        if (!message) {
            return res.status(400).json({
                error: "Message required"
            });
        }

        res.json({
            reply: `You said: ${message}`
        });

    } catch (error) {

        res.status(500).json({
            error: "Chat failed"
        });

    }

});

/* =========================
   404
========================= */

app.use((req, res) => {

    res.status(404).json({
        error: "Page not found"
    });

});

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});