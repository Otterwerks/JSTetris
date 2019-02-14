// Initialization
//--------------------------------------------------------------------------------
var main = document.getElementById("main");
var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");
var sideCanvas = document.getElementById("statCanvas");
var sideContext = sideCanvas.getContext("2d");

var baseUnitSize = 40; // Tetromino block size in pixels, this value scales everything
const FPS = 30; // Frames per second, game is tuned for 30
const TETROMINOS = ["I", "O", "T", "S", "Z", "J", "L"];
const opacitySpectrum = ["00", "08", "10", "18", "20", "28", "30", "38", "40", "48", "50", "58", "60", "68", "70", "78", "80", "88", "90", "98", "A0", "A8", "B0", "B8", "C0", "C8", "D0", "D8", "E0", "E8", "F0", "F8", "FF"];
const DEBUG = false; // Enable testing functionality (read: cheats)

var width = 10;
var height = 20;

function setSize() {
    if (window.innerHeight >= window.innerWidth) {
        baseUnitSize = Math.floor(window.innerWidth * 0.9 / (width + 6));
    }
    else if (window.innerHeight < window.innerWidth) {
        baseUnitSize = Math.floor(window.innerHeight * 0.9 / height);
    }

    let gameOffset = (window.innerWidth / 2) - (((width + 6) * baseUnitSize / 2)) - baseUnitSize / 4;

    canvas.width = baseUnitSize * width;
    canvas.height = baseUnitSize * height;
    canvas.style.paddingRight = "0px";
    canvas.style.position = "absolute";
    canvas.style.left = gameOffset + "px";
    canvas.style.top = baseUnitSize + "px";

    sideCanvas.width = baseUnitSize * 6;
    sideCanvas.height = canvas.height;
    sideCanvas.style.paddingLeft = "0px";
    sideCanvas.style.position = "absolute";
    sideCanvas.style.left = ((gameOffset + canvas.width) + (baseUnitSize / 4))  + "px";
    sideCanvas.style.top = baseUnitSize + "px";

    futurePiece.xPosition = 2 * baseUnitSize;
    futurePiece.yPosition = 3 * baseUnitSize;
    initializeLayout();
}

function initializeLayout() {
    canvas.style.display = "block";
    canvas.style.backgroundColor = "#FFFFFFAA";
    canvas.style.borderTopLeftRadius = (baseUnitSize / 4) + "px";
    canvas.style.borderBottomLeftRadius = (baseUnitSize / 4) + "px";
    canvas.style.borderWidth = (baseUnitSize / 4) + "px";
    canvas.style.borderRightWidth = (baseUnitSize / 8) + "px";
    canvas.style.borderTopStyle = "solid";
    canvas.style.borderLeftStyle = "solid";
    canvas.style.borderRightStyle = "solid";
    canvas.style.borderBottomStyle = "solid";
    sideCanvas.style.display = "block";
    sideCanvas.style.backgroundColor = "#FFFFFF66";
    sideCanvas.style.borderTopRightRadius = (baseUnitSize / 4) + "px";
    sideCanvas.style.borderBottomRightRadius = (baseUnitSize / 4) + "px";
    sideCanvas.style.borderWidth = (baseUnitSize / 4) + "px";
    sideCanvas.style.borderLeftWidth = (baseUnitSize / 8) + "px";
    sideCanvas.style.borderTopStyle = "solid";
    sideCanvas.style.borderLeftStyle = "solid";
    sideCanvas.style.borderRightStyle = "solid";
    sideCanvas.style.borderBottomStyle = "solid";
    main.style.backgroundColor = colors[0];
}

var gamePiece = {
    xPosition : canvas.width / 2,
    yPosition : 0,
    orientation : 1,
    type : "I",
    color : "black",
    leftBoundary : 0,
    rightBoundary : 0,
    updateTemplate : function() {selectGamePiece(gamePiece, gamePiece.orientation, gamePiece.type)},
    template : []
};

var futurePiece = {
    xPosition : canvas.width - (3 * baseUnitSize),
    yPosition : baseUnitSize + (baseUnitSize / 2),
    orientation : 1,
    type : "I",
    color : "black",
    updateTemplate : function() {selectGamePiece(futurePiece, futurePiece.orientation, futurePiece.type)},
    template : []
};

var shadowPiece = {
    xPosition : canvas.width / 2,
    yPosition : 0,
    updateTemplate : function() {selectGamePiece(shadowPiece, gamePiece.orientation, gamePiece.type)},
    template : []
};

function drawGrid() {
    for (i = 0; i <= canvas.width; i += baseUnitSize) {
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, canvas.height);
        context.lineWidth = baseUnitSize / 20;
        context.strokeStyle = gridColor;
        context.stroke();
    }
    for (i = 0; i <= canvas.height; i += baseUnitSize) {
        context.beginPath();
        context.moveTo(0, i);
        context.lineTo(canvas.width, i);
        context.lineWidth = baseUnitSize / 20;
        context.strokeStyle = gridColor;
        context.stroke();
    }
}

