import React from "react";

function Square({ onClick, onContextMenu, squareProps }) {
  if (!squareProps) return null;
  const { id, squareType, checked, flagged, text } = squareProps;

  const getSquareClasses = () => {
    let squareClasses = "gameSquare";
    if (squareType) {
      squareClasses = squareClasses + ` ${squareType}`;
    }
    if (checked) {
      squareClasses = squareClasses + ` checked`;
    }
    return squareClasses;
  };

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu(id);
      }}
      id={id}
      onClick={() => onClick(id)}
      className={getSquareClasses()}
    >
      {text}
    </div>
  );
}

export default Square;
