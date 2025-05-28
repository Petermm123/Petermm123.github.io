// Load sound effects
const jumpSound = new Audio('assets/sounds/jump.mp3');
const gameOverSound = new Audio('assets/sounds/game-over.mp3');

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score-display');

// Load character sprite
const characterSprite = new Image();
characterSprite.src = 'assets/sprites/character.png';

// Game settings
const gravity = 0.5;
const jumpStrength = -10;
const obstacleSpeed = 3;
const obstacleInterval = 1500;

const player = {
  x: 50,
  y: canvas.height - 60,
  width: 40,
  height: 50,
  velocityY: 0,
  isJumping: false
};

let obstacles = [];
let score = 0;
let gameOver = false;
let isPaused = false;
let obstacleIntervalId;

// Handle jump input
function jump() {
  if (!player.isJumping && !isPaused && !gameOver) {
    player.velocityY = jumpStrength;
    player.isJumping = true;
    jumpSound.currentTime = 0;
    jumpSound.play();
  }
}

// 🖱️ Input listeners
document.body.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  if (
    e.clientX >= rect.left &&
    e.clientX <= rect.right &&
    e.clientY >= rect.top &&
    e.clientY <= rect.bottom
  ) {
    jump();
  }
});
canvas.addEventListener('touchstart', jump);
document.body.addEventListener('touchstart', jump);

// Spawn new obstacles
function spawnObstacle() {
  const height = 30 + Math.random() * 50;
  const width = 30 + Math.random() * 20;
  obstacles.push({
    x: canvas.width,
    y: canvas.height - height,
    width: width,
    height: height
  });
}

// 🧠 Collision detection
function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// 🎮 Game loop
function update() {
  if (gameOver || isPaused) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update player physics
  player.velocityY += gravity;
  player.y += player.velocityY;

  // Ground collision
  if (player.y + player.height >= canvas.height) {
    player.y = canvas.height - player.height;
    player.velocityY = 0;
    player.isJumping = false;
  }

  // Draw player sprite
  ctx.drawImage(characterSprite, player.x, player.y, player.width, player.height);

  // Update and draw obstacles
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obs = obstacles[i];
    obs.x -= obstacleSpeed;

    if (obs.x + obs.width < 0) {
      obstacles.splice(i, 1);
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
    }

    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

    if (isColliding(player, obs)) {
      endGame();
    }
  }

  requestAnimationFrame(update);
}

// 💀 End game logic
function endGame() {
  gameOver = true;
  clearInterval(obstacleIntervalId);
  gameOverSound.currentTime = 0;
  gameOverSound.play();
  localStorage.setItem('skyjumper_score', score);

  setTimeout(() => {
    window.location.href = 'scores.html';
  }, 1000);
}

// ▶ Start game
obstacleIntervalId = setInterval(spawnObstacle, obstacleInterval);
update();

// ⏸ Pause/Resume button logic
document.getElementById('pause-btn').addEventListener('click', () => {
  isPaused = !isPaused;
  const btn = document.getElementById('pause-btn');
  btn.textContent = isPaused ? '▶ Resume' : '⏸ Pause';

  if (isPaused) {
    clearInterval(obstacleIntervalId);
  } else {
    obstacleIntervalId = setInterval(spawnObstacle, obstacleInterval);
    update();
  }
});
