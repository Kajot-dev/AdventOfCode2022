import { promises as fs } from 'fs';

function getPriority(char) {
  return char >= 'a' && char <= 'z' ? char.charCodeAt(0) - 96 : char.charCodeAt(0) - 38;
}

function splitArrayInTwo(array) {
    const half = Math.ceil(array.length / 2);
    return [array.slice(0, half), array.slice(half)];
}

function findCommonTypeInTwoArrays(array1, array2) {
    return array1.find((item) => array2.includes(item));
}

function findGroupBadge(elf1, elf2, elf3) {
    // we expect all three elves to have only unique types
    const allItems = [...elf1, ...elf2, ...elf3];
    const itemCounts = {};
    for (const item of allItems) {
        itemCounts[item] = itemCounts[item] ? itemCounts[item] + 1 : 1;
    }
    return Object.entries(itemCounts).find(([_, count]) => count === 3)[0];
}

function* elfUniqueGroupDataGenerator(ruckSacks) {
    while (ruckSacks.length > 0) {
        // no list comprehension in js :(
        // Set is used to remove duplicates
        const elf1 = new Set(ruckSacks.shift());
        const elf2 = new Set(ruckSacks.shift());
        const elf3 = new Set(ruckSacks.shift());
        yield [elf1, elf2, elf3];
    }
}

const rawData = await fs.readFile('data.txt', 'utf8');
const rucksackData = rawData.split('\n').map((line) => line.split(''));

//task 1
const sumOfCommonTypes = rucksackData.reduce((sum, rucksack) => {
    const [first, second] = splitArrayInTwo(rucksack);
    const commonType = findCommonTypeInTwoArrays(first, second);
    return sum + getPriority(commonType);
}, 0);

//task 2

const groups = [...elfUniqueGroupDataGenerator(rucksackData)];
const sumOfGroupBadges = groups.reduce((sum, group) => {
    const commonType = findGroupBadge(...group);
    return sum + getPriority(commonType);
}, 0);

console.log(`Task 1: ${sumOfCommonTypes}`);
console.log(`Task 2: ${sumOfGroupBadges}`);
