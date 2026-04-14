import blessed from 'neo-blessed';
import chalk from 'chalk';
import asciiArt from './ascii-art.json' with { type: 'json' };

// Arcade color palette
const colors = {
  neonGreen: '#00ff00',
  neonPink: '#ff00ff',
  neonBlue: '#00ffff',
  neonYellow: '#ffff00',
  neonRed: '#ff0000',
  darkBg: '#000000',
};

// const colors = {
//   phosphorGreen:  '#39ff14',  // snake head, titles, borders
//   bodyGreen:      '#00cc00',  // snake body
//   tailGreen:      '#007700',  // snake tail
//   ghostGreen:     '#003300',  // trail after-image
//   orange:         '#c8a060',  // HUD labels, score borders
//   red:            '#ff2200',  // death flash + game over title ONLY
//   white:          '#ffffff',  // food
//   mutedGreen:     '#1a4d1a',  // inactive/dim text
//   darkBg:         '#000000',
// };

// Retro 7x5 block font for numbers
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
  title: 'Snake',
  program: blessed.program({ force: true })
});

// Set retro arcade background
screen.append(new blessed.Box({
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  bg: colors.darkBg
}));

// Welcome Screen Logic
const neonPalette = [colors.neonGreen, colors.neonPink, colors.neonBlue, colors.neonYellow, colors.neonRed];

function renderWelcomeContent(selectedIndex = 0, animTick = 0) {
  const options = ['PLAY', 'EXIT'];
  
  // Static title
  let content = '\n\n\n\n\n' + chalk.hex(colors.neonGreen).bold(asciiArt.welcome) + '\n\n\n\n';
  
  options.forEach((opt, i) => {
    const isSelected = i === selectedIndex;
    const isBlinking = isSelected && animTick % 2 === 0;
    
    let text = isSelected ? `► ${opt} ◄` : `  ${opt}  `;
    let styled;
    
    if (isSelected) {
      // Blinking Green when selected
      styled = isBlinking ? chalk.hex(colors.neonGreen).bold(text) : chalk.hex(colors.neonGreen).dim(text);
    } else {
      // Static Yellow when inactive
      styled = chalk.hex(colors.neonYellow).bold(text);
    }
    
    content += styled + (i < options.length - 1 ? '\n\n' : '');
  });
  
  return content;
}

const welcomeBox = blessed.box({
  parent: screen,
  top: 'center',
  left: 'center',
  width: 62,
  height: 22,
  content: renderWelcomeContent(0),
  tags: true,
  align: 'center',
  border: { type: 'double', stroke: chalk.hex(colors.neonBlue) },
  style: { bg: colors.darkBg }
});

// Game Screen
const gameBox = blessed.box({
  parent: screen,
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  hidden: true,
  style: { bg: colors.darkBg }
});

const controlsLeft = blessed.text({
  parent: gameBox,
  top: 2,
  left: 2,
  content:
    chalk.hex(colors.neonGreen).bold('╔═══ MOVEMENT ═══╗\n') +
    chalk.hex(colors.neonGreen).bold('║') + chalk.yellow('  W ') + chalk.gray(' - UP    ') + chalk.hex(colors.neonGreen).bold('   ║\n') +
    chalk.hex(colors.neonGreen).bold('║') + chalk.yellow('  S ') + chalk.gray(' - DOWN  ') + chalk.hex(colors.neonGreen).bold('   ║\n') +
    chalk.hex(colors.neonGreen).bold('║') + chalk.yellow('  A ') + chalk.gray(' - LEFT  ') + chalk.hex(colors.neonGreen).bold('   ║\n') +
    chalk.hex(colors.neonGreen).bold('║') + chalk.yellow('  D ') + chalk.gray(' - RIGHT ') + chalk.hex(colors.neonGreen).bold('   ║\n') +
    chalk.hex(colors.neonGreen).bold('╚════════════════╝\n') +
    chalk.hex(colors.neonPink).bold('╔═══ CONTROLS ═══╗\n') +
    chalk.hex(colors.neonPink).bold('║') + chalk.yellow(' ENTER ') + chalk.gray('- PAUSE') + chalk.hex(colors.neonPink).bold('  ║\n') +
    chalk.hex(colors.neonPink).bold('║') + chalk.yellow('  ESC  ') + chalk.gray('- QUIT ') + chalk.hex(colors.neonPink).bold('  ║\n') +
    chalk.hex(colors.neonPink).bold('╚════════════════╝'),
  tags: false,
  style: { bg: colors.darkBg }
});

