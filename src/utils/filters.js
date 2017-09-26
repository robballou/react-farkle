export function filterRoll(roll, array) {
  return array.filter((item) => item.roll === roll);
}

/**
 * Determine the value of a passed property of a rule result.
 */
export function passedRule(rule, ruleResults) {
  // if the first argument is false instead of an array, then
  // there is no rule results yet...
  if (ruleResults === false) {
    return null;
  }

  // filter anre return the passed property.
  const results = ruleResults.filter((thisRule) => thisRule.rule == rule);
  if (results.length === 0) {
    return null;
  }
  return results[0].passed;
}