function drawFrame() {
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(canvas.width, 0);
    context.lineTo(canvas.width, canvas.height);
    context.lineTo(0, canvas.height);
    context.lineTo(0, 0);
    context.lineWidth = baseUnitSize / 10;
    context.strokeStyle = "black";
    context.stroke();

    sideContext.beginPath();
    sideContext.moveTo(0, 0);
    sideContext.lineTo(sideCanvas.width, 0);
    sideContext.lineTo(sideCanvas.width, sideCanvas.height);
    sideContext.lineTo(0, sideCanvas.height);
    sideContext.lineTo(0, 0);
    sideContext.lineWidth = baseUnitSize / 10;
    sideContext.strokeStyle = "black";
    sideContext.stroke();

    sideContext.beginPath();
    sideContext.moveTo(0, baseUnitSize * 7 - (sideBarSlideUpToken / 8.5 * baseUnitSize * 70 / (sideBarSlideUpToken + 10)));
    sideContext.lineTo(sideCanvas.width, baseUnitSize * 7 - (sideBarSlideUpToken / 8.5 * baseUnitSize * 70 / (sideBarSlideUpToken + 10)));
    sideContext.moveTo(0, baseUnitSize * 17);
    sideContext.lineTo(sideCanvas.width, baseUnitSize * 17);
    sideContext.lineWidth = baseUnitSize / 10;
    sideContext.strokeStyle = "black";
    sideContext.stroke();
}

function drawRightSlidePanel() {
    if (rightSlidePanelToken >= 0) {
        let panelLeftSide = sideCanvas.width - (rightSlidePanelToken / 30 * (40 / (rightSlidePanelToken + 10)) * sideCanvas.width);
        sideContext.beginPath();
        sideContext.moveTo(sideCanvas.width, baseUnitSize * 7);
        sideContext.lineTo(panelLeftSide, baseUnitSize * 7);
        sideContext.moveTo(panelLeftSide, baseUnitSize * 7);
        sideContext.lineTo(panelLeftSide, baseUnitSize * 17);
        sideContext.lineWidth = baseUnitSize / 10;
        sideContext.strokeStyle = "black";
        sideContext.stroke();
        sideContext.textAlign = "center";
        sideContext.fillStyle = "#555";
        sideContext.font = baseUnitSize / 1.5 + "px Monaco, monospace";
        sideContext.fillText("THANKS FOR", panelLeftSide + sideCanvas.width / 2, baseUnitSize * 9);
        sideContext.fillText("PLAYING!", panelLeftSide + sideCanvas.width / 2, baseUnitSize * 10);
        sideContext.font = baseUnitSize / 2 + "px Monaco, monospace";
        sideContext.fillText("Created by:", panelLeftSide + sideCanvas.width / 2, baseUnitSize * 13);
        sideContext.fillText("Sam Weber", panelLeftSide + sideCanvas.width / 2, baseUnitSize * 14);
        if (rightSlidePanelToken < 30) {
            rightSlidePanelToken++;
        }
    }
}

var splashToken = 0;

function drawInstructions() {
    context.fillStyle = "#333";
    context.textAlign = "center";
    context.font = baseUnitSize + "px Monaco, monospace";
    context.fillText("Tetro Game", canvas.width / 2, baseUnitSize * 2);
    context.textAlign = "left";
    context.font = baseUnitSize / 1.5 + "px Monaco, monospace";
    context.fillText("INSTRUCTIONS:", baseUnitSize, baseUnitSize * 4);
    context.textAlign = "center";
    context.font = baseUnitSize / 2 + "px Monaco, monospace";
    context.fillText("Keyboard Controls", canvas.width / 2, baseUnitSize * 5.5);
    context.textAlign = "left";
    context.font = baseUnitSize / 3 + "px Monaco, monospace";
    context.fillText("Move Piece: left/right/down arrow keys", baseUnitSize, baseUnitSize * 6.5);
    context.fillText("Rotate Piece: up arrow key", baseUnitSize, baseUnitSize * 7.5);
    context.fillText("Drop Piece: space bar", baseUnitSize, baseUnitSize * 8.5);
    context.textAlign = "center";
    context.font = baseUnitSize / 2 + "px Monaco, monospace";
    context.fillText("Touch Controls", canvas.width / 2, baseUnitSize * 9.5);
    context.textAlign = "left";
    context.font = baseUnitSize / 3 + "px Monaco, monospace";
    context.fillText("Move Piece: swipe left/right/down", baseUnitSize, baseUnitSize * 10.5);
    context.fillText("Rotate Piece: swipe up", baseUnitSize, baseUnitSize * 11.5);
    context.fillText("Drop Piece: long swipe down", baseUnitSize, baseUnitSize * 12.5);
    context.textAlign = "center";
    context.font = baseUnitSize / 2 + "px Monaco, monospace";
    context.fillText("GAME STARTING IN:", canvas.width / 2, baseUnitSize * 15);
    context.font = baseUnitSize + "px Monaco, monospace";
    context.fillText(Math.ceil((300 - splashToken) / FPS), canvas.width / 2, baseUnitSize * 17);
    context.font = baseUnitSize / 2 + "px Monaco, monospace";
    context.fillText("TAP OR CLICK", canvas.width / 2, baseUnitSize * 18);
    context.fillText("TO SKIP", canvas.width / 2, baseUnitSize * 19);
    if (splashToken == 300) {
        canvas.style.backgroundColor = "#EEE";
        sideCanvas.style.backgroundColor = "#FFFFFFAA";
        gameState = -3;
    }
    splashToken++;
}

function drawTetros() {
    gamePiece.xPosition = (sideCanvas.width / 2) + baseUnitSize / 2;
    let tetroColor = 0;
    for (i = 1; i < 8; i++) {
        
        gamePiece.yPosition = (i * 3.75 * baseUnitSize) - 2 * baseUnitSize;
        gamePiece.type = TETROMINOS[i - 1];
        gamePiece.updateTemplate();
        tetroColor++;
        if (tetroColor >= colors.length) {
            tetroColor = 0;
        }
        for (let j = 0; j < 4; j++) {
            sideContext.beginPath();
            sideContext.fillStyle = colors[tetroColor];
            sideContext.lineWidth = baseUnitSize / 20;
            sideContext.strokeStyle = "black";
            sideContext.rect(gamePiece.template[j][0] / 1.4, gamePiece.template[j][1] / 1.4, baseUnitSize / 1.4, baseUnitSize / 1.4);
            sideContext.fill();
            sideContext.stroke();
        }
    }
}

