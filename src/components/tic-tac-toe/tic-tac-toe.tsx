import React, { useState } from "react";
import { Board } from "./board";
import "./tic-tac-toe.sass";

type BoardArray = Array<Array<string | null>>;

const initialBoardState: BoardArray = Array.from({ length: 3 }, () =>
  Array.from({ length: 3 }, () => null)
);
const initialPlayerState = "X";
const initialWinnerState: string | null = null;
const initialIsNoWinnerState: boolean = false;

// Random computer move
const makeComputerMove = (board: BoardArray): [number, number] => {
  // Search for empty spots on the board
  const emptyCells: [number, number][] = [];
  board.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (!cell) {
        emptyCells.push([rowIndex, cellIndex]);
      }
    });
  });

  const randomMove = Math.floor(Math.random() * emptyCells.length);
  return emptyCells[randomMove];
};

// Check for a winner. If not return null and the game goes on
const checkWinner = (board: BoardArray): string | null => {
  // check rows
  for (let row = 0; row < 3; row++) {
    if (
      board[row][0] &&
      board[row][0] === board[row][1] &&
      board[row][1] === board[row][2]
    ) {
      return board[row][0];
    }
  }
  // check columns
  for (let column = 0; column < 3; column++) {
    if (
      board[0][column] &&
      board[0][column] === board[1][column] &&
      board[1][column] === board[2][column]
    ) {
      return board[0][column];
    }
  }
  // check diagonals
  if (
    board[0][0] &&
    board[0][0] === board[1][1] &&
    board[1][1] === board[2][2]
  ) {
    return board[0][0];
  }
  if (
    board[0][2] &&
    board[0][2] === board[1][1] &&
    board[1][1] === board[2][0]
  ) {
    return board[0][2];
  }
  return null;
};

export const TicTacToe = () => {
  const [board, setBoard] = useState<BoardArray>(initialBoardState);

  const [player, setPlayer] = useState<string>(initialPlayerState);
  const [winner, setWinner] = useState<string | null>(initialWinnerState);
  const [isNoWinner, setIsNoWinner] = useState<boolean>(initialIsNoWinnerState);

  const handleOnClick = (row: number, col: number) => {
    /* Check if the square is already clicked or if there is a winner. Return with no value */
    if (board[row][col] || winner) {
      return;
    }
    /* Create a new board everytime a player clicks a square. if row and index numbers are correct, square value will be player (X or O)  */
    const updatedPlayerBoard = board.map((newRow, rowIndex) =>
      newRow.map((cell, cellIndex) =>
        rowIndex === row && cellIndex === col ? player : cell
      )
    );

    setBoard(updatedPlayerBoard);
    const newWinner = checkWinner(updatedPlayerBoard);
    setWinner(newWinner);
    setPlayer("X");

    // Check for a draw (no null values left)
    const hasNullValue = updatedPlayerBoard.some((row) =>
      row.some((cell) => cell === null)
    );

    if (!winner && !hasNullValue) {
      setIsNoWinner(true);
      return;
    }

    // Random computer move
    if (!newWinner) {
      const [computerRow, computerIndex] = makeComputerMove(updatedPlayerBoard);
      const updatedComputerBoard = updatedPlayerBoard.map((newRow, rowIndex) =>
        newRow.map((cell, cellIndex) =>
          rowIndex === computerRow && cellIndex === computerIndex ? "O" : cell
        )
      );

      setTimeout(() => {
        setBoard(updatedComputerBoard);
        setWinner(checkWinner(updatedComputerBoard));
      }, 200); // delay MS
    }
  };

  const restartGame = () => {
    setBoard(initialBoardState);
    setPlayer(initialPlayerState);
    setWinner(initialWinnerState);
    setIsNoWinner(initialIsNoWinnerState);
  };

  return (
    <div className="game">
      <h1>Tic-Tac-Toe</h1>
      <Board board={board} handleClick={handleOnClick} />
      {winner && <p>{`${winner === "X" ? "You win" : "You lost"}`}</p>}
      {isNoWinner && !winner && <p>No one wins</p>}
      <button className="reset" type="button" onClick={() => restartGame()}>
        Start new game
      </button>
    </div>
  );
};
