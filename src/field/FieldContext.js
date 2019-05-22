import React, { createContext, useContext, useReducer } from 'react';
import { useStateWithLocalStorage } from '../utils/localStorage';

export const FieldContext = createContext();

export const FieldProvider = ({ roles, children }) => {
  const [currentField, setCurrentField] = useStateWithLocalStorage(
    'currentField',
  );
  let initialState;

  if (roles.length === 0) {
    initialState = {
      currentField: 'No fields',
      currentRole: '',
      roles: '',
    };
  } else {
    const hasAccessToCurrentField =
      currentField && roles.some(role => role.field === currentField);
    initialState = {
      currentField: hasAccessToCurrentField ? currentField : roles[0].field,
      currentRole: roles[0].role,
      roles: roles,
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
    <FieldContext.Provider value={useReducer(reducer, initialState)}>
      {children}
    </FieldContext.Provider>
  );
};

export function isCreator(role) {
  if (role === 'creator' || role === 'fieldadmin') {
    return true;
  }
}

export function isFieldAdmin(role) {
  if (role === 'fieldadmin') {
    return true;
  }
}

export const useFieldValue = () => useContext(FieldContext);