var fadeToBlackToken = 0;

function fadeToBlack() {
    context.fillStyle = "#000000" + opacitySpectrum[Math.round(fadeToBlackToken / 15 * opacitySpectrum.length)];
    context.fillRect(0, 0, canvas.width, canvas.height);
    sideContext.fillStyle = "#000000" + opacitySpectrum[Math.round(fadeToBlackToken / 15 * opacitySpectrum.length)];
    sideContext.fillRect(0, 0, sideCanvas.width, sideCanvas.height);
    if (fadeToBlackToken < 15) {
        fadeToBlackToken++;
    }
}

var fadeFromBlackToken = 15;

function fadeFromBlack() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    sideContext.clearRect(0, 0, sideCanvas.width, sideCanvas.height);
    context.fillStyle = "#000000" + opacitySpectrum[Math.round(fadeFromBlackToken / 15 * opacitySpectrum.length)];
    context.fillRect(0, 0, canvas.width, canvas.height);
    sideContext.fillStyle = "#000000" + opacitySpectrum[Math.round(fadeFromBlackToken / 15 * opacitySpectrum.length)];
    sideContext.fillRect(0, 0, sideCanvas.width, sideCanvas.height);
    if (fadeFromBlackToken > 0) {
        fadeFromBlackToken--;
    }
}


// Colors and Themes
//--------------------------------------------------------------------------------
var colors = ["red", "green", "blue", "purple", "yellow", "orange", "pink"];
var gridColor = "#AAA";

// const THEME_99 = ["", "", "", "", ""]; copy paste for adding new theme

var themes = [
    //["#ED6A5A", "#9BC1BC", "#F4F1BB", "#7D7C84", "#E6EBE0"], // theme 1 ([4] is too light)
    //["#FBF5F3", "#522B47", "#7B0828", "#7D7C84", "#0F0E0E"], // theme 2 
    //["#FF715B", "#522B47", "#FFFFFF", "#7D7C84", "#1EA896"], // theme 3
    //["#F4E76E", "#F7FE72", "#8FF7A7", "#7D7C84", "#51BBFE"], // theme 4
    ["#FFEEF2", "#FFE4F3", "#FFC8FB", "#7D7C84", "#FF92C2"], // theme 5 (pink theme) ++
    ["#3D5A80", "#98C1D9", "#E0FBFC", "#EE6C4D", "#293241"], // theme 6 ++
    ["#D8A47F", "#EF8354", "#AA4B6A", "#DF3B57", "#0F7173"], // theme 7
    //["#725752", "#878E88", "#96C0B7", "#D4DFC7", "#FEF6C9"], // theme 8
    //["#DBF4AD", "#A9E190", "#CDC776", "#A5AA52", "#767522"], // theme 9
    //["#EAF2E3", "#61E8E1", "#F25757", "#F2E863", "#F2CD60"], // theme 10
    //["#C1C1C1", "#2C4251", "#D16666", "#B6C649", "#FFFFFF"], // theme 11
    ["#2F4046", "#124559", "#598392", "#AEC3B0", "#83877B"], // theme 12 ++
    //["#012622", "#003B36", "#6C696E", "#E98A15", "#59114D"], // theme 13
    ["#DD6E42", "#E8DAB2", "#4F6D7A", "#C0D6DF", "#808080"], // theme 14
    ["#BEE9E8", "#62B6CB", "#1B4965", "#A6BFD1", "#5FA8D3"], // theme 15 (blue theme)
    ["#FFB997", "#F67E7D", "#843B62", "#211940", "#74546A"], // theme 16 (sunset theme) ++
    //["#FAA916", "#FBFFFE", "#6D676E", "#2F2F32", "#96031A"], // theme 17 ([1] is white)
    ["#BFB1CC", "#6C6E6C", "#60495A", "#3F3244", "#2F2235"], // theme 18 (purple theme) ++
    //["#171C55", "#74A4BC", "#B6D6CC", "#F1FEC6", "#A32515"], // theme 19
    //["#EEE0CB", "#BAA898", "#848586", "#C2847A", "#3B1719"], // theme 20
    ["#0FA3B1", "#777D75", "#EDDEA4", "#F7A072", "#FF9B42"], // theme 21 (beach theme) ++
    //["#4F4D53", "#5A435B", "#D1C3B4", "#A53860", "#47937B"], // theme 22
    ["#9D1C2D", "#B24628", "#2E294E", "#198C7F", "#B4C564"], // theme 23
    ["#387A84", "#99C8BE", "#DCE2C8", "#CC5600", "#F28A3C"], // theme 24 ++
    //["#3A2E39", "#B03B3C", "#1E555C", "#875644", "#F1C6A4"], // theme 25


    
];

var activeTheme = 0; 

function randomTheme() {
    let i = Math.floor(Math.random() * themes.length);
    colors = themes[i];
    activeTheme = i + 1;
}


// Main game loop
//---------------------------------------------------------------------------------

var gameState = -2;

window.onresize = function() {setSize()};

