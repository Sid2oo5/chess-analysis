const express = require("express");
const analyzeGame = require("../services/analyzer");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Analyze API is working. Use POST.");
});

router.post("/", async (req, res) => {
  try {
    const { moves } = req.body;

    if (!moves || !Array.isArray(moves)) {
      return res.status(400).json({ error: "Moves array required" });
    }

    const analysis = await analyzeGame(moves);
    res.json({ analysis });

  } catch (err) {
    console.error("Error analyzing game:", err);
    res.status(500).json({ error: "Analysis failed" });
  }
});

module.exports = router;
