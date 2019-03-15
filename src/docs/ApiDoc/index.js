import React from 'react';
import { getToken } from '../..';
import AccessToken from './AccessToken';
import GraphQL from './GraphQL';
import RestApi from './RestApi';
import Intro from './Intro';

class ApiDoc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showToken: false,
      token: getToken(),
      user: props.user,
      expireDate: new Date(props.user.tokenExpire * 1000),
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(key, selectedOption) {
    this.setState({
      [key]: selectedOption,
    });
  }

  render() {
    return (
      <div>
        <Intro />
        <AccessToken
          showToken={this.state.showToken}
          handleChange={this.handleChange}
          user={this.state.user}
          token={this.state.token}
          expireDate={this.state.expireDate}
        />
        <RestApi />
        <GraphQL />
      </div>
    );
  }
}

export { ApiDoc };
