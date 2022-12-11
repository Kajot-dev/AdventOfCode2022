



export default class Monkey {

  inspectedItems = 0;
  constructor({
    initialItems = [],
    operationString = '',
    testDivisibleBy = Number.NaN,
    testTrueTarget = Number.NaN,
    testFalseTarget = Number.NaN,
    id = 0,
    otherMonkeys = new Map(),
    reduceStress = true
              }) {
    this.items = initialItems;
    operationString = operationString
      .replace(/new /g, "newItem ")
      .replace(/\d+/g, (x) => `${x}n`);

    this.operationFunc = new Function('old', `let ${operationString.replace(/new /g, "newItem ")}; return newItem;`);
    this.testDivisibleBy = BigInt(testDivisibleBy);
    this.testTrueTarget = testTrueTarget;
    this.testFalseTarget = testFalseTarget;
    this.id = id;
    this.otherMonkeys = otherMonkeys;
    this.reduceStress = reduceStress;

  }

  acceptItem(item) {
    this.items.push(item);
  }

  makeTurn(reducingModulo) {
    while (this.items.length > 0) {
      let oldItem = this.items.shift();
      //inspect item
      let newItem;
      if (this.reduceStress) {
        newItem = (this.operationFunc(oldItem) / 3n) % reducingModulo;
      } else {
        newItem = this.operationFunc(oldItem) % reducingModulo;
      }
      this.inspectedItems++;
      if (newItem % this.testDivisibleBy === 0n) {
        this.otherMonkeys.get(this.testTrueTarget).acceptItem(newItem);
      } else {
        this.otherMonkeys.get(this.testFalseTarget).acceptItem(newItem);
      }
    }
  }
}