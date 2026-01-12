import React from "react";
import { Chess } from "chess.js";

const PGNUpload = ({ onMovesExtracted }) => {
const handleUpload=(e)=>{
  const file=e.target.files[0];
  if(!file)return;

  const reader=new FileReader();
  reader.onload=()=>{
    const chess=new Chess();
    chess.loadPgn(reader.result);

    const moves = chess.history({ verbose: true });
    onMovesExtracted(moves);
  };
  reader.readAsText(file);
};

return(
<div>
  <h3>Upload PGN File</h3>
  <input type="file" accept=".pgn" onChange={handleUpload}/>
</div>
);
};

export default PGNUpload;