//add polyfill for IE 11 -> https://github.com/facebook/create-react-app/tree/master/packages/react-app-polyfill
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import React from 'react';
import { render } from 'react-dom';
import './index.css';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { API_URL } from './common/variables';
import { authContext } from './auth/AdalConfig';
import { runWithAdal } from 'react-adal';
import { AuthProvider, getUser } from './auth/AuthContext';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import RoleQuery from './field/RoleQuery';

export const getToken = () => {
  return authContext.getCachedToken(authContext.config.clientId);
};

const client = new ApolloClient({
  request: async operation => {
    const token = getToken();
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    });
  },
  uri: `${API_URL}/graphql`,
});

const AppWithProviders = () => {
  const user = getUser(authContext.getCachedUser());
  return (
    <ApolloProvider client={client}>
      <RoleQuery user={user}>
        {roles => (
          <AuthProvider user={user} roles={roles} token={getToken()}>
            <Router>
              <App />
            </Router>
          </AuthProvider>
        )}
      </RoleQuery>
    </ApolloProvider>
  );
};

runWithAdal(
  authContext,
  () => {
    render(<AppWithProviders />, document.getElementById('root'));
  },
  false,
);
