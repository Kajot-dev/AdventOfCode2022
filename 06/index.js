import { promises as fsPromises } from 'fs';

const signal = (await fsPromises.readFile('data.txt', 'utf8')).trim().split('');

function getMarkerStart(signal, uniqueChars) {
  for (let i = uniqueChars; i <= signal.length; i++) {
    let tmpSet = new Set(signal.slice(i - uniqueChars, i));
    if (tmpSet.size === uniqueChars) {
      return i;
    }
  }
}

console.log(`Signal marker starts at ${getMarkerStart(signal, 4)}`);
console.log(`Message marker starts at ${getMarkerStart(signal, 14)}`);