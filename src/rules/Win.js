import Rule from '../lib/Rule';

/**
 * Figure out if the player has won.
 */
export default class Win extends Rule {
  verify(state, dice) {
    const currentPlayerScore = state.scoreboard[state.currentPlayer].reduce((sum, value) => sum + value.score, 0);
    return this.result('Win', currentPlayerScore >= 5000);
  }
}
