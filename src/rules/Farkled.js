import Rule from '../lib/Rule';
import {didFarkle} from '../utils/score';

/**
 * Tests if the roll was a farkle.
 *
 * Return true if the roll did not farkle.
 */
export default class Farkled extends Rule {
  verify(state, dice) {
    return this.result('Farkled', !didFarkle(dice));
  }
}
