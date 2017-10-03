import React from 'react';

export default class Die extends React.Component {
  render() {
    const dice = [
      '','⚀','⚁','⚂','⚃','⚄','⚅'
    ];

    const classNames = ['die'];
    if (this.props.selected) {
      classNames.push('selected');
    }
    if (this.props.selectable === false) {
      classNames.push('disabled');
    }

    return (
      <button className={classNames.join(' ')} onClick={() => this.props.onClick(this.props.value)}>
        {dice[this.props.value]}
      </button>
    );
  }
}
