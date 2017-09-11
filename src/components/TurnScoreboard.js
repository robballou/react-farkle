import React from 'react';
import {score} from '../utils/score';

export default class TurnScoreboard extends React.Component {
  render() {
    const scoreDetails = this.scoreItems();
    return <div className="scoreboard--turn">
        <p>Turn score: {this.score()}</p>
        <ul>
          {scoreDetails}
        </ul>
      </div>;
  }

  score() {
    if (this.props.value == 0) {
      return 0;
    }

    return this.props.value.score;
  }

  scoreItems() {
    if (this.props.value == 0) {
      return null;
    }

    return this.props.value.items.map((item, ix) => {
      const key = "item" + ix;
      const dice = [
        '','⚀','⚁','⚂','⚃','⚄','⚅'
      ];
      const diceList = item.dice.map((die) => dice[die]);
      return <li key={key}>{diceList}: {item.score}</li>;
    });
  }
}
