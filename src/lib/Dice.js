import {normalizeDice, dieCount} from '../utils/score';

/**
 * An object for modeling a number of dice.
 */
class Dice {
  constructor(dice = []) {
    this.dice = normalizeDice(dice);
    this.count = null;
  }

  count() {
    if (!this.count) {
      this.count = dieCount(this.dice);
    }
    return this.count;
  }
}
