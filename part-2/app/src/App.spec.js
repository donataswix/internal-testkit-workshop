import {renderComponent, filterByTestID} from 'clubs-testkit/full-render';

import App from './App';

describe('App', () => {
  it('says hello', () => {
    expect(renderComponent(App).toJSON()).toEqual({
      type: 'Text',
      props: {},
      children: ['Hello!']
    });
  });
});
