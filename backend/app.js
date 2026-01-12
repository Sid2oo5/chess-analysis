require("dotenv").config();

const analyzeRoute = require("./routes/analyze");

const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

//routes
app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use("/api/analyze", analyzeRoute);


app.post("/game", (req, res) => {
  const { moves, analysis } = req.body;

  if (!Array.isArray(moves)) {
    return res.status(400).json({ error: "Moves must be an array" });
  }

  db.query("INSERT INTO games () VALUES ()", (err, result) => {
    if (err) return res.status(500).json(err);

    const gameId = result.insertId;

    const values = moves.map((move, index) => [
      gameId,
      index + 1,
      move,
      analysis?.[index] || null
    ]);

    db.query(
      "INSERT INTO game_moves (game_id, move_no, move, analysis) VALUES ?",
      [values],
      err => {
        if (err) return res.status(500).json(err);
        res.json({ success: true, gameId });
      }
    );
  });
});
app.get("/game/:id", (req, res) => {
  const gameId = req.params.id;
  db.query(
    "SELECT move_no, move, analysis FROM game_moves WHERE game_id = ? ORDER BY move_no",
    [gameId],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
