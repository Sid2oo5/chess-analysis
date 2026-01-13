import React, { useState, useRef, useEffect } from "react";
import PGNUpload from "./components/PGNUpload";
import ChessBoardView from "./components/ChessBoardView";
import EvalBar from "./components/EvalBar";
import { analyzeMoves } from "./services/api";

const App = () => {
  const [moves, setMoves] = useState([]);
  const [analysis, setAnalysis] = useState([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      const activeMove = scrollRef.current.querySelector(".active-move");
      if (activeMove) {
        activeMove.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  }, [currentMove]);

  const handlePGNMoves = async (extractedMoves) => {
    setMoves(extractedMoves);
    setCurrentMove(1);
    setLoading(true);
    try {
      const sanMoves = extractedMoves.map((m) => m.san);
      const res = await analyzeMoves(sanMoves);
      setAnalysis(res.analysis);
    } catch (err) {
      console.error("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const currentData = analysis[currentMove - 1] || {};

  return (
    <div className="w-screen h-screen flex flex-col bg-[#161512] text-[#bababa] overflow-hidden font-sans">
      
      {/* TOP: HORIZONTAL MOVES (Scrolls automatically) */}
      <div className="h-16 bg-[#21201d] border-b border-[#312e2b] flex items-center px-4 shrink-0">
        <div 
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto no-scrollbar py-2 items-center w-full"
        >
          {moves.map((m, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentMove(idx + 1)}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold whitespace-nowrap transition-all ${
                currentMove === idx + 1
                  ? "bg-[#81b64c] text-white active-move shadow-[0_0_15px_rgba(129,182,76,0.4)]"
                  : "bg-[#2b2926] text-gray-400 hover:bg-[#363430]"
              }`}
            >
              <span className="opacity-40 mr-1 font-mono">{Math.floor(idx / 2) + 1}{idx % 2 === 0 ? '.' : '...'}</span>
              {m.san}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT: THE BOARD (Responsive & Centered) */}
        <div className="flex-1 relative flex items-center justify-center bg-[#161512] p-4 min-w-0">
          {/* This container ensures the board scales down but never gets cut */}
          <div className="relative flex items-stretch h-full w-full max-w-full max-h-full aspect-square justify-center">
            
            {/* Eval Bar */}
            <div className="w-8 sm:w-10 mr-1 shrink-0 rounded-l-sm overflow-hidden bg-[#1a1a1a]">
              <EvalBar evalScore={currentData.eval || 0} />
            </div>
            
            {/* Board */}
            <div className="h-full aspect-square bg-[#262421] shadow-2xl">
              <ChessBoardView moves={moves} currentMove={currentMove} />
            </div>
          </div>
        </div>

        {/* RIGHT: PRO ANALYSIS PANEL (Restored Version) */}
        <div className="w-[400px] shrink-0 bg-[#262421] border-l border-[#312e2b] flex flex-col">
          
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-1">Engine Insights</h2>
            <p className="text-xs text-gray-500 uppercase tracking-tighter">Stockfish 16.1 • 24 Depth</p>
          </div>

          <div className="flex-1 px-6 space-y-6 overflow-y-auto custom-scrollbar">
            {/* Move Info Card */}
            <div className="bg-[#1b1a17] rounded-xl p-6 border border-[#312e2b] shadow-inner">
              {moves.length > 0 ? (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-4xl font-black text-white leading-tight">{currentData.move || "-"}</div>
                      <div className="text-sm text-gray-500 font-medium">Played move</div>
                    </div>
                    <div className={`px-3 py-1 rounded text-xs font-black uppercase tracking-widest ${
                      currentData.label === "Blunder" ? "bg-red-600 text-white" :
                      currentData.label === "Mistake" ? "bg-orange-500 text-white" : "bg-[#81b64c] text-white"
                    }`}>
                      {currentData.label || "Excellent"}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-[#312e2b] flex justify-between items-center">
                    <span className="text-sm text-gray-400">Evaluation</span>
                    <span className="text-xl font-mono font-bold text-white">
                      {currentData.eval > 0 ? `+${currentData.eval}` : currentData.eval || "0.0"}
                    </span>
                  </div>
                </>
              ) : (
                <div className="py-4 text-center">
                  <PGNUpload onMovesExtracted={handlePGNMoves} />
                  <p className="text-xs text-gray-500 mt-4">Import game to begin</p>
                </div>
              )}
            </div>

            <div className="bg-[#312e2b]/30 p-4 rounded-lg border-l-4 border-[#81b64c]">
              <p className="text-sm text-gray-300 italic leading-relaxed">
                Analyze the position to see threats and engine-recommended lines.
              </p>
            </div>
          </div>

          {/* LARGE NAVIGATION BUTTONS */}
         <div className="p-6 bg-[#21201d] mt-auto">
  <div className="flex gap-6">
    <button
      onClick={() => setCurrentMove((m) => Math.max(m - 1, 0))}
      /* Using h-48 for massive height and text-6xl */
      className="flex-1 h-1000 pb-20 rounded-[40px] bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white text-6xl font-black transition-all active:scale-90 shadow-2xl border-b-[10px] border-[#1a1a1a] text-center"
    >
      ◀Prev
    </button>

    <button
      onClick={() => setCurrentMove((m) => Math.min(m + 1, moves.length))}
      className="flex-1 h-1000 pb-20 rounded-[40px] bg-[#6cbf4a] hover:bg-[#5aa73f] text-black text-6xl font-black transition-all active:scale-90 shadow-2xl border-b-[10px] border-[#43792e] text-center"
    >
      Next▶
    </button>
  </div>
</div>
          {loading && (
            <div className="h-1 bg-[#81b64c] animate-[shimmer_2s_infinite]"></div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes shimmer {
          0% { opacity: 0.3; width: 0%; }
          50% { opacity: 1; width: 100%; }
          100% { opacity: 0.3; width: 0%; }
        }
      `}} />
    </div>
  );
};

export default App;