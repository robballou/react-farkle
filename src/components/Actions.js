import React from 'react';

import Roll from './Roll';
import NextPlayer from './NextPlayer';

import { filterRoll } from '../utils/filters';
import {
  all,
  haveRolled,
  allDiceSelected,
  noScoringErrors,
  haveDiceSelected
} from '../utils/game';
/**
 * Render the actions available for the player.
 *
 *
 */
export default class Actions extends React.Component {
  render() {
    // when farkled, can only go to "next"...
    if (this.props.gameState.farkled) {
      return <NextPlayer onClick={this.props.onNext} />;
    }

    // if the user has rolled the dice...
    if (haveRolled(this.props.gameState)) {
      const allSelected = allDiceSelected(this.props.gameState);
      const haveSelected = haveDiceSelected(this.props.gameState);
      const noErrors = noScoringErrors(this.props.gameState);

      // if all dice are selected, we cannot roll anymore so we can only
      // advance to the next player.
      if (allSelected && noErrors) {
        return <div>
            <Roll title="Roll again" onClick={this.props.onRoll} />
            <NextPlayer onClick={this.props.onNext} />
          </div>;
      }
      else if (haveSelected && !allSelected && noErrors) {
        return (
          <div>
            <Roll title="Roll again" onClick={this.props.onRoll} />
            <NextPlayer onClick={this.props.onNext} />
          </div>
        );
      }
      // if they have rolled, but not selected anything so there's nothing we
      // can do yet...
      else if (!haveSelected) {
        return null;
      }
      // if they have rolled but they have selected things that cannot be scored
      // then we also can't do anything...
      else if (haveSelected && !noErrors) {
        return null;
      }
    }

    return <Roll onClick={this.props.onRoll} />;
  }
}
