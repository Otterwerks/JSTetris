// Initialization
//--------------------------------------------------------------------------------

var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

const BASE_UNIT_SIZE = 20; // Tetromino block size in pixels, this value scales everything
const FPS = 30; // Frames per second
const TETROMINOS = ["I", "O", "T", "S", "Z", "J", "L"];
const COLORS = ["red", "green", "blue", "purple", "yellow", "orange", "pink"];
const DEBUG = false; // Enable testing functionality (read: cheats)

// Make canvas scale with piece size
canvas.width = BASE_UNIT_SIZE * 10;
canvas.height = BASE_UNIT_SIZE * 20;

// The playable piece, declared as object literal with placeholder attributes
var gamePiece = {
    xPosition : canvas.width / 2,
    yPosition : 0,
    orientation : 1,
    type : "I",
    color : "black",
    leftBoundary : 0,
    rightBoundary : 0,
    updateTemplate : function() {selectGamePiece(gamePiece.orientation, gamePiece.type)},
    template : [
        [], // each element is an array
        [], // of values which represent
        [], // the coordinates of each square
        []  // that make the current tetromino, and color
    ]
};


// Main game loop
//--------------------------------------------------------------------------------

// Canvas rendering
window.onload = function() {
    newRound();
    setInterval(function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        gamePiece.updateTemplate(); // required because gamePiece.template does not dynamically update with xPosition and yPosition
        detectCollision();
        gravity();
        drawGamePiece();
        drawFallenPieces();
    }, 1000/FPS)
}


// Functionality
//---------------------------------------------------------------------------------

var fallSpeed = 1; // base units per second

// Make game piece fall down
function gravity() {
    if (gamePiece.yPosition < canvas.height) {
        gamePiece.yPosition += fallSpeed * BASE_UNIT_SIZE / (1000 / FPS);
    }
}

// Render playable tetromino
function drawGamePiece() {
    for (let i = 0; i < 4; i++) {
        context.beginPath();
        context.fillStyle = COLORS[gamePiece.color];
        context.lineWidth = BASE_UNIT_SIZE / 10;
        context.strokeStyle = "black";
        context.rect(gamePiece.template[i][0], gamePiece.template[i][1], gamePiece.template[i][2], gamePiece.template[i][3]);
        context.fill();
        context.stroke();
    }
}

// Render fallen tetrominos
function drawFallenPieces() {
    for (let i = 0; i < fallenPieces.length; i++) {
        context.beginPath();
        context.fillStyle = COLORS[fallenPieces[i][4]];
        context.lineWidth = BASE_UNIT_SIZE / 10;
        context.strokeStyle = "black";
        context.rect(fallenPieces[i][0], fallenPieces[i][1], fallenPieces[i][2], fallenPieces[i][3]);
        context.fill();
        context.stroke();
    }
}

// Set up a new round
function newRound() {
    fallSpeed = 1;
    newGamePiece();
}

// Create a new tetromino
function newGamePiece() {
    gamePiece.xPosition = canvas.width / 2;
    gamePiece.yPosition = 0;
    gamePiece.orientation = Math.floor((Math.random() * 4) + 1);
    gamePiece.type = TETROMINOS[Math.floor(Math.random() * TETROMINOS.length)];
    gamePiece.color = Math.floor(Math.random() * COLORS.length);
    gamePiece.updateTemplate();
}

// Collision detection
// Consider hitboxes of playable tetromino subsquares as bottom left corner points
// Consider hitboxes of fallen tetromino subsquares as top left corner points
// Compare for match
function detectCollision() {
    for (let i = 0; i < 4; i++) {
        if (gamePiece.template[i][1] + BASE_UNIT_SIZE + BASE_UNIT_SIZE / 10 >= canvas.height) {
            alignGamePiece(gamePiece.template[i][1] + BASE_UNIT_SIZE, canvas.height);
            saveToFallen();
            detectCompleteRows();
            newRound();
            return;
        }
        for (let j = 0; j < fallenPieces.length; j++) {
            if (gamePiece.template[i][0] == fallenPieces[j][0] && gamePiece.template[i][1] + BASE_UNIT_SIZE + BASE_UNIT_SIZE / 10 >= fallenPieces[j][1]) {
                alignGamePiece(gamePiece.template[i][1] + BASE_UNIT_SIZE, fallenPieces[j][1]);
                saveToFallen();
                detectCompleteRows();
                newRound();
                console.log("Collision at: " + fallenPieces[j][1]);
                return;
            }
        }
    }  
}

