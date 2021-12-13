const mywidth = "1800px";
const myheight = "600px";

document.write(
    '<center><canvas id="myCanv" onkeypress="Key_leftArrow()" width="' + mywidth +
    '"px" height="' + myheight +
    'px" style="border: 2px solid black;"></canvas></center>');

var canvas = document.getElementById("myCanv");
var player1 = canvas.getContext("2d");
var upperWall = canvas.getContext("2d");
var lowerWall = canvas.getContext("2d");


var x = 50; // X position
var y = 100; // Y position
var speed = 6; // Distance to move each frame
var sideLength = 50; // Length of each side of the square

// FLags to track which keys are pressed
var down = false;
var up = false;
var right = false;
var left = false;

// Properties for the target square
var targetX = 0;
var targetY = 0;
var targetLength = 25;

// Determine if number a is within the range b to c (exclusive)
function isWithin(a, b, c) {
    return (a > b && a < c);
}


function structure() {
    player1.save();
    player1.beginPath();

    player1.rect(20, 530, 50, 50);

    player1.lineWidth = 3;
    player1.fillStyle = "#14c960";
    player1.fill();
    player1.stroke();

    player1.lineWidth = 2;
    player1.fill();

    upperWall.beginPath();

    upperWall.rect(500, 0, 50, 200);

    upperWall.lineWidth = 2;
    upperWall.fillStyle = "#165216";
    upperWall.fill();
    upperWall.stroke();

    lowerWall.beginPath();

    lowerWall.rect(500, 400, 50, 200);

    lowerWall.lineWidth = 2;
    lowerWall.fillStyle = "#165216";
    lowerWall.fill();
    lowerWall.stroke();
}
structure();


document.addEventListener('keydown', keyDown);

function keyDown(event) {
    if (event.keyCode === 100) { // UP
        up = true;
    }
    if (event.keyCode === 97) { // RIGHT
        right = true;
    }
    if (event.keyCode === 119) { // DOWN
        down = true;
    }
    if (event.keyCode === 115) { // LEFT
        left = true;
    }
}

document.addEventListener('keyup', keyUp);

function keyUp(event) {
    if (event.keyCode === 100) { // UP
        up = false;
    }
    if (event.keyCode === 97) { // RIGHT
        right = false;
    }
    if (event.keyCode === 119) { // DOWN
        down = false;
    }
    if (event.keyCode === 115) { // LEFT
        left = false;
    }
}

function moveTarget() {
    targetX = Math.round(Math.random() * canvas.width - targetLength);
    targetY = Math.round(Math.random() * canvas.height - targetLength)
}

function draw() {
    erase();
    // Move the square
    if (down) {
        y += speed;
    }
    if (up) {
        y -= speed;
    }
    if (right) {
        x += speed;
    }
    if (left) {
        x -= speed;
    }
    // Keep the square within the bounds
    if (y + sideLength > canvas.height) {
        y = canvas.height - sideLength;
    }
    if (y < 0) {
        y = 0;
    }
    if (x < 0) {
        x = 0;
    }
    if (x + sideLength > canvas.width) {
        x = canvas.width - sideLength;
    }
    // Collide with the target
    if (isWithin(targetX, x, x + sideLength) || isWithin(targetX + targetLength, x, x + sideLength)) { // X
        if (isWithin(targetY, y, y + sideLength) || isWithin(targetY + targetLength, y, y + sideLength)) { // Y
            // Respawn the target
            moveTarget();
            // Increase the score
            score++;
        }
    }
    // Draw the square
    player1.fillStyle = '#FF0000';
    player1.fillRect(x, y, sideLength, sideLength);
    // Draw the target 
    player1.fillStyle = '#00FF00';
    player1.fillRect(targetX, targetY, targetLength, targetLength);
    // Draw the score and time remaining
    player1.fillStyle = '#000000';
    player1.font = '24px Arial';
    player1.textAlign = 'left';
    player1.fillText('Score: ' + score, 10, 24);
    player1.fillText('Time Remaining: ' + countdown, 10, 50);
    // End the game or keep playing
    if (countdown <= 0) {
        //endGame();
    } else {
        window.requestAnimationFrame(draw);
    }
}

moveTarget();
draw();

/*
let spx = 400,
    spy = 200;
player1.lineWidth = 10;
let backw = false;
let myr = false;

function Moveswoosh(a, b) {
    // clean canvas
    player1.clearRect(0, 0, canvas.width, canvas.height);
    player1.beginPath()
    //debugger; if its inside bounds
    if (spx >= canvas.width || spx <= 0 || spy >= canvas.height || spy <= 0) {
        spx = 50;
        spy = 100;
    }
    spx += a;
    spy += b;

    player1.moveTo(spx, spy);
    //context.strokeRect
    player1.bezierCurveTo(spx + 50, spy + 110, spx + 125, spy - 80, spx + 125, spy - 90);
    //context.rotate(Math.PI * (i / 1000));
    player1.stroke();
    //debugger;
    window.requestAnimationFrame(() => {
        Moveswoosh(a, b);
    });
}*/
//Moveswoosh(10, 10);