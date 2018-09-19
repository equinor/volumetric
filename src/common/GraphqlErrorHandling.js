import React from 'react';

export default class GraphqlError extends React.Component {
  render() {
    const { graphError } = this.props;
    var message = graphError.message;
    if (message !== 'test') {
      return <h1>ACCESS DENIED</h1>;
    }
  }
}
