import { promises as fsPromises } from 'fs';

const rawData = await fsPromises.readFile('data.txt', 'utf-8');

let treeGrid = rawData.split('\n').map((row) => row.split('').map(num => parseInt(num)));
let rowQ = treeGrid.length;
let colQ = treeGrid[0].length;

let visibleTreeCount = 0;
let currentScenicScore = 0;

for (let i = 0; i < rowQ; i++) {
  for (let j = 0; j < colQ; j++) {
    let maxTrees = [
      Math.max(...treeGrid[i].slice(0, j)), //trees on the left
      Math.max(...treeGrid[i].slice(j + 1)), //trees on the right
      Math.max(...treeGrid.map(row => row[j]).slice(0, i)), //trees above
      Math.max(...treeGrid.map(row => row[j]).slice(i + 1)) //trees below
    ];
    if (maxTrees.some(max => max < treeGrid[i][j])) {
      visibleTreeCount++;
    }
    let isOnEdge = i === 0 || i === rowQ - 1 || j === 0 || j === colQ - 1;

    //if the three is on the edge findIndex will be -1, thus it's distance will be 0
    let distances = {
      left: treeGrid[i].slice(0, j).reverse().findIndex((height) => height >= treeGrid[i][j]) + 1,
      right: treeGrid[i].slice(j + 1).findIndex((height) => height >= treeGrid[i][j]) + 1, //distance to the right
      above: treeGrid.map(row => row[j]).slice(0, i).reverse().findIndex((height) => height >= treeGrid[i][j]) + 1, //distance above
      below: treeGrid.map(row => row[j]).slice(i + 1).findIndex((height) => height >= treeGrid[i][j]) + 1 //distance below
    }

    //if the tree is not on the edge and the distance is 0, it has maximum visibility
    let viewDistances = [
      !isOnEdge && distances.left === 0 ? j : distances.left, //distance to the left
      !isOnEdge && distances.right === 0 ? colQ - j - 1 : distances.right, //distance to the right
      !isOnEdge && distances.above === 0 ? i : distances.above, //distance above
      !isOnEdge && distances.below === 0 ? rowQ - i - 1 : distances.below //distance below
    ];
    //multiply values of the viewDistances
    let scenicScore = viewDistances.reduce((acc, val) => acc * val, 1);
    if (scenicScore > currentScenicScore) {
      currentScenicScore = scenicScore;
    }
  }
}

console.log(`Visible trees: ${visibleTreeCount}`);
console.log(`Current scenic score: ${currentScenicScore}`);