const board = document.getElementById('game-board');
const gridSize = 20;
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let isPaused = false;

function draw() {
  board.innerHTML = '';
  drawSnake();
  drawFood();
  updateScore();
}

function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement('div', 'snake');
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
}

function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

function move() {
  if (isPaused) return;
  const head = { ...snake[0] };
  switch (direction) {
    case 'right':
      head.x++;
      break;

    case 'up':
      head.y--;
      break;

    case 'down':
      head.y++;
      break;

    case 'left':
      head.x--;
      break;
  }

  snake.unshift(head);

  if (head.x == food.x && head.y == food.y) {
    food = generateFood();
    increaseSpeed();
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}

function startGame() {
  gameStarted = true;
  instructionText.style.display = 'none';
  logo.style.display = 'none';
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

function handleKeyPress(event) {
  if ((!gameStarted && event.code === 'Space') || (!gameStarted && event.code === ' ')) {
    startGame();
  } else {
    switch (event.key) {
      case 'ArrowUp':
        direction = 'up';
        break;

      case 'ArrowDown':
        direction = 'down';
        break;

      case 'ArrowLeft':
        direction = 'left';
        break;

      case 'ArrowRight':
        direction = 'right';
        break;

      case 'w':
        direction = 'up';
        break;

      case 's':
        direction = 'down';
        break;

      case 'a':
        direction = 'left';
        break;

      case 'd':
        direction = 'right';
        break;
    }
  }
}

document.addEventListener('keydown', handleKeyPress);

function increaseSpeed() {
  console.log(gameSpeedDelay);
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 7;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

function checkCollision() {
  const head = snake[0];

  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = 'right';
  gameSpeedDelay = 200;
  updateScore();
}

function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, '0');
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = 'block';
  logo.style.display = 'block';
}

function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, '0')
  }
  highScoreText.style.display = 'block';
}

function togglePause() {
  isPaused = !isPaused;
  document.getElementById("pause-btn").innerText = isPaused ? "▶️ Resume" : "⏸️ Pause";
}



document.getElementById("about-btn").addEventListener("click", function () {
  alert("🐍 Snake Game v1.0.1 by StanisLove\n\n👨‍💻 Developer: StanisLove\n📟 Made with guide from: freeCodeCamp.org\n🔗 GitHub: github.com/OrangeP1llow\n📧 Contacts: https://t.me/orangep1llow\n\nThaks for playing this game! ❤️");
});

document.getElementById("pause-btn").addEventListener("click", togglePause);

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    togglePause();
  }
});

document.getElementById("controls-btn").addEventListener("click", function () {
  alert("👆 Up - Arrow Up || [W]\n👇 Down - Arrow Down || [S]\n👈 Left - Arrow Left || [A]\n👉 Right - Arrow Right [D]\n⏸️ Pause - Escape");
});