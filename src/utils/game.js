import {filterRoll, passedRule} from './filters';
import {get} from 'lodash';

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

export function haveUsedAllDice(state) {
  // return
}

export function needsInitialTurnScore(state) {
  return passedRule('InitialTurn500', get(state.ruleResults, 'select.results', false)) === false
}

/**
 * There are no scoring errors.
 *
 * Note that this will return true when there are no selected dice.
 */
export function noScoringErrors(state) {
  return state.turnScore === 0 || (state.turnScore != 0 && state.turnScore.errors.length === 0);
}

const cachedRules = {};
export function verifyRules(rules, ...args) {
  let passed = true;
  const results = [];

  for (var i = 0, len = rules.length; i < len; i++) {
    const cached = get(cachedRules, rules[i].constructor.name);
    const thisRule = (cached) ? cached : new rules[i];
    const thisResult = thisRule.verify(...args);
    results.push(thisResult);
    if (!thisResult.passed) {
      passed = false;
      break;
    }
  }

  return [passed, results];
}
