
// ! Set this constant to true to debug the placement of bombs without
// ! having to click on all cells to reveal them.
var CHEAT_REVEAL_ALL = false;

var ROWS_COUNT = 10;
var COLS_COUNT = 10;

var BOMBS_COUNT = 6;

// load parameters from json file
// TODO
// include the fetch() statement to fetch the data from the .json file.
function loadParameters() {
// ! DEBUG logs ahead

    console.log("Cleaning local storage...");
    localStorage.clear();

}

const CELLS_TO_CLEAR = (ROWS_COUNT * COLS_COUNT) - BOMBS_COUNT;

var defeat = false;
var victory = false;

var numFlaggedCells = 0;
var numClearedCells = 0;

var bombsCount = getBombsCount();
var clearedCellsCount = numCellsToClear();

function numCellsToClear()
{
    let cleared = numFlaggedCells + numClearedCells;
    let pending = (ROWS_COUNT * COLS_COUNT) - numFlaggedCells - numClearedCells;

    let clearedField = document.getElementById("cleared-cells-count");
    clearedField.textContent = cleared;
    let pendingField = document.getElementById("total-cells-to-clear");
    pendingField.textContent = CELLS_TO_CLEAR;

    // ! DEBUG
    // console.log(`numCellsToClear returns ${cleared}/${CELLS_TO_CLEAR}`)
    return pending;
}

// Cell constructor
function Cell() {
    this.discovered = false;
    this.isBomb = false;
    this.hasBeenFlagged = false;
}

function isBomb(x, y) {

    if ((x < 0) || (y < 0) || (x >= ROWS_COUNT) || (y >= COLS_COUNT)) {
        return false;
    }

    return cells[x][y].isBomb;
}

function flipCell(x, y) {
    if ((x < 0) || (y < 0) || (x >= ROWS_COUNT) || (y >= COLS_COUNT)) {
        return false;
    }

    discoverCell(x, y);
}

// Initialize cells
var cells = Array(ROWS_COUNT);
for (var row = 0; row < ROWS_COUNT; row++) {
    cells[row] = Array(COLS_COUNT);
    for (var col = 0; col < COLS_COUNT; col++) {
        cells[row][col] = new Cell();
    }
}

//
//Task 1 - add some bombs at fixed positions.
// cells[0][0].isBomb = true;
// cells[1][7].isBomb = true;
// cells[4][9].isBomb = true;
// cells[9][2].isBomb = true;
// cells[8][2].isBomb = true;
// cells[9][9].isBomb = true;

// TODO: Task 2 - Comment out the code of task 1. Instead of adding bombs in fixed places, add 10 of them in random places.
// Add a BOMBS_COUNT constant so that you can easily change the amount of bombs placed. Put it next to the other constants.
let x = 0; let y = 0;
for (let i = 0; i < BOMBS_COUNT; i++) {
    x = Math.floor(Math.random() * 10);
    y = Math.floor(Math.random() * 10);
    cells[x][y].isBomb = true;
}


// Once the game has been initialized, we "render" it.
render();


//
// Game functions definitions
//

    // Task 6 - Discover neighbor cells recursively, as long as there are no adjacent bombs to the current cell.
function discoverCell(row, col) {
    //
    // Task 5 - Reveal cells when clicked.
    if (cells[row][col].discovered || cells[row][col].hasBeenFlagged) {
        return;
    }

    cells[row][col].discovered = true;

     // Task 8 - Implement defeat. If the player "discovers" a bomb (clicks on it without holding shift), set the variable defeat to true.
    if (isBomb(row, col)) {
        defeat = true;
        return;
    }
// TODO
    numClearedCells++;
    clearedCellsCount = numCellsToClear();

    let adjacentBombs = countAdjacentBombs(row, col);

    if (0 == adjacentBombs) {
        flipCell(row - 1, col - 1);
        flipCell(row - 1, col);
        flipCell(row - 1, col + 1);
        flipCell(row, col - 1);
        flipCell(row - 1, col + 1);
        flipCell(row + 1, col - 1);
        flipCell(row + 1, col);
        flipCell(row + 1, col + 1);
    }
}

    // When clicking a cell and holding shift, function flagCell() will be called for you.
function flagCell(row, col) {
    // Task 7 - Implement flags. Flags allow the player to mark cells that they think contain a bomb.
    //
    if (cells[row][col].hasBeenFlagged) {
        cells[row][col].hasBeenFlagged = false;
        numFlaggedCells--;
    } else {
        cells[row][col].hasBeenFlagged = true;
        numFlaggedCells++;
    }
    bombsCount = getBombsCount();
    clearedCellsCount = numCellsToClear();
}

