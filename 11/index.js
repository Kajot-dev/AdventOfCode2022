import { promises as fsPromises } from 'fs';
import Monkey from "./classes.js";

const rawData = await fsPromises.readFile('data.txt', 'utf8');

const monkeysData = rawData.split("\n\n");

const moduloSymbol = Symbol('modulo');

function parseMonkeyData(monkeysData, { reduceStress = true } = {}) {
  const monkeyMap = new Map();
  for (const monkeyData of monkeysData) {
    const monkeyLines = monkeyData.split("\n");
    const monkeyId = Number(monkeyLines[0].trim().match(/^Monkey (\d+):$/)[1]);
    const startingItems = monkeyLines[1].trim().match(/^Starting items: (.*)$/)[1].split(',').map(BigInt);
    const operationString = monkeyLines[2].trim().match(/^Operation: (.*)$/)[1];
    const divisibleBy = Number(monkeyLines[3].trim().match(/^Test: divisible by (\d+)$/)[1]);
    const trueTarget = Number(monkeyLines[4].trim().match(/^If true: throw to monkey (\d+)$/)[1]);
    const falseTarget = Number(monkeyLines[5].trim().match(/^If false: throw to monkey (\d+)$/)[1]);
    const monkey = new Monkey({
      initialItems: startingItems,
      operationString,
      testDivisibleBy: divisibleBy,
      testTrueTarget: trueTarget,
      testFalseTarget: falseTarget,
      id: monkeyId,
      otherMonkeys: monkeyMap,
      reduceStress
    });
    monkeyMap.set(monkeyId, monkey);
  }
  let modulo = 1n;
  for (const monkey of monkeyMap.values()) {
    modulo = lcm(modulo, monkey.testDivisibleBy);
  }
  console.log(`Modulo: ${modulo}`);
  monkeyMap[moduloSymbol] = modulo;
  return monkeyMap;
}

function monkeyBusiness(monkeyMap) {
  let inspectedItems = [];
  for (const monkey of monkeyMap.values()) {
    inspectedItems.push(monkey.inspectedItems);
    console.log(`Monkey ${monkey.id} inspected ${monkey.inspectedItems} items`);
  }
  //get two most active monkeys
  const mostActive = inspectedItems.sort((a, b) => b - a).slice(0, 2);
  const monkeyBusiness = mostActive[0] * mostActive[1];
  console.log(`Most active monkeys: ${mostActive[0]} and ${mostActive[1]}`);
  console.log(`Monkey business: ${monkeyBusiness}`);
}

function runTurns(monkeyMap, turns) {
  const reducingModulo = monkeyMap[moduloSymbol];
  for (let i = 0; i < turns; i++) {
    for (const monkey of monkeyMap.values()) {
      monkey.makeTurn(reducingModulo);
    }
  }
}

function gcd(a, b) {
    let tmp;
    while (b) {
        tmp = a % b;
        a = b;
        b = tmp;
    }
    return a;
}

function lcm(a, b) {
    return a * b / gcd(a, b);
}

const monkeyMap1 = parseMonkeyData(monkeysData);
const monkeyMap2 = parseMonkeyData(monkeysData, {
  reduceStress: false
});
console.log(`Part 1:`);
runTurns(monkeyMap1, 20);
monkeyBusiness(monkeyMap1);

console.log(`Part 2:`);
runTurns(monkeyMap2, 10000);
monkeyBusiness(monkeyMap2);

