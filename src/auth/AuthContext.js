import React from 'react';
const AuthContext = React.createContext();

export class AuthProvider extends React.Component {
  static defaultProps = {
    value: {},
  };

  constructor(props) {
    super(props);
    // TODO: protection of getUser is basically for tests, we should figure out how to mock AuthContext
    const user = props.getUser
      ? props.getUser()
      : { profile: { name: 'Not logged in' } };
    const { name, roles } = user.profile;
    console.log(user);
    this.state = {
      name: name,
      roles: roles,
    };
  }

  render() {
    return (
      <AuthContext.Provider value={this.state}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

export const AuthConsumer = AuthContext.Consumer;
