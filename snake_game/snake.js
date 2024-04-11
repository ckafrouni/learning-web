/** @type {HTMLCanvasElement} */
const c = document.getElementById("canvas")

const status = document.getElementById("status")
const level = document.getElementById("level")
const score = document.getElementById("score")

/** @type {CanvasRenderingContext2D} */
const ctx = c.getContext('2d')

c.width = 600
c.height = 600

const canvasStyles = getComputedStyle(c)
const NBLOCKS = parseInt(canvasStyles.getPropertyValue('--n-blocks'))
const BLOCK_WIDTH = c.width / NBLOCKS - 1
const BLOCK_HEIGHT = c.height / NBLOCKS - 1
const BLOCK_RADIUS = parseInt(canvasStyles.getPropertyValue('--border-radius'))

// Helper Drawing functions

/** @param {number} x @param {number} y @param {string} color */
function drawBlock(x, y, color) {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.roundRect(x * (BLOCK_WIDTH + 1), y * (BLOCK_HEIGHT + 1), BLOCK_WIDTH, BLOCK_HEIGHT, BLOCK_RADIUS)
    ctx.fill()
}

/** @param {number} x @param {number} y @param {string} color */
function drawCircle(x, y, color) {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x * (BLOCK_WIDTH + 1) + BLOCK_WIDTH / 2, y * (BLOCK_HEIGHT + 1) + BLOCK_HEIGHT / 2, BLOCK_WIDTH / 2, 0, 2 * Math.PI)
    ctx.fill()
}

/** @param {number} x @param {number} y @param {string} color */
function drawTriangle(x, y, color) {
    let position = { x: x * (BLOCK_WIDTH + 1), y: y * (BLOCK_HEIGHT + 1) }
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(position.x, position.y)
    ctx.lineTo(position.x + BLOCK_WIDTH, position.y)
    ctx.lineTo(position.x + BLOCK_WIDTH / 2, position.y + BLOCK_HEIGHT)
    ctx.fill()
}

/** @param {number} x @param {number} y @param {string} color */
function drawLosange(x, y, color) {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(x * (BLOCK_WIDTH + 1), y * (BLOCK_HEIGHT + 1) + BLOCK_HEIGHT / 2)
    ctx.lineTo(x * (BLOCK_WIDTH + 1) + BLOCK_WIDTH / 2, y * (BLOCK_HEIGHT + 1))
    ctx.lineTo(x * (BLOCK_WIDTH + 1) + BLOCK_WIDTH, y * (BLOCK_HEIGHT + 1) + BLOCK_HEIGHT / 2)
    ctx.lineTo(x * (BLOCK_WIDTH + 1) + BLOCK_WIDTH / 2, y * (BLOCK_HEIGHT + 1) + BLOCK_HEIGHT)
    ctx.fill()
}

/** @param {number} x @param {number} y @param {number} w @param {number} h @param {number} r */

// Game Objects and Drawing

/** 
 * @typedef Snake
 * @property {Array<{x: number, y: number}>} body
 * @property {string} direction
 * @property {Array<string>} nextDirection
 * @property {function} draw
 * @property {function(GameLevel): void} update
 */

/**
 * @typedef FoodType
 * @property {string} color
 * @property {function} shape
 * @property {function} power
 */

/**
 * @typedef Food
 * @property {FoodType} type
 * @property {{x: number, y: number}} position
 * @property {function} draw
 */

/**
 * @typedef GameLevel
 * @property {string} name
 * @property {boolean} walls
 * @property {Array<Food>} foods
 * @property {number} speed
 * @property {function(GameState): boolean} isComplete
 */

/**
 * @typedef GameState
 * @property {'running' | 'paused' | 'game-over'} status
 * @property {GameLevel} level
 * @property {Snake} snake
 * @property {Array<Food>} apples
 * @property {Array<Food>} poisons
 * @property {function} draw
 * @property {function} update
 * @property {function} reset
 */


/** @type {FoodType} */
const appleType = {
    color: 'red',
    shape: drawCircle,
    /** @param {Snake} snake */
    power: function (snake) {
        console.log('Apple eaten')
        snake.body.push({ x: snake.body[snake.body.length - 1].x, y: snake.body[snake.body.length - 1].y })
    },
}

/** @type {FoodType} */
const poisonType = {
    color: 'purple',
    shape: drawTriangle,
    power: function (snake) {
        console.log('Poison eaten')
        snake.body.pop()
    },
}

