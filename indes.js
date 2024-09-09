// @ts-check

/**
 * @typedef {{ x: number, y: number, width: number, height: number, speed: number }} Player
 * @typedef {{ x: number, y: number, width: number, height: number, speed: number }} Obstacle
 */

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('gameCanvas'));
const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));

/** @type {Player} */
let player = { x: 180, y: 550, width: 40, height: 40, speed: 5 };

/** @type {Obstacle[]} */
let obstacles = [];

let score = 0;  // @type {number}
let gameOver = false;  // @type {boolean}
let gameFrames = 0;  // @type {number}

// Керування гравцем за допомогою клавіш "стрілок"
document.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowLeft' && player.x > 0) {
    player.x -= player.speed;
  } else if (event.key === 'ArrowRight' && player.x + player.width < canvas.width) {
    player.x += player.speed;
  }
});

/**
 * Створює нову перешкоду і додає її в масив obstacles
 * @returns {void}
 */
function createObstacle() {
  let width = Math.floor(Math.random() * (canvas.width / 2)) + 50;  // @type {number}
  let x = Math.floor(Math.random() * (canvas.width - width));  // @type {number}
  obstacles.push({ x: x, y: 0, width: width, height: 20, speed: 3 });
}

/**
 * Оновлює положення перешкод і видаляє їх, якщо вони виходять за межі екрану
 * @returns {void}
 */
function updateObstacles() {
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].y += obstacles[i].speed;
    
    if (obstacles[i].y > canvas.height) {
      obstacles.splice(i, 1);
      score += 1;
      i--;
    }
  }
}

/**
 * Перевіряє зіткнення гравця з перешкодою
 * @param {Player} player - Об'єкт гравця
 * @param {Obstacle} obstacle - Об'єкт перешкоди
 * @returns {boolean}
 */
function checkCollision(player, obstacle) {
  return (
    player.x < obstacle.x + obstacle.width &&
    player.x + player.width > obstacle.x &&
    player.y < obstacle.y + obstacle.height &&
    player.y + player.height > obstacle.y
  );
}

/**
 * Малює гравця на канвасі
 * @returns {void}
 */
function drawPlayer() {
  ctx.fillStyle = '#00f';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

/**
 * Малює перешкоди на канвасі
 * @returns {void}
 */
function drawObstacles() {
  ctx.fillStyle = '#f00';
  for (let obstacle of obstacles) {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  }
}

/**
 * Відображає очки на екрані
 * @returns {void}
 */
function drawScore() {
  document.getElementById('score').innerText = 'Очки: ' + score;
}

/**
 * Основний ігровий цикл
 * @returns {void}
 */
function gameLoop() {
  if (gameOver) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText('Гра закінчена!', 90, 300);
    ctx.font = '20px Arial';
    ctx.fillText('Очки: ' + score, 160, 350);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  drawObstacles();
  drawScore();

  updateObstacles();

  for (let obstacle of obstacles) {
    if (checkCollision(player, obstacle)) {
      gameOver = true;
    }
  }

  gameFrames++;
  if (gameFrames % 60 === 0) {
    createObstacle();
  }

  requestAnimationFrame(gameLoop);
}

// Запуск гри
gameLoop();
