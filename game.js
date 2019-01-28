// Initialization
//--------------------------------------------------------------------------------

var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var baseUnitSize = 40; // Tetromino block size in pixels, this value scales everything
const FPS = 30; // Frames per second
const TETROMINOS = ["I", "O", "T", "S", "Z", "J", "L"];
const DEBUG = false; // Enable testing functionality (read: cheats)

// Make canvas size scale with piece size, all functionality retained across all gameboard sizes as well
var width = 10;
var height = 20;
canvas.width = baseUnitSize * width;
canvas.height = baseUnitSize * height;

// The playable piece, declared as object literal with placeholder attributes
var gamePiece = {
    xPosition : canvas.width / 2,
    yPosition : 0,
    orientation : 1,
    type : "I",
    color : "black",
    leftBoundary : 0,
    rightBoundary : 0,
    updateTemplate : function() {selectGamePiece(gamePiece, gamePiece.orientation, gamePiece.type)},
    template : [
        [], // each element is an array
        [], // of values which represent
        [], // the coordinates of each square
        []  // that make the current tetromino
    ]
};

// The future playable piece, declared as object literal with placeholder attributes
var futurePiece = {
    xPosition : canvas.width - (3 * baseUnitSize),
    yPosition : 2 * baseUnitSize,
    orientation : 1,
    type : "I",
    color : "black",
    updateTemplate : function() {selectGamePiece(futurePiece, futurePiece.orientation, futurePiece.type)},
    template : [
        [], // each element is an array
        [], // of values which represent
        [], // the coordinates of each square
        []  // that make the current tetromino
    ]
};


// Colors and Themes
//--------------------------------------------------------------------------------
var colors = ["red", "green", "blue", "purple", "yellow", "orange", "pink"];

// const THEME_99 = ["", "", "", "", ""]; copy paste for adding new theme

// Array to feed randomTheme();
themes = [
    ["ED6A5A", "F4F1BB", "9BC1BC", "7D7C84", "E6EBE0"], // theme 1
    ["FBF5F3", "522B47", "7B0828", "7D7C84", "0F0E0E"], // theme 2
    ["FF715B", "522B47", "FFFFFF", "7D7C84", "1EA896"], // theme 3
    ["F4E76E", "F7FE72", "8FF7A7", "7D7C84", "51BBFE"], // theme 4
    ["FFEEF2", "FFE4F3", "FFC8FB", "7D7C84", "FF92C2"], // theme 5
    ["3D5A80", "98C1D9", "E0FBFC", "EE6C4D", "293241"], // theme 6
    ["D8A47F", "EF8354", "EE4B6A", "DF3B57", "0F7173"], // theme 7
    ["725752", "878E88", "96C0B7", "D4DFC7", "FEF6C9"], // theme 8
    ["DBF4AD", "A9E190", "CDC776", "A5AA52", "767522"], // theme 9
    ["EAF2E3", "61E8E1", "F25757", "F2E863", "F2CD60"], // theme 10
];

// Load random theme
function randomTheme() {
    colors = themes[Math.floor(Math.random() * themes.length)];
}


// Main game loop
//---------------------------------------------------------------------------------

var gameState = 1;

// Canvas rendering
window.onload = function() {
    randomTheme();
    addToQueue(3);
    setFuturePiece();
    newRound();
    setInterval(function() {
        if (gameState == 1) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            gamePiece.updateTemplate(); // required because gamePiece.template does not dynamically update with xPosition and yPosition
            detectCollision();
            gravity();
            drawGamePiece();
            drawNextPiece();
            drawFallenPieces();
            drawStats();
        }
        else if (gameState == 0) {
            drawStats();
            drawGameOver();
        }
    }, 1000/FPS)
}

// Scoring and loss conditions
//---------------------------------------------------------------------------------

// Player stats and scorekeeping
var playerScore = 0

// Render player stats and score
function drawStats() {
    context.font = (baseUnitSize / 2) + "px Monaco";
    context.fillStyle = "555";
    context.textAlign = "left";
    context.fillText("Score: " + playerScore, baseUnitSize, baseUnitSize);
}

// Render game over screen
function drawGameOver() {
    context.font = (baseUnitSize / 2) + "px Monaco";
    context.fillStyle = "555";
    context.textAlign = "center";
    context.fillText("GAME OVER", (canvas.width / 2), (canvas.height / 4));
    context.fillText("Refresh page to play again", (canvas.width / 2), (canvas.height / 3));
}

