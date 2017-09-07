import React from 'react';

export default class Roll extends React.Component {
  render() {
    // calls the onClick property passed in via Game
    return <button className="roll" onClick={() => this.props.onClick()}>Roll</button>;
  }
}
