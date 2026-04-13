import {
  screen, welcomeBox, gameBox, gameGrid, scoreDisplay, highScoreDisplay, pauseBox, gameOverBox, renderBigNumber,
  renderWelcomeContent, renderPauseContent, renderGameOverContent
} from './screens.js';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

const highScoreFile = path.join(process.cwd(), '.highscore');
let highScore = 0;

function loadHighScore() {
  try {
    if (fs.existsSync(highScoreFile)) {
      highScore = parseInt(fs.readFileSync(highScoreFile, 'utf8'), 10) || 0;
    }
  } catch (err) {
    highScore = 0;
  }
}

function saveHighScore() {
  try {
    fs.writeFileSync(highScoreFile, highScore.toString(), 'utf8');
  } catch (err) { }
}

let snake = [];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let score = 0;
let gameLoop = null;
let food = { x: 0, y: 0 };
let currentScreen = 'welcome';
let menuSelection = 0;
let animTick = 0;
let animInterval = null;
const width = 60;
const height = 20;

export function initGame() {
  snake = [
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 },
  ];
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  score = 0;
  loadHighScore();
  scoreDisplay.setContent(renderBigNumber(score, chalk.green));
  highScoreDisplay.setContent(renderBigNumber(highScore, chalk.yellow));
  spawnFood();
  draw();
}

function spawnFood() {
  while (true) {
    food.x = 1 + Math.floor(Math.random() * (width - 2));
    food.y = 1 + Math.floor(Math.random() * (height - 2));
    if (!snake.some(segment => segment.x === food.x && segment.y === food.y)) {
      break;
    }
  }
}

function draw() {
  let content = '';
  let grid = Array.from({ length: height }, () => Array.from({ length: width }, () => ' '));
  
  grid[food.y][food.x] = '{yellow-bg} {/yellow-bg}';
  
  snake.forEach((segment, index) => {
  if (segment.y >= 0 && segment.y < height && segment.x >= 0 && segment.x < width) {
    if (index === 0) {
      grid[segment.y][segment.x] = '{#39ff14-bg} {/}'; // head - bright phosphor
    } else {
      grid[segment.y][segment.x] = '{#007700-bg} {/}'; // body - mid green
    }
  }
});

  for (let y = 0; y < height; y++) {
    content += grid[y].join('');
    if (y < height - 1) content += '\n';
  }

  gameGrid.setContent(content);
  screen.render();
}

function move() {
  direction = nextDirection;
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };
  
  // Collisions with walls or self
  if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height || 
      snake.some(s => s.x === head.x && s.y === head.y)) {
    return gameOver();
  }
  
  snake.unshift(head);
  
  // Check if food eaten
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    if (score > highScore) {
      highScore = score;
      saveHighScore();
    }
    scoreDisplay.setContent(renderBigNumber(score, chalk.green));
    highScoreDisplay.setContent(renderBigNumber(highScore, chalk.yellow));
    spawnFood();
  } else {
    snake.pop(); // Remove tail if no food eaten
  }
  
  draw();
}

function scheduleNextMove() {
  if (gameLoop) clearTimeout(gameLoop);

  // Decrease interval (increase speed) as score goes up
  let speed = Math.max(40, 120 - (score / 10) * 3);

  // Terminal characters are typically taller than they are wide.
  // Delay vertical movements to make visual speed seem consistent.
  if (direction.y !== 0) {
    speed = Math.floor(speed * 1.6);
  }

  gameLoop = setTimeout(() => {
    move();
    if (currentScreen === 'game') {
      scheduleNextMove();
    }
  }, speed);
}

function startGameLoop() {
  stopAnimationLoop();
  scheduleNextMove();
}

function stopAnimationLoop() {
  if (animInterval) clearInterval(animInterval);
  animInterval = null;
}

function startAnimationLoop() {
  if (animInterval) return;
  animInterval = setInterval(() => {
    animTick++;
    updateMenuUI();
  }, 250);
}

function pauseGame() {
  if (gameLoop) {
    clearTimeout(gameLoop);
    gameLoop = null;
  }
}

function gameOver() {
  pauseGame();
  currentScreen = 'gameover';
  menuSelection = 0;
  startAnimationLoop();
  gameOverBox.setContent(renderGameOverContent(menuSelection, animTick));

  let flashes = 0;
  const flashInterval = setInterval(() => {
    gameBox.style.bg = flashes % 2 === 0 ? '#ff2200' : '#000000';
    screen.render();
    flashes++;
    if (flashes >= 6) {
      clearInterval(flashInterval);
      gameBox.style.bg = '#000000';
      gameOverBox.show();
      screen.render();
    }
  }, 80);
}

function updateMenuUI() {
  if (currentScreen === 'welcome') {
    welcomeBox.setContent(renderWelcomeContent(menuSelection, animTick));
  } else if (currentScreen === 'pause') {
    pauseBox.setContent(renderPauseContent(menuSelection, animTick));
  } else if (currentScreen === 'gameover') {
    gameOverBox.setContent(renderGameOverContent(menuSelection, animTick));
  }
  screen.render();
}

// Controls
screen.key(['up', 'w'], () => {
  if (currentScreen === 'game') {
    if (direction.y === 0 && nextDirection.y === 0) nextDirection = { x: 0, y: -1 };
  } else {
    menuSelection = (menuSelection - 1 + 2) % 2;
    updateMenuUI();
  }
});

screen.key(['down', 's'], () => {
  if (currentScreen === 'game') {
    if (direction.y === 0 && nextDirection.y === 0) nextDirection = { x: 0, y: 1 };
  } else {
    menuSelection = (menuSelection + 1) % 2;
    updateMenuUI();
  }
});

screen.key(['left', 'a'], () => {
  if (currentScreen === 'game') {
    if (direction.x === 0 && nextDirection.x === 0) nextDirection = { x: -1, y: 0 };
  }
});

screen.key(['right', 'd'], () => {
  if (currentScreen === 'game') {
    if (direction.x === 0 && nextDirection.x === 0) nextDirection = { x: 1, y: 0 };
  }
});

screen.key(['enter', 'space'], () => {
  if (currentScreen === 'welcome') {
    if (menuSelection === 0) { // PLAY
      welcomeBox.hide();
      gameBox.show();
      currentScreen = 'game';
      initGame();
      startGameLoop();
    } else { // EXIT
      process.exit(0);
    }
    screen.render();
  } else if (currentScreen === 'pause') {
    if (menuSelection === 0) { // RESUME
      pauseBox.hide();
      currentScreen = 'game';
      startGameLoop();
    } else { // EXIT
      process.exit(0);
    }
    screen.render();
  } else if (currentScreen === 'gameover') {
    if (menuSelection === 0) { // PLAY AGAIN
      gameOverBox.hide();
      currentScreen = 'game';
      initGame();
      startGameLoop();
    } else { // EXIT
      process.exit(0);
    }
    screen.render();
  } else if (currentScreen === 'game') {
    // Only handle pause (space/p) in game mode, but enter also toggles pause for convenience?
    // The previous logic had space/p for pause.
    pauseGame();
    pauseBox.show();
    currentScreen = 'pause';
    menuSelection = 0;
    startAnimationLoop();
    pauseBox.setContent(renderPauseContent(menuSelection, animTick));
    screen.render();
  }
});

screen.key(['p'], () => {
  if (currentScreen === 'game') {
    pauseGame();
    pauseBox.show();
    currentScreen = 'pause';
    menuSelection = 0;
    startAnimationLoop();
    pauseBox.setContent(renderPauseContent(menuSelection, animTick));
    screen.render();
  }
});

// Initial render
startAnimationLoop();
screen.render();