/** @type {FoodType} */
const reverseType = {
    color: 'blue',
    shape: drawLosange,
    power: function (snake) {
        console.log('Reverse eaten')
        snake.body.reverse()
        if (snake.body.length == 1) {
            snake.nextDirection = [{
                'up': 'down',
                'down': 'up',
                'left': 'right',
                'right': 'left',
            }[snake.direction]]
        } else {
            const dx = snake.body[0].x - snake.body[1].x
            const dy = snake.body[0].y - snake.body[1].y
            if (dx !== 0) {
                snake.nextDirection = dx > 0 ? ['right'] : ['left']
            } else {
                snake.nextDirection = dy > 0 ? ['down'] : ['up']
            }
        }
        snake.direction = snake.nextDirection[0]
    },
}


/**
 * @param {FoodType} type
 * @param {number} x
 * @param {number} y
 * @returns {Food}
 */
const makeFood = (type, x, y) => ({
    type,
    position: { x, y },
    draw: function () {
        this.type.shape(this.position.x, this.position.y, this.type.color)
    }
})

/** @returns {Snake} */
const makeSnake = () => ({
    direction: 'right',
    nextDirection: [],
    body: [
        { x: 5, y: 2 },
        { x: 4, y: 2 },
        { x: 3, y: 2 },
    ],
    draw: function () {
        drawBlock(this.body[0].x, this.body[0].y, 'darkgreen')
        this.body.slice(1).forEach(({ x, y }) => drawBlock(x, y, 'green'))
    },
    update: function (level) {
        while (this.nextDirection.length > 0) {
            const next = this.nextDirection.shift()
            if (this.direction === 'up' && next === 'down') continue
            if (this.direction === 'down' && next === 'up') continue
            if (this.direction === 'left' && next === 'right') continue
            if (this.direction === 'right' && next === 'left') continue
            this.direction = next
            break
        }
        switch (this.direction) {
            case 'up':
                this.body.unshift({ x: this.body[0].x, y: this.body[0].y - 1 })
                if (this.body[0].y < 0 && !level.walls) {
                    this.body[0].y = NBLOCKS - 1
                } else if (this.body[0].y < 0 && level.walls) {
                    gameState.status = 'game-over'
                }
                break
            case 'down':
                this.body.unshift({ x: this.body[0].x, y: this.body[0].y + 1 })
                if (this.body[0].y === NBLOCKS && !level.walls) {
                    this.body[0].y = 0
                } else if (this.body[0].y === NBLOCKS && level.walls) {
                    gameState.status = 'game-over'
                }
                break
            case 'left':
                this.body.unshift({ x: this.body[0].x - 1, y: this.body[0].y })
                if (this.body[0].x < 0 && !level.walls) {
                    this.body[0].x = NBLOCKS - 1
                } else if (this.body[0].x < 0 && level.walls) {
                    gameState.status = 'game-over'
                }
                break
            case 'right':
                this.body.unshift({ x: this.body[0].x + 1, y: this.body[0].y })
                if (this.body[0].x === NBLOCKS && !level.walls) {
                    this.body[0].x = 0
                } else if (this.body[0].x === NBLOCKS && level.walls) {
                    gameState.status = 'game-over'
                }
                break
        }
        this.body.pop()
    }
})

