export default class RuleResult {
  constructor(ruleName, passed) {
    this.passed = passed;
    this.rule = ruleName;
  }
}
