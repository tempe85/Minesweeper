import React from "react";
import Square from "./Square";

function Squares({ squares, onClick, onContextMenu }) {
  return (
    <div style={{ display: "flex" }}>
      {squares.map((square, i) => (
        <Square
          onContextMenu={onContextMenu}
          squareProps={square}
          onClick={onClick}
          key={i}
        />
      ))}
    </div>
  );
}

export default Squares;
