import React, { createContext, useContext, useReducer } from 'react';

export const FieldContext = createContext();

export const FieldProvider = ({ reducer, initialState, children }) => (
  <FieldContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </FieldContext.Provider>
);

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
