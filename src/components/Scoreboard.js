import React from 'react';

export default class Scoreboard extends React.Component {
  scoreItems(items, key) {
    let index = 0;
    return items.map((turn) => {
      const thisKey = `${key}${index}`;
      index++;
      return <li key={thisKey}>{turn.score}</li>;
    });
  }

  render() {
    // get the list of each player's score items...
    const player1ScoreItems = this.scoreItems(this.props.score[1], 'player1');
    const player2ScoreItems = this.scoreItems(this.props.score[2], 'player2');

    const player1Total = this.props.score[1].reduce((carry, turn) => carry + turn.score, 0);
    const player2Total = this.props.score[2].reduce((carry, turn) => carry + turn.score, 0);

    return <div className="scoreboard">
        <div className="scoreboard--player">
          <h3>Player 1</h3>
          <ul>{player1ScoreItems}</ul>
          Total: {player1Total}
        </div>
        <div className="scoreboard--player">
          <h3>Player 2</h3>
          <ul>{player2ScoreItems}</ul>
          Total: {player2Total}
        </div>
      </div>;
  }
}
