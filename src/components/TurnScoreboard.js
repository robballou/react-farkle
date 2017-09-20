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

    if (this.props.farkled) {
      return <span><strike>{this.props.value.score}</strike> 0</span>;
    }

    return this.props.value.score;
  }

  scoreItems() {
    if (this.props.value == 0) {
      return null;
    }

    // show a list of the items as we are scoring them
    const scoreItems = this.props.value.items.map((item, ix) => {
      const key = "item" + ix;
      const dice = [
        '','⚀','⚁','⚂','⚃','⚄','⚅'
      ];
      const diceList = item.dice.map((die) => dice[die]);
      return <li className="valid" key={key}>{diceList}: {item.score}</li>;
    });

    // list of die the user selected but we cannot score...
    const errorItems = this.props.value.errors.map((item, ix) => {
      const key = "item" + ix;
      const dice = [
        '','⚀','⚁','⚂','⚃','⚄','⚅'
      ];
      const diceList = item.dice.map((die) => dice[die]);
      return <li className="error" key={key}>Unused: {diceList}</li>;
    });

    return <ul className="turnScore">
        {scoreItems}
        {errorItems}
      </ul>;
  }
}
