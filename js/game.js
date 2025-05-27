const jumpSound = new Audio('assets/sounds/jump.mp3'); // jumping sound
const gameOverSound = new Audio('assets/sounds/game-over.mp3');

// Core game logic: player jump, obstacle generation, scoring

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score-display');

// Game settings
const gravity = 0.5;
const jumpStrength = -10;
const obstacleSpeed = 3;
const obstacleInterval = 1500; // ms

// Player object
const player = {
  x: 50,
  y: canvas.height - 60,
  width: 20,
  height: 50,
  velocityY: 0,
  isJumping: false
};

// Obstacles array
let obstacles = [];
let score = 0;
let gameOver = false;

// Handle jump
function jump() {
  if (!player.isJumping) {
    player.velocityY = jumpStrength;
    player.isJumping = true;
    
// Play jump sound
   jumpSound.currentTime = 0; // rewind to start
  jumpSound.play();

  }
}

// Touch and keyboard support
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') jump();
});
canvas.addEventListener('touchstart', jump);

// Create obstacles
function spawnObstacle() {
  const height = 30 + Math.random() * 50;
  obstacles.push({
    x: canvas.width,
    y: canvas.height - height,
    width: 30,
    height: height
  });
}

// Collision detection
function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// Game loop
function update() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update player
  player.velocityY += gravity;
  player.y += player.velocityY;

  // Ground collision
  if (player.y + player.height >= canvas.height) {
    player.y = canvas.height - player.height;
    player.velocityY = 0;
    player.isJumping = false;
  }

  // Draw player
  ctx.fillStyle = '#3498db';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Update and draw obstacles
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obs = obstacles[i];
    obs.x -= obstacleSpeed;

    // Remove off-screen obstacles
    if (obs.x + obs.width < 0) {
      obstacles.splice(i, 1);
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
    }

    // Draw obstacle
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

    // Check collision
    if (isColliding(player, obs)) {
      endGame();
    }
  }

  requestAnimationFrame(update);
}

// End game
function endGame() {
  if (!gameOver) {
    gameOver = true;

    // Play game over sound
    gameOverSound.currentTime = 0;
    gameOverSound.play();

    // Save score andredirect
    localStorage.setItem('skyjumper_score', score);
    setTimeout(() => {
      window.location.href = 'scores.html';
    }, 1000); // Wait 1 second to let the sound play
  }
}


// Start game
setInterval(spawnObstacle, obstacleInterval);
update();
document.body.addEventListener('touchstart', jump);