window.onload = function() {
    randomTheme();
    setSize();
    addToQueue(3);
    setFuturePiece();
    newRound();
    checkServerStatus();
    setInterval(function() {checkServerStatus()}, 30000);
    setInterval(function() {
        if (gameState == 1) { // Main Game
            context.clearRect(0, 0, canvas.width, canvas.height);
            sideContext.clearRect(0, 0, sideCanvas.width, sideCanvas.height);
            gamePiece.updateTemplate(); // required because gamePiece.template does not dynamically update with xPosition and yPosition
            detectCollision();
            gravity();
            drawGrid();
            drawFrame();
            drawShadowPiece();
            drawGamePiece();
            drawNextPiece();
            drawFallenPieces();
            drawStats();
            showNotifications();
        }
        else if (gameState == 0) { // Post Game
            context.clearRect(0, 0, canvas.width, canvas.height);
            sideContext.clearRect(0, 0, sideCanvas.width, sideCanvas.height);
            drawStats();
            drawFrame();
            drawNextPiece();
            drawRightSlidePanel();
            drawGameOver();
            drawLeaderboard();
            if (sideBarSlideUpToken < 60) {
                sideBarSlideUpToken++;
            }
        }
        else if (gameState == -1) { // Leaderboard/Scoring
            if (leaderboard != 0 && serverStatus.status == "Online") {
                checkNewHighScore();
            }
            gameState = 0;
            setTimeout(function() {rightSlidePanelToken = 0;}, 1000);
        }
        else if (gameState == -2) { // Splash
            context.clearRect(0, 0, canvas.width, canvas.height);
            drawInstructions();
            drawTetros();
        }
        else if (gameState == -3) { // Initialize Game
            gamePiece.xPosition = canvas.width / 2;
            gamePiece.yPosition = - 3 * baseUnitSize;
            gamePiece.orientation = Math.floor((Math.random() * 4) + 1);
            gamePiece.type = TETROMINOS[Math.floor(Math.random() * TETROMINOS.length)];
            gamePiece.color = Math.floor(Math.random() * colors.length);
            gamePiece.updateTemplate();
            if (fadeToBlackToken < 15) {
                fadeToBlack();
            }
            if (fadeToBlackToken == 15) {
                fadeFromBlack();
                drawGrid();
                drawFrame();
                drawNextPiece();
                drawStats();
            }
            if (fadeFromBlackToken == 0) {
                gameState = 1;
                fadeToBlackToken = 0;
                fadeFromBlackToken = 15;
            }
        }
    }, 1000/FPS)
}

// Scoring and loss conditions
//---------------------------------------------------------------------------------

var playerScore = 0;
var playerName = "";
var leaderboard = 0;

var blocksAddedToken = 30;
var speedIncreaseToken = 30;
var rowComboToken = 30;
var comboKingToken = 30;
var gameStartToken = 0;
var dangerWarningToken = 60;
var gameOverSlideInToken = 0;
var sideBarSlideUpToken = 0;
var sideBarSlideRightToken = 0;
var rightSlidePanelToken = -1;

function drawStats() {
    sideContext.font = "bold " + (baseUnitSize / 1.5) + "px Monaco, monospace";
    sideContext.fillStyle = "#555";
    sideContext.textAlign = "center";
    sideContext.fillText("NEXT PIECE", sideCanvas.width / 2, baseUnitSize - (sideBarSlideUpToken / 8.5 * baseUnitSize * 70 / (sideBarSlideUpToken + 10)));
    sideContext.fillText("GAME STATS", sideCanvas.width / 2, (baseUnitSize * 8) - (sideBarSlideUpToken / 8.5 * baseUnitSize * 70 / (sideBarSlideUpToken + 10)));
    sideContext.font = (baseUnitSize / 2) + "px Monaco, monospace";
    sideContext.textAlign = "left";
    sideContext.fillText("Score: " + playerScore, baseUnitSize / 2, (baseUnitSize * 9) - (sideBarSlideUpToken / 8.5 * baseUnitSize * 70 / (sideBarSlideUpToken + 10)));
    sideContext.fillText("Rows Cleared: " + totalRowsCleared, baseUnitSize / 2, baseUnitSize * 10 - (sideBarSlideUpToken / 8.5 * baseUnitSize * 70 / (sideBarSlideUpToken + 10)));
    sideContext.fillText("Round: " + gamePlayRounds, baseUnitSize / 2, (baseUnitSize * 11) - (sideBarSlideUpToken / 8.5 * baseUnitSize * 70 / (sideBarSlideUpToken + 10)));
    sideContext.fillText("Speed: " + fallSpeed, baseUnitSize / 2, (baseUnitSize * 12) - (sideBarSlideUpToken / 8.5 * baseUnitSize * 70 / (sideBarSlideUpToken + 10)));
    sideContext.fillText("Theme: " + activeTheme, baseUnitSize / 2, (baseUnitSize * 13) - (sideBarSlideUpToken / 8.5 * baseUnitSize * 70 / (sideBarSlideUpToken + 10)));
    sideContext.font = "bold " + (baseUnitSize / 2) + "px Monaco, monospace";
    sideContext.textAlign = "center";
    sideContext.fillText("SERVER STATUS", sideCanvas.width / 2, baseUnitSize * 18);
    sideContext.font = (baseUnitSize / 2) + "px Monaco, monospace";
    sideContext.fillStyle = serverStatus.color;
    sideContext.fillText(serverStatus.status, sideCanvas.width / 2, baseUnitSize * 19);
}