// Assign points for clearing rows, bonus points for clearning more than 1 row at once
function givePoints(rowsCleared) {
    if (rowsCleared == 1) {
        playerScore += 10;
    }
    else {
        playerScore += 20 * rowsCleared;
    }
}

// Loss condition
function checkLoss() {
    for (i = 0; i < 4; i++) {
        if (gamePiece.template[i][1] <= 0) {
            // Game over!
            gameState = 0;
        }
    }
}


// Functionality
//---------------------------------------------------------------------------------

// The queue for pieces to be played
var futurePieces = [];

// Populate queue with x pieces
function addToQueue(numberOfPieces) {
    let piece = {};
    for (let i = 0; i < numberOfPieces; i++) {
        piece.orientation = Math.floor((Math.random() * 4) + 1);
        piece.type = TETROMINOS[Math.floor(Math.random() * TETROMINOS.length)];
        piece.color = Math.floor(Math.random() * colors.length);
        futurePieces.push(piece);
        piece = {};
    }
}

// Load attributes from queue into next piece
function setFuturePiece() {
    futurePiece.orientation = futurePieces[0].orientation;
    futurePiece.type = futurePieces[0].type;
    futurePiece.color = futurePieces[0].color;
    futurePiece.updateTemplate();
    futurePieces.shift();
}

var fallSpeed = 1; // base units per second

// Make game piece fall down
function gravity() {
    if (gamePiece.yPosition < canvas.height) {
        gamePiece.yPosition += fallSpeed * baseUnitSize / (1000 / FPS);
    }
}

// Render playable tetromino
function drawGamePiece() {
    for (let i = 0; i < 4; i++) {
        context.beginPath();
        context.fillStyle = colors[gamePiece.color];
        context.lineWidth = baseUnitSize / 10;
        context.strokeStyle = "black";
        context.rect(gamePiece.template[i][0], gamePiece.template[i][1], baseUnitSize, baseUnitSize);
        context.fill();
        context.stroke();
    }
}

// Render next tetromino
function drawNextPiece() {
    for (let i = 0; i < 4; i++) {
        context.beginPath();
        context.fillStyle = colors[futurePiece.color];
        context.lineWidth = baseUnitSize / 10;
        context.strokeStyle = "black";
        context.rect(futurePiece.template[i][0], futurePiece.template[i][1], baseUnitSize, baseUnitSize);
        context.fill();
        context.stroke();
    }
}

// Render fallen tetrominos
function drawFallenPieces() {
    for (let i = 0; i < fallenPieces.length; i++) {
        context.beginPath();
        context.fillStyle = colors[fallenPieces[i][2]];
        context.lineWidth = baseUnitSize / 10;
        context.strokeStyle = "black";
        context.rect(fallenPieces[i][0], fallenPieces[i][1], baseUnitSize, baseUnitSize);
        context.fill();
        context.stroke();
    }
}

// Set up a new round
function newRound() {
    fallSpeed = 1;
    allowDown = true;
    newGamePiece();
    setFuturePiece();
    addToQueue(1);
}

// Grab a new tetromino from the queue and assign new next piece
function newGamePiece() {
    gamePiece.xPosition = canvas.width / 2;
    gamePiece.yPosition = - 3 * baseUnitSize;
    gamePiece.orientation = futurePiece.orientation;
    gamePiece.type = futurePiece.type;
    gamePiece.color = futurePiece.color;
    gamePiece.updateTemplate();
}

// Collision detection helper function, prevents fallthroughs
function willCollide() {
    for (let i = 0; i < 4; i++) {
        if (gamePiece.template[i][1] + 2 * baseUnitSize >= canvas.height) {
            if (fallSpeed >= 10) {
                fallSpeed /= 10;
            }
            allowDown = false;
        }
        for (let j = 0; j < fallenPieces.length; j++) {
            if (gamePiece.template[i][0] == fallenPieces[j][0] && 
                gamePiece.template[i][1] + 2 * baseUnitSize >= fallenPieces[j][1]) {
                    if (fallSpeed >= 10) {
                        fallSpeed /= 10;
                    }
                    allowDown = false;
            }
        }
    }
}