// Check for full rows by top left corner of block, recursively
function detectCompleteRows() {
    snapToGrid();
    let totalPossible = canvas.width / BASE_UNIT_SIZE;
    let totalBlockCount = 0;
    for (let i = 0; i < canvas.height; i += BASE_UNIT_SIZE) { // start at the top and go down row by row
        totalBlockCount = 0;
        for (let j = 0; j < canvas.width; j += BASE_UNIT_SIZE) { // check each row from left to right
            for (let k = 0; k < fallenPieces.length; k++) { // look at each fallen block
                if (fallenPieces[k][1] == i && fallenPieces[k][0] == j) { // count how many blocks
                    totalBlockCount ++;
                }
            }
            if (totalBlockCount >= totalPossible) {
                console.log("Row " + (i / BASE_UNIT_SIZE) + " cleared, " + totalBlockCount + "/" + totalPossible);
                clearRow(i);
                shiftRowsDown(i);
                detectCompleteRows();
                return;
            }
        }
        if (totalBlockCount != 0) {
            console.log("Row: " + (i / BASE_UNIT_SIZE) + ", blocks: " + totalBlockCount);
        }
    }
}

// Clear completed row, recursively
function clearRow(row) {
    for (let i = 0; i < fallenPieces.length; i++) {
        if (fallenPieces[i][1] == row) {
            fallenPieces.splice(i, 1);
            clearRow(row);
            return;
        }
    }
}

// Shift rows down
function shiftRowsDown(row) {
    for (let i = 0; i < fallenPieces.length; i++) {
        if (fallenPieces[i][1] <= row) {
            fallenPieces[i][1] += BASE_UNIT_SIZE;
        }
    }
}


// Set alignment on tetromino before saving as fallen
function alignGamePiece(currentPosition, referencePosition) {
    for (let i = 0; i < 4; i++) {
        gamePiece.template[i][1] -= (currentPosition - referencePosition);
    }
    snapToGrid();
}

// Straighten all blocks, scoring relies on this
function snapToGrid() {
    for (let i = 0; i < fallenPieces.length; i++) {
        for (let j = 0; j < 2; j++) {
            if (fallenPieces[i][j] % BASE_UNIT_SIZE == 0) {
                // pass
            }
            else if (fallenPieces[i][j] % BASE_UNIT_SIZE < BASE_UNIT_SIZE / 2) {
                fallenPieces[i][j] -= fallenPieces[i][j] % BASE_UNIT_SIZE;
            }
            else {
                fallenPieces[i][j] += BASE_UNIT_SIZE - fallenPieces[i][j] % BASE_UNIT_SIZE;
            }
        }
    }
}

// Save fallen pieces
var fallenPieces = [];

function saveToFallen() {
    for (let i = 0; i < 4; i++) {
        gamePiece.template[i].push(gamePiece.color);
        fallenPieces.push(gamePiece.template[i]);
    }
}

// Set piece orientation
function rotateGamePiece(direction) {
    if (direction == "CLOCKWISE"){
        if (gamePiece.orientation == 1 || gamePiece.orientation == 2 || gamePiece.orientation == 3) {
            gamePiece.orientation ++;
        }
        else if (gamePiece.orientation == 4) {
            gamePiece.orientation = 1;
        }
        else {
            console.log("Unknown clockwise rotation: " + gamePiece.orientation);
        }
    }
    else if (direction == "COUNTERCLOCKWISE") {
        if (gamePiece.orientation == 2 || gamePiece.orientation == 3 || gamePiece.orientation == 4) {
            gamePiece.orientation --;
        }
        else if (gamePiece.orientation == 1) {
            gamePiece.orientation = 4;
        }
        else {
            console.log("Unknown counterclockwise rotation: " + gamePiece.orientation);
        }
    }
    else {
        console.log("Unknown rotation direction: " + direction);
    }
}

