// Initialization
//--------------------------------------------------------------------------------

var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

const BASE_UNIT_SIZE = 20; // Tetromino block size, pixels
const FPS = 30; // Frames per second
const DEBUG = false; // Enable testing functionality (read: cheats)


// Main game loop
//--------------------------------------------------------------------------------

// Canvas rendering
window.onload = function() {
    setInterval(function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        gamePiece.updateTemplate(); // required because gamePiece.template does not dynamically update with xPosition and yPosition
        gameEngine();
        drawGamePiece();
        // reserved for drawing fallen pieces
        // reserved for drawing game stats
        
    }, 1000/FPS)
}


// Functionality
//------------------------------------------------------------------------------

var fallSpeed = 20; // pixels per second

// Game engine
function gameEngine() {
    if (gamePiece.yPosition < canvas.height) {
        gamePiece.yPosition += fallSpeed/(1000/FPS);
    }
}

function drawGamePiece() {
    for (let i = 0; i < gamePiece.template.length; i++) {
        context.fillRect(gamePiece.template[i][0], gamePiece.template[i][1], gamePiece.template[i][2], gamePiece.template[i][3]);
    }
}

// The playable piece, declared as object literal with placeholder attributes
var gamePiece = {
    xPosition : 200,
    yPosition : 200,
    orientation : 1,
    type : "I",
    leftBoundary : 0,
    rightBoundary : 0,
    updateTemplate : function() {selectGamePiece(gamePiece.orientation, gamePiece.type)},
    template : [[], ,[] ,[], []]
};

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
            console.log("Unknown counterclockwise rotation " + gamePiece.orientation);
        }
    }
    else {
        console.log("Unknown rotation direction: " + direction);
    }
    selectGamePiece(gamePiece.orientation, gamePiece.type);
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
        // move down and test for collision, bottom boundary
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
            gamePiece.type = "I";
        }
        else if (event.keyCode == 79) {
            gamePiece.type = "O";
        }
        else if (event.keyCode == 84) {
            gamePiece.type = "T";
        }
        else if (event.keyCode == 83) {
            gamePiece.type = "S";
        }
        else if (event.keyCode == 90) {
            gamePiece.type = "Z";
        }
        else if (event.keyCode == 74) {
            gamePiece.type = "J";
        }
        else if (event.keyCode == 76) {
            gamePiece.type = "L";
        }
        // RDFG movement pad
        else if (event.keyCode == 68) {
            gamePiece.xPosition -= BASE_UNIT_SIZE;
        }
        else if (event.keyCode == 71) {
            gamePiece.xPosition += BASE_UNIT_SIZE;
        }
        else if (event.keyCode == 82) {
            gamePiece.yPosition -= BASE_UNIT_SIZE;
        }
        else if (event.keyCode == 70) {
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
