import React from 'react';

export default class Scoreboard extends React.Component {
  render() {
    const player1ScoreItems = this.props.score[1].map((turn, ix) => <li key="player1{ix}">{turn.score}</li>);
    const player2ScoreItems = this.props.score[2].map((turn, ix) => <li key="player2{ix}">{turn.score}</li>);

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