// Move piece
function moveGamePiece(direction) {
    if (direction == "LEFT") {
        if (gamePiece.xPosition + gamePiece.leftBoundary > 0) { 
            gamePiece.xPosition -= BASE_UNIT_SIZE;
        }
    }
    else if (direction == "RIGHT") {
        if (gamePiece.xPosition + gamePiece.rightBoundary < canvas.width) {
            gamePiece.xPosition += BASE_UNIT_SIZE;
        }
    }
    else if (direction == "DOWN") {
        if (gamePiece.yPosition + BASE_UNIT_SIZE < canvas.height) {
            gamePiece.yPosition += BASE_UNIT_SIZE;
        }
    }
    else {
        console.log("Unknown game piece move direction: " + direction);
    }
    debugHelper();
}


// Keyboard event listeners and friends
//------------------------------------------------------------------------------

document.addEventListener('keydown', keyDownHandler, false);

function keyDownHandler(event) {
    if (event.keyCode == 39) {
        // Right arrow
        moveGamePiece("RIGHT");
    }
    else if (event.keyCode == 37) {
        // Left arrow
        moveGamePiece("LEFT");
    }
    else if (event.keyCode == 40) {
        // Down arrow
        moveGamePiece("DOWN");
    }
    else if (event.keyCode == 38) {
        // Up arrow
        rotateGamePiece("CLOCKWISE");
    }
    else if (event.keyCode == 32) {
        // Spacebar
        fallSpeed = 40;
    }
    else if (event.keyCode == 81) {
        // Q key
        rotateGamePiece("COUNTERCLOCKWISE");
    }
    else if (event.keyCode == 87) {
        // W key
        rotateGamePiece("CLOCKWISE");
    }
    if (DEBUG == true) {
        // Game piece chooser
        if (event.keyCode == 73) {
            // I key
            gamePiece.type = "I";
        }
        else if (event.keyCode == 79) {
            // O key
            gamePiece.type = "O";
        }
        else if (event.keyCode == 84) {
            // T key
            gamePiece.type = "T";
        }
        else if (event.keyCode == 83) {
            // S key
            gamePiece.type = "S";
        }
        else if (event.keyCode == 90) {
            // Z key
            gamePiece.type = "Z";
        }
        else if (event.keyCode == 74) {
            // J key
            gamePiece.type = "J";
        }
        else if (event.keyCode == 76) {
            // L key
            gamePiece.type = "L";
        }
        // RDFG movement pad without boundaries
        else if (event.keyCode == 68) {
            // D key
            gamePiece.xPosition -= BASE_UNIT_SIZE;
        }
        else if (event.keyCode == 71) {
            // G key
            gamePiece.xPosition += BASE_UNIT_SIZE;
        }
        else if (event.keyCode == 82) {
            // R key
            gamePiece.yPosition -= BASE_UNIT_SIZE;
        }
        else if (event.keyCode == 70) {
            // F key
            gamePiece.yPosition += BASE_UNIT_SIZE;
        }
    }
}


// Selectors for retreiving piece template formulas and boundaries
//-------------------------------------------------------------------------

// Access the correct template
function selectGamePiece(orientation, type) {
    switch(type) {
        case "I":
            selectITetromino(orientation);
            break;
        case "O":
            selectOTetromino(orientation);
            break;
        case "T":
            selectTTetromino(orientation);
            break;
        case "S":
            selectSTetromino(orientation);
            break;
        case "Z":
            selectZTetromino(orientation);
            break;
        case "J":
            selectJTetromino(orientation);
            break;
        case "L":
            selectLTetromino(orientation);
            break;
        default: // error
            console.log("Tetromino type error");
    }
    // Bring game piece within boundaries after calling template
    if (gamePiece.xPosition + gamePiece.leftBoundary < 0) {
        gamePiece.xPosition += BASE_UNIT_SIZE;
    }
    else if (gamePiece.xPosition + gamePiece.rightBoundary > canvas.width) {
        gamePiece.xPosition -= BASE_UNIT_SIZE;
    }
}


