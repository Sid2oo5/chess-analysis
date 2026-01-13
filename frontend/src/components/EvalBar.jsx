import React from "react";

const EvalBar = ({ evalScore }) => {
  const clamped = Math.max(-10, Math.min(10, evalScore ?? 0));
  const percentage = ((clamped + 10) / 20) * 100;

  return (
    <div className="h-full w-3 mr-2 rounded-full overflow-hidden bg-[#444]">
      <div
        className="bg-black transition-all duration-300"
        style={{ height: `${100 - percentage}%` }}
      />
      <div
        className="bg-white transition-all duration-300"
        style={{ height: `${percentage}%` }}
      />
    </div>
  );
};

export default EvalBar;
