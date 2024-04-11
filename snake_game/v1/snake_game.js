// Define constants
const BOARD_SIZE = 24;
const CELL_SIZE = 20; // in pixels
const INITIAL_SNAKE_LENGTH = 1;
const APPLE_SCORE = 1;
const FPS = 10;
const DIRECTIONS = {
    Up: "up",
    Down: "down",
    Left: "left",
    Right: "right",
};

// Define colors
const COLORS = {
    snakeBody: "green",
    snakeHead: "lightgreen",
    apple: "red",
};

// Game status
const GAME_STATUS = {
    running: "running",
    paused: "paused",
    over: "over",
};


// Get references to HTML elements
const canvas = document.getElementById("gameBoard");
canvas.width = BOARD_SIZE * CELL_SIZE;
canvas.height = BOARD_SIZE * CELL_SIZE;

const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const controlsWrapper = document.getElementById("controlsWrapper");
const constrolsWrapperDisplay = controlsWrapper.style.display;
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");

// On spacebar press, start the game or pause it
document.addEventListener("keydown", (e) => {
    if (e.key === " ") {
        if (gameState.status === GAME_STATUS.running) {
            pauseBtn.hidden = false;
            controlsWrapper.style.display = constrolsWrapperDisplay;
            pauseGame();
        } else if (gameState.status === GAME_STATUS.paused) {
            pauseBtn.hidden = true;
            controlsWrapper.style.display = "none";
            resumeGame();
        } else {
            playBtn.hidden = true;
            controlsWrapper.style.display = "none";
            startGame();
        }
    } else if (e.key === "Escape") {
        pauseBtn.hidden = true;
        controlsWrapper.style.display = "none";
        endGame();
    }
});

// Define game state
const gameState = {
    status: GAME_STATUS.over,
    snake: [],
    apple: {},
    direction: DIRECTIONS.Right,
    nextDirection: null,
    nextNextDirection: null,
    score: 0,
    interval: null,
};

const startGame = () => {
    gameState.status = GAME_STATUS.running;
    gameState.snake = createSnake();
    gameState.apple = createApple();
    gameState.direction = DIRECTIONS.Right;
    gameState.score = 0;
    gameState.interval = setInterval(updateGame, 1000 / FPS);
}

const resumeGame = () => {
    gameState.status = GAME_STATUS.running;
    gameState.interval = setInterval(updateGame, 1000 / FPS);
}

const pauseGame = () => {
    gameState.status = GAME_STATUS.paused;
    clearInterval(gameState.interval);
}

const endGame = () => {
    gameState.status = GAME_STATUS.over;
    clearInterval(gameState.interval);
    playBtn.hidden = false;
    controlsWrapper.style.display = constrolsWrapperDisplay;
}

const createSnake = () => {
    const snake = [];
    for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
        snake.push({ x: i, y: 0 });
    }
    return snake;
}

const createApple = () => {
    return {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
    };
}

const updateGame = () => {
    updateSnake();
    checkCollision();
    checkAppleCollision();
    drawGame();
}

const isOppositeDirection = (dir1, dir2) => {
    return (dir1 === DIRECTIONS.Up && dir2 === DIRECTIONS.Down) ||
        (dir1 === DIRECTIONS.Down && dir2 === DIRECTIONS.Up) ||
        (dir1 === DIRECTIONS.Left && dir2 === DIRECTIONS.Right) ||
        (dir1 === DIRECTIONS.Right && dir2 === DIRECTIONS.Left);
}

const updateSnake = () => {
    let newDirection;
    if (gameState.nextDirection && isOppositeDirection(gameState.direction, gameState.nextDirection)) {
        // We skip the next direction if it is opposite to the current direction
        if (gameState.nextNextDirection && !isOppositeDirection(gameState.direction, gameState.nextNextDirection)) {
            // If the next next direction is not opposite to the current direction, we use it
            newDirection = gameState.nextNextDirection;
            gameState.nextDirection = null;
            gameState.nextNextDirection = null;
        } else {
            // Otherwise, we use the current direction
            newDirection = gameState.direction;
            gameState.nextDirection = gameState.nextNextDirection;
            gameState.nextNextDirection = null;
        }
    } else if (gameState.nextDirection) {
        newDirection = gameState.nextDirection;
        gameState.nextDirection = gameState.nextNextDirection;
        gameState.nextNextDirection = null;
    } else {
        newDirection = gameState.direction;
    }

    gameState.direction = newDirection;

    const head = { ...gameState.snake[gameState.snake.length - 1] };
    switch (gameState.direction) {
        case DIRECTIONS.Up:
            head.y--;
            break;
        case DIRECTIONS.Down:
            head.y++;
            break;
        case DIRECTIONS.Left:
            head.x--;
            break;
        case DIRECTIONS.Right:
            head.x++;
            break;
    }
    gameState.snake.push(head);
    if (head.x === gameState.apple.x && head.y === gameState.apple.y) {
        gameState.score += APPLE_SCORE;
        gameState.apple = createApple();
    } else {
        gameState.snake.shift();
    }
}

const checkCollision = () => {
    const head = gameState.snake[gameState.snake.length - 1];
    if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
        endGame();
    }
    for (let i = 0; i < gameState.snake.length - 1; i++) {
        if (head.x === gameState.snake[i].x && head.y === gameState.snake[i].y) {
            endGame();
        }
    }
}

const checkAppleCollision = () => {
    const head = gameState.snake[gameState.snake.length - 1];
    if (head.x === gameState.apple.x && head.y === gameState.apple.y) {
        gameState.score += APPLE_SCORE;
        gameState.apple = createApple();
    }
}

const drawGame = () => {
    // Clear the canvas
    ctx.fillStyle = "black";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the snake
    gameState.snake.forEach((segment, index) => {
        ctx.fillStyle = index === gameState.snake.length - 1 ? COLORS.snakeHead : COLORS.snakeBody;
        ctx.beginPath();
        ctx.roundRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE - 2, CELL_SIZE - 2, 5);
        ctx.fill();
    });

    // Draw the apple
    ctx.fillStyle = COLORS.apple;
    ctx.beginPath();
    ctx.roundRect(gameState.apple.x * CELL_SIZE, gameState.apple.y * CELL_SIZE, CELL_SIZE - 2, CELL_SIZE - 2, 20);
    ctx.fill();

    // Update the score
    scoreDisplay.textContent = gameState.score;
}

// On arrow key press, update the direction
document.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown" && e.key !== "ArrowLeft" && e.key !== "ArrowRight") {
        return;
    }

    if (gameState.status !== GAME_STATUS.running) {
        return;
    }

    let newDirection;
    switch (e.key) {
        case "ArrowUp":
            newDirection = DIRECTIONS.Up;
            break;
        case "ArrowDown":
            newDirection = DIRECTIONS.Down;
            break;
        case "ArrowLeft":
            newDirection = DIRECTIONS.Left;
            break;
        case "ArrowRight":
            newDirection = DIRECTIONS.Right;
            break;
    }

    if (gameState.nextDirection === null) {
        gameState.nextDirection = newDirection;
    } else if (gameState.nextNextDirection === null) {
        gameState.nextNextDirection = newDirection;
    }
});