function showNotifications() {
    if (blocksAddedToken < 30) {
        context.textAlign = "center";
        context.fillStyle = colors[3];
        context.font = ((baseUnitSize / 2) + (baseUnitSize / 60 * blocksAddedToken)) + "px Monaco, monospace";
        context.fillText("BLOCKS ADDED!", (canvas.width / 2), (canvas.height * 0.75) - (blocksAddedToken * baseUnitSize / 30));
        context.lineWidth = baseUnitSize / 100;
        context.strokeStyle = "#000";
        context.strokeText("BLOCKS ADDED!", (canvas.width / 2), (canvas.height * 0.75) - (blocksAddedToken * baseUnitSize / 30));
        blocksAddedToken++;
    }
    if (speedIncreaseToken < 30) {
        context.textAlign = "center";
        context.fillStyle = colors[3];
        context.font = ((baseUnitSize / 2) + (baseUnitSize / 30 * speedIncreaseToken)) + "px Monaco, monospace";
        context.fillText("SPEED INCREASE!", (canvas.width / 2), (canvas.height * 0.25) + (speedIncreaseToken * baseUnitSize / 30));
        context.lineWidth = baseUnitSize / 100;
        context.strokeStyle = "#000";
        context.strokeText("SPEED INCREASE!", (canvas.width / 2), (canvas.height * 0.25) + (speedIncreaseToken * baseUnitSize / 30));
        speedIncreaseToken++;
    }
    if (rowComboToken < 30) {
        context.textAlign = "center";
        context.fillStyle = colors[3];
        context.font = ((baseUnitSize / 2) + (baseUnitSize / 30 * rowComboToken)) + "px Monaco, monospace";
        context.fillText("COMBO!", (canvas.width / 2), (canvas.height / 2) - (rowComboToken * baseUnitSize / 30));
        context.lineWidth = baseUnitSize / 100;
        context.strokeStyle = "#000";
        context.strokeText("COMBO!", (canvas.width / 2), (canvas.height / 2) - (rowComboToken * baseUnitSize / 30));
        rowComboToken++;
    }
    if (comboKingToken < 30) {
        context.textAlign = "center";
        context.fillStyle = colors[3];
        context.font = ((baseUnitSize / 2) + (baseUnitSize / 30 * comboKingToken)) + "px Monaco, monospace";
        context.fillText("SUPER COMBO!", (canvas.width / 2), (canvas.height / 2) - (comboKingToken * baseUnitSize / 30));
        context.lineWidth = baseUnitSize / 100;
        context.strokeStyle = "#000";
        context.strokeText("SUPER COMBO!", (canvas.width / 2), (canvas.height / 2) - (comboKingToken * baseUnitSize / 30));
        comboKingToken++;
    }
    if (gameStartToken < 60) {
        context.textAlign = "center";
        context.fillStyle = colors[3];
        context.font = ((baseUnitSize / 2) + (baseUnitSize / 90 * gameStartToken)) + "px Monaco, monospace";
        context.fillText("GAME START!", (canvas.width / 2), (canvas.height / 2) - (gameStartToken * baseUnitSize / 15));
        context.lineWidth = baseUnitSize / 100;
        context.strokeStyle = "#000";
        context.strokeText("GAME START!", (canvas.width / 2), (canvas.height / 2) - (gameStartToken * baseUnitSize / 15));
        gameStartToken++;
    }
    if (dangerWarningToken == 0) {
        canvas.style.backgroundColor = "#EEE";
        dangerWarningToken++;
        return;
    }
    else if (dangerWarningToken < 60 && dangerWarningToken > 0) {
        canvas.style.backgroundColor = "#EEEEEE" + opacitySpectrum[Math.round(dangerWarningToken/(60/opacitySpectrum.length))];
        dangerWarningToken++;
    }
}

function drawLeaderboard() {
    if (leaderboard != 0) {
        for (let i = 0; i < leaderboard.length; i++) {
            context.font = baseUnitSize + "px Monaco, monospace";
            context.fillStyle = colors[1];
            context.textAlign = "center";
            context.fillText("LEADERBOARD", (canvas.width / 2), (baseUnitSize * 9 * 60 / gameOverSlideInToken));
            context.lineWidth = baseUnitSize / 100;
            context.strokeStyle = "#000";
            context.strokeText("LEADERBOARD", (canvas.width / 2), (baseUnitSize * 9 * 60 / gameOverSlideInToken));
            context.font = (baseUnitSize / 2) + "px Monaco, monospace";
            context.fillText((leaderboard[i].name + ": " + leaderboard[i].score), (canvas.width / 2), ((baseUnitSize * 10 * 60 / gameOverSlideInToken) + (i * baseUnitSize)));
            context.lineWidth = baseUnitSize / 100;
            context.strokeStyle = "#000";
            context.strokeText((leaderboard[i].name + ": " + leaderboard[i].score), (canvas.width / 2), ((baseUnitSize * 10 * 60 / gameOverSlideInToken) + (i * baseUnitSize)));
        }
    }
    else if (leaderboard == 0) {
        context.font = (baseUnitSize / 2) + "px Monaco, monospace";
        context.fillStyle = "SteelBlue";
        context.textAlign = "center";
        context.fillText("Leaderboard Unavailable...", (canvas.width / 2), baseUnitSize * 10 * 60 / gameOverSlideInToken);
    }
}

function drawGameOver() {
    context.textAlign = "center";
    context.fillStyle = "#555";
    context.font = baseUnitSize + "px Monaco, monospace";
    context.fillText("GAME OVER", canvas.width - ((canvas.width * 30) / gameOverSlideInToken), baseUnitSize * 6);
    context.font = (baseUnitSize / 2) + "px Monaco, monospace";
    context.fillText("Reload page to play again", ((canvas.width * 30) / gameOverSlideInToken), baseUnitSize * 7);
    if (gameOverSlideInToken < 60) {
        gameOverSlideInToken++;
    }
}

function animateBlocksUp() {
    let t = 0;
    for (i = canvas.height - baseUnitSize; i >= 0; i -= baseUnitSize){
        for (j = canvas.width - baseUnitSize; j >= 0; j -= baseUnitSize) {
            setTimeout(upCallBack(j, i), t);
            t += 10;
        }
    }
    setTimeout(function() {canvas.style.backgroundColor = "#FFFFFFAA";}, t);
    animateBlocksDown(t);
}

