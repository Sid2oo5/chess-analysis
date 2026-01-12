const { Chess } = require("chess.js");
const getEngine = require("../engine/stockfish");

function evaluatePosition(engine, fen) {
  return new Promise((resolve) => {
    engine.stdin.write(`position fen ${fen}\n`);
    engine.stdin.write("go depth 12\n");

    engine.stdout.on("data", (data) => {
      const lines = data.toString().split("\n");

      for (let line of lines) {
        if (line.includes("score cp")) {
          const match = line.match(/score cp (-?\d+)/);
          if (match) {
            resolve(parseInt(match[1]));
          }
        }
      }
    });
  });
}

function classifyMove(diff) {
  if (diff <= -300) return "Blunder";
  if (diff <= -150) return "Mistake";
  if (diff <= -50) return "Inaccuracy";
  if (diff < 50) return "Good";
  return "Best";
}

async function analyzeGame(moves) {
  const chess = new Chess();
  const engine = getEngine();
  const result = [];

  for (let move of moves) {
    const beforeFen = chess.fen();
    const evalBefore = await evaluatePosition(engine, beforeFen);

    chess.move(move);

    const afterFen = chess.fen();
    const evalAfter = await evaluatePosition(engine, afterFen);

    const diff = evalAfter - evalBefore;
    const label = classifyMove(diff);

    result.push({ move, evalBefore, evalAfter, label });
  }

  engine.stdin.write("quit\n");
  return result;
}

module.exports = analyzeGame;
