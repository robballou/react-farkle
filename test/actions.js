import test from 'ava';

import { merge } from 'lodash';

import Actions from '../src/components/Actions';
import Game from '../src/components/Game';
import { verifyRules, needsInitialTurnScore } from '../src/utils/game';

const g = new Game();
const a = new Actions();

test('Actions.getActions() returns ACTION_ROLL if the player has not rolled', t => {
  const state = g.getState();
  t.is(a.getActions(state), 'ROLL');
});

test('Actions.getActions() returns ACTION_NEXT if the player has farkled', t => {
  const state = merge(g.getState(), {farkled: true, dice: [2,2]});
  t.is(a.getActions(state), 'NEXT');
});

test('Actions.getActions() returns ACTION_ROLL_AGAIN if the player has not met initial turn score', t => {
  const state = merge(g.getState(), {
    dice: [3,3,2,2,4],
    selectedDie: [
      {roll: 1, value: 1},
    ],
    turnScore: {
      errors: [],
      items: [{dice: [1], score: 100}],
      score: 100,
      farkled: false,
    },
    scoreboard: {
      1: [],
      2: []
    },
  });

  // getActions() calls needsInitialTurnScore which requires the rules to
  // be processed, so do that now...
  const [passedRules, ruleResults] = verifyRules(g.rules.select, state);
  state.ruleResults.select = {passed: passedRules, results: ruleResults};
  t.is(a.getActions(state), 'ROLL_AGAIN');
});

test('Actions.getActions() returns ACTION_ROLL_AGAIN_NEXT if the player has met initial turn score and can still play', t => {
  const state = merge(g.getState(), {
    dice: [1,1,1,5,4],
    selectedDie: [
      {roll: 1, value: 1},
      {roll: 1, value: 1},
      {roll: 1, value: 1},
    ],
    turnScore: {
      errors: [],
      items: [{dice: [1, 1, 1], score: 1000}],
      score: 1000,
    },
    scoreboard: {
      1: [],
      2: []
    },
  });

  t.is(a.getActions(state), 'ROLL_AGAIN_NEXT');
});
