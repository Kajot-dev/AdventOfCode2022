import { promises as fsPromises } from 'fs';
import CPU from './cpu.js';

const rawData = await fsPromises.readFile('data.txt', 'utf8');

const parsedInstructions = rawData.split('\n').map((line) => line.split(' '));

const cpu1 = new CPU({
  instructions: parsedInstructions,
  initialRegister: {
    X: 1
  },
  instructionSet: {
    'addx': {
      execute: (self, value) => {
        self.register.X += Number(value);
      },
      duration: 2
    },
    'noop': {
      execute: () => {},
      duration: 1
    }
  }
});

const importantCycles = [20, 60, 100, 140, 180, 220];
let screen = [];
let activeRow = [];
let sum1 = 0;
for (const { activeCycle, register } of cpu1) {
  if (importantCycles.includes(activeCycle)) {
    sum1 += activeCycle * register.X;
  }
  if ((activeCycle - 1) % 40 === 0) {
    screen.push(activeRow);
    activeRow = [];
  }
  let spriteIndex = register.X;
  let drawnPixelIndex = (activeCycle - 1) % 40;
  console.log(`Drawing sprite ${spriteIndex} at ${drawnPixelIndex}`);
  if (spriteIndex + 1 >= drawnPixelIndex && spriteIndex - 1 <= drawnPixelIndex) {
    activeRow.push('#');
  } else {
    activeRow.push('.');
  }
}

console.log(`Sum of X multiplied by cycle number at important cycles is ${sum1}`);
for (const row of screen) {
  console.log(row.join(''));
}