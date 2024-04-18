/**
 * @typedef Game
 * @type {object}
 * @property {GameStatus} status - The current game status
 * @property {Snake} snake - The snake object
 * @property {number} speed - The current speed
 * 
 * @typedef Snake
 * @type {object}
 * @property {Position[]} body - The snake body positions
 * @property {Direction} direction - The current direction of the snake
 * @property {Direction[]} directions - The directions the snake has to follow
 * @property {{head: string, body: string}} colors - The snake's colors
 *
 * @typedef GameStatus
 * @type {'ready'|'running'|'over'}
 * 
 * @typedef Direction
 * @type {'up'|'down'|'left'|'right'}
 * 
 * @typedef Position
 * @type {object}
 * @property {number} x - The x position
 * @property {number} y - The y position
 *
 */


/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('gameCanvas') // Similar to the #gameCanvas CSS selector
const pen = canvas.getContext('2d')
canvas.width = 1000
canvas.height = 1000

const GRID_WIDTH = 20
const GRID_HEIGHT = 20

const CELL_WIDTH = canvas.width / GRID_WIDTH
const CELL_HEIGHT = canvas.height / GRID_HEIGHT




// POSITION (Already implemented)

/**
 * Creates a random position within the grid
 * @returns {Position}
 */
function randomGridPosition() {
    return {
        x: Math.floor(Math.random() * GRID_WIDTH),
        y: Math.floor(Math.random() * GRID_HEIGHT),
    }
}

/**
 * Converts a grid position to a canvas position
 * @param {Position} position
 * @returns {x: number, y: number}
 */
function gridToCanvasPosition(position) {
    return {
        x: position.x * CELL_WIDTH,
        y: position.y * CELL_HEIGHT,
    }
}




// OBJECTS CREATION

/**
 * Creates a default game object
 * @returns {Game}
 */
function createGame() {
    return {
        status: 'ready',
        snake: {
            body: [
                { x: GRID_WIDTH / 2, y: GRID_HEIGHT / 2 },
                { x: GRID_WIDTH / 2 - 1, y: GRID_HEIGHT / 2 }
            ],
            direction: 'right',
            directions: [],
            headColor: 'darkgreen',
            bodyColor: 'green',
        },
        speed: 10,
    }
}




// GAME LOOP

/**
 * Updates the game state
 * @param {Game} game
 */
function updateGame(game) {
    // Update snake position
    updateSnakePosition(game)

    // TODO: Check if the snake collides with the walls or itself
    // * If the snake collides with the walls, set the game status to 'over'
    // * If the snake collides with itself, set the game status to 'over'

    // REMOVE-START
    const snake = game.snake
    const head = snake.body[0]

    // Check if the snake collides with the walls
    if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT) {
        game.status = 'over'
        return
    }

    // Check if the snake collides with itself
    for (let i = 1; i < snake.body.length; i++) {
        if (head.x === snake.body[i].x && head.y === snake.body[i].y) {
            game.status = 'over'
            return
        }
    }
    // REMOVE-END    
}

/**
 * Updates the snake position
 * @param {Game} game
 */
function updateSnakePosition(game) {
    // TODO: Update the snake position based on the current direction and next directions
    // * If the snake has directions, change the direction to the first one in the list
    // * Take care of not allowing the snake to go back to the opposite direction
    // * Move the snake to the new position

    // REMOVE-START
    const snake = game.snake
    if (snake.directions.length) {
        if (snake.direction !== snake.directions[0] && (
            snake.direction === 'up' && snake.directions[0] !== 'down' ||
            snake.direction === 'down' && snake.directions[0] !== 'up' ||
            snake.direction === 'left' && snake.directions[0] !== 'right' ||
            snake.direction === 'right' && snake.directions[0] !== 'left')) {
            console.log('Changing direction')
            snake.direction = snake.directions.shift()
        } else {
            console.log('Ignoring direction')
            snake.directions.shift()
        }
    }

    const newPosition = { ...snake.body[0] }
    switch (snake.direction) {
        case 'up':
            newPosition.y--
            break
        case 'down':
            newPosition.y++
            break
        case 'left':
            newPosition.x--
            break
        case 'right':
            newPosition.x++
            break
    }

    snake.body.unshift(newPosition)
    snake.body.pop()
    // REMOVE-END
}


/**
 * Draws the game state
 * @param {Game} game
 * @param {CanvasRenderingContext2D} pen
 */
function drawGame(game, pen) {
    // TODO: Clear the canvas
    // TODO: Draw the snake (head and body)

    // REMOVE-START
    pen.clearRect(0, 0, pen.canvas.width, pen.canvas.height)

    // Draw snake
    const snake = game.snake
    const headPosition = gridToCanvasPosition(snake.body[0])
    pen.fillStyle = snake.colors.head
    pen.fillRect(headPosition.x, headPosition.y, CELL_WIDTH, CELL_HEIGHT)

    for (const position of snake.body.slice(1)) {
        const bodyPosition = gridToCanvasPosition(position)
        pen.fillStyle = snake.colors.body
        pen.fillRect(bodyPosition.x, bodyPosition.y, CELL_WIDTH, CELL_HEIGHT)
    }
    // REMOVE-END
}




// GAME INITIALIZATION

const scoreElement = document.getElementById('score')
const game = createGame()

/**
 * The game loop.
 * All games are handled using a game loop.
 * This function will be called every frame, and will update and draw the game.
 * It will also schedule the next frame using requestAnimationFrame.
 */
function gameLoop() {
    if (game.status !== 'running') return;

    updateGame(game)
    drawGame(game, pen)
    scoreElement.innerText = game.snake.body.length

    // This will make the game run at the game.speed frames per second
    setTimeout(() => {
        requestAnimationFrame(gameLoop);
    }, 1000 / game.speed);
}

// Start game 
// TODO (Optional): Add a start/pause button to start the game, or start it when pressing any key
game.status = 'running'
gameLoop()




// INPUT HANDLING / EVENT LISTENERS

document.addEventListener('keydown', (event) => {
    if (game.status !== 'running') return;

    const snake = game.snake
    let newDirection = null
    switch (event.key) {
        case 'ArrowUp':
            newDirection = 'up'
            break
        case 'ArrowDown':
            newDirection = 'down'
            break
        case 'ArrowLeft':
            newDirection = 'left'
            break
        case 'ArrowRight':
            newDirection = 'right'
            break
    }
    // Ads the new direction to the directions list to be processed in the next frame
    // Only if the new direction is different from the last direction in the list
    if (newDirection && snake.directions[snake.directions.length - 1] !== newDirection) {
        snake.directions.push(newDirection)
    }
})

// TODO (Optional): Add a start/pause button to start the game, or start it when pressing any key
