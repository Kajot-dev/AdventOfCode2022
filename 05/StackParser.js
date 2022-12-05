import Stack from "./Stack.js";


export default class StackParser {

  #internalStackList = [];
  #stackNum = 0;

  get largestStackLength() {
    return Math.max(...this.#internalStackList.map(stack => stack.length));
  }
  parse(stackData) {
    this.#stackNum = this.#parseQuantity(stackData.pop());
    this.#internalStackList = this.#parseStackRepresentations(stackData);
  }

  executeAll(instructionList, { oneByOne = true}) {
    for (const instruction of instructionList) {
      this.execute(instruction, { oneByOne });
    }
  }

  execute(instruction, { oneByOne = true}) {
    const commandMatch = instruction.trim().match(StackParser.#commandRegex);
    if (commandMatch) {
      const cratesQuantity = parseInt(commandMatch[1]);
      const sourceStackIndex = parseInt(commandMatch[2]) - 1;
      const targetStackIndex = parseInt(commandMatch[3]) - 1;
      let tempList = [];
      for (let i = 0; i < cratesQuantity; i++) {
        tempList.push(this.#internalStackList[sourceStackIndex].pop());
      }
      if (!oneByOne) {
        tempList.reverse();
      }
      for (const crate of tempList) {
        this.#internalStackList[targetStackIndex].push(crate);
      }
    } else {
      throw new Error("Invalid command");
    }
  }

  print() {
    const length = this.largestStackLength;
    for (let i = length - 1; i >= 0; i--) {
      const crateList = this.#internalStackList.map(stack => {
        const crate = stack.seek(stack.length - i - 1);
        return crate ? '[' + crate + ']' : '   ';
      });
      process.stdout.write(crateList.join(' ') + '\n');
    }
    process.stdout.write(' ' + Array.from({ length: this.#stackNum }, (_, i) => `${i+1}`).join('   ') + ' ');
    process.stdout.write('\n');
  }

  topView() {
    return this.#internalStackList.map(stack => stack.top());
  }

  #parseQuantity(countLine) {
    const indexes = countLine.trim().split(' ');
    return parseInt(indexes[indexes.length - 1]);
  }

  #parseStackRepresentations(stackLines) {
    let tempStackList = Array.from({ length: this.#stackNum }, () => new Stack([]));
    stackLines = StackParser.#normalizeStackLines(stackLines);
    while (stackLines.length > 0) {
      //lowest line
      const stackLine = stackLines.pop();
      const valuesList = StackParser.#parseStackLine(stackLine);
      for (let i = 0; i < valuesList.length; i++) {
        if (valuesList[i] !== null) {
          tempStackList[i].push(valuesList[i]);
        }
      }
    }
    return tempStackList;
  }

  static #normalizeStackLines(stackLines) {
    let maxLineLength = Math.max(...stackLines.map(line => line.length));
    stackLines.map(line => line.length < maxLineLength ? line.padEnd(maxLineLength, ' ') : line);
    return stackLines;
  }

  static #parseStackLine(stackLine) {
    const stackLineChunks = StackParser.#separateByChunkAndGap(stackLine, 3, 1);
    return stackLineChunks.map(chunk => {
      const match = chunk.match(StackParser.#chunkRegex);
      return match ? match[1] : null;
    });
  }

  static #separateByChunkAndGap(line, chunkSize, gap) {
    let result = [];
    while (line.length > 0) {
      result.push(line.slice(0, chunkSize));
      line = line.slice(chunkSize + gap);
    }
    return result;
  }
  static #chunkRegex = /\[(\w)]/;
  static #commandRegex = /^move (\d+) from (\d+) to (\d+)$/;
}