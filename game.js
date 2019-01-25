var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

const BASE_UNIT_SIZE = 20; // Tetromino block size
const FPS = 30; // Frames per second
const DEBUG = true; // Enable testing functionality (read: cheats)

// Canvas rendering
window.onload = function() {
    setInterval(function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawGamePiece(gamePiece.xPosition, gamePiece.yPosition, gamePiece.orientation, gamePiece.type);
        // reserved for drawing fallen pieces
        // reserved for checking horizontal boundaries
        // reserved for collision detection
    }, 1000/FPS)
}

// The playable piece, declared as object literal
var gamePiece = {
    xPosition : 200,
    yPosition : 200,
    orientation : 1,
    type : "T"
};

// Keyboard event listeners and friends
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
    else { // Other key press
        console.log("Unmapped key press detected " + event.keycode);
    }
    if (DEBUG == true) {
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
    }
}

// Move piece
function moveGamePiece(direction) {
    if (direction == "LEFT") {
        // note to self, add bounds check
        gamePiece.xPosition -= 20;
    }
    else if (direction == "RIGHT") {
        // note to self, add bounds check
        gamePiece.xPosition += 20;
    }
    else {
        console.log("Unknown game piece move direction: " + direction);
    }
}

// Set piece orientation
function rotateGamePiece(direction) {
    if (direction == "CLOCKWISE"){
        // The next line wouldn't work as "if (gamePiece.orientation in [1, 2, 3])", why?
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
}


// Debug testing functionality
//-------------------------------------------------------------------------
if (DEBUG == true) {
    // Reserved
}



// Selectors for choosing piece and orientation
//-------------------------------------------------------------------------

// Draw the playable piece
function drawGamePiece(x, y, orientation, type) {
    switch(type) {
        case "I":
            drawITetromino(x, y, orientation);
            break;
        case "O":
            drawOTetromino(x, y, orientation);
            break;
        case "T":
            drawTTetromino(x, y, orientation);
            break;
        case "S":
            drawSTetromino(x, y, orientation);
            break;
        case "Z":
            drawZTetromino(x, y, orientation);
            break;
        case "J":
            drawJTetromino(x, y, orientation);
            break;
        case "L":
            drawLTetromino(x, y, orientation);
            break;
        default: // error
            console.log("Tetromino type error");
    }

}


// "I" Tetromino
function drawITetromino(x, y, orientation) {
    switch(orientation) {
        case 1: //vertical
        case 3: //vertical
            context.fillRect(x, y - BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x, y + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x, y + 2 * BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            break;
        case 2: //horizontal
        case 4: //horizontal
            context.fillRect(x - BASE_UNIT_SIZE, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x + BASE_UNIT_SIZE, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x + 2 * BASE_UNIT_SIZE, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            break;
        default: // error
            console.log("I Tetromino orientation error")
    }
}
// "O" Tetromino
function drawOTetromino(x, y, orientation) {
    switch(orientation) {
        case 1: // it's
        case 2: // a
        case 3: // square
        case 4: // !
            context.fillRect(x, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x, y + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x + BASE_UNIT_SIZE, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x + BASE_UNIT_SIZE, y + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            break;
        default: // error
            console.log("O Tetromino orientation error");
    }   
}
// "T" Tetromino
function drawTTetromino(x, y, orientation) {
    switch(orientation) {
        case 1: // facing down
            context.fillRect(x, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x - BASE_UNIT_SIZE, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x + BASE_UNIT_SIZE, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x, y + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            break;
        case 2: // facing left
            context.fillRect(x, y - BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x, y + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x - BASE_UNIT_SIZE, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            break;
        case 3: // facing up
            context.fillRect(x - BASE_UNIT_SIZE, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x + BASE_UNIT_SIZE, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x, y - BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            break;
        case 4: // facing right
            context.fillRect(x, y - BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x, y + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x + BASE_UNIT_SIZE, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            break;
        default: // error
            console.log("T Tetromino orientation error");
    
    }
}
// "J" Tetromino
function drawJTetromino(x, y, orientation) {
    switch(orientation) {
        case 1: // facing left
            context.fillRect(x - BASE_UNIT_SIZE, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x + BASE_UNIT_SIZE, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x + BASE_UNIT_SIZE, y + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            break;
        case 2: // facing up
            context.fillRect(x, y - BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x, y + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x - BASE_UNIT_SIZE, y + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            break;
        case 3: // facing right
            context.fillRect(x - BASE_UNIT_SIZE, y - BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x - BASE_UNIT_SIZE, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x + BASE_UNIT_SIZE, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            break;
        case 4: // facing down
            context.fillRect(x, y - BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x + BASE_UNIT_SIZE, y - BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x, y + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            break;
        default: // error
            console.log("J Tetromino orientation error");
    }
}
// "L" Tetromino
function drawLTetromino(x, y, orientation) {
    switch(orientation) {
        case 1: // facing right
            context.fillRect(x - BASE_UNIT_SIZE, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x + BASE_UNIT_SIZE, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x - BASE_UNIT_SIZE, y + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            break;
        case 2: // facing down
            context.fillRect(x - BASE_UNIT_SIZE, y - BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x, y - BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x, y + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            break;
        case 3: // facing left
            context.fillRect(x - BASE_UNIT_SIZE, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x + BASE_UNIT_SIZE, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x + BASE_UNIT_SIZE, y - BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            break;
        case 4: // facing up
            context.fillRect(x, y - BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x, y + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x + BASE_UNIT_SIZE, y + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            break;
        default: // error
            console.log("L Tetromino orientation error");
    }
}
// "S" Tetromino
function drawSTetromino(x, y, orientation) {
    switch(orientation) {
        case 1: // vertical
        case 3: // vertical
            context.fillRect(x, y - BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x + BASE_UNIT_SIZE, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x + BASE_UNIT_SIZE, y + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            break;
        case 2: // horizontal
        case 4: // horizontal
            context.fillRect(x, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x + BASE_UNIT_SIZE, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x, y + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x - BASE_UNIT_SIZE, y + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            break;
        default: // error
            console.log("S Tetromino orientation error");
    }
}
// "Z" Tetromino
function drawZTetromino(x, y, orientation) {
    switch(orientation) {
        case 1: // horizontal
        case 3: // horizontal
            context.fillRect(x - BASE_UNIT_SIZE, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x, y + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x + BASE_UNIT_SIZE, y + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            break;
        case 2: // vertical
        case 4: // vertical
            context.fillRect(x, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x + BASE_UNIT_SIZE, y, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x + BASE_UNIT_SIZE, y - BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            context.fillRect(x, y + BASE_UNIT_SIZE, BASE_UNIT_SIZE, BASE_UNIT_SIZE);
            break;
        default: // error
            console.log("Z Tetromino orientation error");

    }
}

