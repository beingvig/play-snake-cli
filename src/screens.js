import blessed from 'neo-blessed';
import chalk from 'chalk';
import asciiArt from './ascii-art.json' with { type: 'json' };

const bigNumbers = {
  '0': ['███████', '█     █', '█     █', '█     █', '███████'],
  '1': ['  ███  ', ' █ ██  ', '   █   ', '   █   ', '███████'],
  '2': ['███████', '      █', '███████', '█      ', '███████'],
  '3': ['███████', '      █', '███████', '      █', '███████'],
  '4': ['█     █', '█     █', '███████', '      █', '      █'],
  '5': ['███████', '█      ', '███████', '      █', '███████'],
  '6': ['███████', '█      ', '███████', '█     █', '███████'],
  '7': ['███████', '      █', '     █ ', '    █  ', '    █  '],
  '8': ['███████', '█     █', '███████', '█     █', '███████'],
  '9': ['███████', '█     █', '███████', '      █', '███████']
};

function renderBigNumber(num, colorFn) {
  const str = num.toString();
  const lines = ['', '', '', '', ''];
  for (let i = 0; i < str.length; i++) {
    const digit = str[i];
    const pattern = bigNumbers[digit] || bigNumbers['0'];
    for (let line = 0; line < 5; line++) {
      lines[line] += pattern[line] + ' ';
    }
  }
  return lines.map(line => colorFn(line)).join('\n');
}

const screen = blessed.screen({
  smartCSR: true,
  title: 'Snake'
});

// Welcome Screen
const welcomeBox = blessed.box({
  parent: screen,
  top: 'center',
  left: 'center',
  width: 91,
  height: 15,
  content: '\n' + asciiArt.welcome + '\n\n{center}Play (Enter){/center}\n\n{center}Exit (Esc){/center}',
  tags: true,
  align: 'center',
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
  top: 2,
  left: 2,
  content:
    chalk.cyan.bold('═══ MOVEMENT ═══\n\n') +
    chalk.white.bold('  W') + chalk.gray(' - UP\n') +
    chalk.white.bold('  S') + chalk.gray(' - DOWN\n') +
    chalk.white.bold('  A') + chalk.gray(' - LEFT\n') +
    chalk.white.bold('  D') + chalk.gray(' - RIGHT\n\n') +
    chalk.yellow.bold('═══ CONTROLS ═══\n\n') +
    chalk.white('  ENTER/SPACE') + chalk.gray(' - PAUSE\n') +
    chalk.red('  ESC') + chalk.gray(' - QUIT'),
  tags: false,
});

const scoreLabel = blessed.text({
  parent: gameBox,
  top: 2,
  right: 2,
  content: chalk.blue.bold('╔════════════════╗\n') +
           chalk.blue.bold('║   YOUR SCORE   ║\n') +
           chalk.blue.bold('╚════════════════╝'),
  tags: false,
});

const scoreDisplay = blessed.text({
  parent: gameBox,
  top: 6,
  right: 2,
  content: renderBigNumber('0', chalk.green),
});

const highScoreLabel = blessed.text({
  parent: gameBox,
  top: 13,
  right: 2,
  content: chalk.yellow.bold('╔════════════════╗\n') +
           chalk.yellow.bold('║   HIGH SCORE   ║\n') +
           chalk.yellow.bold('╚════════════════╝'),
  tags: false,
});

const highScoreDisplay = blessed.text({
  parent: gameBox,
  top: 17,
  right: 2,
  content: renderBigNumber('0', chalk.yellow),
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
  width: 60,
  height: 14,
  content: '\n' + asciiArt.paused + '\n\n{center}Resume (Enter){/center}\n\n{center}Exit (Esc){/center}',
  tags: true,
  align: 'center',
  hidden: true,
});

// Game Over Screen
const gameOverBox = blessed.box({
  parent: screen,
  top: 'center',
  left: 'center',
  width: 80,
  height: 16,
  content: '\n' + asciiArt.game_over + '\n\n{center}Play again (Enter){/center}\n\n{center}Exit (Esc){/center}',
  tags: true,
  align: 'center',
  hidden: true,
});

screen.key(['escape', 'q', 'C-c'], () => {
  return process.exit(0);
});

export { screen, welcomeBox, gameBox, gameGrid, scoreDisplay, highScoreDisplay, pauseBox, gameOverBox, renderBigNumber };