
class Knot {

  history = [];
  get uniqueHistory() {
    return this.history.filter((point, index) => {
      return this.history.findIndex(p => p.x === point.x && p.y === point.y) === index;
    });
  }

  constructor() {
    this.x = 0;
    this.y = 0;
    this.history.push({x: 0, y: 0});
  }

  moveToPoint(x, y) {
    this.x = x;
    this.y = y;
    this.history.push({x, y});

  }
  moveBy(x, y) {

    this.moveToPoint(this.x + x, this.y + y);
  }
}

export class Head extends Knot {
  constructor() {
    super();
  }

  moveDirection(direction) {
    switch (direction) {
      case 'L':
        this.moveBy(-1, 0);
        break;
      case 'R':
        this.moveBy(1, 0);
        break;
      case 'D':
        this.moveBy(0, -1);
        break;
      case 'U':
        this.moveBy(0, 1);
        break;
    }
  }
}

export class Tail extends Knot {
  constructor(head) {
    super();
    this.head = head;
  }

  moveToHead() {
    //if head is in the same spot or is one point away, do nothing
    if (Math.abs(this.head.x - this.x) <= 1 && Math.abs(this.head.y - this.y) <= 1 ) return;
    //if head is in the same row or column move on point towards it
    let moveX = 0;
    let moveY = 0;
    if (this.head.x === this.x) {
      moveY = this.head.y > this.y ? 1 : -1;
    } else if (this.head.y === this.y) {
      moveX = this.head.x > this.x ? 1 : -1;
    } else {
      //if head is in different row and column move on point towards it diagonally
      moveX = this.head.x > this.x ? 1 : -1;
      moveY = this.head.y > this.y ? 1 : -1;
    }
    this.moveBy(moveX, moveY);
  }
}