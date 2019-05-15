import React, { useContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { FieldProvider } from './FieldContext';
import App from '../App';
import { AuthContext } from '../auth/AuthContext';

function FieldContextWrap(roles) {
  const { user } = useContext(AuthContext);
  console.log(user);
  const initialState = {
    currentField: roles.roles[0].field,
    currentRole: roles.roles[0].role,
    roles: roles.roles,
  };
  const reducer = (state, action) => {
    return {
      ...state,
      currentField: action.currentField,
      currentRole: action.currentRole,
    };
  };
  return (
    <Router>
      <FieldProvider initialState={initialState} reducer={reducer}>
        <App user={user} />
      </FieldProvider>
    </Router>
  );
}

export default FieldContextWrap;
