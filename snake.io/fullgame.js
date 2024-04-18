/**
 * Full Snake Game Structure
 * 
 * @typedef Game
 * @type {object}
 * @property {GameStatus} status - The current game status
 * @property {Snake} snake - The snake object
 * @property {Food[]} foods - The food object list
 * @property {number} score - The current score
 * @property {number} speed - The current speed
 *
 * 
 * @typedef Snake
 * @type {object}
 * @property {Position} position - The position of the snake's head
 * @property {Direction} direction - The current direction of the snake
 * @property {Direction[]} directions - The directions the snake has to follow
 * @property {string} headColor - The color of the snake head
 * @property {string} bodyColor - The color of the snake body
 * 
 * @typedef Food
 * @type {object}
 * @property {Position} position - The position of the food
 * @property {string} color - The color of the food
 * @property {boolean} respawn - If the food has to respawn
 * @property {(game: Game) => void} effect - The effect of the food
 * 
 * @typedef Position - The position within the game grid
 * @type {object}
 * @property {number} x - The x position
 * @property {number} y - The y position
 * 
 * @typedef GameStatus
 * @type {'ready'|'running'|'over'}
 * 
 * @typedef Direction
 * @type {'up'|'down'|'left'|'right'}
 * 
 */
