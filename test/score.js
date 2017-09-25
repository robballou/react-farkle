import test from 'ava';
import {has} from 'lodash';

import {
  dieCount,
  didFarkle,
  hasThreeOfAKind,
  hasThreeDoubles,
  isStraight,
  score
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
      die: [5, 5, 5],
      result: true,
    },
    {
      die: [1, 1, 1, 2],
      result: true,
    },
  ];

  tests.forEach((testCase, ix) => {
    t.is(hasThreeOfAKind(testCase.die), testCase.result, `Test case failed: ${ix}`);
  });
});

test('hasThreeDoubles()', t => {
  const tests = [
    {
      die: [1],
      result: false,
    },
    {
      die: [1, 1, 2, 2, 3, 3],
      result: true,
    },
  ];

  tests.forEach((testCase, ix) => {
    t.is(hasThreeDoubles(testCase.die), testCase.result, `Test case failed: ${ix}`);
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

test('score() for 1 die', t => {
  [
    {
      die: [1],
      score: 100,
      items: [{dice: [1], score: 100}],
      errors: [],
    },
    {
      die: [2],
      score: 0,
      items: [],
      errors: [2],
    },
    {
      die: [3],
      score: 0,
      items: [],
      errors: [3],
    },
    {
      die: [4],
      score: 0,
      items: [],
      errors: [4],
    },
    {
      die: [5],
      score: 50,
      items: [{dice: [5], score: 50}],
      errors: [],
    },
    {
      die: [6],
      score: 0,
      items: [],
      errors: [6],
    },
  ].forEach((testCase, ix) => {
    const s = score(testCase.die);
    t.is(s.score, testCase.score, `Test #${ix} for ${testCase.die} failed: ${s.score}`);
    t.is(s.errors.length, testCase.errors.length, `Test #${ix} has incorrect number of errors`);
    t.is(s.items.length, testCase.items.length, `Test #${ix} has incorrect number of items`);
    t.deepEqual(s.items, testCase.items, `Test #${ix} has incorrect items`);
  });
});

test('score() for 2 dice', t => {
  [
    {
      die: [1, 1],
      score: 200,
      items: [{dice: [1], score: 100}, {dice: [1], score: 100}],
      errors: [],
    },
    {
      die: [1, 5],
      score: 150,
      items: [{dice: [1], score: 100}, {dice: [5], score: 50}],
      errors: [],
    },
    // only the "1" is valid.
    {
      die: [1, 2],
      score: 100,
      items: [{dice: [1], score: 100}],
      errors: [{dice: [1]}],
    }
  ].forEach((testCase, ix) => {
    const s = score(testCase.die);
    t.is(s.score, testCase.score, `Test #${ix} for ${testCase.die} failed: ${s.score}`);
    t.is(s.errors.length, testCase.errors.length, `Test #${ix} has incorrect number of errors`);
    t.is(s.items.length, testCase.items.length, `Test #${ix} has incorrect number of items`);
    t.deepEqual(s.items, testCase.items, `Test #${ix} has incorrect items`);
  });
});

test('score() for 3 of a kind', t => {
  [
    {
      die: [1, 1, 1],
      score: 1000,
      items: [{dice: [1, 1, 1], score: 1000}],
      errors: [],
    },
    {
      die: [2, 2, 2],
      score: 200,
      items: [{dice: [2, 2, 2], score: 200}],
      errors: [],
    },
    {
      die: [3, 3, 3],
      score: 300,
      items: [{dice: [3, 3, 3], score: 300}],
      errors: [],
    },
    {
      die: [4, 4, 4],
      score: 400,
      items: [{dice: [4, 4, 4], score: 400}],
      errors: [],
    },
    {
      die: [5, 5, 5],
      score: 500,
      items: [{dice: [5, 5, 5], score: 500}],
      errors: [],
    },
    {
      die: [6, 6, 6],
      score: 600,
      items: [{dice: [6, 6, 6], score: 600}],
      errors: [],
    },
    {
      die: [6, 6, 6, 1],
      score: 700,
      items: [{dice: [6, 6, 6], score: 600}, {dice: [1], score: 100}],
      errors: [],
    },
  ].forEach((testCase, ix) => {
    const s = score(testCase.die);
    t.is(s.score, testCase.score, `Test #${ix} for ${testCase.die} failed: ${s.score}`);
    t.is(s.errors.length, testCase.errors.length, `Test #${ix} has incorrect number of errors`);
    t.is(s.items.length, testCase.items.length, `Test #${ix} has incorrect number of items`);
    t.deepEqual(s.items, testCase.items, `Test #${ix} has incorrect items`);
  });
});

test('score() for 4 of a kind', t => {
  [
    {
      die: [1, 1, 1, 1],
      score: 2000,
      items: [{dice: [1, 1, 1, 1], score: 2000}],
      errors: [],
    },
    {
      die: [2, 2, 2, 2],
      score: 400,
      items: [{dice: [2, 2, 2, 2], score: 400}],
      errors: [],
    },
    {
      die: [3, 3, 3, 3],
      score: 600,
      items: [{dice: [3, 3, 3, 3], score: 600}],
      errors: [],
    },
    {
      die: [4, 4, 4, 4],
      score: 800,
      items: [{dice: [4, 4, 4, 4], score: 800}],
      errors: [],
    },
    {
      die: [5, 5, 5, 5],
      score: 1000,
      items: [{dice: [5, 5, 5, 5], score: 1000}],
      errors: [],
    },
    {
      die: [6, 6, 6, 6],
      score: 1200,
      items: [{dice: [6, 6, 6, 6], score: 1200}],
      errors: [],
    },
    {
      die: [6, 6, 6, 6, 1],
      score: 1300,
      items: [{dice: [6, 6, 6, 6], score: 1200}, {dice: [1], score: 100}],
      errors: [],
    },
  ].forEach((testCase, ix) => {
    const s = score(testCase.die);
    t.is(s.score, testCase.score, `Test #${ix} for ${testCase.die} failed: ${s.score}`);
    t.is(s.errors.length, testCase.errors.length, `Test #${ix} has incorrect number of errors`);
    t.is(s.items.length, testCase.items.length, `Test #${ix} has incorrect number of items`);
    t.deepEqual(s.items, testCase.items, `Test #${ix} has incorrect items`);
  });
});

test('score() for 5 of a kind', t => {
  [
    {
      die: [1, 1, 1, 1, 1],
      score: 3000,
      items: [{dice: [1, 1, 1, 1, 1], score: 3000}],
      errors: [],
    },
    {
      die: [2, 2, 2, 2, 2],
      score: 600,
      items: [{dice: [2, 2, 2, 2, 2], score: 600}],
      errors: [],
    },
    {
      die: [3, 3, 3, 3, 3],
      score: 900,
      items: [{dice: [3, 3, 3, 3, 3], score: 900}],
      errors: [],
    },
    {
      die: [4, 4, 4, 4, 4],
      score: 1200,
      items: [{dice: [4, 4, 4, 4, 4], score: 1200}],
      errors: [],
    },
    {
      die: [5, 5, 5, 5, 5],
      score: 1500,
      items: [{dice: [5, 5, 5, 5, 5], score: 1500}],
      errors: [],
    },
    {
      die: [6, 6, 6, 6, 6],
      score: 1800,
      items: [{dice: [6, 6, 6, 6, 6], score: 1800}],
      errors: [],
    },
    {
      die: [6, 6, 6, 6, 6, 1],
      score: 1900,
      items: [{dice: [6, 6, 6, 6, 6], score: 1800}, {dice: [1], score: 100}],
      errors: [],
    },
  ].forEach((testCase, ix) => {
    const s = score(testCase.die);
    t.is(s.score, testCase.score, `Test #${ix} for ${testCase.die} failed: ${s.score}`);
    t.is(s.errors.length, testCase.errors.length, `Test #${ix} has incorrect number of errors`);
    t.is(s.items.length, testCase.items.length, `Test #${ix} has incorrect number of items`);
    t.deepEqual(s.items, testCase.items, `Test #${ix} has incorrect items`);
  });
});

test('score() for 3 pairs', t => {
  [
    {
      die: [1, 1, 2, 2, 3, 3],
      score: 500,
      items: [{dice: [1, 1, 2, 2, 3, 3], score: 500}],
      errors: [],
    },
  ].forEach((testCase, ix) => {
    const s = score(testCase.die);
    t.is(s.score, testCase.score, `Test #${ix} for ${testCase.die} failed: ${s.score}`);
    t.is(s.errors.length, testCase.errors.length, `Test #${ix} has incorrect number of errors`);
    t.is(s.items.length, testCase.items.length, `Test #${ix} has incorrect number of items`);
    t.deepEqual(s.items, testCase.items, `Test #${ix} has incorrect items`);
  });
});

test('score() for 6 of a kind', t => {
  [
    {
      die: [1, 1, 1, 1, 1, 1],
      score: 4000,
      items: [{dice: [1, 1, 1, 1, 1, 1], score: 4000}],
      errors: [],
    },
    {
      die: [2, 2, 2, 2, 2, 2],
      score: 800,
      items: [{dice: [2, 2, 2, 2, 2, 2], score: 800}],
      errors: [],
    },
    {
      die: [3, 3, 3, 3, 3, 3],
      score: 1200,
      items: [{dice: [3, 3, 3, 3, 3, 3], score: 1200}],
      errors: [],
    },
    {
      die: [4, 4, 4, 4, 4, 4],
      score: 1600,
      items: [{dice: [4, 4, 4, 4, 4, 4], score: 1600}],
      errors: [],
    },
    {
      die: [5, 5, 5, 5, 5, 5],
      score: 2000,
      items: [{dice: [5, 5, 5, 5, 5, 5], score: 2000}],
      errors: [],
    },
    {
      die: [6, 6, 6, 6, 6, 6],
      score: 2400,
      items: [{dice: [6, 6, 6, 6, 6, 6], score: 2400}],
      errors: [],
    },
  ].forEach((testCase, ix) => {
    const s = score(testCase.die);
    t.is(s.score, testCase.score, `Test #${ix} for ${testCase.die} failed: ${s.score}`);
    t.is(s.errors.length, testCase.errors.length, `Test #${ix} has incorrect number of errors`);
    t.is(s.items.length, testCase.items.length, `Test #${ix} has incorrect number of items`);
    t.deepEqual(s.items, testCase.items, `Test #${ix} has incorrect items`);
  });
});

test('score() for a straight', t => {
  [
    {
      die: [1, 2, 3, 4, 5, 6],
      score: 1000,
      items: [{dice: [1, 2, 3, 4, 5, 6], score: 1000}],
      errors: [],
    },
  ].forEach((testCase, ix) => {
    const s = score(testCase.die);
    t.is(s.score, testCase.score, `Test #${ix} for ${testCase.die} failed: ${s.score}`);
    t.is(s.errors.length, testCase.errors.length, `Test #${ix} has incorrect number of errors`);
    t.is(s.items.length, testCase.items.length, `Test #${ix} has incorrect number of items`);
    t.deepEqual(s.items, testCase.items, `Test #${ix} has incorrect items`);
  });
});

test('score() with multiple rolls', t => {
  [
    {
      selected: [
        {value: 1, roll: 1},
        {value: 1, roll: 2},
      ],
      score: 200,
    },
    {
      selected: [
        {value: 1, roll: 1},
        {value: 1, roll: 2},
        {value: 1, roll: 2},
        {value: 1, roll: 2},
      ],
      score: 1100,
    },
  ].forEach((testCase, ix) => {
    const s = score(testCase.selected);
    t.is(s.score, testCase.score);
  });
});

test('score() result has a .farkled property', t => {
  [
    {
      selected: [
        {value: 1, roll: 1},
      ]
    }
  ].forEach((testCase, ix) => {
    const s = score(testCase.selected);
    t.is(has(s, 'farkled'), true);
  });
});
