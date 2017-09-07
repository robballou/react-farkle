import React from 'react';

export default class Messages extends React.Component {
  render() {
    const messages = this.props.value.map((message) => {
      return <div className="message">{message}</div>;
    });

    return <div className="messages">{messages}</div>;
  }
}
