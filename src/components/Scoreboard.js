import React from 'react';

/**
 * Game scoreboard.
 */
export default class Scoreboard extends React.Component {
  /**
   * Create the score items list.
   */
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

    // calculate the player totals...
    const player1Total = this.props.score[1].reduce((carry, turn) => carry + turn.score, 0);
    const player2Total = this.props.score[2].reduce((carry, turn) => carry + turn.score, 0);

    const player1Winning = (player1Total > player2Total) ? '⭐️' : '';
    const player2Winning = (player1Total < player2Total) ? '⭐️' : '';

    const player1Won = (this.props.score.winning == 1) ? 'winning' : '';
    const player2Won = (this.props.score.winning == 2) ? 'winning' : '';

    const player1Class = ['scoreboard--player', player1Won].filter((value) => value !== '').join(' ');
    const player2Class = ['scoreboard--player', player2Won].filter((value) => value !== '').join(' ');

    return <div className="scoreboard">
        <header><h2>Scoreboard</h2></header>
        <div className="scores">
          <div className={player1Class}>
            <h3>Player 1 {player1Winning}</h3>
            Total: {player1Total}
            <ul>{player1ScoreItems}</ul>
          </div>
          <div className={player2Class}>
            <h3>Player 2 {player2Winning}</h3>
            Total: {player2Total}
            <ul>{player2ScoreItems}</ul>
          </div>
        </div>
      </div>;
  }
}
