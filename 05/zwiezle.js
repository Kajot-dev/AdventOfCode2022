import { promises as fs } from 'fs';

const rawData = await fs.readFile('data.txt', 'utf8');
const [stackData, instructions] = rawData.split('\n\n');
const quantity = parseInt(stackData.split('\n').pop().split(/\s+/).pop());

let stackLines = stackData.split('\n').map(l => l.padEnd(quantity * 4 + 1, ' '))
const stacks9000 = Array.from({ length: quantity }, () => []);
//fill stacks9000
for (const line of stackLines) {
    line.match(/\[\w]\s?|\s{3}\s?/g).forEach((c, i) => {
        /\[\w]/.test(c.trim()) && stacks9000[i].push(c.charAt(1))
    });
}
//clone stacks9000
const stacks9001 = stacks9000.map(s => s.slice());
//execute instructions
for (const instruction of instructions.split('\n')) {
    const moveData = instruction.trim().match(/^move (\d+) from (\d+) to (\d+)$/).slice(1).map(Number);
    let mv = [stacks9000, stacks9001].map(s => s[moveData[1] - 1].splice(0, moveData[0]));
    mv[0].reverse();
    [stacks9000, stacks9001].forEach((s, i) => s[moveData[2] - 1].unshift(...mv[i]));
}
//print results
[stacks9000, stacks9001].forEach((s, i) => {
    console.log(`--- Task ${i + 1} ---`);
    console.log(`Top view: ${s.map(l => l[0] || ' ').join('')}`);
});