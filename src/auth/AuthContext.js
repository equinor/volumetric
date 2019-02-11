import React from 'react';

const AuthContext = React.createContext();

export class AuthProvider extends React.Component {
  constructor(props) {
    super(props);
    const user = props.getUser();
    const token = props.getToken && props.getToken();
    const { name, roles, upn, exp = [] } = user.profile;
    this.state = {
      user: {
        name: name,
        shortName: upn.toString().substring(0, upn.lastIndexOf('@')),
        tokenExpire: exp,
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
