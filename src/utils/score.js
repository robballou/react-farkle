import {isEqual, pickBy, toPairs} from 'lodash';

export function didFarkle(die) {
  // check if there are any 1's or 5's
  if (hasScoringSingleDie(die)) {
    return false;
  }

  if (die.length > 3) {
    // check if there are more than three of a kind

  }

  return true;
}

export function score(die, carryOver = 0) {

}

export function dieCount(die) {
  const counts = {};
  let current = 1;
  while (current <= 6) {
    counts[current] = (die.filter((value) => value == current)).length;
    current++;
  }
  return counts;
}

/**
 * Check if there are any 1s or 5s in the die set.
 *
 * These are scoreable on their own.
 */
export function hasScoringSingleDie(die) {
  return (die.filter((value) => value == 1 || value == 5)).length > 0;
}

export function hasThreeOfAKind(die) {
  const counts = dieCount(die);
  const triples = toPairs(pickBy(counts, (count) => count >= 3));
  return triples.length > 0;
}

export function isStraight(die) {
  if (die.length != 6) {
    return false;
  }

  return isEqual(die, [1,2,3,4,5,6]);  
}

export function hasThreeDoubles() {
  if (die.length != 6) {
    return false;
  }

  const counts = dieCount(die);
  const triples = toPairs(pickBy(counts, (count) => count >= 3));
  return triples.length == 3;
}
