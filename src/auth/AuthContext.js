import React from 'react';

const AuthContext = React.createContext();

export class AuthProvider extends React.Component {
  constructor(props) {
    super(props);
    // TODO: protection of getUser is for tests, we should figure out how to mock AuthContext
    const user = props.getUser
      ? props.getUser()
      : { profile: { name: 'Not logged in', roles: [] } };
    const token = props.getToken && props.getToken();
    const { name, roles } = user.profile;
    this.state = {
      user: {
        name: name,
        isCreator:
          roles.includes('VolumetricAdmin') ||
          roles.includes('VolumetricCreator'),
        isAdmin: roles.includes('VolumetricAdmin'),
      },
      token,
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
