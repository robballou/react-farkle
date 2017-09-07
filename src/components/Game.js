import React from 'react';
import {getRandomIntInclusive} from '../utils/random';
import Roll from './Roll';
import PlayerRoll from './PlayerRoll';
import Scoreboard from './Scoreboard';
import Messages from './Messages';
import NextPlayer from './NextPlayer';

import {
  didFarkle
} from '../utils/score';

// - user rolls all the dice
// - selects which die they want to use for their score
// - if no score possible, they "farkled" and it's the next player's turn
// - if remaining die, they can roll or just use the score

/*
Initial state/new turn state:

- Show roll button
- Show message for current player

During turn loop:

- Can select dice if they did not farkle
  - Selecting die updates the in-turn score.
  - Also need to validate that they *can* select the die. This probably
    only needs to happen on the "next" button press (so they have the
    opportunity of selecting multiple).
- Can keep rolling dice if there are unselected dice...

TODO toggling selected based on the die index won't work or needs to be updated
 in cases with subsequent rolls. E.g. use selects die index 0, then rolls
 remaining dice, we now have a new die index 0.

Potential state changes:

- initial/new turn (show roll button, show player message)
- roll (show the dice, show the select die message)
- select die (update the selected die, show the "roll" and "next" button)
- next (update score, update current player, fire new turn)
*/

export default class Game extends React.Component {
  constructor() {
    super();

    this.state = {
      currentPlayer: 1,
      dice: [],
      selectedDie: [],
      diceRemaining: 6,
      messages: [],
    };
  }

  nextPlayer() {
    const next = (currentPlayer == 1) ? 2 : 1;
    this.setState({currentPlayer: next, messages: [`Player ${this.state.currentPlayer}, select roll to start your turn`]});
  }

  /**
   * Render the game.
   *
   * TODO Change Roll into a component and use state for showing die or not.
   */
  render() {
    return (
      <div>
        <div className="game">
          <div className="turnIndicator">
          Player {this.state.currentPlayer}
          </div>
          <Messages value={this.state.messages} />
          <div className="actions">
            {this.renderActions()}
          </div>
          <div className="roll">
            <PlayerRoll selected={this.state.selectedDie} value={this.state.dice} onClick={this.selectDie.bind(this)}/>
          </div>
          <div className="selectedDie" />
          <Scoreboard />
        </div>
      </div>
    );
  }

  /**
   * Render action buttons (roll, next, etc)
   *
   * Actions:
   *
   * - Roll (initial and subsequent rolls)
   * - Next player
   * - Accept score (player selected all die they want, does not want to roll
   *   remaining dice)
   */
  renderActions() {
    if (this.state.dice.length > 0) {
      if (didFarkle(this.state.dice)) {
        return <NextPlayer onClick={() => this.nextPlayer()} />;
      }
      return null;
    }

    return (
      <Roll onClick={() => this.roll()} />
    )
  }

  /**
   * Roll a new set of die for this player.
   */
  roll() {
    const newDice = [];
    for (var i = 0; i < this.state.diceRemaining; i++) {
      newDice.push(getRandomIntInclusive(1,6));
    }
    this.setState({dice: newDice});
    // this.updateActions();
  }

  selectDie(selected) {
    // check if this dice is al
    const alreadySelected = (this.state.selectedDie.filter((die) => die.index == selected.index)).length > 0;
    if (alreadySelected) {

    }

    this.state.selectedDie.push(selected);
    this.setState({selectedDie: this.state.selectedDie});
  }
}
