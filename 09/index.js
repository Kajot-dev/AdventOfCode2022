import { promises as fsPromises } from 'fs';
import { Head, Tail } from "./classes.js";

const input = await fsPromises.readFile('data.txt', 'utf8');

const instructions = input.split('\n').map(instruction => {
  let tmp = instruction.split(' ');
  tmp[1] = parseInt(tmp[1]);
  return tmp;
});

const head = new Head();
const tails = [new Tail(head)];
for (let i = 1; i < 9; i++) {
  tails.push(new Tail(tails[i - 1]));
}

for (const [direction, steps] of instructions) {
  for (let i = 0; i < steps; i++) {
    head.moveDirection(direction);
    tails.forEach(tail => tail.moveToHead());
  }
}

console.log(`Task 1: ${tails[0].uniqueHistory.length}`);
console.log(`Task 2: ${tails[tails.length - 1].uniqueHistory.length}`);