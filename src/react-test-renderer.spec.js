import React, {PureComponent} from 'react';
import ReactTestRenderer from 'react-test-renderer';

class MyList extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {a: 1};
    this.changeState = this.changeState.bind(this);
  }

  componentDidMount() {
    this.input.focus();
  }

  componentWillUnmount() {
    console.log('I am gone!');
  }

  changeState() {
    this.setState({a: this.state.a + 1});
    console.log('state =', this.state);
  }

  render () {
    console.log('render!');
    return (
      <div onClick={this.changeState}>
        <input ref={el => this.input = el}/>
        <ul>{this.props.items.map((item, i) => (<li key={i}>{item}</li>))}</ul>
      </div>
    );
  }
}

// https://reactjs.org/docs/test-renderer.html

describe('React Test Renderer', () => {
  let items;
  let renderer;
  let focus;

  beforeEach(() => {
    focus = jest.fn();
    items = ['hello', 'workshop'];
    renderer = ReactTestRenderer.create(
      <MyList items={items}/>,
      {
        createNodeMock: () => {
          return {focus};
        }
      }
    );
  });

  it.skip('produces plain object representation of rendered compponent with toJSON() method', () => {
    expect(renderer.toJSON()).toEqual({
      type: 'ul',
      props: {},
      children: [
        {type: 'li', props: {}, children: ['hello']},
        {type: 'li', props: {}, children: ['workshop']}
      ]
    });
  });

  it('can mock refs', () => {
    expect(focus).toBeCalled();
  });

  it('produces very detailed object with toTree() method', () => {
    expect(renderer.toTree()).toMatchObject({
      nodeType: 'component',
      type: MyList,
      props: {
        items: ['hello', 'workshop']
      }
    });
  });

  it('can find elements', () => {
    expect(renderer.root.findAllByType('li').length).toBe(2);
  });

  it('can start unmount cycle', () => {
    renderer.unmount();
  });

  it('changes state synchronously', () => {
    renderer.toJSON().props.onClick();
    // renderer.unstable_flushSync(() => renderer.toJSON().props.onClick());
  });
});