function upCallBack(j, i){
    return function() {
        context.beginPath();
        context.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        context.lineWidth = baseUnitSize / 10;
        context.strokeStyle = "black";
        context.rect(j, i, baseUnitSize, baseUnitSize);
        context.fill();
        context.stroke();
    }
}

function animateBlocksDown(t) {
    for (i = 0; i <= canvas.height; i += baseUnitSize){
        for (j = 0; j <= canvas.width; j += baseUnitSize) {
            setTimeout(downCallBack(j, i), t);
            t += 10;
        }
    }
    setTimeout(function() {gameState = -1;}, t);
}

function downCallBack(j, i){
    return function() {
        context.clearRect(j, i, baseUnitSize, baseUnitSize);
        drawFrame();
    }
}

function givePoints(rowsCleared) {
    if (rowsCleared == 1) {
        playerScore += 10;
    }
    else if (rowsCleared > 1 && rowsCleared < 4) {
        playerScore += 20 * rowsCleared;
        rowComboToken = 0;
    }
    else if (rowsCleared > 3) {
        playerScore += 20 * rowsCleared;
        comboKingToken = 0;
    }
}

function checkLoss() {
    for (i = 0; i < 4; i++) {
        if (gamePiece.template[i][1] <= 0) {
            // Game over!
            dangerWarningToken = 0;
            gameState = -99;
            if (serverStatus.status == "Online") {
                getLeaderboard();
            }
            animateBlocksUp();
            return;
        }
    }
}


// Functionality
//---------------------------------------------------------------------------------

var futurePieces = [];

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

function setFuturePiece() {
    futurePiece.orientation = futurePieces[0].orientation;
    futurePiece.type = futurePieces[0].type;
    futurePiece.color = futurePieces[0].color;
    futurePiece.updateTemplate();
    futurePieces.shift();
}

var fallSpeed = 1; // base units per second

function gravity() {
    if (gamePiece.yPosition < canvas.height) {
        gamePiece.yPosition += fallSpeed * baseUnitSize / (1000 / FPS);
    }
}

var fallspeedReference = 1;

function fallSpeedListener() {
    if(fallSpeed == (fallspeedReference + 1)) {
        speedIncreaseToken = 0;
        fallspeedReference++;
    }
}

var gamePlayRounds = 0;

function setDifficulty() {
    if (gamePlayRounds % 15 == 0 && gamePlayRounds > 0) {
        let challengeRows = 0;
        if (gamePlayRounds <= 30) {
            challengeRows = gamePlayRounds / 15;
        }
        else {
            challengeRows = 2;
        }
        createChallengeRow(challengeRows);
        blocksAddedToken = 0;
    }
    fallSpeed = Math.floor(playerScore / 100) + 1;
    fallSpeedListener();
}

function createChallengeRow(numberOfRows) {
    for (let j = 0; j < numberOfRows; j++) {
        for (let i = 0; i < fallenPieces.length; i++) {
            fallenPieces[i][1] -= baseUnitSize;
        }
        let maxChallengeBlocks = width - 1;
        let blockDistribution = [];
        for (let i = 0; i < width; i++) {
            blockDistribution.push(Math.random());
        }
        blockDistribution.push(Math.floor(Math.random() * (width - 1)))
        for (let i = 0; i < width; i++) {
            if (blockDistribution[i] > 0.25 && maxChallengeBlocks > 0) {
                fallenPieces.push([(i * baseUnitSize), (canvas.height - baseUnitSize), (colors.length - 1)]);
                maxChallengeBlocks--;
            }
        }
    }
}

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

function drawShadowPiece() {
    gamePieceShadow();
    for (let i = 0; i < 4; i++) {
        context.beginPath();
        context.lineWidth = baseUnitSize / 10;
        context.strokeStyle = "#666";
        context.rect(shadowPiece.template[i][0] + baseUnitSize / 10, shadowPiece.template[i][1] + baseUnitSize / 10, baseUnitSize - baseUnitSize / 5, baseUnitSize - baseUnitSize / 5);
        context.stroke();
    }
}

function drawNextPiece() {
    if (gameState == 0) {
        futurePiece.yPosition = (3 * baseUnitSize) - (sideBarSlideUpToken / 8.5 * baseUnitSize * 70 / (sideBarSlideUpToken + 10));
        futurePiece.updateTemplate();
    }
    for (let i = 0; i < 4; i++) {
        sideContext.beginPath();
        sideContext.fillStyle = colors[futurePiece.color];
        sideContext.lineWidth = baseUnitSize / 10;
        sideContext.strokeStyle = "black";
        sideContext.rect(futurePiece.template[i][0], futurePiece.template[i][1], baseUnitSize, baseUnitSize);
        sideContext.fill();
        sideContext.stroke();
    }
}

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

function newRound() {
    allowDown = true;
    setDifficulty();
    newGamePiece();
    setFuturePiece();
    addToQueue(1);
}

function newGamePiece() {
    gamePiece.xPosition = canvas.width / 2;
    gamePiece.yPosition = - 3 * baseUnitSize;
    gamePiece.orientation = futurePiece.orientation;
    gamePiece.type = futurePiece.type;
    gamePiece.color = futurePiece.color;
    gamePiece.updateTemplate();
    gamePlayRounds++;
}

function gamePieceShadow() {
    shadowPiece.xPosition = gamePiece.xPosition;
    shadowPiece.yPosition = canvas.height;
    shadowPiece.updateTemplate();
    liftShadow();
}

