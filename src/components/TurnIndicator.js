import React from 'react';

export default class TurnIndicator extends React.Component {
  render() {
    return (<div className="turnIndicator">
    Player {this.props.player}: {this.props.message}
    </div>);
  }
}
