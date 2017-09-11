import {isEqual, pickBy, toPairs, clone, concat, isNumber, keys} from 'lodash';

/**
 * Check if the player "farkled" (e.g. has no scoring die in a roll)
 */
export function didFarkle(dice) {
  const thisScore = score(dice);
  if (thisScore.score != 0) {
    return false;
  }
  return true;
}

/**
 * Count the dice, returning an object with each die's number of occurences.
 */
export function dieCount(dice) {
  const counts = {};
  let current = 1;
  while (current <= 6) {
    counts[current] = (dice.filter((value) => value == current)).length;
    current++;
  }
  return counts;
}

/**
 * Normalize an array of die-values to die-objects.
 *
 * Does not mutate the dice argument.
 */
export function normalizeDice(dice) {
  return dice.map((die) => {
    if (isNumber(die)) {
      return {value: die};
    }
    return clone(die);
  });
}

/**
 * Score the dice roll.
 */
export function score(dice) {
  const thisScore = {score: 0, items: [], errors: []};
  const thisDice = normalizeDice(dice);

  // map the selected die into the respective scores, starting from the high
  // value pairings, etc. to the simple scoring objects
  const [specialsScore, specialScoreItems, remainingDie] = scoreSpecials(thisDice);

  thisScore.score += specialsScore;
  thisScore.items = concat(thisScore.items, specialScoreItems);

  // check if remaining items have a score...
  remainingDie.forEach((die) => {
    if (die.value == 1) {
      thisScore.score += 100;
      thisScore.items.push({
        dice: [1],
        score: 100,
      });
    }
    else if (die.value == 5) {
      thisScore.score += 50;
      thisScore.items.push({
        dice: [5],
        score: 50,
      });
    }
    else {
      thisScore.errors.push({
        dice: [die.value]
      });
    }
  });

  return thisScore;
}

/**
 * Score any special case rolls (e.g. pairs, straights, etc.)
 */
export function scoreSpecials(dice) {
  let thisDice = normalizeDice(dice);
  const diceValues = (thisDice.map((die) => die.value)).sort();
  const counts = dieCount(diceValues);
  const scoreItems = [];
  let specialScore = 0;

  const threeOfAKindScores = {
    1: 1000,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
    6: 600,
  };

  // in a nutshell, we need to check for special value scores starting at the
  // high scoring varieties down to the lower scoring ones...
  if (diceValues.length === 6) {
    // check for six of a kind = 4x the 3-of-a-kind score.
    if (hasSixOfAKind(diceValues)) {
      const sixOfAKind = keys(pickBy(counts, (v) => v === 6));
      if (sixOfAKind) {
        const itemScore = threeOfAKindScores[diceValues[0]] * 4;
        scoreItems.push({dice: diceValues, score: itemScore});
        thisDice = [];
        specialScore += itemScore;
      }
    }
    // straight = 1000
    else if (isStraight(diceValues)) {
      scoreItems.push({dice: diceValues, score: 1000});
      thisDice = [];
      specialScore += 1000;
    }
    else if (hasThreeDoubles(diceValues)) {
      scoreItems.push({dice: diceValues, score: 500});
      thisDice = [];
      specialScore += 500;
    }
  }

  if (diceValues.length >= 5) {
    const fiveOfAKind = getFiveOfAKind(diceValues);
    fiveOfAKind.forEach((quin) => {
      scoreItems.push({dice: [quin, quin, quin, quin, quin], score: threeOfAKindScores[quin] * 3});
      thisDice = thisDice.filter((die) => die.value != quin);
      specialScore += threeOfAKindScores[quin] * 3;
    });
  }

  if (diceValues.length >= 4) {
    const fourOfAKind = getFourOfAKind(diceValues);
    fourOfAKind.forEach((quad) => {
      scoreItems.push({dice: [quad, quad, quad, quad], score: threeOfAKindScores[quad] * 2});
      thisDice = thisDice.filter((die) => die.value != quad);
      specialScore += threeOfAKindScores[quad] * 2;
    });
  }

  if (diceValues.length >= 3) {
    const threeOfAKind = getThreeOfAKind(diceValues);
    threeOfAKind.forEach((triple) => {
      scoreItems.push({dice: [triple, triple, triple], score: threeOfAKindScores[triple]});
      thisDice = thisDice.filter((die) => die.value != triple);
      specialScore += threeOfAKindScores[triple];
    });
  }

  return [specialScore, scoreItems, thisDice];
}

/**
 * Check if there are any 1s or 5s in the die set.
 *
 * These are scoreable on their own.
 */
export function hasScoringSingleDie(die) {
  return (die.filter((value) => value == 1 || value == 5)).length > 0;
}

export function getNumberOfAKind(dice, n) {
  const counts = dieCount(dice);
  return keys(pickBy(counts, (count) => count === n))
    .map(parseInt);
}

export function getThreeOfAKind(dice) {
  return getNumberOfAKind(dice, 3);
}

export function getFourOfAKind(dice) {
  return getNumberOfAKind(dice, 4);
}

export function getFiveOfAKind(dice) {
  return getNumberOfAKind(dice, 5);
}
export function getSixOfAKind(dice) {
  return getNumberOfAKind(dice, 6);
}

export function hasThreeOfAKind(dice) {
  return (getThreeOfAKind(dice)).length > 0;
}

export function hasSixOfAKind(dice) {
  return (getSixOfAKind(dice)).length > 0;
}

export function isStraight(dice) {
  if (dice.length != 6) {
    return false;
  }

  return isEqual(dice, [1,2,3,4,5,6]);
}

export function hasThreeDoubles(dice) {
  if (dice.length != 6) {
    return false;
  }

  const counts = dieCount(dice);
  const pairs = getNumberOfAKind(dice, 2);
  return pairs.length == 3;
}
