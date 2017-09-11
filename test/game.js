import test from 'ava';
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
