//VARIABLES LIST:
const board = document.getElementById('game-board');
const gridSize = 20;
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

const eatSound = new Audio('sounds/eat.mp3');
const gameOverSound = new Audio('sounds/game-over.mp3');
const clickSound = new Audio('sounds/click.mp3');
const restartSound = new Audio('sounds/restart.mp3');
const errorSound = new Audio('sounds/error.mp3');

errorSound.volume = 0.25;
eatSound.volume = 0.5;
restartSound.volume = 0.5;
clickSound.volume = 0.5;
gameOverSound.volume = 0.5;

let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let isPaused = false;

let isMuted = false;
const muteBtn = document.getElementById("mute-btn");

let highScore = localStorage.getItem("highScore") || 0;
highScoreText.textContent = highScore.toString().padStart(3, '0');
highScoreText.style.display = 'block';


////FUNCTIONS LIST:
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
    eatSound.play();
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
  if (!gameStarted && (event.code === 'Space' || event.code === ' ')) {
    startGame();
    return;
  }

  const keyMapping = {
    ArrowUp: 'up', w: 'up', W: 'up',
    ArrowDown: 'down', s: 'down', S: 'down',
    ArrowLeft: 'left', a: 'left', A: 'left',
    ArrowRight: 'right', d: 'right', D: 'right'
  };

  if (keyMapping[event.key]) {
    direction = keyMapping[event.key];
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
    updateHighScore();
    updateScore();
    stopGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      updateHighScore();
      updateScore();
      stopGame();
    }
  }
}

function resetGame() {
  document.getElementById("game-over-screen").style.display = "none";
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = 'right';
  gameSpeedDelay = 200;
}

function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, '0');
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  updateHighScore();
  gameOverSound.play();
  document.getElementById("final-score").textContent = snake.length - 1;
  document.getElementById("game-over-screen").style.display = "block";
}

function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    localStorage.setItem("highScore", highScore);
    highScoreText.textContent = highScore.toString().padStart(3, '0')
  }
  highScoreText.style.display = 'block';
}

function togglePause() {
  if (!gameStarted) return;
  isPaused = !isPaused;
  document.getElementById("pause-btn").innerText = isPaused ? "▶️ Resume" : "⏸️ Pause";
}

function resetHighScore() {
  localStorage.removeItem("highScore");
  highScore = 0;
  highScoreText.textContent = highScore.toString().padStart(3, '0');
}

function updateMuteState() {
  const volume = isMuted ? 0 : 0.5;

  eatSound.volume = volume;
  gameOverSound.volume = volume;
  clickSound.volume = volume;

  if (isMuted) {
    eatSound.pause();
    gameOverSound.pause();
    clickSound.pause();
  }

  muteBtn.innerText = isMuted ? "🔇 Unmute" : "🔊 Mute";
}

const spaceEvent = new KeyboardEvent("keydown", {
  key: " ",
  code: "Space",
  keyCode: 32,
  which: 32,
  bubbles: true
});


//BUTTONS ACTIONS:
document.getElementById("restart-btn").addEventListener("click", function () {
  resetGame();
  document.dispatchEvent(spaceEvent);
  restartSound.play();
});
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    resetGame();
    document.dispatchEvent(spaceEvent);
    restartSound.play();
  }
});

document.getElementById("about-btn").addEventListener("click", function () {
  clickSound.play();
  alert("🐍 Snake Game v1.0.0\n\n👨‍💻 Made for: WebProg Task\n📟 Made with guide from: freeCodeCamp.org\n🔗 GitHub: github.com/OrangeP1llow\n📧 Contacts: https://t.me/orangep1llow\n\nThaks for playing this game! ❤️");
});

document.getElementById("pause-btn").addEventListener("click", function () {
  if (!gameStarted) {
    errorSound.play();
    return;
  }
  clickSound.play();
  togglePause();
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && gameStarted) {
    clickSound.play();
    togglePause();
  }
});

document.getElementById("controls-btn").addEventListener("click", function () {
  clickSound.play();
  alert("👆 Up - Arrow Up || [W]\n👇 Down - Arrow Down || [S]\n👈 Left - Arrow Left || [A]\n👉 Right - Arrow Right [D]\n⏸️ Pause - Escape\n🔄 Restart - Enter");
});

document.getElementById("resetHighScore-btn").addEventListener("click", function () {
  clickSound.play();

  if (!highScore || highScore === "0") {
    alert("ℹ️ There is no HighScore to reset.");
    return;
  }

  const message = "⚠️ You really want to reset your HighScore?";

  if (confirm(message)) {
    resetHighScore();
  }
});

document.getElementById("mute-btn").addEventListener("click", function () {
  clickSound.play();
  isMuted = !isMuted;
  updateMuteState();
});