import React, { useState } from "react";
import { Board } from "./board";
import "./tic-tac-toe.sass";
import {getAiMoves} from "./util";

type BoardArray = Array<Array<string | null>>;

const initialBoardState: BoardArray = Array.from({ length: 3 }, () =>
  Array.from({ length: 3 }, () => null)
);
const initialPlayerState = "X";
const initialWinnerState: string | null = null;
const initialIsNoWinnerState: boolean = false;


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

export const AiTicTacToe = () => {
  const [board, setBoard] = useState<BoardArray>(initialBoardState);

  const [player, setPlayer] = useState<string>(initialPlayerState);
  const [winner, setWinner] = useState<string | null>(initialWinnerState);
  const [isNoWinner, setIsNoWinner] = useState<boolean>(initialIsNoWinnerState);
  const [isPlayerNext, setIsPlayerNext] = useState<boolean>(true);

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
      const nextPlayer = player === "O" ? "X" : "O";
      const bestMove = getAiMoves(updatedPlayerBoard, nextPlayer, checkWinner);

      const bestComputerBoard = updatedPlayerBoard.map((newRow, rowIndex) =>
        newRow.map((cell, cellIndex) =>
          rowIndex === bestMove?.[0] && cellIndex === bestMove?.[1] ? "O" : cell
        )
      );

      setTimeout(() => {
        setBoard(bestComputerBoard);
        setWinner(checkWinner(bestComputerBoard));
      }, 200); // delay MS
    }
  };

  const restartGame = () => {
      setBoard(initialBoardState);
      const nextPlayer = isPlayerNext ? "O" : "X";
      setPlayer(nextPlayer);
      setWinner(initialWinnerState);
      setIsNoWinner(initialIsNoWinnerState);
      setIsPlayerNext(!isPlayerNext); // alternate between players

      if (nextPlayer == "O") {
        const bestMove = getAiMoves(initialBoardState, "O", checkWinner);

        const bestComputerBoard = initialBoardState.map((newRow, rowIndex) =>
          newRow.map((cell, cellIndex) =>
            rowIndex === bestMove?.[0] && cellIndex === bestMove?.[1] ? "O" : cell
          )
        );
        setPlayer("X");
        setTimeout(() => {
          setBoard(bestComputerBoard);
          setWinner(checkWinner(bestComputerBoard));
        }, 200); // delay MS
      }
    }

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
