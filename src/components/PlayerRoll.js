import React from 'react';
import Die from './Die';
import {indexOf} from 'lodash';

export default class PlayerRoll extends React.Component {
  render() {
    // if (this.state.die.length === 0) {
    //   return null;
    // }

    const selectedDieIndices = this.props.selected.map((die) => die.index);

    const dice = this.props.value.map((value, ix) => {
      const isSelected = indexOf(selectedDieIndices, ix) > -1;
      return <Die key={ix} value={value} selected={isSelected}
        onClick={(value) => this.props.onClick({value, index: ix})}  />;
    });

    return <div className="dice">{dice}</div>;
  }
}
