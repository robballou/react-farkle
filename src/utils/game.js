import {filterRoll} from './filters';

/**
 * Player has a selected at least one die.
 */
export function haveDiceSelected(state) {
  return (filterRoll(state.roll, state.selectedDie)).length > 0;
}

/**
 * All dice have been selected.
 */
export function allDiceSelected(state) {
  const selectedRollDice = filterRoll(state.roll, state.selectedDie);
  return selectedRollDice.length === state.dice.length;
}

/**
 * The player has rolled their dice.
 */
export function haveRolled(state) {
  return state.dice.length !== 0;
}

/**
 * There are no scoring errors.
 *
 * Note that this will return true when there are no selected dice.
 */
export function noScoringErrors(state) {
  return state.turnScore === 0 || (state.turnScore != 0 && state.turnScore.errors.length === 0);
}
