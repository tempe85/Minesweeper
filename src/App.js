import React, { useEffect, useState } from "react";
import Board from "./Board";
import "./App.css";
import RulesModal from "./RulesModal";
import EditBoardModal from "./EditBoardModal";
import { Button } from "reactstrap";

function App() {
  const [gameBoardProps, setGameBoardProps] = useState({
    width: 10,
    height: 10,
    totalBombs: 6,
  });
  const [endGameText, setEndGameText] = useState();
  const { width, height, totalBombs } = gameBoardProps;
  const [showPlayAgainButton, setShowPlayAgainButton] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isEditBoardModalOpen, setEditBoardModalOpen] = useState(false);

  const handleGameEnd = (playerWon) => {
    if (playerWon) {
      console.log("you won???");
      setEndGameText("You Won!");
      setShowPlayAgainButton(true);
      return;
    }
    setEndGameText("You lost!");
    setShowPlayAgainButton(true);
  };

  const toggleRulesModal = (isOpen) => {
    setIsRulesModalOpen(isOpen);
  };

  const toggleEditBoardModal = (isOpen) => {
    setEditBoardModalOpen(isOpen);
  };

  const handleEditSubmit = (updatedBombs, updatedBoardSize) => {
    setGameBoardProps({
      width: updatedBoardSize,
      height: updatedBoardSize,
      totalBombs: updatedBombs,
    });
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div>
          <h1 style={{ textAlign: "center" }}>MINESWEEPER</h1>
          <div>
            <Board
              width={height}
              height={width}
              totalBombs={totalBombs}
              handleGameEnd={handleGameEnd}
              showPlayAgainButton={showPlayAgainButton}
              togglePlayAgainButton={(show) => setShowPlayAgainButton(show)}
              toggleEndGameText={(value) => setEndGameText(value)}
              endGameText={endGameText}
            ></Board>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div style={{ marginTop: "15px" }}>
              <span>
                <Button color="primary" onClick={() => toggleRulesModal(true)}>
                  Rules
                </Button>
              </span>

              <Button
                color="primary"
                onClick={() => toggleEditBoardModal(true)}
              >
                Edit Board
              </Button>
              <div>
                <h5>
                  {`Grid Size: ${gameBoardProps.width} x ${gameBoardProps.width}`}
                </h5>
                <h5>{`Bomb Total: ${gameBoardProps.totalBombs}`}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isRulesModalOpen && (
        <RulesModal isOpen={isRulesModalOpen} toggle={toggleRulesModal} />
      )}
      {isEditBoardModalOpen && (
        <EditBoardModal
          isOpen={isEditBoardModalOpen}
          toggle={toggleEditBoardModal}
          size={gameBoardProps.width}
          totalBombs={gameBoardProps.totalBombs}
          handleSubmit={handleEditSubmit}
        />
      )}
    </>
  );
}

export default App;
