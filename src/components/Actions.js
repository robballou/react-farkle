import React from 'react';
import {get} from 'lodash';

import Roll from './Roll';
import NextPlayer from './NextPlayer';

import { filterRoll, passedRule } from '../utils/filters';
import {
  all,
  haveRolled,
  allDiceSelected,
  noScoringErrors,
  haveDiceSelected,
  needsInitialTurnScore,
} from '../utils/game';

// these consts are really shareable... e.g. there won't be a ROLL && ROLL_AGAIN
const ACTION_NONE = null;
const ACTION_ROLL = 'ROLL';
const ACTION_ROLL_AGAIN = 'ROLL_AGAIN';
const ACTION_ROLL_AGAIN_NEXT = 'ROLL_AGAIN_NEXT';
const ACTION_NEXT = 'ROLL_NEXT';

/**
 * Render the actions available for the player.
 *
 *
 */
export default class Actions extends React.Component {
  getActions(state) {
    if (state.farkled) {
      return ACTION_NEXT;
    }

    // if the player has not rolled yet...
    if (!haveRolled(state)) {
      return ACTION_ROLL;
    }

    // this will be true if the player still needs to pass their initial turn
    // score before proceeding with normal play...
    const needsInitialScore = needsInitialTurnScore(state);

    // various flags related to the game state
    const allSelected = allDiceSelected(state);
    const haveSelected = haveDiceSelected(state);
    const noErrors = noScoringErrors(state);

    if (!needsInitialTurnScore && allSelected && noErrors) {
      return ACTION_ROLL_AGAIN_NEXT;
    }
    // they have selected dice and they haven't selected them all
    else if (!needsInitialTurnScore && haveSelected && !allSelected && noErrors) {
      return ACTION_ROLL_AGAIN_NEXT;
    }
    else if (needsInitialTurnScore && haveSelected) {
      return ACTION_ROLL_AGAIN;
    }

    return ACTION_NONE;
  }

  /**
   * Render this component.
   *
   * See getActions() for details on how each button/state is selected.
   */
  render() {
    const actions = this.getActions(this.props.gameState);

    switch (actions) {
      case ACTION_NEXT:
        return <NextPlayer onClick={this.props.onNext} />;

      case ACTION_ROLL:
        return <Roll onClick={this.props.onRoll} />;

      case ACTION_ROLL_AGAIN:
        return <Roll title="Roll again" onClick={this.props.onRoll} />;

      case ACTION_ROLL_AGAIN_NEXT:
        return <div>
          <Roll title="Roll again" onClick={this.props.onRoll} />
          <NextPlayer onClick={this.props.onNext} />
        </div>;
    }

    return null;
  }
}
