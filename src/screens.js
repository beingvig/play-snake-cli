import blessed from 'neo-blessed';

const screen = blessed.screen({
  smartCSR: true,
  title: 'Snake'
});

const welcomeBox = blessed.box({
  parent: screen,
  top: 'center',
  left: 'center',
  width: 30,
  height: 10,
  border: { type: 'line' },
  content: '{center}Snake{/center}\n\n{center}Play (Enter){/center}\n\n{center}Exit (Esc){/center}',
  tags: true,
});

const gameBox = blessed.box({
  parent: screen,
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  border: { type: 'line' },
  hidden: true,
});

const gameGrid = blessed.box({
  parent: gameBox,
  top: 3,
  left: 'center',
  width: '80%',
  height: '80%',
  border: { type: 'dashed' },
});

const scoreBox = blessed.text({
  parent: gameBox,
  top: 1,
  right: 2,
  content: 'Your score\n0',
  tags: true,
});

const pauseBox = blessed.box({
  parent: screen,
  top: 'center',
  left: 'center',
  width: 30,
  height: 10,
  border: { type: 'line' },
  content: '{center}Paused{/center}\n\n{center}Resume (Enter){/center}\n\n{center}Exit (Esc){/center}',
  tags: true,
  hidden: true,
});

const gameOverBox = blessed.box({
  parent: screen,
  top: 'center',
  left: 'center',
  width: 30,
  height: 10,
  border: { type: 'line' },
  content: '{center}Game Over{/center}\n\n{center}Play Again (Enter){/center}\n\n{center}Exit (Esc){/center}',
  tags: true,
  hidden: true,
});

//Wellcome Screen controls
screen.key('enter', () => {
  welcomeBox.hide();
  gameBox.show();
  screen.render();
});

screen.key('escape', () => {
  process.exit(0);
});

//Pause Screen controls
let currentScreen = 'welcome';

screen.key('enter', () => {
  if (currentScreen === 'welcome') {
    welcomeBox.hide();
    gameBox.show();
    currentScreen = 'game';
    screen.render();
  } else if (currentScreen === 'pause') {
    pauseBox.hide();
    gameBox.show();
    currentScreen = 'game';
    screen.render();
  } else if (currentScreen === 'gameover') {
    gameOverBox.hide();
    welcomeBox.show();
    currentScreen = 'welcome';
    screen.render();
  }
});

screen.key('space', () => {
  if (currentScreen === 'game') {
    gameBox.hide();
    pauseBox.show();
    currentScreen = 'pause';
    screen.render();
  }
});

screen.key('escape', () => {
  process.exit(0);
});

//Game Over
// screen.key('g', () => {
//   gameBox.hide();
//   gameOverBox.show();
//   currentScreen = 'gameover';
//   screen.render();
// });

screen.render();

export { screen, welcomeBox, gameBox, gameGrid, scoreBox, pauseBox, gameOverBox };