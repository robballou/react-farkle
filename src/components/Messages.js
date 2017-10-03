import React from 'react';

export default class Messages extends React.Component {
  render() {
    const messages = this.props.value.map((message, ix) => {
      const messageKey = `message${ix}`;
      return <div className="message" key={messageKey}>{message}</div>;
    });

    return <div className="messages">{messages}</div>;
  }
}
