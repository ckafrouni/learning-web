// Define constants
const BOARD_SIZE = 24;
const CELL_SIZE = 20; // in pixels
const INITIAL_SNAKE_LENGTH = 1;
const APPLE_SCORE = 10;

// Get references to HTML elements
const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");

// Initialize game variables
let snake = [];
let direction = "right";
let apple = {};
let score = 0;

// Initialize game board
function initBoard() {
    canvas.width = BOARD_SIZE * CELL_SIZE;
    canvas.height = BOARD_SIZE * CELL_SIZE;
}

// Initialize snake
function initSnake() {
    snake = [];
    for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
        snake.push({ x: i + 5, y: 5 });
    }
}

// Initialize apple
function spawnApple() {
    apple = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE)
    };
}

// Draw a single cell on the game board
function drawCell(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

// Draw the entire game board
function drawBoard() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach((segment) => {
        drawCell(segment.x, segment.y, "green");
    });

    // Draw apple
    drawCell(apple.x, apple.y, "red");
}

// Handle player input
function handleInput(event) {
    const key = event.key.toLowerCase();
    if (["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
        direction = key.substr(5);
    }
}

// Update game state
function update() {
    // Move the snake
    const head = { ...snake[0] };
    switch (direction) {
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
    if (snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    // Check for collision with apple
    if (head.x === apple.x && head.y === apple.y) {
        score += APPLE_SCORE;
        scoreDisplay.textContent = score;
        spawnApple();
    } else {
        snake.pop(); // Remove tail segment
    }

    // Add new head segment
    snake.unshift(head);
}

// Game over
function gameOver() {
    alert("Game over! Your score: " + score);
    resetGame();
}

// Reset game
function resetGame() {
    initSnake();
    spawnApple();
    score = 0;
    scoreDisplay.textContent = score;
}

// Main game loop
let lastFrameTime = 0;
const frameRate = 10; // Adjust the frame rate here (lower value = slower game)
function gameLoop(currentTime) {
    const deltaTime = (currentTime - lastFrameTime) / 1000; // Convert milliseconds to seconds

    if (deltaTime < 1 / frameRate) {
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
    initSnake();
    spawnApple();
    scoreDisplay.textContent = score;

    // Event listeners
    document.addEventListener("keydown", handleInput);

    // Start game loop
    requestAnimationFrame(gameLoop);
}

//Start the game
initGame();
