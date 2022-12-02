import fs from 'fs';

const shapeScores = {
    'X': 1, //rock
    'Y': 2, //paper
    'Z': 3 //scissors
}

const nameMappers = {
    my: {
        'X': 'Rock',
        'Y': 'Paper',
        'Z': 'Scissors'
    },
    enemy: {
        'A': 'Rock',
        'B': 'Paper',
        'C': 'Scissors'
    }
}

const resultScores = {
    'W': 6, //win
    'L': 0, //lose
    'D': 3  //draw
}

const resultCodeMapper = {
    'X': 'L',
    'Y': 'D',
    'Z': 'W'
}

const shapeMappers = {
    'W': {
        'A': 'Y', //paper beats rock
        'B': 'Z', //scissors beats paper
        'C': 'X' //rock beats scissors
    },
    'L': {
        'A': 'Z', //scissors beats rock
        'B': 'X', //rock beats paper
        'C': 'Y' //paper beats scissors
    },
    'D': {
        'A': 'X', //rock draws rock
        'B': 'Y', //paper draws paper
        'C': 'Z' //scissors draws scissors
    }
}




function getScoreForRoundShape(enemyShape, myShape) {
    let totalPoints = shapeScores[myShape];
    if (shapeMappers['D'][enemyShape] === myShape) {
        totalPoints += resultScores['D'];
    } else if (shapeMappers['W'][enemyShape] === myShape) {
        totalPoints += resultScores['W'];
    } else {
        totalPoints += resultScores['L'];
    }
    /*console.log(
        `Round ${nameMappers.enemy[enemyShape]} vs ${nameMappers.my[myShape]}: ${totalPoints} points 
        (${shapeScores[myShape]} - for shape, ${totalPoints - shapeScores[myShape]} - for result)`);
     */
    return totalPoints;
}

function getScoreForRoundResult(enemyShape, gameResult) {
    let desiredResultCode = resultCodeMapper[gameResult];
    let myShape = shapeMappers[desiredResultCode][enemyShape];
    return getScoreForRoundShape(enemyShape, myShape);
}

const rawData = await fs.promises.readFile("data.txt", "utf8");
const rounds = rawData.split('\n').map(round => round.split(' '));

console.log("--- Counting points for round one ---");

let totalPointsOne = rounds.reduce((total, round) => {
    return total + getScoreForRoundShape(...round);
}, 0);

console.log("--- Counting points for round two ---");

let totalPointsTwo = rounds.reduce((total, round) => {
    return total + getScoreForRoundResult(...round);
}, 0);

console.log("Total points for round one: " + totalPointsOne);

console.log("Total points for round two: " + totalPointsTwo);

