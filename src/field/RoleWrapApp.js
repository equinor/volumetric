import React, { useContext } from 'react';
import FieldContextWrap from './FieldContextWrap';
import { Query } from 'react-apollo';
import { GET_ROLES } from '../common/Queries';
import { GraphqlError, NetworkError } from '../common/ErrorHandling';
import { StyledSpinner } from '../common/Spinner';
import { AuthContext } from '../auth/AuthContext';

const RoleWrapApp = () => {
  const { user } = useContext(AuthContext);
  return (
    <Query query={GET_ROLES} variables={{ user: user.shortName.toLowerCase() }}>
      {({ loading, error, data }) => {
        if (loading) return <StyledSpinner isLoading={true} />;
        if (error)
          return error.networkError ? NetworkError(error) : GraphqlError(error);
        return <FieldContextWrap roles={data.roleByUser} />;
      }}
    </Query>
  );
};

export default RoleWrapApp;
