import blessed from 'neo-blessed';

const screen = blessed.screen({
  smartCSR: true,
  title: 'Snake'
});

// Welcome Screen
const welcomeBox = blessed.box({
  parent: screen,
  top: 'center',
  left: 'center',
  width: 40,
  height: 12,
  border: { type: 'line' },
  content: '\n{center}{bold}Snake{/bold}{/center}\n\n\n{center}Play (Enter){/center}\n\n{center}Exit (Esc){/center}',
  tags: true,
});

// Game Screen
const gameBox = blessed.box({
  parent: screen,
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  hidden: true,
});

const controlsLeft = blessed.text({
  parent: gameBox,
  top: 'center',
  left: 2,
  content: 'forward: W\ndown: S\nleft: A\nright: D\n\npause: Enter /space\nExit: esc',
  tags: true,
});

const scoreLabel = blessed.text({
  parent: gameBox,
  top: 8,
  right: 18,
  content: 'your score',
});

const scoreBig = blessed.bigtext({
  parent: gameBox,
  top: 10,
  right: 18,
  content: '0',
  fch: '█',
});

const highScoreLabel = blessed.text({
  parent: gameBox,
  top: 18,
  right: 18,
  content: 'high score',
});

const highScoreBig = blessed.bigtext({
  parent: gameBox,
  top: 20,
  right: 18,
  content: '0',
  fch: '█',
});

const gameGrid = blessed.box({
  parent: gameBox,
  top: 'center',
  left: 'center',
  width: 62,
  height: 22,
  border: { type: 'line' },
  tags: true,
});

// Pause Screen
const pauseBox = blessed.box({
  parent: screen,
  top: 'center',
  left: 'center',
  width: 40,
  height: 12,
  border: { type: 'line' },
  content: '\n{center}{bold}Paused{/bold}{/center}\n\n\n{center}Resume (Enter){/center}\n\n{center}Exit (Esc){/center}',
  tags: true,
  hidden: true,
});

// Game Over Screen
const gameOverBox = blessed.box({
  parent: screen,
  top: 'center',
  left: 'center',
  width: 50,
  height: 12,
  border: { type: 'line' },
  hidden: true,
});

const gameOverTitle = blessed.text({
  parent: gameOverBox,
  top: 1,
  left: 'center',
  content: '{bold}Game over{/bold}',
  tags: true,
});

const gameOverControls = blessed.text({
  parent: gameOverBox,
  top: 5,
  left: 4,
  content: 'Play again (Enter)\n\nExit (Esc)',
  tags: true,
});

const gameOverScore = blessed.text({
  parent: gameOverBox,
  top: 4,
  right: 4,
  content: 'your score\n0\nhigh score: 0',
  align: 'left',
  tags: true,
});

screen.key(['escape', 'q', 'C-c'], () => {
  return process.exit(0);
});

export { screen, welcomeBox, gameBox, gameGrid, scoreBig, highScoreBig, pauseBox, gameOverBox, gameOverScore };