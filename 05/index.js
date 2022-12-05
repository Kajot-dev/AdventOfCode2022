import { promises as fs } from 'fs';
import StackParser from "./StackParser.js";

const rawData = await fs.readFile('data.txt', 'utf8');
const [stackData, instructions] = rawData.split('\n\n');

const instructionsList = instructions.split('\n');

//task 1

const stackParser9000 = new StackParser();

stackParser9000.parse(stackData.split('\n'));
stackParser9000.executeAll(instructionsList, { oneByOne: true });

console.log("--- Task 1 ---" );
stackParser9000.print();
console.log(`Top view: ${stackParser9000.topView().join('')}`);

//task 2

const stackParser9001 = new StackParser();

stackParser9001.parse(stackData.split('\n'));
stackParser9001.executeAll(instructionsList, { oneByOne: false });

console.log("--- Task 2 ---" );
stackParser9001.print();
console.log(`Top view: ${stackParser9001.topView().join('')}`);

