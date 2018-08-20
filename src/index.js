import React from 'react';
import { render } from 'react-dom';
import './index.css';
import ApolloClient from 'apollo-boost';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { ApolloProvider } from 'react-apollo';
import { API_URL } from './common/variables';

const client = new ApolloClient({ uri: `${API_URL}/graphql` });

const ApolloApp = App => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

render(ApolloApp(App), document.getElementById('root'));

registerServiceWorker();
