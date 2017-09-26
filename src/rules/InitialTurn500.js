import Rule from '../lib/Rule';

export default class InitialTurn500 extends Rule {
  verify(state, dice) {
    const isFirstTurn = state.scoreboard[state.currentPlayer].length === 0;
    // return false if the score is 0 or less than 500 points
    if (isFirstTurn) {
      if (state.turnScore === 0) {
        return this.result('InitialTurn500', false);
      }
      else if (state.turnScore.score < 500) {
        return this.result('InitialTurn500', false);
      }

      return this.result('InitialTurn500', true);
    }

    // if this isn't the first turn, return null.
    return this.result('InitialTurn500', null);
  }
}