/** @type {Array<GameLevel>} */
const levels = [
    {
        name: 'Easy',
        walls: false,
        speed: 8,
        foods: [
            makeFood(appleType, 8, 8),
            makeFood(appleType, 3, 5),
            makeFood(poisonType, 4, 4),
            makeFood(reverseType, 13, 13),
        ],
        isComplete: function (gameState) {
            return gameState.snake.body.length >= 6
        }
    },
    {
        name: 'Easy[Walls]',
        walls: true,
        speed: 8,
        foods: [
            makeFood(appleType, 8, 8),
            makeFood(appleType, 3, 5),
            makeFood(poisonType, 4, 4),
            makeFood(reverseType, 13, 13),
        ],
        isComplete: function (gameState) {
            return gameState.snake.body.length >= 12
        }
    },
    {
        name: 'Medium',
        walls: false,
        speed: 8,
        foods: [
            makeFood(appleType, 8, 8),
            makeFood(appleType, 10, 2),
            makeFood(appleType, 3, 5),
            makeFood(poisonType, 4, 4),
            makeFood(poisonType, 3, 8),
            makeFood(reverseType, 13, 13),
        ],
        isComplete: function (gameState) {
            return gameState.snake.body.length >= 18
        }
    },
    {
        name: 'Medium[Walls]',
        walls: true,
        speed: 8,
        foods: [
            makeFood(appleType, 8, 8),
            makeFood(appleType, 10, 2),
            makeFood(appleType, 3, 5),
            makeFood(poisonType, 4, 4),
            makeFood(poisonType, 3, 8),
            makeFood(reverseType, 13, 13),
        ],
        isComplete: function (gameState) {
            return gameState.snake.body.length >= 24
        }
    },
    {
        name: 'Hard',
        walls: false,
        speed: 12,
        foods: [
            makeFood(appleType, 8, 8),
            makeFood(appleType, 10, 2),
            makeFood(appleType, 3, 5),
            makeFood(poisonType, 4, 4),
            makeFood(poisonType, 3, 8),
            makeFood(reverseType, 6, 1),
            makeFood(reverseType, 13, 13),
        ],
        isComplete: function (gameState) {
            return gameState.snake.body.length >= 30
        }
    },
    {
        name: 'Hard[Walls]',
        walls: true,
        speed: 12,
        foods: [
            makeFood(appleType, 8, 8),
            makeFood(appleType, 10, 2),
            makeFood(appleType, 3, 5),
            makeFood(poisonType, 4, 4),
            makeFood(poisonType, 3, 8),
            makeFood(reverseType, 6, 1),
            makeFood(reverseType, 13, 13),
        ],
        isComplete: function (gameState) {
            return false
        }
    },

]


/** 
 * @param {GameLevel} level
 * @returns {GameState} 
 */
const makeGameState = (level) => ({
    status: 'game-over',
    level,
    snake: makeSnake(),
    foods: [...level.foods],
    draw: function () {
        ctx.clearRect(0, 0, c.width, c.height)
        this.snake.draw()
        this.foods.forEach(food => food.draw())
    },
    update: function () {
        this.snake.update(this.level)
        if (this.snake.body.slice(1).some(segment => segment.x === this.snake.body[0].x && segment.y === this.snake.body[0].y)) {
            this.status = 'game-over'
        }
        this.foods.forEach(food => {
            if (food.position.x === this.snake.body[0].x && food.position.y === this.snake.body[0].y) {
                food.position = {
                    x: Math.floor(Math.random() * NBLOCKS),
                    y: Math.floor(Math.random() * NBLOCKS),
                }
                food.type.power(this.snake)
            }
        })
        if (this.level.isComplete(this)) {
            this.level = levels[levels.indexOf(this.level) + 1]
            this.foods = [...this.level.foods]
        }
    },
    reset: function () {
        this.snake = makeSnake()
        this.foods = [...this.level.foods]
    }
})


// Game Loop

/** @type {GameState} */
const gameState = makeGameState(levels[0])

document.addEventListener('keydown', (e) => {
    if (gameState.status !== 'running') return
    switch (e.key) {
        case 'ArrowUp':
            gameState.snake.nextDirection.push('up')
            break
        case 'ArrowDown':
            gameState.snake.nextDirection.push('down')
            break
        case 'ArrowLeft':
            gameState.snake.nextDirection.push('left')
            break
        case 'ArrowRight':
            gameState.snake.nextDirection.push('right')
            break
    }
})

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case ' ':
            console.log('Space');
            if (gameState.status === 'running') {
                gameState.status = 'paused'
            } else if (gameState.status === 'paused') {
                gameState.status = 'running'
                window.requestAnimationFrame(loop)
            } else if (gameState.status === 'game-over') {
                gameState.reset()
                gameState.status = 'running'
                window.requestAnimationFrame(loop)
            }
            break
    }
})


const loop = () => {
    canvas.setAttribute('status', gameState.status)
    canvas.setAttribute('walls', gameState.level.walls)
    level.textContent = gameState.level.name
    status.textContent = gameState.status
    status.setAttribute('status', gameState.status)

    score.textContent = gameState.snake.body.length
    if (gameState.status !== 'running') {
        return
    }
    gameState.update()
    gameState.draw()
    // Call the next frame
    setTimeout(() => {
        window.requestAnimationFrame(loop)
    }, 1000 / gameState.level.speed)
}
window.requestAnimationFrame(loop)
