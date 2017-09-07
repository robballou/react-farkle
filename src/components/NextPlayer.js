import React from 'react';

export default class NextPlayer extends React.Component {
  render() {
    return <button className="nextPlayer" onClick={this.props.onClick}>Next Player</button>;
  }
}
