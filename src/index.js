//add polyfill for IE < 11
import 'core-js';

import React from 'react';
import { render } from 'react-dom';
import './index.css';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { API_URL } from './common/variables';
import { authContext } from './auth/AdalConfig';
import { runWithAdal } from 'react-adal';
import { AuthProvider } from './auth/AuthContext';
import RoleWrapApp from './field/RoleWrapApp';

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

const AppWithApollo = (
  <ApolloProvider client={client}>
    <AuthProvider
      getUser={() => authContext.getCachedUser()}
      getToken={() => getToken()}
    >
      <RoleWrapApp />
    </AuthProvider>
  </ApolloProvider>
);

runWithAdal(
  authContext,
  () => {
    render(AppWithApollo, document.getElementById('root'));
  },
  false,
);
