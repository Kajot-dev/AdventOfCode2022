

export default class CPU {
  register = {}
  instructionSet = {};
  get done() {
    return this.instructions.length === 0;
  }

  _isBusy = false
  _durationLeft = 0
  _activeInstruction = null
  _activeInstructionObj = null;

  //start with the active cycle being 1
  programCounter = 0

  constructor({ initialRegister = null, instructionSet = null, instructions  }) {
    if (initialRegister) {
      this.register = initialRegister
    }
    if (instructionSet) {
      this.instructionSet = instructionSet
    }
    //add noop instruction
    //so we start program with active cycle 1
    //and finished cycle 0
    this.instructions = [['noop'], ...instructions];
  }

  tick() {
    this.programCounter++;
    if (!this._isBusy) {
      this._activeInstruction = this.instructions.shift();
      const instructionName = this._activeInstruction[0];
      this._activeInstructionObj = this.instructionSet[instructionName];
      this._durationLeft = this._activeInstructionObj.duration;
      this._isBusy = true
    }
    this._durationLeft--;
    if (this._durationLeft === 0) {
      const instructionArgs = this._activeInstruction.slice(1);
      this._activeInstructionObj.execute(this, ...instructionArgs);
      this._isBusy = false
      this._activeInstruction = null
      this._activeInstructionObj = null;
    }
  }



  next() {
    if (this.done) {
      return { done: true }
    }
    this.tick();
    return {
      done: false,
      value: {
        finishedCycle: this.programCounter - 1,
        activeCycle: this.programCounter,
        register: this.register
      }
    }
  }

  [Symbol.iterator]() {
    return this;
  }

}