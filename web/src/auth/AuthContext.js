import React, { useContext } from 'react';
import { useStateWithLocalStorage } from '../utils/localStorage';

export const AuthContext = React.createContext();

export const getUser = cachedUser => {
  const { name, roles, upn, exp = [] } = cachedUser.profile;
  return {
    name: name,
    shortName: upn.toString().substring(0, upn.lastIndexOf('@')),
    tokenExpire: exp,
    isAdmin: roles && roles.includes('VolumetricAdmin'),
  };
};

const findRole = (roles, field) => {
  const role = roles.find(role => role.field === field);
  return role ? role.role : '';
};

export const AuthProvider = ({ user, token, roles, children }) => {
  const [localStorageField, setLocalStorageField] = useStateWithLocalStorage(
    'currentField',
  );

  const hasRoles = roles.length > 0;
  const hasAccessToCurrentField =
    localStorageField && roles.some(role => role.field === localStorageField);
  const initialRole = hasRoles ? roles[0] : { field: 'No field' };
  const currentField = hasAccessToCurrentField
    ? localStorageField
    : initialRole.field;

  const [currentRole, setCurrentRole] = React.useState(
    findRole(roles, currentField),
  );

  const setCurrentField = field => {
    setLocalStorageField(field);
    setCurrentRole(findRole(roles, field));
  };

  return (
    <AuthContext.Provider
      value={{
        user: {
          ...user,
          roles,
          currentRole: currentRole,
          isFieldAdmin: currentRole === 'fieldadmin',
          isCreator: currentRole === 'creator' || currentRole === 'fieldadmin',
        },
        currentField: currentField,
        token,
        setCurrentField,
        setCurrentRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUserSettings = () => useContext(AuthContext);

export const AuthConsumer = AuthContext.Consumer;
