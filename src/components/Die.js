import React from 'react';

export default class Die extends React.Component {
  render() {
    const dice = [
      '','⚀','⚁','⚂','⚃','⚄','⚅'
    ];
    return (
      <button className={(this.props.selected) ? 'die selected' : 'die'} onClick={() => this.props.onClick(this.props.value)}>
        {dice[this.props.value]}
      </button>
    );
  }
}
