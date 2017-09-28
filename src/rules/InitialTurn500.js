import Rule from '../lib/Rule';

export default class InitialTurn500 extends Rule {
  verify(state, dice) {
    const isFirstTurn = state.scoreboard[state.currentPlayer].length === 0;
    const ruleName = 'InitialTurn500';

    // return null if this is not the first turn (e.g., we don't care whether
    // this rule passes anymore)
    if (!isFirstTurn) {
      return this.result(ruleName, null);
    }

    // return false if the score is 0 or less than 500 points
    if (state.turnScore === 0) {
      return this.result(ruleName, false);
    }
    else if (state.turnScore.score < 500) {
      return this.result(ruleName, false);
    }

    // score is >= 500 so they have met this rule requirement
    return this.result(ruleName, true);
  }
}