// Collision detection
// Consider hitboxes of playable tetromino subsquares as bottom left corner points
// Consider hitboxes of fallen tetromino subsquares as top left corner points
// Compare for match, this function has trouble at high speed without willCollide();
function detectCollision() {
    willCollide();
    for (let i = 0; i < 4; i++) {
        if (gamePiece.template[i][1] + baseUnitSize + baseUnitSize / 10 >= canvas.height) {
            alignGamePiece(gamePiece.template[i][1] + baseUnitSize, canvas.height);
            saveToFallen();
            detectCompleteRows();
            newRound();
            return;
        }
        for (let j = 0; j < fallenPieces.length; j++) {
            if (gamePiece.template[i][0] == fallenPieces[j][0] && 
                gamePiece.template[i][1] + baseUnitSize + baseUnitSize / 10 >= fallenPieces[j][1]) {
                    alignGamePiece(gamePiece.template[i][1] + baseUnitSize, fallenPieces[j][1]);
                    checkLoss();
                    saveToFallen();
                    detectCompleteRows();
                    newRound();
                    return;
            }
        }
    }  
}

// Check for full rows by top left corner of block, recursively

var rowsCleared = 0;

function detectCompleteRows() {
    snapToGrid();
    let totalPossible = canvas.width / baseUnitSize;
    let totalBlockCount = 0;
    for (let i = 0; i < canvas.height; i += baseUnitSize) { // start at the top and go down row by row
        totalBlockCount = 0;
        for (let j = 0; j < canvas.width; j += baseUnitSize) { // check each row from left to right
            for (let k = 0; k < fallenPieces.length; k++) { // look at each fallen block
                if (fallenPieces[k][1] == i && 
                    fallenPieces[k][0] == j) { // count how many blocks are in the row
                        totalBlockCount ++;
                }
            }
            if (totalBlockCount >= totalPossible) {
                clearRow(i);
                shiftRowsDown(i);
                rowsCleared++;
                detectCompleteRows();
                return;
            }
        }
    }
    givePoints(rowsCleared);
    rowsCleared = 0;
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
            fallenPieces[i][1] += baseUnitSize;
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
            if (fallenPieces[i][j] % baseUnitSize == 0) {
                // pass
            }
            else if (fallenPieces[i][j] % baseUnitSize < baseUnitSize / 2) {
                fallenPieces[i][j] -= fallenPieces[i][j] % baseUnitSize;
            }
            else {
                fallenPieces[i][j] += baseUnitSize - fallenPieces[i][j] % baseUnitSize;
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
            gamePiece.xPosition -= baseUnitSize;
        }
    }
    else if (direction == "RIGHT") {
        if (gamePiece.xPosition + gamePiece.rightBoundary < canvas.width) {
            gamePiece.xPosition += baseUnitSize;
        }
    }
    else if (direction == "DOWN") {
        if (gamePiece.yPosition + baseUnitSize < canvas.height && allowDown == true) {
            gamePiece.yPosition += baseUnitSize;
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
            gamePiece.xPosition -= baseUnitSize;
        }
        else if (event.keyCode == 71) {
            // G key
            gamePiece.xPosition += baseUnitSize;
        }
        else if (event.keyCode == 82) {
            // R key
            gamePiece.yPosition -= baseUnitSize;
        }
        else if (event.keyCode == 70) {
            // F key
            gamePiece.yPosition += baseUnitSize;
        }
    }
}


// Selectors for retreiving piece template formulas and boundaries
//-------------------------------------------------------------------------

// Access the correct template
function selectGamePiece(target, orientation, type) {
    switch(type) {
        case "I":
            selectITetromino(target, orientation);
            break;
        case "O":
            selectOTetromino(target, orientation);
            break;
        case "T":
            selectTTetromino(target, orientation);
            break;
        case "S":
            selectSTetromino(target, orientation);
            break;
        case "Z":
            selectZTetromino(target, orientation);
            break;
        case "J":
            selectJTetromino(target, orientation);
            break;
        case "L":
            selectLTetromino(target, orientation);
            break;
        default: // error
            console.log("Tetromino type error");
    }
    // Bring game piece within boundaries after calling template
    if (gamePiece.xPosition + gamePiece.leftBoundary < 0) {
        gamePiece.xPosition += baseUnitSize;
    }
    else if (gamePiece.xPosition + gamePiece.rightBoundary > canvas.width) {
        gamePiece.xPosition -= baseUnitSize;
    }
}


