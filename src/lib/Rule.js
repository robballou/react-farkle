import RuleResult from '../lib/RuleResult';

/**
 *
 */
export default class Rule {
  result(...args) {
    return new RuleResult(...args);
  }

  verify() {
    return true;
  }
}