// "I" Tetromino
function selectITetromino(orientation) {
    switch(orientation) {
        case 1: //vertical
        case 3: //vertical
            gamePiece.template = [
                [gamePiece.xPosition, gamePiece.yPosition - BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition, gamePiece.yPosition + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition, gamePiece.yPosition + 2 * BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE]
            ];
            gamePiece.leftBoundary = 0;
            gamePiece.rightBoundary = BASE_UNIT_SIZE;
            break;
        case 2: //horizontal
        case 4: //horizontal
            gamePiece.template = [
                [gamePiece.xPosition - BASE_UNIT_SIZE, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition + BASE_UNIT_SIZE, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition + 2 * BASE_UNIT_SIZE, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE]
            ];
            gamePiece.leftBoundary = - BASE_UNIT_SIZE;
            gamePiece.rightBoundary = 3 * BASE_UNIT_SIZE;
            break;
        default: // error
            console.log("I Tetromino orientation error")
    }
}
// "O" Tetromino
function selectOTetromino(orientation) {
    switch(orientation) {
        case 1: // it's
        case 2: // a
        case 3: // square
        case 4: // !
            gamePiece.template = [
                [gamePiece.xPosition, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition, gamePiece.yPosition + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition + BASE_UNIT_SIZE, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition + BASE_UNIT_SIZE, gamePiece.yPosition + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE]
            ]
            gamePiece.leftBoundary = 0;
            gamePiece.rightBoundary = 2 * BASE_UNIT_SIZE;
            break;
        default: // error
            console.log("O Tetromino orientation error");
    }   
}
// "T" Tetromino
function selectTTetromino(orientation) {
    switch(orientation) {
        case 1: // facing down
            gamePiece.template = [
                [gamePiece.xPosition, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition - BASE_UNIT_SIZE, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition + BASE_UNIT_SIZE, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition, gamePiece.yPosition + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE]
            ]
            gamePiece.leftBoundary = - BASE_UNIT_SIZE;
            gamePiece.rightBoundary = 2 * BASE_UNIT_SIZE;
            break;
        case 2: // facing left
            gamePiece.template = [
                [gamePiece.xPosition, gamePiece.yPosition - BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition, gamePiece.yPosition + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition - BASE_UNIT_SIZE, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE]
            ]
            gamePiece.leftBoundary = - BASE_UNIT_SIZE;
            gamePiece.rightBoundary = BASE_UNIT_SIZE;
            break;
        case 3: // facing up
            gamePiece.template = [
                [gamePiece.xPosition - BASE_UNIT_SIZE, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition + BASE_UNIT_SIZE, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition, gamePiece.yPosition - BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE]
            ]
            gamePiece.leftBoundary = - BASE_UNIT_SIZE;
            gamePiece.rightBoundary = 2 * BASE_UNIT_SIZE;
            break;
        case 4: // facing right
            gamePiece.template = [
                [gamePiece.xPosition, gamePiece.yPosition - BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition, gamePiece.yPosition + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition + BASE_UNIT_SIZE, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE]
            ]
            gamePiece.leftBoundary = 0;
            gamePiece.rightBoundary = 2 * BASE_UNIT_SIZE;
            break;
        default: // error
            console.log("T Tetromino orientation error");
    }
}
// "J" Tetromino
function selectJTetromino(orientation) {
    switch(orientation) {
        case 1: // facing left
            gamePiece.template = [
                [gamePiece.xPosition - BASE_UNIT_SIZE, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition + BASE_UNIT_SIZE, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition + BASE_UNIT_SIZE, gamePiece.yPosition + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE]
            ]
            gamePiece.leftBoundary = - BASE_UNIT_SIZE;
            gamePiece.rightBoundary = 2 * BASE_UNIT_SIZE;
            break;
        case 2: // facing up
            gamePiece.template = [
                [gamePiece.xPosition, gamePiece.yPosition - BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition, gamePiece.yPosition + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition - BASE_UNIT_SIZE, gamePiece.yPosition + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE]
            ]
            gamePiece.leftBoundary = - BASE_UNIT_SIZE;
            gamePiece.rightBoundary = BASE_UNIT_SIZE;
            break;
        case 3: // facing right
            gamePiece.template = [
                [gamePiece.xPosition - BASE_UNIT_SIZE, gamePiece.yPosition - BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition - BASE_UNIT_SIZE, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition + BASE_UNIT_SIZE, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE]
            ]
            gamePiece.leftBoundary = - BASE_UNIT_SIZE;
            gamePiece.rightBoundary = 2 * BASE_UNIT_SIZE;
            break;
        case 4: // facing down
            gamePiece.template = [
                [gamePiece.xPosition, gamePiece.yPosition - BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition + BASE_UNIT_SIZE, gamePiece.yPosition - BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition, gamePiece.yPosition + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE]
            ]
            gamePiece.leftBoundary = 0;
            gamePiece.rightBoundary = 2 * BASE_UNIT_SIZE;
            break;
        default: // error
            console.log("J Tetromino orientation error");
    }
}
// "L" Tetromino
function selectLTetromino(orientation) {
    switch(orientation) {
        case 1: // facing right
            gamePiece.template = [
                [gamePiece.xPosition - BASE_UNIT_SIZE, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition + BASE_UNIT_SIZE, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition - BASE_UNIT_SIZE, gamePiece.yPosition + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE]
            ]
            gamePiece.leftBoundary = - BASE_UNIT_SIZE;
            gamePiece.rightBoundary = 2 * BASE_UNIT_SIZE;
            break;
        case 2: // facing down
            gamePiece.template = [
                [gamePiece.xPosition - BASE_UNIT_SIZE, gamePiece.yPosition - BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition, gamePiece.yPosition - BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition, gamePiece.yPosition + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE]
            ]
            gamePiece.leftBoundary = - BASE_UNIT_SIZE;
            gamePiece.rightBoundary = BASE_UNIT_SIZE;
            break;
        case 3: // facing left
            gamePiece.template = [
                [gamePiece.xPosition - BASE_UNIT_SIZE, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition + BASE_UNIT_SIZE, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition + BASE_UNIT_SIZE, gamePiece.yPosition - BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE]
            ]
            gamePiece.leftBoundary = - BASE_UNIT_SIZE;
            gamePiece.rightBoundary = 2 * BASE_UNIT_SIZE;
            break;
        case 4: // facing up
            gamePiece.template = [
                [gamePiece.xPosition, gamePiece.yPosition - BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition, gamePiece.yPosition + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition + BASE_UNIT_SIZE, gamePiece.yPosition + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE]
            ]
            gamePiece.leftBoundary = 0;
            gamePiece.rightBoundary = 2 * BASE_UNIT_SIZE;
            break;
        default: // error
            console.log("L Tetromino orientation error");
    }
}
// "S" Tetromino
function selectSTetromino(orientation) {
    switch(orientation) {
        case 1: // vertical
        case 3: // vertical
            gamePiece.template = [
                [gamePiece.xPosition, gamePiece.yPosition - BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition + BASE_UNIT_SIZE, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition + BASE_UNIT_SIZE, gamePiece.yPosition + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE]
            ]
            gamePiece.leftBoundary = 0;
            gamePiece.rightBoundary = 2 * BASE_UNIT_SIZE;
            break;
        case 2: // horizontal
        case 4: // horizontal
            gamePiece.template = [
                [gamePiece.xPosition, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition + BASE_UNIT_SIZE, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition, gamePiece.yPosition + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition - BASE_UNIT_SIZE, gamePiece.yPosition + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE]
            ]
            gamePiece.leftBoundary = - BASE_UNIT_SIZE;
            gamePiece.rightBoundary = 2 * BASE_UNIT_SIZE;
            break;
        default: // error
            console.log("S Tetromino orientation error");
    }
}
// "Z" Tetromino
function selectZTetromino(orientation) {
    switch(orientation) {
        case 1: // horizontal
        case 3: // horizontal
            gamePiece.template = [
                [gamePiece.xPosition - BASE_UNIT_SIZE, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition, gamePiece.yPosition + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition + BASE_UNIT_SIZE, gamePiece.yPosition + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE]
            ]
            gamePiece.leftBoundary = - BASE_UNIT_SIZE;
            gamePiece.rightBoundary = 2 * BASE_UNIT_SIZE;
            break;
        case 2: // vertical
        case 4: // vertical
            gamePiece.template = [
                [gamePiece.xPosition, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition + BASE_UNIT_SIZE, gamePiece.yPosition, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition + BASE_UNIT_SIZE, gamePiece.yPosition - BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE],
                [gamePiece.xPosition, gamePiece.yPosition + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE]
            ]
            gamePiece.leftBoundary = 0;
            gamePiece.rightBoundary = 2 * BASE_UNIT_SIZE;
            break;
        default: // error
            console.log("Z Tetromino orientation error");
    }
}


// Debug testing functionality
//-------------------------------------------------------------------------

if (DEBUG == true) {
    fallSpeed = 0;
}

function debugHelper() {
    if (DEBUG == true) {
        console.log("Game piece X, Y coords: " + gamePiece.xPosition + ", " + gamePiece.yPosition);
    }
}
