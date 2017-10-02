import React from 'react';
import lzstring from 'lz-string';

export default class Log extends React.Component {
  render() {
    const entries = JSON.stringify(this.props.entries, null, 2);
    const compressedLog = lzstring.compressToEncodedURIComponent(entries);
    const logLink = "?log=" + compressedLog;
    return <div className="log">
        <a href={logLink}>Copy this link</a>
        <pre>{entries}</pre>
      </div>;
  }
}
