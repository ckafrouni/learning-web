export function keyDownHandler(gameState) {
    return function (event) {
        const { key } = event;
        console.log('Key pressed:', key);
        const { snake } = gameState;
        switch (key) {
            case 'ArrowUp':
                if (snake.direction !== 'down') {
                    snake.direction = 'up';
                }
                break;
            case 'ArrowDown':
                if (snake.direction !== 'up') {
                    snake.direction = 'down';
                }
                break;
            case 'ArrowLeft':
                if (snake.direction !== 'right') {
                    snake.direction = 'left';
                }
                break;
            case 'ArrowRight':
                if (snake.direction !== 'left') {
                    snake.direction = 'right';
                }
                break;
        }
    };
}
