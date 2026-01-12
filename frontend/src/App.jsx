import React, { useState } from "react";
import PGNUpload from "./components/PGNUpload";
import ChessBoardView from "./components/ChessBoardView";
import AnalysisPanel from "./components/AnalysisPanel";
import { analyzeMoves } from "./services/api";

const App = () => {
  const [moves, setMoves] = useState([]);
  const [analysis, setAnalysis] = useState([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [loading, setLoading] = useState(false);

  const handlePGNMoves = async (extractedMoves) => {
    setMoves(extractedMoves);
    console.log("moves:", extractedMoves);
    setCurrentMove(1);
    setLoading(true);

    try {
      const sanMoves = extractedMoves.map(m => m.san);

      const res = await analyzeMoves(sanMoves);
      setAnalysis(res.analysis);
    } catch (err) {
      alert("Analysis failed");
    }

    setLoading(false);
  };
  


  return (
  <div style={{ display: "flex", padding: "20px", gap: "30px" }}>
    
    
    <div>
      <h1>♟️ Chess Move Analyzer</h1>
      <PGNUpload onMovesExtracted={handlePGNMoves} />

      <ChessBoardView
        moves={moves}
        currentMove={currentMove}
      />

     
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => setCurrentMove(m => Math.max(m - 1, 0))}>
          ◀ Prev
        </button>

        <button
          onClick={() => setCurrentMove(m => Math.min(m + 1, moves.length))}
          style={{ marginLeft: "10px" }}
        >
          Next ▶
        </button>
      </div>

      {analysis[currentMove - 1] && (
        <div style={{ marginTop: "10px" }}>
          <b>Move:</b> {analysis[currentMove - 1].move} <br />
          <b>Quality:</b> {analysis[currentMove - 1].label}
        </div>
      )}
    </div>

   
    <div>
      {loading && <p>Analyzing with Stockfish...</p>}
      <AnalysisPanel
        analysis={analysis}
        onSelectMove={setCurrentMove}
      />
    </div>

  </div>
);

};

export default App;
