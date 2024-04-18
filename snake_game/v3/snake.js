const app = document.getElementById('app');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;


// Constants

const STATES = {
    ready: 'ready',
    running: 'running',
    paused: 'paused',
    gameover: 'gameover',
    levelup: 'levelup'
};

const NBLOCK_X = 20;
const NBLOCK_Y = 20;
const BLOCK_WIDTH = canvas.width / NBLOCK_X;
const BLOCK_HEIGHT = canvas.height / NBLOCK_Y;

// Helper functions

function positionToCoordinate({ x, y }) {
    return {
        x: x * BLOCK_WIDTH,
        y: y * BLOCK_HEIGHT
    };
}

function randomPosition() {
    return {
        x: Math.floor(Math.random() * NBLOCK_X),
        y: Math.floor(Math.random() * NBLOCK_Y)
    };
}

function drawBlock({ x, y }, color) {
    const { x: xCoord, y: yCoord } = positionToCoordinate({ x, y });
    ctx.fillStyle = color;
    ctx.fillRect(xCoord, yCoord, BLOCK_WIDTH, BLOCK_HEIGHT);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Main loop

const gameState = {
    state: STATES.ready,
    hasWall: true,
    snake: {
        direction: 'right',
        body: [randomPosition()]
    },
    foods: [randomPosition()]
};


function drawGame(gameState) {
    clearCanvas();
    // Draw the snake
    gameState.snake.body.forEach((block, index) => {
        drawBlock(block, 'green');
    });
    // Draw the food
    gameState.foods.forEach(food => {
        drawBlock(food, 'red');
    });
}

function updateGame(gameState) {
    const { snake, foods } = gameState;
    console.log('Updating game...');

    // Move the snake
    const newHead = { ...snake.body[0] };
    switch (snake.direction) {
        case 'up':
            newHead.y -= 1;
            if (newHead.y < 0 && !gameState.hasWall) {
                newHead.y = NBLOCK_Y - 1;
            }
            break;
        case 'down':
            newHead.y += 1;
            if (newHead.y >= NBLOCK_Y && !gameState.hasWall) {
                newHead.y = 0;
            }
            break;
        case 'left':
            newHead.x -= 1;
            if (newHead.x < 0 && !gameState.hasWall) {
                newHead.x = NBLOCK_X - 1;
            }
            break;
        case 'right':
            newHead.x += 1;
            if (newHead.x >= NBLOCK_X && !gameState.hasWall) {
                newHead.x = 0;
            }
            break;
    }
    snake.body.unshift(newHead);
    snake.body.pop();

    // Check if the snake has eaten the food
    const head = snake.body[0];
    foods.forEach((food, index) => {
        if (head.x === food.x && head.y === food.y) {
            snake.body.push(food);
            foods[index] = randomPosition();
        }
    });

    // Check if the snake has collided with the walls
    if (head.x < 0 || head.x >= NBLOCK_X || head.y < 0 || head.y >= NBLOCK_Y) {
        gameState.state = STATES.gameover;
        app.setAttribute('data-state', STATES.gameover);
        return;
    }

    // Check if the snake has collided with itself
    for (let i = 1; i < snake.body.length; i++) {
        if (head.x === snake.body[i].x && head.y === snake.body[i].y) {
            gameState.state = STATES.gameover;
            app.setAttribute('data-state', STATES.gameover);
            return;
        }
    }
}

const FPS = 10;
drawGame(gameState);
function loop() {
    console.log('Looping...');
    if (gameState.state !== STATES.running) {
        console.log('Game is not running');
        return;
    }
    drawGame(gameState);
    updateGame(gameState);
    setTimeout(() => {
        requestAnimationFrame(loop);
    }, 1000 / FPS);
}


// Keyboard event listeners

import { keyDownHandler } from './handlers.js';

document.addEventListener('keydown', keyDownHandler(gameState));

// Add Button event listeners

const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resumeBtn = document.getElementById('resumeBtn');
const resetBtn = document.getElementById('resetBtn');

startBtn.addEventListener('click', () => {
    console.log('Start button clicked');
    app.setAttribute('data-state', STATES.running);
    gameState.state = STATES.running;
    loop();
    startBtn.disabled = true;
    pauseBtn.disabled = false;
});

pauseBtn.addEventListener('click', () => {
    console.log('Pause button clicked');
    app.setAttribute('data-state', STATES.paused);
    gameState.state = STATES.paused;
    pauseBtn.disabled = true;
    resumeBtn.disabled = false;
});

resumeBtn.addEventListener('click', () => {
    console.log('Resume button clicked');
    app.setAttribute('data-state', STATES.running);
    gameState.state = STATES.running;
    loop();
    pauseBtn.disabled = false;
    resumeBtn.disabled = true;
});

resetBtn.addEventListener('click', () => {
    console.log('Reset button clicked');
    app.setAttribute('data-state', STATES.ready);
    gameState.state = STATES.ready;
    gameState.snake = {
        direction: 'right',
        body: [randomPosition()]
    };
    gameState.foods = [randomPosition()];
    drawGame(gameState);
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resumeBtn.disabled = true;
});
