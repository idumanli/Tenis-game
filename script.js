var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;

var showingWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGTH = 80;
const PADDLE_THICKNESS = 10;
var MESSEGE_1 = 'player won';
var MESSEGE_2 = 'computer won';

function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY,
    };
}

function handleMouseClick(evt) {
    if (showingWinScreen) {
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
    }
}

window.onload = function () {
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext("2d");
    var framePerSecond = 30;
    setInterval(function () {
        moveEverthing();
        drawEverything();
    }, 1000 / framePerSecond);

    canvas.addEventListener("mousedown", handleMouseClick);

    canvas.addEventListener("mousemove", function (evt) {
        var mousePos = calculateMousePos(evt);
        paddle1Y = mousePos.y - PADDLE_HEIGTH / 2;
    });
};

function ballReset() {
    if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
        showingWinScreen = true;
    }

    ballSpeedX = -ballSpeedX;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

function computerMovment() {
    var paddle2YCentre = paddle2Y + PADDLE_HEIGTH / 2;
    if (paddle2YCentre < ballY) {
        paddle2Y += 6;
    } else {
        paddle2Y -= 6;
    }
}

function moveEverthing() {
    if (showingWinScreen) {
        return;
    }
    computerMovment();

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX < 0) {
        if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGTH) {
            ballSpeedX = -ballSpeedX;

            var deltaY = ballY - (paddle1Y + PADDLE_HEIGTH / 2);
            ballSpeedY = deltaY * 0.35;
        } else {
            player2Score++; //must be before ballReset()
            ballReset();
        }
    }
    if (ballX > canvas.width) {
        if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGTH) {
            ballSpeedX = -ballSpeedX;

            var deltaY = ballY - (paddle2Y + PADDLE_HEIGTH / 2);
            ballSpeedY = deltaY * 0.35;
        } else {
            player1Score++; //must be before ballReset()
            ballReset();
        }
    }
    if (ballY < 0) {
        ballSpeedY = -ballSpeedY;
    }
    if (ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }
}

function drawNet() {
    for (var i = 0; i < canvas.height; i += 40) {
        colorRect(canvas.width / 2 - 1, i, 2, 20, "white");
    }
}

function drawEverything() {
    // next line blanks out the screen with black
    colorRect(0, 0, canvas.width, canvas.height, "black");

    if (showingWinScreen) {
        canvasContext.fillStyle = "white";
        if (player1Score >= WINNING_SCORE) {
            canvasContext.fillText(MESSEGE_1, 200, 300);
        }

        if (player2Score >= WINNING_SCORE) {
            canvasContext.fillText(MESSEGE_2, 200, 300);
        }
        canvasContext.fillText("click to contunie", 500, 300);
    }
    drawNet();

    //  this is left plair paddle
    colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGTH, "white");
    //  this is computer plair paddle
    colorRect(canvas.width - PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGTH, "white");
    //  next line draws the ball
    colorCircle(ballX, ballY, PADDLE_THICKNESS, "white");

    canvasContext.fillText(player1Score, 100, 100);
    canvasContext.fillText(player2Score, canvas.width - 100, 100);
}

function colorCircle(centreX, centreY, radius, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centreX, centreY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}