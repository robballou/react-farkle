import React from 'react';
import {merge} from 'lodash';

import Actions from './Actions';
import PlayerRoll from './PlayerRoll';
import Scoreboard from './Scoreboard';
import Messages from './Messages';
import NextPlayer from './NextPlayer';
import TurnIndicator from './TurnIndicator';
import TurnScoreboard from './TurnScoreboard';

import {getRandomIntInclusive} from '../utils/random';
import {filterRoll} from '../utils/filters';
import {verifyRules} from '../utils/game';

import {
  score,
} from '../utils/score';

import Farkled from '../rules/Farkled';
import InitialTurn500 from '../rules/InitialTurn500';

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

      ruleResults: {},

      selectedDie: [],
      diceRemaining: 6,
      messages: [],
      turnScore: 0,
      scoreboard: {
        1: [],
        2: [],
      },
    };

    this.rules = {
      roll: [
        Farkled
      ],
      select: [
        InitialTurn500,
      ]
    }
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
    const next = (this.state.currentPlayer == 1) ? 2 : 1;

    // add the player's score to the overall scoreboard...
    const scoreboard = this.state.scoreboard;
    scoreboard[this.state.currentPlayer].push(this.state.turnScore);

    // update the state...
    this.setState({
      turnScore: 0,
      roll: 1,
      scoreboard,
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
          <TurnScoreboard farkled={this.state.farkled} selected={this.state.selectedDie} value={this.state.turnScore} />
          <Scoreboard score={this.state.scoreboard} />
        </div>
      </div>
    );
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

    if (this.state.diceRemaining == 0) {
      this.state.diceRemaining = 6;
    }

    const newDice = [];
    for (var i = 0; i < this.state.diceRemaining; i++) {
      newDice.push(getRandomIntInclusive(1,6));
    }

    // check if they passed all of the "roll" rules before advancing. Currently we are
    // only checking if they farkled here, but this could be extended to other cases.
    const [passedRules, ruleResults] = verifyRules(this.rules.roll, this.state, newDice);

    // check the farkled roll...
    const farkled = (ruleResults.filter((rule) => rule.rule == 'Farkled'))[0].passed === false;
    console.log({results: (ruleResults.filter((rule) => rule.rule == 'Farkled')), farkled});

    // const farkled = didFarkle(newDice);
    const currentMessage = farkled ? 'Farkled!' : 'Select die to score';
    this.setState({
      dice: newDice,
      currentMessage,
      farkled,
      ruleResults: this.updateRuleResults('roll', passedRules, ruleResults),
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

    const turnScore = score(this.state.selectedDie);
    const [passedRules, ruleResults] = verifyRules(this.rules.select, this.state);
    this.state.ruleResults = this.updateRuleResults('selectDie', passedRules, ruleResults);

    this.setState({selectedDie: this.state.selectedDie, turnScore, ruleResults: this.state.ruleResults});
  }

  /**
   * Update the rule results structure with a new set of results.
   *
   * Only one keyed entry is maintained per result set currently. E.g. if the
   * player has rolled twice, the 'roll' result set will be for the most recent
   * roll.
   */
  updateRuleResults(key, passed, results) {
    return merge(this.state.ruleResults, {key: {
      passed: passed,
      results: results,
    }});
  }
}