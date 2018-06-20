import React, {PureComponent} from 'react';
import ReactTestRenderer from 'react-test-renderer';

class MyList extends PureComponent {
  render () {
    return (
      <ul>{this.props.items.map((item, i) => (<li key={i}>{item}</li>))}</ul>
    );
  }
}

describe.skip('React Test Renderer', () => {
  let items;
  let renderer;

  beforeEach(() => {
    items = ['hello', 'workshop'];
    renderer = ReactTestRenderer.create(
      <MyList items={items}/>
    );
  });

  it('produces plain object representation of rendered compponent with toJSON() method', () => {
    expect('?').toEqual({
      type: 'ul',
      props: {},
      children: [
        {type: 'li', props: {}, children: ['hello']},
        {type: 'li', props: {}, children: ['workshop']}
      ]
    });
  });

  it.skip('can mock refs', () => {
  });

  it.skip('produces very detailed object with toTree() method', () => {
  });

  it.skip('can find elements', () => {
  });

  it.skip('can start unmount cycle', () => {
  });

  it.skip('changes state synchronously', () => {
  });
});
