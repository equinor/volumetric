import React from 'react';
import {render} from 'react-dom';
import './index.css';
import ApolloClient from 'apollo-boost';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {ApolloProvider} from "react-apollo";

const client = new ApolloClient({uri: '/api/graphql'});

const ApolloApp = App => (
    <ApolloProvider client={client}>
        <App/>
    </ApolloProvider>
);

render(ApolloApp(App), document.getElementById('root'));

registerServiceWorker();
