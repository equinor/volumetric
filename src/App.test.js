import React from 'react';
import App from './App';
import { MockedProvider } from 'react-apollo/test-utils';
import { AuthProvider } from './auth/AuthContext';

it('renders without crashing', () => {
  ReactDOM.render(
    <MockedProvider addTypename={true}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MockedProvider>,
    document.createElement('div'),
  );
});
