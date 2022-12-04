import { promises as fs } from 'fs';

function range(start, end) {
    return Array.from({length: (end - start)}, (_, i) => i + start);
}

function containingSets(arr1, arr2) {
    let largest = arr1.length > arr2.length ? arr1 : arr2;
    let smallest = arr1.length > arr2.length ? arr2 : arr1;
    return !smallest.some((e) => !largest.includes(e));
}

function overlappingSets(arr1, arr2) {
    return arr1.some((e) => arr2.includes(e));
}

const rawData = await fs.readFile('data.txt', 'utf8');
const elfPairs = rawData.split('\n').map((line) => line.split(','));
const parsedElfPairs = elfPairs.map((pair) => {
    return pair.map((sectors) => {
        let s = sectors.split('-');
        return range(parseInt(s[0]), parseInt(s[1]) + 1);
    })
});

//task 1
let counterOne = 0;
let counterTwo = 0;
for (const pair of parsedElfPairs) {
    if (containingSets(pair[0], pair[1])) {
        counterOne++;
        counterTwo++;
    } else if (overlappingSets(pair[0], pair[1])) {
        counterTwo++;
    }
}

console.log(`Task 1: ${counterOne}`);
console.log(`Task 2: ${counterTwo}`);