function liftShadow() {
    for (let i = 0; i < 4; i++) {
        if ((shadowPiece.template[i][1] + baseUnitSize) > canvas.height) {
            shadowPiece.yPosition = shadowPiece.yPosition - (shadowPiece.template[i][1] - canvas.height) - baseUnitSize;
            shadowPiece.updateTemplate();
            liftShadow();
            return;
        }
        else if (fallenPieces.length > 0) {
            for (let j = 0; j < fallenPieces.length; j++) {
                if (shadowPiece.template[i][0] == fallenPieces[j][0] &&
                    (gamePiece.template[i][1] + baseUnitSize) < fallenPieces[j][1] &&
                    (shadowPiece.template[i][1] + baseUnitSize) > fallenPieces[j][1]) {
                        shadowPiece.yPosition = shadowPiece.yPosition - (shadowPiece.template[i][1] - fallenPieces[j][1]) - baseUnitSize;
                        shadowPiece.updateTemplate();
                        liftShadow();
                        return;
                }
            }
        }
    }
}
                

// Collision detection helper function, prevents fallthroughs
function willCollide() {
    for (let i = 0; i < 4; i++) {
        if (gamePiece.template[i][1] + 2 * baseUnitSize >= canvas.height) {
            if (fallSpeed >= 10) {
                fallSpeed /= 10;
            }
            allowDown = false;
            return;
        }
        for (let j = 0; j < fallenPieces.length; j++) {
            if (gamePiece.template[i][0] == fallenPieces[j][0] && 
                gamePiece.template[i][1] + 2 * baseUnitSize >= fallenPieces[j][1] &&
                gamePiece.template[i][1] < fallenPieces[j][1]) {
                    if (fallSpeed >= 10) {
                        fallSpeed /= 10;
                    }
                    allowDown = false;
                    return;
            }
        }
    }
    allowDown = true;
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
                gamePiece.template[i][1] + baseUnitSize + baseUnitSize / 10 >= fallenPieces[j][1] &&
                gamePiece.template[i][1] < fallenPieces[j][1] ) {
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

function detectLateralCollisionLeft() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < fallenPieces.length; j++) {
            if ((gamePiece.template[i][0] == fallenPieces[j][0] + baseUnitSize &&
                gamePiece.template[i][1] + baseUnitSize >= fallenPieces[j][1] &&
                gamePiece.template[i][1] + baseUnitSize <= fallenPieces[j][1] + baseUnitSize) ||
                (gamePiece.template[i][0] == fallenPieces[j][0] + baseUnitSize &&
                gamePiece.template[i][1] > fallenPieces[j][1] &&
                gamePiece.template[i][1] < fallenPieces[j][1] + (baseUnitSize * 0.9))) {
                    return true;
                }
        }
    }
    return false;
}

function detectLateralCollisionRight() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < fallenPieces.length; j++) {
            if ((gamePiece.template[i][0] == fallenPieces[j][0] - baseUnitSize &&
                gamePiece.template[i][1] + baseUnitSize >= fallenPieces[j][1] &&
                gamePiece.template[i][1] + baseUnitSize <= fallenPieces[j][1] + baseUnitSize) ||
                (gamePiece.template[i][0] == fallenPieces[j][0] - baseUnitSize &&
                gamePiece.template[i][1] > fallenPieces[j][1] &&
                gamePiece.template[i][1] < fallenPieces[j][1] + (baseUnitSize * 0.9))) {
                    return true;
                }
        }
    }
    return false;
}

function allowRotation(tryingToRotateTo) {
    let rotationCheckPiece = {};
    rotationCheckPiece.xPosition = gamePiece.xPosition;
    rotationCheckPiece.yPosition = gamePiece.yPosition;
    selectGamePiece(rotationCheckPiece, tryingToRotateTo, gamePiece.type);
    for (let i = 0; i < 4; i++) {
        if (rotationCheckPiece.template[i][1] > canvas.height) {
            return false;
        }
        for (let j = 0; j < fallenPieces.length; j++) {
            if (rotationCheckPiece.template[i][0] == fallenPieces[j][0] &&
                rotationCheckPiece.template[i][1] >= fallenPieces[j][1] &&
                rotationCheckPiece.template[i][1] <= fallenPieces[j][1] + baseUnitSize) {
                return false;
            }
        }
    }
    return true;
}

// Check for full rows by top left corner of block, recursively

var totalRowsCleared = 0;
var rowsCleared = 0;

function detectCompleteRows() {
    snapToGrid();
    let totalPossible = canvas.width / baseUnitSize;
    let totalBlockCount = 0;
    for (let i = 0; i < canvas.height; i += baseUnitSize) { // start at the top and go down row by row
        totalBlockCount = 0; // reset block count before moving to next row
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
                totalRowsCleared++;
                detectCompleteRows();
                return;
            }
        }
    }
    givePoints(rowsCleared);
    rowsCleared = 0;
}

function clearRow(row) {
    for (let i = 0; i < fallenPieces.length; i++) {
        if (fallenPieces[i][1] == row) {
            fallenPieces.splice(i, 1);
            clearRow(row);
            return;
        }
    }
}

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

var fallenPieces = [];

function saveToFallen() {
    for (let i = 0; i < 4; i++) {
        gamePiece.template[i].push(gamePiece.color);
        fallenPieces.push(gamePiece.template[i]);
        if (gamePiece.template[i][1] < 4 * baseUnitSize && dangerWarningToken == 60) {
            dangerWarningToken = 40;
        }
    }
}