const scoreLabel = blessed.text({
  parent: gameBox,
  top: 2,
  right: 2,
  content: chalk.hex(colors.neonGreen).bold('╔══════════════╗\n') +
           chalk.hex(colors.neonGreen).bold('║     SCORE    ║\n') +
           chalk.hex(colors.neonGreen).bold('╚══════════════╝'),
  tags: false,
  style: { bg: colors.darkBg }
});

const scoreDisplay = blessed.text({
  parent: gameBox,
  top: 6,
  right: 2,
  content: renderBigNumber('0', chalk.hex(colors.neonGreen)),
  style: { bg: colors.darkBg }
});

const highScoreLabel = blessed.text({
  parent: gameBox,
  top: 13,
  right: 2,
  content: chalk.hex(colors.neonYellow).bold('╔══════════════╗\n') +
           chalk.hex(colors.neonYellow).bold('║  HIGH SCORE  ║\n') +
           chalk.hex(colors.neonYellow).bold('╚══════════════╝'),
  tags: false,
  style: { bg: colors.darkBg }
});

const highScoreDisplay = blessed.text({
  parent: gameBox,
  top: 17,
  right: 2,
  content: renderBigNumber('0', chalk.hex(colors.neonYellow)),
  style: { bg: colors.darkBg }
});

const gameGrid = blessed.box({
  parent: gameBox,
  top: 'center',
  left: 'center',
  width: 62,
  height: 22,
  border: { type: 'double', stroke: chalk.hex(colors.neonBlue) },
  tags: true,
  style: { bg: colors.darkBg }
});

// Pause Screen Logic
function renderPauseContent(selectedIndex = 0, animTick = 0) {
  const options = ['RESUME', 'EXIT'];
  
  // Static title
  let content = '\n\n\n\n' + chalk.hex(colors.neonYellow).bold(asciiArt.paused) + '\n\n\n\n';
  
  options.forEach((opt, i) => {
    const isSelected = i === selectedIndex;
    const isBlinking = isSelected && animTick % 2 === 0;
    
    const text = isSelected ? `► ${opt} ◄` : `  ${opt}  `;
    let styled;
    
    if (isSelected) {
      // Blinking Green when selected
      styled = isBlinking ? chalk.hex(colors.neonGreen).bold(text) : chalk.hex(colors.neonGreen).dim(text);
    } else {
      // Static Yellow when inactive
      styled = chalk.hex(colors.neonYellow).bold(text);
    }
    
    content += styled + (i < options.length - 1 ? '\n\n' : '');
  });
  
  return content;
}

const pauseBox = blessed.box({
  parent: screen,
  top: 'center',
  left: 'center',
  width: 60,
  height: 18,
  content: renderPauseContent(0),
  tags: true,
  align: 'center',
  style: { bg: colors.darkBg },
  hidden: true,
});

// Game Over Screen Logic
function renderGameOverContent(selectedIndex = 0, animTick = 0) {
  const options = ['PLAY AGAIN', 'EXIT'];
  
  // Static title
  let content = '\n' + chalk.hex(colors.neonYellow).bold(asciiArt.game_over) + '\n\n\n\n';
  
  options.forEach((opt, i) => {
    const isSelected = i === selectedIndex;
    const isBlinking = isSelected && animTick % 2 === 0;
    
    const text = isSelected ? `► ${opt} ◄` : `  ${opt}  `;
    let styled;
    
    if (isSelected) {
      // Blinking Green when selected
      styled = isBlinking ? chalk.hex(colors.neonGreen).bold(text) : chalk.hex(colors.neonGreen).dim(text);
    } else {
      // Static Yellow when inactive
      styled = chalk.hex(colors.neonYellow).bold(text);
    }
    
    content += styled + (i < options.length - 1 ? '\n\n' : '');
  });
  
  return content;
}

const gameOverBox = blessed.box({
  parent: screen,
  top: 'center',
  left: 'center',
  width: 80,
  height: 16,
  content: renderGameOverContent(0),
  tags: true,
  align: 'center',
  border: { type: 'double', stroke: chalk.hex(colors.neonPink) },
  style: { bg: colors.darkBg },
  hidden: true,
});

screen.key(['escape', 'q', 'C-c'], () => {
  return process.exit(0);
});

export { screen, welcomeBox, gameBox, gameGrid, scoreDisplay, highScoreDisplay, pauseBox, gameOverBox, renderBigNumber, renderWelcomeContent, renderPauseContent, renderGameOverContent };