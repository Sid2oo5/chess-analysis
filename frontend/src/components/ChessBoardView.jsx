import React, { useEffect, useState } from "react";
import { Chess } from "chess.js";
import SimpleBoard from "./SimpleBoard";


const ChessBoardView = ({ moves, currentMove }) => {
  const [fen, setFen] = useState("start");

  useEffect(() => {
    const chess = new Chess();

    for (let i = 0; i < currentMove && i < moves.length; i++) {
      const move = moves[i];
      if (!move) break;

      chess.move({
        from: move.from,
        to: move.to,
        promotion: move.promotion || "q"
      });
    }

    setFen(chess.fen());
  }, [moves, currentMove]);

  return (
   <div className="h-screen basis-[70%] flex items-center justify-center bg-gray-200">
      <SimpleBoard fen={fen} />
    </div>
  );
};

export default ChessBoardView;
