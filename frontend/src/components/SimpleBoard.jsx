import React from "react";

const pieceMap = {
  p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚",
  P: "♙", R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔",
};

const SimpleBoard = ({ fen }) => {
  const rows = fen.split(" ")[0].split("/");

  return (
    <div className="w-full h-full aspect-square grid grid-cols-8 grid-rows-8 border border-gray-400 bg-white">
      {rows.map((row, rowIndex) => {
        let colIndex = 0;

        return row.split("").map((c) => {
          if (isNaN(c)) {
            const square = (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`flex items-center justify-center text-[42px] select-none
                  ${(rowIndex + colIndex) % 2 === 0
                    ? "bg-[#f0d9b5]"
                    : "bg-[#b58863]"}
                `}
              >
                {pieceMap[c]}
              </div>
            );
            colIndex++;
            return square;
          } else {
            return [...Array(Number(c))].map(() => {
              const square = (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`${
                    (rowIndex + colIndex) % 2 === 0
                      ? "bg-[#f0d9b5]"
                      : "bg-[#b58863]"
                  }`}
                />
              );
              colIndex++;
              return square;
            });
          }
        });
      })}
    </div>
  );
};

export default SimpleBoard;
