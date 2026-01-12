import React from "react";

const pieceMap = {
  p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚",
  P: "♙", R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔",
};

const SimpleBoard = ({ fen }) => {
  const rows = fen.split(" ")[0].split("/");

  return (
    <div style={boardStyle}>
      {rows.map((row, rowIndex) => {
        let squares = [];
        let colIndex = 0;

        for (const c of row) {
          if (isNaN(c)) {
            squares.push(
              <div
                key={`${rowIndex}-${colIndex}`}
                style={getSquareStyle(rowIndex, colIndex)}
              >
                <span style={pieceStyle}>{pieceMap[c]}</span>
              </div>
            );
            colIndex++;
          } else {
            for (let i = 0; i < Number(c); i++) {
              squares.push(
                <div
                  key={`${rowIndex}-${colIndex}`}
                  style={getSquareStyle(rowIndex, colIndex)}
                />
              );
              colIndex++;
            }
          }
        }

        return (
          <div key={rowIndex} style={{ display: "flex" }}>
            {squares}
          </div>
        );
      })}
    </div>
  );
};

/* ---------- STYLES ---------- */

const boardStyle = {
  width: 320,
  height: 320,
  border: "2px solid #333",
};

const getSquareStyle = (row, col) => {
  const isLight = (row + col) % 2 === 0;
  return {
    width: 40,
    height: 40,
    backgroundColor: isLight ? "#f0d9b5" : "#b58863",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
  };
};

const pieceStyle = {
  lineHeight: 1,
};

export default SimpleBoard;
