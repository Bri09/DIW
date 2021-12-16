var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

// Codigo de cada tecla
var W = 87;
var S = 83;
var UP = 38;
var DOWN = 40;

// Variables para las teclas y sus eventos
var keys = {
    W: false,
    S: false,
    UP: false,
    DOWN: false
};

// Crea un objeto rectangular para cada objeto de la partida
function createRect(x, y, width, height, speed, color) {
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

// Creamos a los jugadores(tablas)
var paddleWidth = 20;
var paddleHeight = 120;
var leftPaddle = createRect(25, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, 10, '#BC0000');
var rightPaddle = createRect(canvas.width - paddleWidth - 25, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, 10, '#0000BC');

// Variables para la puntuación
var leftScore = 0;
var rightScore = 0;

// Creamos la pelota
var ballLength = 20;
var ballSpeed = 10;
var ball = createRect(0, 0, ballLength, ballLength, ballSpeed, '#000000');

// Añadimos una propiedad de velocidad por eje a la pelota
ball.sX = ballSpeed;
ball.sY = ballSpeed;

// Devuelve la pelota a su posición inicial
function resetBall() {
    ball.x = canvas.width / 2 - ball.w / 2;
    ball.y = canvas.height / 2 - ball.w / 2;
    ball.sX = ballSpeed;
    ball.sY = ballSpeed / 2;
    leftPaddle = createRect(25, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, 5, '#BC0000');
    rightPaddle = createRect(canvas.width - paddleWidth - 25, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, 5, '#0000BC');
}

// Permite el rebote de la pelota
function bounceBall() {
    // Envía la pelota en la dirección contraria
    ball.sX *= -1;
}

/**  Añadimos un eventListener para las teclas de movimiento,
 *   mientras estén presionadas se moveran*/
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

/** Añadimos un eventListener para las teclas de movimiento,
 *  cuando no estén presionadas no se moveran */
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

// Comenzamos la partida
function startGame() {
    // Colocamos la pelota en su sitio
    resetBall();
    // Comienza el bucle del juego y su movimiento
    draw();
}

// Muestra en pantalla el final del juego
function endGame() {
    erase();
    context.fillStyle = '#000000';
    context.font = '24px Arial';
    context.textAlign = 'center';
    var winner = 1;
    if (rightScore === 10) winner = 2;
    context.fillText('Player ' + winner + ' wins!', canvas.width / 2, canvas.height / 2);
}

// Vacía el canvas
function erase() {
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);
}

// Bucle para el movimiento
function draw() {
    erase();
    // Movimiento de los jugadores
    if (keys.W) {
        leftPaddle.y -= leftPaddle.s + 5;
    }
    if (keys.S) {
        leftPaddle.y += leftPaddle.s + 5;
    }
    if (keys.UP) {
        rightPaddle.y -= rightPaddle.s + 5;
    }
    if (keys.DOWN) {
        rightPaddle.y += rightPaddle.s + 5;
    }
    // Movimiento de la pelota
    ball.x += ball.sX;
    ball.y += ball.sY;
    // Rebota la pelota en el techo y el suelo
    if (ball.y < 0 || ball.y + ball.h > canvas.height) {
        ball.sY *= -1;
    }
    // Evita que el jugador no salga de la pantalla 
    [leftPaddle, rightPaddle].forEach(function (paddle) {
        if (paddle.y < 0) {
            paddle.y = 0;
        }
        if (paddle.y + paddle.h > canvas.height) {
            paddle.y = canvas.height - paddle.h;
        }
    });
    // Rebote de la pelota en los jugadores
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
    // Sistema de puntuación
    if (ball.x < leftPaddle.x) {
        rightScore++;
        resetBall();
        ball.sX *= -1;
    } else if (ball.x + ball.w > rightPaddle.x + rightPaddle.w) {
        leftScore++;
        resetBall();
        ball.sX *= -1;
    }
    // Dibuja los jugadores y la pelota
    leftPaddle.draw();
    rightPaddle.draw();
    ball.draw();
    // Dibuja la puntuación
    context.fillStyle = '#000000';
    context.font = '24px Arial';
    context.textAlign = 'left';
    context.fillText('Score: ' + leftScore, 5, 24);
    context.textAlign = 'right';
    context.fillText('Score: ' + rightScore, canvas.width - 5, 24);
    // Comprueba si la partida ha terminado, el que llegue a 8 gana
    if (leftScore === 8 || rightScore === 8) {
        endGame();
    } else {
        window.requestAnimationFrame(draw);
    }
}

// Comienza el juego
startGame();