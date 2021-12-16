var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

// Key Codes
var W = 87;
var S = 83;
var UP = 38;
var DOWN = 40;

// Keep track of pressed keys
var keys = {
    W: false,
    S: false,
    UP: false,
    DOWN: false
};

// Create a rectangle object - for paddles, ball, etc
function makeRect(x, y, width, height, speed, color) {
    if (!color) color = '#000000';
    return {
        x: x,
        y: y,
        w: width,
        h: height,
        s: speed,
        c: color,
        draw: function () {
            context.fillStyle = this.c;
            context.fillRect(this.x, this.y, this.w, this.h);
        }
    };
}

// Create the paddles
var paddleWidth = 25;
var paddleHeight = 100;
var leftPaddle = makeRect(25, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, 5, '#BC0000');
var rightPaddle = makeRect(canvas.width - paddleWidth - 25, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, 5, '#0000BC');

// Keep track of the score
var leftScore = 0;
var rightScore = 0;

// Create the ball
var ballLength = 15;
var ballSpeed = 2;
var ball = makeRect(0, 0, ballLength, ballLength, ballSpeed, '#000000');

// Modify the ball object to have two speed properties, one for X and one for Y
ball.sX = ballSpeed;
ball.sY = ballSpeed / 2;

// Randomize initial direction
if (Math.random() > 0.5) {
    ball.sX *= -1;
}
// Randomize initial direction
if (Math.random() > 0.5) {
    ball.sY *= -1;
}

// Reset the ball's position and speed after scoring
function resetBall() {
    ball.x = canvas.width / 2 - ball.w / 2;
    ball.y = canvas.height / 2 - ball.w / 2;
    ball.sX = ballSpeed;
    ball.sY = ballSpeed / 2;
}

// Bounce the ball off of a paddle
function bounceBall() {
    // Increase and reverse the X speed
    if (ball.sX > 0) {
        ball.sX += 1;
        // Add some "spin"
        if (keys.UP) {
            ball.sY -= 1;
        } else if (keys.DOWN) {
            ball.sY += 1;
        }
    } else {
        ball.sX -= 1;
        // Add some "spin"
        if (keys.W) {
            ball.sY -= 1;
        } else if (keys.S) {
            ball.sY += 1
        }
    }
    ball.sX *= -1;
}

// Listen for keydown events
document.addEventListener('keydown', function (event) {
    if (event.keyCode === W) {
        keys.W = true;
    }
    if (event.keyCode === S) {
        keys.S = true;
    }
    if (event.keyCode === UP) {
        keys.UP = true;
    }
    if (event.keyCode === DOWN) {
        keys.DOWN = true;
    }
});

// Listen for keyup events
document.addEventListener('keyup', function (event) {
    if (event.keyCode === W) {
        keys.W = false;
    }
    if (event.keyCode === S) {
        keys.S = false;
    }
    if (event.keyCode === UP) {
        keys.UP = false;
    }
    if (event.keyCode === DOWN) {
        keys.DOWN = false;
    }
});

// Start the game
function startGame() {
    // Put the ball in place
    resetBall();
    // Kick off the game loop
    draw();
}

// Show the end game screen
function endGame() {
    erase();
    context.fillStyle = '#000000';
    context.font = '24px Arial';
    context.textAlign = 'center';
    var winner = 1;
    if (rightScore === 10) winner = 2;
    context.fillText('Player ' + winner + ' wins!', canvas.width / 2, canvas.height / 2);
}

// Clear the canvas
function erase() {
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);
}

// Main draw loop
function draw() {
    erase();
    // Move the paddles
    if (keys.W) {
        leftPaddle.y -= leftPaddle.s;
    }
    if (keys.S) {
        leftPaddle.y += leftPaddle.s;
    }
    if (keys.UP) {
        rightPaddle.y -= rightPaddle.s;
    }
    if (keys.DOWN) {
        rightPaddle.y += rightPaddle.s;
    }
    // Move the ball
    ball.x += ball.sX;
    ball.y += ball.sY;
    // Bounce the ball off the top/bottom
    if (ball.y < 0 || ball.y + ball.h > canvas.height) {
        ball.sY *= -1;
    }
    // Don't let the paddles go off screen
    [leftPaddle, rightPaddle].forEach(function (paddle) {
        if (paddle.y < 0) {
            paddle.y = 0;
        }
        if (paddle.y + paddle.h > canvas.height) {
            paddle.y = canvas.height - paddle.h;
        }
    });
    // Bounce the ball off the paddles
    if (ball.y + ball.h / 2 >= leftPaddle.y && ball.y + ball.h / 2 <= leftPaddle.y + leftPaddle.h) {
        if (ball.x <= leftPaddle.x + leftPaddle.w) {
            bounceBall();
        }
    }
    if (ball.y + ball.h / 2 >= rightPaddle.y && ball.y + ball.h / 2 <= rightPaddle.y + rightPaddle.h) {
        if (ball.x + ball.w >= rightPaddle.x) {
            bounceBall();
        }
    }
    // Score if the ball goes past a paddle
    if (ball.x < leftPaddle.x) {
        rightScore++;
        resetBall();
        ball.sX *= -1;
    } else if (ball.x + ball.w > rightPaddle.x + rightPaddle.w) {
        leftScore++;
        resetBall();
        ball.sX *= -1;
    }
    // Draw the paddles and ball
    leftPaddle.draw();
    rightPaddle.draw();
    ball.draw();
    // Draw the scores
    context.fillStyle = '#000000';
    context.font = '24px Arial';
    context.textAlign = 'left';
    context.fillText('Score: ' + leftScore, 5, 24);
    context.textAlign = 'right';
    context.fillText('Score: ' + rightScore, canvas.width - 5, 24);
    // End the game or keep going
    if (leftScore === 10 || rightScore === 10) {
        endGame();
    } else {
        window.requestAnimationFrame(draw);
    }
}

// Show the menu to start the game
startGame();