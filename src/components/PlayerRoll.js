import React from 'react';
import {indexOf} from 'lodash';
import Die from './Die';

import {filterRoll} from '../utils/filters';

/**
 * Represents a component containing a player's dice.
 */
export default class PlayerRoll extends React.Component {
  render() {
    // get the dice for this roll
    const selectedDieIndices = filterRoll(this.props.gameState.roll, this.props.gameState.selectedDie).map((die) => die.index);

    // now show the dice available
    const dice = this.props.gameState.dice.map((value, ix) => {
      // check if this die is selected...
      const isSelected = indexOf(selectedDieIndices, ix) > -1;
      const selectable = (this.props.gameState.farkled === false) ? true : false;

      // return the Die component
      return <Die key={ix} value={value} selected={isSelected} selectable={selectable}
        onClick={(value) => this.props.onClick({value, index: ix})}  />;
    });

    return <div className="dice">{dice}</div>;
  }
}