function rotateGamePiece(direction) {
    let tryingToRotateTo = 0;
    if (direction == "CLOCKWISE"){
        if (gamePiece.orientation == 1 || gamePiece.orientation == 2 || gamePiece.orientation == 3) {
            tryingToRotateTo = gamePiece.orientation + 1;
            if (allowRotation(tryingToRotateTo) == true) {
                gamePiece.orientation ++;
            }
        }
        else if (gamePiece.orientation == 4) {
            tryingToRotateTo = 1;
            if (allowRotation(tryingToRotateTo) == true) {
                gamePiece.orientation = 1;
            }
        }
        else {
            console.log("Unknown clockwise rotation: " + gamePiece.orientation);
        }
    }
    else if (direction == "COUNTERCLOCKWISE") {
        if (gamePiece.orientation == 2 || gamePiece.orientation == 3 || gamePiece.orientation == 4) {
            tryingToRotateTo = gamePiece.orientation - 1;
            if (allowRotation(tryingToRotateTo) == true) {
                gamePiece.orientation --;
            }
        }
        else if (gamePiece.orientation == 1) {
            tryingToRotateTo = 4;
            if (allowRotation(tryingToRotateTo) == true) {
                gamePiece.orientation = 4;
            }
        }
        else {
            console.log("Unknown counterclockwise rotation: " + gamePiece.orientation);
        }
    }
    else {
        console.log("Unknown rotation direction: " + direction);
    }
}

function moveGamePiece(direction) {
    if (direction == "LEFT") {
        if (gamePiece.xPosition + gamePiece.leftBoundary > 0 && detectLateralCollisionLeft() == false) { 
            gamePiece.xPosition -= baseUnitSize;
        }
    }
    else if (direction == "RIGHT") {
        if (gamePiece.xPosition + gamePiece.rightBoundary < canvas.width && detectLateralCollisionRight() == false) {
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
}

// Leaderboard
//------------------------------------------------------------------------------

function getLeaderboard() {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://otterwerks.net:2222/leaderboard", true);
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    xhr.responseType = 'text';
    xhr.onload = function () {
        if (xhr.readyState === xhr.DONE && 
            xhr.status === 200) {
                leaderboard = JSON.parse(xhr.response).leaderboard;
                console.log(leaderboard);
                return;
            }
    };    
    xhr.send();
}

function submitScore() {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://otterwerks.net:2222/submitScore", true);
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    console.log(xhr.responseText);
    xhr.send(JSON.stringify({name: playerName, score: playerScore}));
}

var serverStatus = {status: "Unknown", color: "darkgrey"};

function checkServerStatus() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://otterwerks.net:2222/status", true);
    xhr.onload = function() {   
        if (xhr.readyState === xhr.DONE && 
            xhr.status === 200) {
                serverStatus.status = "Online";
                serverStatus.color = "green";
                return;
        }
    };
    xhr.onerror = function() {
        serverStatus.status = "Offline";
        serverStatus.color = "red";
    }
    xhr.send();
}


function checkNewHighScore() {
    if (leaderboard != 0) {
        if (playerScore >= leaderboard[(leaderboard.length) - 1].score) {
            playerName = prompt("Enter your name:");
            if (playerName == null) {
                playerName = "Anonymous";
            }
            submitScore();
            buildLeaderboard();
        }
    }
}

function buildLeaderboard() {
    for (let i = 0; i < 5; i++) {
        if (playerScore >= leaderboard[i].score) {
            leaderboard.splice(i, 0, {name: playerName, score: playerScore});
            leaderboard.pop();
            console.log(leaderboard);
            return;
        }
    }
}


// Keyboard event listeners and friends
//------------------------------------------------------------------------------

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("touchstart", touchStart, {passive: false});
document.addEventListener("touchmove", touchMove, {passive: false});
document.addEventListener("touchend", touchEnd, {passive: false});
main.addEventListener("click", function() {splashToken = 300;});

var touchStartX = 0;
var touchStartY = 0;

function touchStart(event) {
    event.preventDefault();
    touchStartX = event.touches[0].pageX;
    touchStartY = event.touches[0].pageY;
    if (gameState == -2) {
        splashToken = 300;
    }
}

function touchEnd(event) {
    event.preventDefault();
    let touchEndX = event.changedTouches[0].pageX;
    let touchEndY = event.changedTouches[0].pageY;
    if (gameState == 1) {
        if (touchEndY > touchStartY + 2 * baseUnitSize &&
                touchEndY < touchStartY + 6 * baseUnitSize) {
                    moveGamePiece("DOWN");
                    event.preventDefault();
                    return;
                }
        else if (touchEndY > touchStartY + 6 * baseUnitSize) {
            fallSpeed = 40;
            event.preventDefault();
            return;
        }
        else if (touchEndY < touchStartY - 2 * baseUnitSize) {
            rotateGamePiece("COUNTERCLOCKWISE");
            event.preventDefault();
            return;
        }
        else if (touchEndX > touchStartX + baseUnitSize ) {
            moveGamePiece("RIGHT");
            event.preventDefault;
            return;
        }
        else if (touchEndX < touchStartX - baseUnitSize) {
            moveGamePiece("LEFT");
            event.preventDefault();
            return;
        }
    }
}

function touchMove(event) {
     event.preventDefault();
}

function keyDownHandler(event) {
    if (gameState == 1) {
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
            rotateGamePiece("COUNTERCLOCKWISE");
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
        else if (event.keyCode == 16) {
            // Right Shift key
            let i = prompt("Enter a theme number...")
            colors = themes[i - 1];
            activeTheme = i;
        }
        // RDFG movement pad without boundary checks
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
        default:
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
        default:
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
        default:
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
        default:
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
        default:
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
        default:
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
        default:
            console.log("Z Tetromino orientation error");
    }
}
