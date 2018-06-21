import {renderComponent, filterByTestID} from 'clubs-testkit/full-render';

import App from './App';

describe('App', () => {
  it('says hello', () => {
    expect(anApp().getWelcomeText()).toEqual(['Hello!']);
  });

  it('shows TODO list', () => {
    expect(anApp().getTodoList().length).toBe(2);
  });
});

function anApp(props) {
  const app = renderComponent(App);
  return {
    getWelcomeText() {
      return filterByTestID('app.welcome_text', app)[0].children;
    },
    getTodoList() {
      return filterByTestID(/app.todo.item-.*/, app);
    }
  };
}
