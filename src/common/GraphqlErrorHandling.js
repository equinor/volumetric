import React from 'react';

export default class GraphqlError extends React.Component {
  render() {
    const {graphError} = this.props;
    var message = graphError.message;
    var delimiter = ':';
    var delimiterIndex = graphError.message.indexOf(':');
    // var statusCode = str.slice(0)
    if (message !== "test"){
      return (
        <h1>
          ACCESS DENIED
        </h1>
      );
    }
  }
}
