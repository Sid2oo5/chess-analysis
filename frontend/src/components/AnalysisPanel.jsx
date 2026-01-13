import React from "react";

function AnalysisPanel({ analysis, onSelectMove }) {
  return (
   <div className="w-[30%] flex flex-col p-4 bg-white border-l">

      <h3>Move Analysis</h3>
      <ul>
        {analysis.map((a, i) => (
          <li
            key={i}
            onClick={() => onSelectMove(i + 1)}
            style={{
              cursor: "pointer",
              color:
                a.label === "Blunder" ? "red" :
                a.label === "Mistake" ? "orange" :
                "black"
            }}
          >
            {i + 1}. {a.move} — {a.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AnalysisPanel;
