import Rule from '../lib/Rule';

export default class Win {
  verify(state, dice) {
    return this.result('Win', state.turnScore != 0 && state.turnScore > 10000);
  }
}
