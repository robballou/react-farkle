import test from 'ava';
import sinon from 'sinon';
import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

configure({ adapter: new Adapter() });

import React from 'react';
import Scoreboard from '../src/components/Scoreboard';

test('scoreboard supports multiple score items', t => {
  const score = {
    1: [
      {
        items: [{dice: [1], score: 100}],
        score: 100,
      },
      {
        items: [{dice: [1], score: 100}],
        score: 100,
      },
    ],
    2: [],
  }
  const scoreboard = shallow(<Scoreboard score={score}/>);
  t.is(scoreboard.find('li').length, 2);
});
