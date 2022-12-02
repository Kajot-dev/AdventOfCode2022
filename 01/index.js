import fs from 'fs';

const data = await fs.promises.readFile('./data.txt', 'utf-8');


const elfData = data.trim().split('\n\n')

for (let i = 0; i < elfData.length; i++) {
    let total = elfData[i].split('\n').map(s => parseInt(s)).reduce((acc, curr) => acc + curr, 0);
    elfData[i] = total;
}

let chunkiestElfData = {
    index: 0,
    amount: 0
}

for (let i = 0; i < elfData.length; i++) {
    if (elfData[i] > chunkiestElfData.amount) {
        chunkiestElfData.index = i;
        chunkiestElfData.amount = elfData[i];
    }
}

const topThreeSum = elfData.sort((a, b) => b - a).slice(0, 3).reduce((acc, curr) => acc + curr, 0);


console.log("Chunkiest elf is " + (chunkiestElfData.index + 1) + "th with " + chunkiestElfData.amount + " calories.");

console.log("Top three elves have " + topThreeSum + " calories.");