// "I" Tetromino
function selectITetromino(target, orientation) {
    switch(orientation) {
        case 1: //vertical
        case 3: //vertical
            target.template = [
                [target.xPosition, target.yPosition - baseUnitSize],
                [target.xPosition, target.yPosition],
                [target.xPosition, target.yPosition + baseUnitSize],
                [target.xPosition, target.yPosition + 2 * baseUnitSize]
            ];
            target.leftBoundary = 0;
            target.rightBoundary = baseUnitSize;
            break;
        case 2: //horizontal
        case 4: //horizontal
            target.template = [
                [target.xPosition - baseUnitSize, target.yPosition],
                [target.xPosition, target.yPosition],
                [target.xPosition + baseUnitSize, target.yPosition],
                [target.xPosition + 2 * baseUnitSize, target.yPosition]
            ];
            target.leftBoundary = - baseUnitSize;
            target.rightBoundary = 3 * baseUnitSize;
            break;
        default: // error
            console.log("I Tetromino orientation error")
    }
}
// "O" Tetromino
function selectOTetromino(target, orientation) {
    switch(orientation) {
        case 1: // it's
        case 2: // a
        case 3: // square
        case 4: // !
            target.template = [
                [target.xPosition, target.yPosition],
                [target.xPosition, target.yPosition + baseUnitSize],
                [target.xPosition + baseUnitSize, target.yPosition],
                [target.xPosition + baseUnitSize, target.yPosition + baseUnitSize]
            ]
            target.leftBoundary = 0;
            target.rightBoundary = 2 * baseUnitSize;
            break;
        default: // error
            console.log("O Tetromino orientation error");
    }   
}
// "T" Tetromino
function selectTTetromino(target, orientation) {
    switch(orientation) {
        case 1: // facing down
            target.template = [
                [target.xPosition, target.yPosition],
                [target.xPosition - baseUnitSize, target.yPosition],
                [target.xPosition + baseUnitSize, target.yPosition],
                [target.xPosition, target.yPosition + baseUnitSize]
            ]
            target.leftBoundary = - baseUnitSize;
            target.rightBoundary = 2 * baseUnitSize;
            break;
        case 2: // facing left
            target.template = [
                [target.xPosition, target.yPosition - baseUnitSize],
                [target.xPosition, target.yPosition],
                [target.xPosition, target.yPosition + baseUnitSize],
                [target.xPosition - baseUnitSize, target.yPosition]
            ]
            target.leftBoundary = - baseUnitSize;
            target.rightBoundary = baseUnitSize;
            break;
        case 3: // facing up
            target.template = [
                [target.xPosition - baseUnitSize, target.yPosition],
                [target.xPosition, target.yPosition],
                [target.xPosition + baseUnitSize, target.yPosition],
                [target.xPosition, target.yPosition - baseUnitSize]
            ]
            target.leftBoundary = - baseUnitSize;
            target.rightBoundary = 2 * baseUnitSize;
            break;
        case 4: // facing right
            target.template = [
                [target.xPosition, target.yPosition - baseUnitSize],
                [target.xPosition, target.yPosition],
                [target.xPosition, target.yPosition + baseUnitSize],
                [target.xPosition + baseUnitSize, target.yPosition]
            ]
            target.leftBoundary = 0;
            target.rightBoundary = 2 * baseUnitSize;
            break;
        default: // error
            console.log("T Tetromino orientation error");
    }
}
// "J" Tetromino
function selectJTetromino(target, orientation) {
    switch(orientation) {
        case 1: // facing left
            target.template = [
                [target.xPosition - baseUnitSize, target.yPosition],
                [target.xPosition, target.yPosition],
                [target.xPosition + baseUnitSize, target.yPosition],
                [target.xPosition + baseUnitSize, target.yPosition + baseUnitSize]
            ]
            target.leftBoundary = - baseUnitSize;
            target.rightBoundary = 2 * baseUnitSize;
            break;
        case 2: // facing up
            target.template = [
                [target.xPosition, target.yPosition - baseUnitSize],
                [target.xPosition, target.yPosition],
                [target.xPosition, target.yPosition + baseUnitSize],
                [target.xPosition - baseUnitSize, target.yPosition + baseUnitSize]
            ]
            target.leftBoundary = - baseUnitSize;
            target.rightBoundary = baseUnitSize;
            break;
        case 3: // facing right
            target.template = [
                [target.xPosition - baseUnitSize, target.yPosition - baseUnitSize],
                [target.xPosition - baseUnitSize, target.yPosition],
                [target.xPosition, target.yPosition],
                [target.xPosition + baseUnitSize, target.yPosition]
            ]
            target.leftBoundary = - baseUnitSize;
            target.rightBoundary = 2 * baseUnitSize;
            break;
        case 4: // facing down
            target.template = [
                [target.xPosition, target.yPosition - baseUnitSize],
                [target.xPosition + baseUnitSize, target.yPosition - baseUnitSize],
                [target.xPosition, target.yPosition],
                [target.xPosition, target.yPosition + baseUnitSize]
            ]
            target.leftBoundary = 0;
            target.rightBoundary = 2 * baseUnitSize;
            break;
        default: // error
            console.log("J Tetromino orientation error");
    }
}
// "L" Tetromino
function selectLTetromino(target, orientation) {
    switch(orientation) {
        case 1: // facing right
            target.template = [
                [target.xPosition - baseUnitSize, target.yPosition],
                [target.xPosition, target.yPosition],
                [target.xPosition + baseUnitSize, target.yPosition],
                [target.xPosition - baseUnitSize, target.yPosition + baseUnitSize]
            ]
            target.leftBoundary = - baseUnitSize;
            target.rightBoundary = 2 * baseUnitSize;
            break;
        case 2: // facing down
            target.template = [
                [target.xPosition - baseUnitSize, target.yPosition - baseUnitSize],
                [target.xPosition, target.yPosition - baseUnitSize],
                [target.xPosition, target.yPosition],
                [target.xPosition, target.yPosition + baseUnitSize]
            ]
            target.leftBoundary = - baseUnitSize;
            target.rightBoundary = baseUnitSize;
            break;
        case 3: // facing left
            target.template = [
                [target.xPosition - baseUnitSize, target.yPosition],
                [target.xPosition, target.yPosition],
                [target.xPosition + baseUnitSize, target.yPosition],
                [target.xPosition + baseUnitSize, target.yPosition - baseUnitSize]
            ]
            target.leftBoundary = - baseUnitSize;
            target.rightBoundary = 2 * baseUnitSize;
            break;
        case 4: // facing up
            target.template = [
                [target.xPosition, target.yPosition - baseUnitSize],
                [target.xPosition, target.yPosition],
                [target.xPosition, target.yPosition + baseUnitSize],
                [target.xPosition + baseUnitSize, target.yPosition + baseUnitSize]
            ]
            target.leftBoundary = 0;
            target.rightBoundary = 2 * baseUnitSize;
            break;
        default: // error
            console.log("L Tetromino orientation error");
    }
}
// "S" Tetromino
function selectSTetromino(target, orientation) {
    switch(orientation) {
        case 1: // vertical
        case 3: // vertical
            target.template = [
                [target.xPosition, target.yPosition - baseUnitSize],
                [target.xPosition, target.yPosition],
                [target.xPosition + baseUnitSize, target.yPosition],
                [target.xPosition + baseUnitSize, target.yPosition + baseUnitSize]
            ]
            target.leftBoundary = 0;
            target.rightBoundary = 2 * baseUnitSize;
            break;
        case 2: // horizontal
        case 4: // horizontal
            target.template = [
                [target.xPosition, target.yPosition],
                [target.xPosition + baseUnitSize, target.yPosition],
                [target.xPosition, target.yPosition + baseUnitSize],
                [target.xPosition - baseUnitSize, target.yPosition + baseUnitSize]
            ]
            target.leftBoundary = - baseUnitSize;
            target.rightBoundary = 2 * baseUnitSize;
            break;
        default: // error
            console.log("S Tetromino orientation error");
    }
}
// "Z" Tetromino
function selectZTetromino(target, orientation) {
    switch(orientation) {
        case 1: // horizontal
        case 3: // horizontal
            target.template = [
                [target.xPosition - baseUnitSize, target.yPosition],
                [target.xPosition, target.yPosition],
                [target.xPosition, target.yPosition + baseUnitSize],
                [target.xPosition + baseUnitSize, target.yPosition + baseUnitSize]
            ]
            target.leftBoundary = - baseUnitSize;
            target.rightBoundary = 2 * baseUnitSize;
            break;
        case 2: // vertical
        case 4: // vertical
            target.template = [
                [target.xPosition, target.yPosition],
                [target.xPosition + baseUnitSize, target.yPosition],
                [target.xPosition + baseUnitSize, target.yPosition - baseUnitSize],
                [target.xPosition, target.yPosition + baseUnitSize]
            ]
            target.leftBoundary = 0;
            target.rightBoundary = 2 * baseUnitSize;
            break;
        default: // error
            console.log("Z Tetromino orientation error");
    }
}


// Debug testing functionality
//-------------------------------------------------------------------------

if (DEBUG == true) {
    // Reserved
}

function debugHelper() {
    if (DEBUG == true) {
        console.log("Game piece X, Y coords: " + gamePiece.xPosition + ", " + gamePiece.yPosition);
    }
}