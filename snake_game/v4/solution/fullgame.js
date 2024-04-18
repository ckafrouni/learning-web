/**
 * Full Snake Game Structure
 * 
 * @typedef Game
 * @type {object}
 * @property {GameStatus} status - The current game status
 * @property {Snake} snake - The snake object
 * @property {number} speed - The current speed
 * @property {Food[]} foods - The food object list
 * @property {number} score - The current score
 */
/** 
 * @typedef Snake
 * @type {object}
 * @property {Position} position - The position of the snake's head
 * @property {Direction} direction - The current direction of the snake
 * @property {Direction[]} directions - The directions the snake has to follow
 * @property {{head: string, body: string}} colors - The snake's colors
 */
/**
 * The food object must define an effect function that will be \
 * called when the snake eats the food.
 * @typedef Food
 * @type {object}
 * @property {Position} position - The position of the food
 * @property {string} color - The color of the food
 * @property {boolean} respawn - If the food has to respawn
 * @property {(game: Game) => void} effect - The effect of the food
 */
/**
 * The position within the game grid
 * @typedef Position
 * @type {object}
 * @property {number} x - The x position
 * @property {number} y - The y position
 */
/**
 * Status of the game
 * @typedef GameStatus
 * @type {'ready'|'running'|'over'}
 */
/**
 * The direction the snake can move
 * @typedef Direction
 * @type {'up'|'down'|'left'|'right'}
 */
