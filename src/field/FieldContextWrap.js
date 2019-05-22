import React, { useContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { FieldProvider } from './FieldContext';
import App from '../App';
import { AuthContext } from '../auth/AuthContext';
import { useStateWithLocalStorage } from '../utils/localStorage';

function FieldContextWrap(roles) {
  const { user } = useContext(AuthContext);
  const [currentField, setCurrentField] = useStateWithLocalStorage(
    'currentField',
  );
  let initialState;

  if (roles.roles.length === 0) {
    initialState = {
      currentField: 'No fields',
      currentRole: '',
      roles: '',
    };
  } else {
    const hasAccessToCurrentField =
      currentField && roles.roles.some(role => role.field === currentField);
    initialState = {
      currentField: hasAccessToCurrentField
        ? currentField
        : roles.roles[0].field,
      currentRole: roles.roles[0].role,
      roles: roles.roles,
    };
  }

  const reducer = (state, action) => {
    setCurrentField(action.currentField);
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
