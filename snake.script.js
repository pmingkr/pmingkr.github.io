const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// Touch control buttons
const upBtn = document.getElementById('up-btn');
const downBtn = document.getElementById('down-btn');
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');

const GRID_SIZE = 20;
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let dx = GRID_SIZE;
let dy = 0;
let score = 0;
let changingDirection = false;
let isGameOver = false;

function main() {
    if (isGameOver) {
        alert(`Game Over! Your score: ${score}. Press OK to restart.`);
        document.location.reload();
        return;
    }

    changingDirection = false;
    setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
        main();
    }, 100);
}

function clearCanvas() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = 'lightgreen';
    ctx.strokeStyle = 'darkgreen';
    ctx.fillRect(snakePart.x * GRID_SIZE, snakePart.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    ctx.strokeRect(snakePart.x * GRID_SIZE, snakePart.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'darkred';
    ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    ctx.strokeRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
}

function moveSnake() {
    const head = { x: snake[0].x + dx / GRID_SIZE, y: snake[0].y + dy / GRID_SIZE };
    snake.unshift(head);

    const hasEatenFood = snake[0].x === food.x && snake[0].y === food.y;
    if (hasEatenFood) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }

    checkCollision();
}

function checkCollision() {
    // Wall collision
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > (CANVAS_WIDTH / GRID_SIZE) - 1;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > (CANVAS_HEIGHT / GRID_SIZE) - 1;

    if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
        isGameOver = true;
    }

    // Self collision
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            isGameOver = true;
            return;
        }
    }
}

function generateFood() {
    food.x = Math.floor(Math.random() * (CANVAS_WIDTH / GRID_SIZE));
    food.y = Math.floor(Math.random() * (CANVAS_HEIGHT / GRID_SIZE));
    snake.forEach(function isFoodOnSnake(part) {
        if (part.x === food.x && part.y === food.y) {
            generateFood();
        }
    });
}

function changeDirection(direction) {
    if (changingDirection) return;
    changingDirection = true;

    const goingUp = dy === -GRID_SIZE;
    const goingDown = dy === GRID_SIZE;
    const goingRight = dx === GRID_SIZE;
    const goingLeft = dx === -GRID_SIZE;

    if (direction === 'LEFT' && !goingRight) {
        dx = -GRID_SIZE;
        dy = 0;
    }
    if (direction === 'UP' && !goingDown) {
        dx = 0;
        dy = -GRID_SIZE;
    }
    if (direction === 'RIGHT' && !goingLeft) {
        dx = GRID_SIZE;
        dy = 0;
    }
    if (direction === 'DOWN' && !goingUp) {
        dx = 0;
        dy = GRID_SIZE;
    }
}

function handleKeyPress(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;

    if (keyPressed === LEFT_KEY) {
        changeDirection('LEFT');
    }
    if (keyPressed === UP_KEY) {
        changeDirection('UP');
    }
    if (keyPressed === RIGHT_KEY) {
        changeDirection('RIGHT');
    }
    if (keyPressed === DOWN_KEY) {
        changeDirection('DOWN');
    }
}

// Event Listeners
document.addEventListener('keydown', handleKeyPress);
upBtn.addEventListener('click', () => changeDirection('UP'));
downBtn.addEventListener('click', () => changeDirection('DOWN'));
leftBtn.addEventListener('click', () => changeDirection('LEFT'));
rightBtn.addEventListener('click', () => changeDirection('RIGHT'));

generateFood();
main();
