import Rule from '../lib/Rule';

export default class InitialTurn500 extends Rule {
  verify(state, dice) {
    return this.result('InitialTurn500', true);
  }
}
