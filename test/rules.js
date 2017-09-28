import test from 'ava';

import {passedRule} from '../src/utils/filters';
import RuleResult from '../src/lib/RuleResult';
import InitialTurn500 from '../src/rules/InitialTurn500';

test('InitialTurn500 requires 500 points on first turn...', t => {
  const initialTurn = new InitialTurn500();
  const verify = initialTurn.verify.bind(initialTurn);

  [
    {
      state: {
        currentPlayer: 1,
        scoreboard: {
          1: [],
          2: [],
        },
        turnScore: 0,
      },
      result: false
    },
    {
      state: {
        currentPlayer: 1,
        scoreboard: {
          1: [{}],
          2: [],
        },
        turnScore: 0,
      },
      result: null
    },
    {
      state: {
        currentPlayer: 1,
        scoreboard: {
          1: [],
          2: [],
        },
        turnScore: {score: 500},
      },
      result: true,
    },
    {
      state: {
        currentPlayer: 1,
        scoreboard: {
          1: [],
          2: [],
        },
        turnScore: {score: 550},
      },
      result: true,
    },
    {
      state: {
        currentPlayer: 1,
        scoreboard: {
          1: [],
          2: [],
        },
        turnScore: {score: 100},
      },
      result: false,
    },
    {
      state: {
        currentPlayer: 1,
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
      },
      result: false,
    }
  ].forEach((testCase, ix) => {
    const thisResult = verify(testCase.state, []);
    t.is(thisResult.passed, testCase.result, `Test #${ix} failed`);
  });

});

test('passedRule() returns a rule value', t => {
  t.is(
    passedRule('Farkled', [
      new RuleResult('Farkled', true)
    ]),
    true
  );
});
