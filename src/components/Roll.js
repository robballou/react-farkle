import React from 'react';

export default class Roll extends React.Component {
  render() {
    const title = (this.props.title) ? this.props.title : 'Roll';

    // calls the onClick property passed in via Game
    return <button className="roll" onClick={() => this.props.onClick()}>{title}</button>;
  }
}
