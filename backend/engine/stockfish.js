const { spawn } = require("child_process");
const path = require("path");

function getEngine() {
  const enginePath = path.join(__dirname, "stockfish.exe");

  const engine = spawn(enginePath);

  engine.stdin.setEncoding("utf-8");

  engine.stdin.write("uci\n");
  engine.stdin.write("isready\n");

  return engine;
}

module.exports = getEngine;