// This function is called once for each cell when rendering the game.
// The row and col of the current cell is passed to the functionn
function countAdjacentBombs(row, col) {
    // TODO: Task 4 - Adjacent bombs are bombs in cells touching our cell (also diagonally).
    // Implement this function so that it returns the count of adjacent cells with bombs in them.
    let numBombs = 0;

    if (isBomb(row - 1, col - 1)) { numBombs++; }
    if (isBomb(row - 1, col)) { numBombs++; }
    if (isBomb(row - 1, col + 1)) { numBombs++; }
    
    if (isBomb(row, col - 1)) { numBombs++; }
    if (isBomb(row, col + 1)) { numBombs++; }
    
    if (isBomb(row + 1, col - 1)) { numBombs++; }
    if (isBomb(row + 1, col)) { numBombs++; }
    if (isBomb(row + 1, col + 1)) { numBombs++; }
        
    return numBombs;
 }

// * returns how many bombs not yet flagged.
function getBombsCount() {
    //
    // TODO: Task 9 - Implement stats: the counters currently always display 0, calculate and return the relevant values.
    let pending = BOMBS_COUNT- numFlaggedCells
    let bombsCounter = document.getElementById("bombs-count");
    bombsCounter.textContent = pending;

    // ! DEBUG
    // console.log(`getBombsCount returns ${pending}.`);
    return pending ;
}

function getClearedCells() {
    // Task 9 - Implement stats: the counters currently always display 0, calculate and return the relevant values.
    return numClearedCells;
}

function getTotalCellsToClear() {
    // Task 9 - Implement stats: the counters currently always display 0, calculate and return the relevant values.
    return CELLS_TO_CLEAR;
}

function checkForVictory() {
    //
    // TODO: Task 10 - Implement victory. If the player has revealed as many cells as they must (every cell that isn't a  bomb), set variable victory to true.
    // ! DEBUG
    console.log("Check for Victory");
    console.log(`getClearedCells() - getTotalCellsToClear() = ${getClearedCells()} - ${getTotalCellsToClear()}.`)
    victory = (0 == (getClearedCells() - getTotalCellsToClear()));
    return victory;
}

//
// Rendering functions
//
function getMessage() {
    if (victory == true) {
        return "Well done! 👏🏼<br><br>Refresh the page to start again.";
    } else if (defeat) {
        return "Boom! 💥<br><br>Refresh the page to try again.";
    }
    return "";
}

// "Render" the game. Update the content of the page to reflect any changes to the game state.
function render() {
    var playfield = document.getElementById("playfield");
    var html = "";
    for (var row = 0; row < ROWS_COUNT; row++) {
        html += '<div class="row">';
        for (var col = 0; col < COLS_COUNT; col++) {
            var cell = cells[row][col];
            var cellText = "";
            var cssClass = "";
            var textColor = "";
            if (cell.discovered || CHEAT_REVEAL_ALL || defeat) {
                cssClass = "discovered";
                if (cell.isBomb) {
                    cellText = "💣";
                } else {
                    var adjBombs = countAdjacentBombs(row, col);
                    if (adjBombs > 0) { 
                        cellText = adjBombs.toString();
                        if (adjBombs == 1) {
                            textColor = "blue";
                        } else if (adjBombs == 2) {
                            textColor = "green";
                        } else if (adjBombs == 3) {
                            textColor = "red";
                        } else if (adjBombs == 4) {
                            textColor = "black";
                        }
                    }
                }
            } else {
                if (cell.hasBeenFlagged) {
                    cellText = "🚩"
                }
            }
            html += `<div class="cell ${cssClass}" style="color:${textColor}" onclick="onCellClicked(${row}, ${col}, event)">${cellText}</div>`;
        }
        html += "</div>"
    }
    playfield.innerHTML = html;

    // Defeat screen
    var body = document.getElementsByTagName("body")[0];
    if (defeat) {
        body.classList.add("defeat")
    }

    // Victory screen
    if (victory) {
        body.classList.add("victory")
    }

    // Update stats
    document.getElementById("bombs-count").innerText = getBombsCount().toString();
    document.getElementById("cleared-cells-count").innerText = getClearedCells().toString();
    document.getElementById("total-cells-to-clear").innerText = getTotalCellsToClear().toString();

    // Update message
    document.getElementById("message").innerHTML = getMessage();
}

// This function gets called each time a cell is clicked. Arguments "row" and "col" will be set to the relevant
// values. Argument "event" is used to check if the shift key was held during the click.
function onCellClicked(row, col, event) {
    if(event.shiftKey) {
        flagCell(row, col);
    } else {
        discoverCell(row, col);
    }
    checkForVictory();
    render();
}