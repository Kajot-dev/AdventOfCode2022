import { promises as fsPromises } from 'fs';
import Graph from 'node-dijkstra'

//import data.txt
const data = await fsPromises.readFile('./data.txt', 'utf-8');
const dataGrid = data.split('\n').map((row) => row.split('').map(l => l.charCodeAt(0) - 97));

//charcode of S is 83

let startPosition = {};

let shouldContinue = true;
for (let i = 0; i < dataGrid.length; i++) {
    for (let j = 0; j < dataGrid[i].length; j++) {
        if (dataGrid[i][j] === (83 - 97)) {
            startPosition = { x: j, y: i };
            dataGrid[i][j] = 0;
            shouldContinue = false;
            break;
        }

    }
    if (!shouldContinue) break;
}

let endPosition = {};
shouldContinue = true;
//charcode of E is 69
for (let i = 0; i < dataGrid.length; i++) {
    for (let j = 0; j < dataGrid[i].length; j++) {
        if (dataGrid[i][j] === (69 - 97)) {
            endPosition = { x: j, y: i };
            dataGrid[i][j] = "z".charCodeAt(0) - 97;
            shouldContinue = false;
            break;
        }

    }
    if (!shouldContinue) break;
}

const graph = new Graph();
for (let y = 0; y < dataGrid.length; y++) {
    for (let x = 0; x < dataGrid[y].length; x++) {
        let neighbours = {};
        //check if it's possible to go to the neighbours
        if (y > 0 && dataGrid[y - 1][x] <= dataGrid[y][x] + 1) {
            neighbours[`${x},${y - 1}`] = 1;
        }
        if (y < dataGrid.length - 1 && dataGrid[y + 1][x] <= dataGrid[y][x] + 1) {
            neighbours[`${x},${y + 1}`] = 1;
        }
        if (x > 0 && dataGrid[y][x - 1] <= dataGrid[y][x] + 1) {
            neighbours[`${x - 1},${y}`] = 1;
        }
        if (x < dataGrid[y].length - 1 && dataGrid[y][x + 1] <= dataGrid[y][x] + 1) {
            neighbours[`${x + 1},${y}`] = 1;
        }
        graph.addNode(`${x},${y}`, neighbours);
    }
}

const shortestPath1 = graph.path(`${startPosition.x},${startPosition.y}`, `${endPosition.x},${endPosition.y}`);

const pathLengths = [];
for (let y = 0; y < dataGrid.length; y++) {
    for (let x = 0; x < dataGrid[y].length; x++) {
        if (dataGrid[y][x] === 0) {
            const tempRoute = graph.path(`${x},${y}`, `${endPosition.x},${endPosition.y}`);
            if (tempRoute !== null) {
                pathLengths.push(tempRoute.length - 1);
            }
        }
    }
}

console.log(`Shortest path is ${shortestPath1.length - 1} steps long`);

console.log(`Shortest path from any low point is ${Math.min(...pathLengths)} steps long`);