import React from 'react';
import { render } from 'react-dom';
import './index.css';
import ApolloClient from 'apollo-boost';
import App from './App';
import { ApolloProvider } from 'react-apollo';
import { API_URL } from './common/variables';
import { authContext } from './auth/AdalConfig';
import { runWithAdal } from 'react-adal';
import { AuthProvider } from './auth/AuthContext';

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
  clientState: {
    defaults: {
      metrics: {
        __typename: 'Metrics',
        selectedMetric: 'bulk',
        metrics: ['bulk', 'net', 'porv', 'hcpv', 'stoiip'],
      },
    },
  },
});

const AppWithApollo = (
  <ApolloProvider client={client}>
    <AuthProvider
      getUser={() => authContext.getCachedUser()}
      getToken={() => getToken()}
    >
      <App />
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

