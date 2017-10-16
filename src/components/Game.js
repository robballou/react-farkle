import React from 'react';
import {merge, pick} from 'lodash';

import Actions from './Actions';
import PlayerRoll from './PlayerRoll';
import Scoreboard from './Scoreboard';
import Messages from './Messages';
import NextPlayer from './NextPlayer';
import TurnIndicator from './TurnIndicator';
import TurnScoreboard from './TurnScoreboard';
import Log from './Log';

import {getRandomIntInclusive} from '../utils/random';
import {filterRoll, passedRule} from '../utils/filters';
import {verifyRules} from '../utils/game';

import {
  score,
  calculateScore
} from '../utils/score';

import Farkled from '../rules/Farkled';
import Win from '../rules/Win';
import InitialTurn500 from '../rules/InitialTurn500';

// Messages are used through this class... and we don't want to repeat and make
// more places to need to change in the future...
const MESSAGE_ROLL = 'Select "roll" to start your turn';
const MESSAGE_SELECT = 'Select die to score.';
const MESSAGE_SELECT_INITIAL = 'Select die to score. You must get 500 or more points on your first turn.';
const MESSAGE_SELECT_ERROR = 'Note: Currently you have selected dice that do not complete a correct score.';

/**
 * Parent game component and subcomponent logic.
 */
