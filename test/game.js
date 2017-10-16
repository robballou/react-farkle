import test from 'ava';
import sinon from 'sinon';
import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

configure({ adapter: new Adapter() });

import React from 'react';
import { merge } from 'lodash';
import Game from '../src/components/Game';

test('game.alreadySelected() returns false if the die was not selected', t => {
  const g = new Game();
  t.is(g.alreadySelected({index:0, value: 1}), false);
});

test('game.alreadySelected() returns true if the die was already selected', t => {
  const g = new Game();
  g.state.selectedDie = [
    {index:0, value: 1, roll: 1}
  ];
  t.is(g.alreadySelected({index:0}), true);
});

test('game.nextPlayer() adds the players score to the scoreboard', t => {
  const g = shallow(<Game />);
  const myGame = g.instance();

  myGame.state = merge(myGame.state, {
    dice: [1,1,1,4,5,2],
    selectedDie: [{value: 1, roll: 1}, {value: 1, roll: 1}, {value: 1, roll: 1}],
    turnScore: {
      score: 1000,
      items: [{dice: [1,1,1], score: 1000}],
      errors: [],
      farkled: false
    },
    scoreboard: {
      1: [],
      2: []
    }
  });

  myGame.nextPlayer();

  t.is(myGame.state.currentPlayer, 2);
  t.is(myGame.state.turnScore, 0);
  // player one should now have an item in their scoreboard...
  t.is(myGame.state.scoreboard[1].length, 1);
});

test('game.nextPlayer() ends the game after the last players turn', t => {
  const g = shallow(<Game />);
  const myGame = g.instance();

  myGame.state = merge(myGame.state, {
    currentPlayer: 2,
    dice: [1,1,1,4,5,2],
    selectedDie: [{value: 1, roll: 1}, {value: 1, roll: 1}, {value: 1, roll: 1}],
    turnScore: {
      score: 100,
      items: [{dice: [1,1,1], score: 100}],
      errors: [],
      farkled: false
    },
    scoreboard: {
      winning: 1,
      1: [{
        score: 10000
      }],
      2: []
    }
  });

  myGame.nextPlayer();

  t.is(myGame.state.messages.length, 1);
  t.is(myGame.state.scoreboard.winning, 1);
})
