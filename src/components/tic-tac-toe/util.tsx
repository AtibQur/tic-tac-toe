type BoardArray = Array<Array<string | null>>;

type checkWinner = (board: BoardArray) => string | null;

export const getAiMoves = (
  board: BoardArray,
  player: string,
  checkWinner: checkWinner
): [number, number] => {
  const aiMoves: Array<[number, number]> = [];

  // 1 Check for the best possible AI move to win, if there's is one move
  board.forEach((row, rowIndex) =>
    row.map((col, colIndex) => {
      if (!board[rowIndex][colIndex]) {
        const clonedBoard = board.map((r) => [...r]);
        clonedBoard[rowIndex][colIndex] = player;
        if (checkWinner(clonedBoard) === player) {
          aiMoves.unshift([rowIndex, colIndex]);
        }
      }
    })
  );

  // 2 Check for the next players move. If the play can win, take that spot
  const opponent = player === "X" ? "O" : "X"; // assign the opposite value of the player
  board.forEach((row, rowindex) =>
    row.some((col, colindex) => {
      if (!board[rowindex][colindex]) {
        const clonedBoard = board.map((r) => [...r]);
        clonedBoard[rowindex][colindex] = opponent;
        if (checkWinner(clonedBoard) === opponent) {
          aiMoves.push([rowindex, colindex]);
        }
        return false;
      }
    })
  );

  if (aiMoves.length > 0) {
    return aiMoves[0];
  }

  // 3 Choose the center cell
  if (!board[1][1]) {
    return [1, 1];
  }

  // 4 Choose random move
  const emptyCells: Array<[number, number]> = [];
  board.forEach((row, rowIndex) =>
    row.forEach((col, colIndex) => {
      if (!board[rowIndex][colIndex]) emptyCells.push([rowIndex, colIndex]);
    })
  );

  const randomCell = Math.floor(Math.random() * emptyCells.length);
  return emptyCells[randomCell];
};