export default class Game extends React.Component {
  constructor() {
    super();

    // get the initial state object
    this.state = this.getState();

    // these are the rules used for this game ... broken out by specific events
    // that they need to be used for.
    this.rules = {
      // post-roll functionality
      roll: [
        Farkled
      ],

      // selected a die...
      select: [
        InitialTurn500,
      ],

      nextPlayer: [
        Win
      ]
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

  /**
   * Get the default state object.
   *
   * Used in two places: the initial start of the app plus each turn.
   */
  getState() {
    return {
      // current player number (1-index)
      currentPlayer: 1,

      // the current message to display
      currentMessage: MESSAGE_ROLL,

      // collection of dice values (e.g. the dot-values only)
      dice: [],

      // collection of the dice available with some metdata about state
      availableDice: [],

      // roll count, used to help differentiate between die indices
      roll: 1,

      // capture the results of rules here so that they can be shared with
      // components as needed.
      ruleResults: {},

      // dice that the player has selected
      selectedDie: [],

      // number of dice remaining on the table
      diceRemaining: 6,

      messages: [],

      // current turn score...
      turnScore: 0,

      farkled: false,

      // the scoreboard for this game (currently hardcoded for two players)
      scoreboard: {
        1: [],
        2: [],
        winning: null,
      },

      log: [],
    };
  }

  /**
   * Add an action to the log.
   */
  log(action, object) {
    const objectItems = ['dice', 'selectedDie',];
    const thisObject = pick(object, objectItems);
    const entry = {action, object: thisObject};
    const log = this.state.log;
    log.push(entry);
    this.setState({log});
    return object;
  }

  /**
   * Accept the score and move to the next player.
   *
   * This also needs to account for the winning state. Once one player is marked
   * as winning, other players have one turn to surpass their score.
   */
  nextPlayer() {
    const next = (this.state.currentPlayer == 1) ? 2 : 1;

    // add the player's score to the overall scoreboard...
    const scoreboard = this.state.scoreboard;
    if (this.state.turnScore !== 0 && this.state.turnScore.farkled === false) {
      scoreboard[this.state.currentPlayer].push(this.state.turnScore);
    }

    // check if "next" rules, including checking if the player is now winning
    const [passedRules, ruleResults] = verifyRules(this.rules.nextPlayer, this.state);
    this.state.ruleResults = this.updateRuleResults('nextPlayer', passedRules, ruleResults);
    const won = passedRule('Win', ruleResults) === true;

    // updateWinningPlayer() returns true if the game is over
    if (this.updateWinningPlayer(scoreboard, won, next)) {
      this.setState({messages: [`Player ${scoreboard.winning} has won`]});
      return;
    }

    // continue the game with the next player
    this.state.currentPlayer = next;

    // update the state...
    const newState = merge(this.getState(), pick(this.state, ['scoreboard', 'currentPlayer', 'log']));
    this.setState(this.log('nextPlayer', newState));
  }

  /**
   * Update the winning player in the game state and determine if the game has ended.
   */
  updateWinningPlayer(scoreboard, won, next) {
    // is the winning player next?
    const winningPlayerIsNext = (next == scoreboard.winning);

    // if the player won, update the state... but we need to check if another
    // player is already winning. If another player is winning, the higher score
    // wins and the game ends.
    if (won) {
      if (scoreboard.winning != null) {
        // get the score for the current winning player
        const winningScore = calculateScore(scoreboard[scoreboard.winning]);
        const currentPlayerScore = calculateScore(scoreboard[this.state.currentPlayer]);


        // now the current player is winning
        if (currentPlayerScore > winningScore) {
          scoreboard.winning = this.state.currentPlayer;
        }
      }
      else {
        scoreboard.winning = this.state.currentPlayer;
      }
    }

    return winningPlayerIsNext;
  }

  /**
   * Remove the previously selected die.
   */
  removeSelected(die) {
    return this.state.selectedDie.filter((selected) => !(selected.roll == this.state.roll && selected.index == die.index));
  }

  /**
   * Render the game.
   */
  render() {
    return (
      <div>
        <div className="game">
          <TurnIndicator
            player={this.state.currentPlayer}
            message={this.state.currentMessage} />
          <Messages value={this.state.messages} />
          <div className="actions">
            <Actions
              onRoll={this.roll.bind(this)}
              onNext={this.nextPlayer.bind(this)}
              gameState={this.state}
              />
          </div>
          <PlayerRoll
            gameState={this.state}
            onClick={this.selectDie.bind(this)} />
          <TurnScoreboard farkled={this.state.farkled} selected={this.state.selectedDie} value={this.state.turnScore} />
          <Scoreboard score={this.state.scoreboard} />
          <Log entries={this.state.log} />
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

    // set the remaining dice... and reset it to 6 if we're back at 0 dice...
    const diceRemaining = (this.state.diceRemaining === 0) ? 6 : this.state.diceRemaining;

    const newDice = [];
    for (var i = 0; i < diceRemaining; i++) {
      newDice.push(getRandomIntInclusive(1,6));
    }

    // check if they passed all of the "roll" rules before advancing. Currently we are
    // only checking if they farkled here, but this could be extended to other cases.
    const [passedRules, ruleResults] = verifyRules(this.rules.roll, this.state, newDice);

    // check the farkled roll...
    const farkled = passedRule('Farkled', ruleResults) === false;
    const turnScore = this.state.turnScore;
    if (farkled) {
      turnScore.farkled = true;
    }

    // const farkled = didFarkle(newDice);
    const currentMessage = farkled ? 'Farkled!' : this.state.currentMessage;
    this.setState(this.log('roll', {
      dice: newDice,
      diceRemaining,
      currentMessage,
      farkled,
      turnScore,
      ruleResults: this.updateRuleResults('roll', passedRules, ruleResults),
    }));
  }

  /**
   * Player selected a die, so score it...
   */
  selectDie(selected) {
    // if the player has farkled, they cannot select anymore dice...
    if (this.state.farkled) {
      return;
    }

    // check if this dice is already selected
    if (this.alreadySelected(selected)) {
      this.state.selectedDie = this.removeSelected(selected);
    }
    else {
      selected.roll = this.state.roll;
      this.state.selectedDie.push(selected);
    }

    const turnScore = score(this.state.selectedDie);
    this.state.turnScore = turnScore;
    const [passedRules, ruleResults] = verifyRules(this.rules.select, this.state);
    this.state.ruleResults = this.updateRuleResults('select', passedRules, ruleResults);

    let currentMessage = MESSAGE_SELECT;
    if (passedRule('InitialTurn500', ruleResults) === false) {
      currentMessage = MESSAGE_SELECT_INITIAL;
    }
    const messages = [];
    if (turnScore.errors.length > 0) {
      messages.push(MESSAGE_SELECT_ERROR);
    }

    this.setState(this.log('select', {selectedDie: this.state.selectedDie, turnScore, currentMessage, messages, ruleResults: this.state.ruleResults}));
  }

  /**
   * Update the rule results structure with a new set of results.
   *
   * Only one keyed entry is maintained per result set currently. E.g. if the
   * player has rolled twice, the 'roll' result set will be for the most recent
   * roll.
   */
  updateRuleResults(key, passed, results) {
    // to set the key specified in the argument, we need this workaround.
    const newRuleResults = {};
    newRuleResults[key] = {
      passed: passed,
      results: results,
    };

    return merge(this.state.ruleResults, newRuleResults);
  }
}
