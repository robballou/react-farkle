import test from 'ava';

import {
  dieCount,
  didFarkle,
  hasThreeOfAKind,
  isStraight
} from '../src/utils/score';

test('correctly check if user farkled', t => {
  const farkled = [
    {
      die: [2, 2, 3, 4, 6, 6],
      result: true
    },
    {
      die: [2, 2, 3, 4, 6, 6],
      result: true,
    },
    {
      die: [2],
      result: true,
    },
    {
      die: [1, 2],
      result: false
    }
  ];

  farkled.forEach((testCase) => {
    t.is(didFarkle(testCase.die), testCase.result);
  });

});

test('dieCount()', t => {
  const tests = [
    {
      die: [1],
      counts: {1: 1, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0},
    },
    {
      die: [1, 1],
      counts: {1: 2, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0},
    }
  ];

  tests.forEach((testCase, ix) => {
    t.deepEqual(dieCount(testCase.die), testCase.counts, `Test case failed: ${ix}`);
  });
});

test('hasThreeOfAKind()', t => {
  const tests = [
    {
      die: [1],
      result: false,
    },
    {
      die: [1, 1],
      result: false,
    },
    {
      die: [1, 1, 1],
      result: true,
    },
    {
      die: [1, 1, 1, 2],
      result: true,
    },
  ];

  tests.forEach((testCase, ix) => {
    t.deepEqual(hasThreeOfAKind(testCase.die), testCase.result, `Test case failed: ${ix}`);
  });
});

test('isStraight()', t => {
  const tests = [
    {
      die: [1],
      result: false,
    },
    {
      die: [1, 2, 3, 4, 5, 6],
      result: true,
    },
    {
      die: [1, 1, 2, 3, 4, 5],
      result: false,
    },
  ];

  tests.forEach((testCase, ix) => {
    t.deepEqual(isStraight(testCase.die), testCase.result, `Test case failed: ${ix}`);
  });
});
