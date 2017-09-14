import React from 'react';
import {getRandomIntInclusive} from '../utils/random';

import Actions from './Actions';
import PlayerRoll from './PlayerRoll';
import Scoreboard from './Scoreboard';
import Messages from './Messages';
import NextPlayer from './NextPlayer';
import TurnIndicator from './TurnIndicator';
import TurnScoreboard from './TurnScoreboard';

import {filterRoll} from '../utils/filters';

import {
  didFarkle,
  score,
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
      currentMessage: 'Select "roll" to start your turn',

      // collection of dice values (e.g. the dot-values only)
      dice: [],

      // collection of the dice available with some metdata about state
      availableDice: [],

      // roll count, used to help differentiate between die indices
      roll: 1,

      selectedDie: [],
      diceRemaining: 6,
      messages: [],
      turnScore: 0,
      scoreboard: {
        1: 0,
        2: 0,
      },
    };
  }

  /**
   * Check if the player already selected the die in this turn.
   */
  alreadySelected(die) {
    const thisRollsDice = filterRoll(this.state.roll, this.state.selectedDie);
    const alreadySelected = thisRollsDice.filter((selected) => selected.index == die.index);
    return alreadySelected.length > 0;
  }

  nextPlayer() {
    const next = (currentPlayer == 1) ? 2 : 1;
    this.setState({
      turnScore: 0,
      currentPlayer: next,
      messages: [`Player ${this.state.currentPlayer}, select roll to start your turn`]
    });
  }

  /**
   * Remove the previously selected die.
   */
  removeSelected(die) {
    return this.state.selectedDie.filter((selected) => !(selected.roll == this.state.roll && selected.index == die.index));
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
          <TurnIndicator
            player={this.state.currentPlayer}
            message={this.state.currentMessage} />
          <Messages value={this.state.messages} />
          <Actions
            onRoll={this.roll.bind(this)}
            onNext={this.nextPlayer.bind(this)}
            gameState={this.state}
            />
          <PlayerRoll
            roll={this.state.roll}
            selected={this.state.selectedDie}
            value={this.state.dice}
            farkled={this.state.farkled}
            onClick={this.selectDie.bind(this)} />
          <TurnScoreboard selected={this.state.selectedDie} value={this.state.turnScore} />
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
    // user has dice in play right now?
    if (this.state.dice.length !== 0) {
      this.state.diceRemaining = this.state.dice.length - (filterRoll(this.state.roll, this.state.selectedDie)).length;
      this.setState({roll: ++this.state.roll, diceRemaining: this.state.diceRemaining});
    }

    const newDice = [];
    for (var i = 0; i < this.state.diceRemaining; i++) {
      newDice.push(getRandomIntInclusive(1,6));
    }

    const farkled = didFarkle(newDice);
    const currentMessage = farkled ? 'Farkled!' : 'Select die to score';
    this.setState({
      dice: newDice,
      currentMessage,
      farkled
    });
  }

  /**
   * Player selected a die, so score it...
   */
  selectDie(selected) {
    // check if this dice is already selected
    if (this.alreadySelected(selected)) {
      this.state.selectedDie = this.removeSelected(selected);
    }
    else {
      selected.roll = this.state.roll;
      this.state.selectedDie.push(selected);
    }
    this.setState({selectedDie: this.state.selectedDie, turnScore: score(this.state.selectedDie)});
  }
}
