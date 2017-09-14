import React from 'react';
import {indexOf} from 'lodash';
import Die from './Die';

import {filterRoll} from '../utils/filters';

/**
 * Represents a component containing a player's dice.
 */
export default class PlayerRoll extends React.Component {
  render() {
    const selectedDieIndices = filterRoll(this.props.roll, this.props.selected).map((die) => die.index);
    const dice = this.props.value.map((value, ix) => {
      const isSelected = indexOf(selectedDieIndices, ix) > -1;
      return <Die key={ix} value={value} selected={isSelected}
        onClick={(value) => this.props.onClick({value, index: ix})}  />;
    });

    return <div className="dice">{dice}</div>;
  }
}
