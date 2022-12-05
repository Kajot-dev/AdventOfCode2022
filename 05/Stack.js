

export default class Stack {
  #internalStack = [];
  constructor(initialStack = []) {
    this.#internalStack = initialStack;
  }

  toString() {
    return JSON.stringify(this.#internalStack);
  }

  push(item) {
    this.#internalStack.push(item);
  }

  pop() {
    return this.#internalStack.pop();
  }

  seek(position) {
    const realPosition = this.#internalStack.length - position - 1;
    return this.#internalStack[realPosition];
  }

  get length() {
    return this.#internalStack.length;
  }

  top() {
    return this.#internalStack[this.#internalStack.length - 1];
  }
}