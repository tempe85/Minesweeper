import React, { useState, useEffect } from "react";
import Square from "./Square";
import Squares from "./Squares";
import { Button } from "reactstrap";
import { render } from "react-dom";

let tempSquareArray = [];
let tempCheckGrid = [];

//Main board component
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameBoardProps: {
        width: this.props.height,
        height: this.props.width,
        totalBombs: this.props.totalBombs,
        flags: 0,
      },
      isGameOver: false,
      squares: [],
      checkForWinVisitedSquares: [],
    };
  }

  //First initialization of game board
  componentDidMount() {
    this.initializeGameBoard();
  }

  //Handles update to total bombs by a user. If the total bombs changes it re-initializes the board by calling handleStartNewGame
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.totalBombs !== this.props.totalBombs ||
      prevProps.width !== this.props.width
    ) {
      this.handleStartNewGame();
    }
  }

  //Resets the game state and initializes a new game board. Used for when the player plays games after the first
  handleStartNewGame = () => {
    this.setState(
      {
        gameBoardProps: {
          width: this.props.height,
          height: this.props.width,
          totalBombs: this.props.mines,
          flags: 0,
        },
        squares: [],
        checkForWinVisitedSquares: [],
        isGameOver: false,
      },
      () => this.initializeGameBoard()
    );
  };

  //Checks to see if a border square contains a bomb
  borderSquareContainsBomb = (direction, currIndex, gameSquares) => {
    return this.containsBomb(
      gameSquares[this.borderSquareIndex(direction, currIndex)]
    );
  };

  //Main function for initialization a game board. Is responsible for randomizing the squares with bombs/no bombs
  initializeGameBoard = () => {
    const { width, totalBombs } = this.props;
    const bombsBoard = new Array(totalBombs).fill("bomb");
    const emptyBoard = Array(width * width - totalBombs).fill("valid");
    const gameArray = [...emptyBoard, ...bombsBoard];
    const randomGameBoard = gameArray.sort(() => Math.random() - 0.5);

    const gameSquares = [];
    for (let i = 0; i < width * width; i++) {
      const square = {
        squareType: randomGameBoard[i],
        id: i,
        total: 0,
        checked: false,
        flagged: false,
        text: undefined,
      };
      gameSquares.push(square);
    }

    for (let i = 0; i < gameSquares.length; i++) {
      let total = 0;

      const isLeftEdge = i % width === 0;
      const isRightEdge = (i + 1) % width === 0;
      const isTop = i < width;
      const isBottom = i > width * width - width - 1;
      if (gameSquares[i].squareType === "valid") {
        if (
          !isLeftEdge &&
          this.borderSquareContainsBomb("west", i, gameSquares)
        ) {
          total++;
        }
        if (
          !isRightEdge &&
          this.borderSquareContainsBomb("east", i, gameSquares)
        ) {
          total++;
        }
        if (
          !isTop &&
          !isRightEdge &&
          this.borderSquareContainsBomb("northeast", i, gameSquares)
        ) {
          total++;
        }
        if (!isTop && this.borderSquareContainsBomb("north", i, gameSquares)) {
          total++;
        }
        if (
          !isTop &&
          !isLeftEdge &&
          this.borderSquareContainsBomb("northwest", i, gameSquares)
        ) {
          total++;
        }
        if (
          !isBottom &&
          this.borderSquareContainsBomb("south", i, gameSquares)
        ) {
          total++;
        }
        if (
          !isBottom &&
          !isLeftEdge &&
          this.borderSquareContainsBomb("southwest", i, gameSquares)
        ) {
          total++;
        }
        if (
          !isBottom &&
          !isRightEdge &&
          this.borderSquareContainsBomb("southeast", i, gameSquares)
        ) {
          total++;
        }
        gameSquares[i].total = total;
      }
    }

    this.setState({
      squares: gameSquares,
    });
  };

  containsBomb(square) {
    return square.squareType === "bomb";
  }

  //Helps traverse the index of the board. Accounts for outer edges of the grid
  borderSquareIndex = (direction, currIndex) => {
    const { width } = this.props;
    switch (direction) {
      case "west":
        return currIndex - 1;
      case "east":
        return currIndex + 1;
      case "north":
        return currIndex - width;
      case "south":
        return currIndex + width;
      case "northwest":
        return currIndex - 1 - width;
      case "northeast":
        return currIndex + 1 - width;
      case "southwest":
        return currIndex - 1 + width;
      case "southeast":
        return currIndex + 1 + width;
    }
  };

  //check neighboring squares once square is clicked
  checkSquare = (square, updatedSquares, currentId) => {
    const { width } = this.props;
    const isLeftEdge = currentId % width === 0;
    const isRightEdge = currentId % width === width - 1;
    const isTop = currentId < width;
    const isBottom = currentId > width * width - width - 1;

    setTimeout(() => {
      if (!isLeftEdge) {
        this.checkNextSquare("west", currentId, updatedSquares);
      }
      if (!isRightEdge) {
        this.checkNextSquare("east", currentId, updatedSquares);
      }
      if (!isTop) {
        this.checkNextSquare("north", currentId, updatedSquares);
      }
      if (!isTop && !isLeftEdge) {
        this.checkNextSquare("northwest", currentId, updatedSquares);
      }
      if (!isTop && !isRightEdge) {
        this.checkNextSquare("northeast", currentId, updatedSquares);
      }
      if (!isBottom) {
        this.checkNextSquare("south", currentId, updatedSquares);
      }
      if (!isBottom && !isLeftEdge) {
        this.checkNextSquare("southwest", currentId, updatedSquares);
      }
      if (!isBottom && !isRightEdge) {
        this.checkNextSquare("southeast", currentId, updatedSquares);
      }
    }, 5);
  };

  ////**** BRUTE FORCE METHODS BEGIN */
  //Attempt at creating a 'solution' algorithm. Performs BFS on each square, guarenteeing you will find a solution regardless of the game state.
  solveWithBruteForce(initialValue = 0) {
    let solveByBruteForceArray = [...this.state.squares];
    tempSquareArray = solveByBruteForceArray;
    for (let i = 0; i < this.state.squares.length; i++) {
      const initialSquare = { ...solveByBruteForceArray[i] };
      this.solveWithBruteForceHelper(
        initialSquare,
        solveByBruteForceArray,
        initialSquare.id
      );
    }
    this.setState(
      {
        squares: tempSquareArray,
      },
      () => this.handleCheckForWin()
    );
  }

  //Brute force helper method
  solveWithBruteForceHelper = (square, solveByBruteForceArray, id) => {
    if (
      solveByBruteForceArray[square.id].checked ||
      solveByBruteForceArray[square.id].squareType === "bomb"
    ) {
      return;
    }

    let squareCopy = { ...solveByBruteForceArray[square.id] };
    if (squareCopy.squareType === "valid") {
      squareCopy.checked = true;
    }
    solveByBruteForceArray[square.id] = squareCopy;

    this.checkSquareForBruteForceSolution(
      squareCopy,
      solveByBruteForceArray,
      square.id
    );
  };

  //Checks adjacent squares in the brute force solution, helper method
  checkNextSquareForBruteForceSolution = (
    direction,
    currentId,
    solveByBruteForceArray
  ) => {
    const newId = this.borderSquareIndex(direction, parseInt(currentId));
    const square = { ...solveByBruteForceArray[newId] };
    this.solveWithBruteForceHelper(square, solveByBruteForceArray, newId);
  };

  //Initial check in brute force solution
  checkSquareForBruteForceSolution = (
    square,
    solveByBruteForceArray,
    currentId
  ) => {
    const { width } = this.props;
    const isLeftEdge = currentId % width === 0;
    const isRightEdge = currentId % width === width - 1;
    const isTop = currentId < width;
    const isBottom = currentId > width * width - width - 1;

    if (!isLeftEdge) {
      this.checkNextSquareForBruteForceSolution(
        "west",
        currentId,
        solveByBruteForceArray
      );
    }
    if (!isRightEdge) {
      this.checkNextSquareForBruteForceSolution(
        "east",
        currentId,
        solveByBruteForceArray
      );
    }
    if (!isTop) {
      this.checkNextSquareForBruteForceSolution(
        "north",
        currentId,
        solveByBruteForceArray
      );
    }
    if (!isTop && !isLeftEdge) {
      this.checkNextSquareForBruteForceSolution(
        "northwest",
        currentId,
        solveByBruteForceArray
      );
    }
    if (!isTop && !isRightEdge) {
      this.checkNextSquareForBruteForceSolution(
        "northeast",
        currentId,
        solveByBruteForceArray
      );
    }
    if (!isBottom) {
      this.checkNextSquareForBruteForceSolution(
        "south",
        currentId,
        solveByBruteForceArray
      );
    }
    if (!isBottom && !isLeftEdge) {
      this.checkNextSquareForBruteForceSolution(
        "southwest",
        currentId,
        solveByBruteForceArray
      );
    }
    if (!isBottom && !isRightEdge) {
      this.checkNextSquareForBruteForceSolution(
        "southeast",
        currentId,
        solveByBruteForceArray
      );
    }
  };

  ////**** BRUTE FORCE METHODS END */

  //Checks an square that connects to the previous checked square. Used for checking user inputs. Helps with 'exploading' the grid
  checkNextSquare = (direction, currentId, updatedSquares) => {
    const newId = this.borderSquareIndex(direction, parseInt(currentId));
    const square = { ...updatedSquares[newId] };
    this.handleClickSquareHelper(newId, square, updatedSquares);
  };

  //Handles a user click input on the grid. Begins BFS process and then checks to see if the user has won the game.
  handleClickSquare = (id) => {
    const { squares, isGameOver } = this.state;
    let updatedSquares = [...squares];
    let square = { ...updatedSquares[id] };

    if (isGameOver) return;
    if (square.checked || square.flagged) return;
    if (this.containsBomb(square)) {
      this.gameOver(false);
    } else {
      let total = square.total;
      square.checked = true;
      if (total !== 0) {
        square.text = total;
        updatedSquares[id] = square;
        this.setState(
          {
            squares: updatedSquares,
          },
          () => {
            this.handleCheckForWin();
          }
        );
        return;
      } else {
        updatedSquares[id] = square;
      }
      tempSquareArray = updatedSquares;
      this.checkSquare(square, updatedSquares, id);
      setTimeout(
        () =>
          this.setState(
            {
              squares: tempSquareArray,
            },
            () => {
              this.handleCheckForWin();
            }
          ),
        100
      );
    }
  };

  //Helper method for user clicking a square
  handleClickSquareHelper = (id, square, updatedSquares) => {
    if (square.checked || square.flagged) return;
    if (this.containsBomb(square)) {
      this.gameOver(false);
    } else {
      let total = square.total;
      square.checked = true;
      updatedSquares[id] = square;
      if (total !== 0) {
        square.text = total;
        return;
      }
      this.checkSquare(square, updatedSquares, id);
    }
  };

  //Performs game over cleanup after a user either won or lost
  gameOver = (didUserWin) => {
    const { squares } = this.state;
    let updatedSquares = [...squares];

    //show all bomLocations
    updatedSquares.forEach((square) => {
      if (this.containsBomb(square)) {
        square.text = "💣";
      }
    });
    this.setState({
      squares: updatedSquares,
      isGameOver: true,
    });
    this.props.handleGameEnd(didUserWin);
  };

  //Main method to check if a game is complete
  handleCheckForWin = () => {
    const { width } = this.props;
    const { squares } = this.state;
    let checkForWinArray = new Array(width * width).fill({
      isValid: true,
      isChecked: false,
    });

    tempCheckGrid = checkForWinArray;
    this.checkForWin(squares[0], checkForWinArray, squares[0].id);
    setTimeout(
      () =>
        this.setState(
          {
            checkForWinVisitedSquares: tempCheckGrid,
          },
          () => {
            if (
              this.checkIfCheckWinArrayIsValid(
                this.state.checkForWinVisitedSquares
              )
            ) {
              this.gameOver(true);
            }
          }
        ),
      100
    );
  };

  // Looks through the 'memo' created when checking a win and figures out if all squares are valid
  checkIfCheckWinArrayIsValid = (checkForWinVisitedSquares) => {
    for (let i = 0; i < checkForWinVisitedSquares.length; i++) {
      if (!checkForWinVisitedSquares[i].isValid) {
        return false;
      }
    }
    return true;
  };

  //Win verification helper method
  checkForWin = (square, checkForWinArray, id) => {
    if (checkForWinArray[square.id].isChecked) return;

    let checkedIndexObject = { ...checkForWinArray[square.id] };
    checkedIndexObject.isChecked = true;
    checkForWinArray[square.id] = checkedIndexObject;

    if (!square.checked && !square.flagged && square.squareType === "valid") {
      checkForWinArray[id].isValid = false;
      return;
    }

    this.checkSquareForSolution(square, checkForWinArray, id);
  };

  //Win verification helper method
  checkNextSquareForSolution = (direction, currentId, checkForWinArray) => {
    const newId = this.borderSquareIndex(direction, parseInt(currentId));
    const square = { ...this.state.squares[newId] };
    this.checkForWin(square, checkForWinArray, newId);
  };

  //Win verification helper method
  checkSquareForSolution = (square, checkForWinArray, currentId) => {
    const { width } = this.props;
    const isLeftEdge = currentId % width === 0;
    const isRightEdge = currentId % width === width - 1;
    const isTop = currentId < width;
    const isBottom = currentId > width * width - width - 1;

    if (!isLeftEdge) {
      this.checkNextSquareForSolution("west", currentId, checkForWinArray);
    }
    if (!isRightEdge) {
      this.checkNextSquareForSolution("east", currentId, checkForWinArray);
    }
    if (!isTop) {
      this.checkNextSquareForSolution("north", currentId, checkForWinArray);
    }
    if (!isTop && !isLeftEdge) {
      this.checkNextSquareForSolution("northwest", currentId, checkForWinArray);
    }
    if (!isTop && !isRightEdge) {
      this.checkNextSquareForSolution("northeast", currentId, checkForWinArray);
    }
    if (!isBottom) {
      this.checkNextSquareForSolution("south", currentId, checkForWinArray);
    }
    if (!isBottom && !isLeftEdge) {
      this.checkNextSquareForSolution("southwest", currentId, checkForWinArray);
    }
    if (!isBottom && !isRightEdge) {
      this.checkNextSquareForSolution("southeast", currentId, checkForWinArray);
    }
  };

  //Main method for creating the gameboard
  createGameBoard = () => {
    const { width } = this.props;
    const { squares } = this.state;
    const gameBoard = [];
    for (let j = 0; j < width; j++) {
      const squareRow = [];
      for (let i = 0; i < width; i++) {
        const index = j * 10 + i;
        squareRow.push(squares[index]);
      }
      gameBoard.push(squareRow);
    }

    return gameBoard;
  };

  //Handles adding or removing a flag from the game board
  addFlag = (id) => {
    const { squares, isGameOver } = this.state;
    let updatedSquares = [...squares];
    let square = { ...updatedSquares[id] };
    if (!square) return;
    if (isGameOver) {
      return;
    }
    if (!square.checked) {
      if (!square.flagged) {
        square.flagged = true;
        square.text = "🚩";
        updatedSquares[square.id] = square;
        this.setState({
          squares: updatedSquares,
        });
      } else {
        square.flagged = false;
        square.text = "";
        updatedSquares[square.id] = square;
        this.setState({
          squares: updatedSquares,
        });
      }
    }
  };

  render() {
    const { squares } = this.state;
    const { showPlayAgainButton, endGameText } = this.props;
    const gameBoard = this.createGameBoard();
    return (
      <>
        {gameBoard &&
          gameBoard.map((squares, i) => (
            <Squares
              onClick={this.handleClickSquare}
              onContextMenu={this.addFlag}
              squares={squares}
              key={i}
            />
          ))}
        <span style={{ paddingRight: "10px" }}>
          <Button color="success" onClick={() => this.solveWithBruteForce()}>
            Solve for me
          </Button>
        </span>
        {/* <span style={{ paddingRight: "10px" }}>
          <Button color="success" onClick={() => this.handleCheckForWin()}>
            Check For Win
          </Button>
        </span> */}
        <div>
          <h4>{endGameText}</h4>
          {showPlayAgainButton && (
            <>
              <div
                className={"play-again-button"}
                style={{ backgroundColor: "red" }}
                onClick={() => {
                  this.handleStartNewGame();
                  this.props.togglePlayAgainButton(false);
                  this.props.toggleEndGameText(undefined);
                }}
              >
                Click to play again!
              </div>
            </>
          )}
        </div>
      </>
    );
  }
}

export default Board;
