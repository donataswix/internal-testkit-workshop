import React, {PureComponent} from 'react';
import ReactTestRenderer from 'react-test-renderer';

function Link ({url, children}) {
  return (
    <a style={{textDecoration: 'none'}} className="link" href={url}>{children}</a>
  );
}

class MyLinks extends PureComponent {
  renderLink({url, text}, i) {
    return <li key={i}><Link url={url}>{text}</Link></li>;
  }

  render () {
    return (
      <ul>{this.props.links.map(this.renderLink)}</ul>
    );
  }
}

describe.skip('Snapshot Testing', () => {
  it('just works', () => {
    const links = [
      {url: 'https://github.com', text: 'Was a good place'},
      {url: 'https://gitlab.com', text: 'Is a good place'},
    ];
    const renderer = ReactTestRenderer.create(<MyLinks links={links}/>);

    expect(renderer).toMatchSnapshot();
  });
});
