/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let piecesPlayed = 0;
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  board.length = HEIGHT;
  for (let i = 0; i < HEIGHT; i++) {
    board[i] = [];
    board[i].length = WIDTH;
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  let htmlBoard = document.getElementById('board');
  // TODO: add comment for this code
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick); //these three lines create the top row of the table and create an event listener for clicks to place pieces in the row (in connect four they all come from the top)

  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top); //these lines create the indivual cells (table datacells) to fill out the row according to the WIDTH constant above, and add them to the end of the row as they are created (hence append)

  // TODO: add comment for this code
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  } //these lines create further rows below the header row to create the playing area below the column selectors
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  let y = 5;
  for (let i = 5; i >= 0; i--) {
    if (board[i][x] > 0) {
      y--;
    }
  }
  return y;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  let newPiece = document.createElement('div');
  newPiece.classList.add('piece', `p${currPlayer}`);
  //added p before the currPlayer number in the class to avoid requiring unicode characters to express the numbers in the CSS, which makes it difficult to read/understand

  let spot = document.querySelector(`#${CSS.escape(y + "-" + x)}`);
  spot.append(newPiece);
  
  //marks the spot as played on the JS board
  board[y][x] = currPlayer;

  //counts as a piece played (for alternate tie logic - see handleClick below)
  piecesPlayed++;
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }


  // let htmlBoard = document.getElementById('board');

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  };

  // check for tie
  // is every element of every array truthy?
  // if (board.every(row => row.every(cell => {cell == true}))) { //this is what i wrote as an early draft; without brackets it calls a tie after one piece is played
  //   return endGame("The board is full with no winner. Tied game!")
  // }
  // if (board.every(row => row.every(cell => cell))) { //this is the logic from the solution. it didn't work either. same thing: calls a tie after one piece is played
  //   return endGame('Tie!');
  // }
  // OR: is the board full based on its height and width?
  if (piecesPlayed >= HEIGHT * WIDTH) {
    return endGame('The board is full with no winner. The game results in a tie!')
  };

  // switch players
  currPlayer === 1 ? currPlayer = 2 : currPlayer = 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) { //for each row
    for (let x = 0; x < WIDTH; x++) { //for each cell in each row
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]]; //check for horizontal win
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]]; //check for vertical win
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]]; //check for diagonal win to the upper right
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]]; //check for diagonal win to the lower left

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();