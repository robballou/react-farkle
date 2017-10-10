import test from 'ava';
import sinon from 'sinon';
import { shallow, mount, configure, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

configure({ adapter: new Adapter() });

import React from 'react';
import { merge } from 'lodash';
import Game from '../src/components/Game';
import Die from '../src/components/Die';
import PlayerRoll from '../src/components/PlayerRoll';
import Actions from '../src/components/Actions';
import Roll from '../src/components/Roll';

test('Die has selected class when marked selected', t => {
  const g = render(<Die value="1" selected={true} />);
  t.true(g.hasClass('selected'));
});

test('Die does not have selected class when not selected', t => {
  const g = render(<Die value="1" selected={false} />);
  t.true(!g.hasClass('selected'));
});
