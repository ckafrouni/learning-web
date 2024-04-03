// Define constants
const BOARD_SIZE = 24;
const CELL_SIZE = 20; // in pixels
const INITIAL_SNAKE_LENGTH = 1;
const APPLE_SCORE = 1;
const FPS = 10;

// Get references to HTML elements
const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const controls = {
    start: document.getElementById("start"),
    pause: document.getElementById("pause"),
}

// Start button
controls.start.addEventListener("click", () => {
    controls.start.hidden = true;
    controls.pause.hidden = false;
    initGame();
});

// Pause button
controls.pause.addEventListener("click", () => {
    if (gameState.running) {
        controls.pause.textContent = "Resume";
        gameState.running = false;
    }
    else {
        controls.pause.textContent = "Pause";
        gameState.running = true;
    }
});

/**
 * @typedef {Object} GameState
 * @property {Array<{x: number, y: number}>} snake
 * @property {string} direction
 * @property {{x: number, y: number}} apple
 * @property {number} score
 */

/** @type {GameState} */
const initialGameState = {
    running: false,
    snake: [
        { x: 5, y: 5 },
    ],
    direction: "right",
    apple: {},
    score: 0,
};

// Game state
const gameState = { ...initialGameState };

// Initialize game board
function initBoard() {
    canvas.width = BOARD_SIZE * CELL_SIZE;
    canvas.height = BOARD_SIZE * CELL_SIZE;
}

// Initialize apple
function spawnApple() {
    gameState.apple = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE)
    };
}

// Draw a single cell on the game board
function drawCell(x, y, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE - 2, CELL_SIZE - 2, 5)
    ctx.fill();
}

// Draw the entire game board
function drawBoard() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    gameState.snake.forEach((segment) => {
        drawCell(segment.x, segment.y, "green");
    });

    // Draw apple
    drawCell(gameState.apple.x, gameState.apple.y, "red");
}

// Handle player input
function handleInput(event) {
    const key = event.key.toLowerCase();
    if (["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
        const newDirection = key.substr(5);
        if (isOppositeDirection(gameState.direction, newDirection)) {
            return; // Skip if the direction is opposite
        }
        gameState.direction = newDirection;
    }
}

// Check if two directions are opposite
function isOppositeDirection(dir1, dir2) {
    return (
        (dir1 === "up" && dir2 === "down") ||
        (dir1 === "down" && dir2 === "up") ||
        (dir1 === "left" && dir2 === "right") ||
        (dir1 === "right" && dir2 === "left")
    );
}

// Update game state
function update() {
    // Move the snake
    const head = { ...gameState.snake[0] };

    switch (gameState.direction) {
        case "up":
            head.y -= 1;
            break;
        case "down":
            head.y += 1;
            break;
        case "left":
            head.x -= 1;
            break;
        case "right":
            head.x += 1;
            break;
    }

    // Check for collisions with walls
    if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
        gameOver();
        return;
    }

    // Check for collisions with self
    if (gameState.snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    // Check for collision with apple
    if (head.x === gameState.apple.x && head.y === gameState.apple.y) {
        gameState.score += APPLE_SCORE;
        scoreDisplay.textContent = gameState.score;
        spawnApple();
    } else {
        gameState.snake.pop(); // Remove tail segment
    }

    // Add new head segment
    gameState.snake.unshift(head);
}

// Game over
function gameOver() {
    gameState.running = false;
    controls.start.hidden = false;
    controls.pause.hidden = true;
}

// Reset game
function resetGame() {
    gameState.running = false;
    gameState.snake = [...initialGameState.snake]; // Reset snake using spread operator
    gameState.direction = initialGameState.direction;
    gameState.apple = {};
    gameState.score = 0;
    spawnApple();
    scoreDisplay.textContent = gameState.score;
}

// Main game loop
let lastFrameTime = 0;
function gameLoop(currentTime) {
    const deltaTime = (currentTime - lastFrameTime) / 1000; // Convert milliseconds to seconds

    if (deltaTime < 1 / FPS) {
        requestAnimationFrame(gameLoop);
        return;
    }

    if (!gameState.running) {
        requestAnimationFrame(gameLoop);
        return;
    }

    update(deltaTime);
    drawBoard();

    lastFrameTime = currentTime;

    requestAnimationFrame(gameLoop);
}

// Initialize game
function initGame() {
    initBoard();

    // Reset game state
    resetGame();
    gameState.running = true;

    // Event listeners
    document.addEventListener("keydown", handleInput);

    // Start game loop
    requestAnimationFrame(gameLoop);
}
