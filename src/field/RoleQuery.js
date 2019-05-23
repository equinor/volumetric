import React from 'react';
import { Query } from 'react-apollo';
import { GET_ROLES } from '../common/Queries';
import { GraphqlError, NetworkError } from '../common/ErrorHandling';
import { StyledSpinner } from '../common/Spinner';

const RoleQuery = ({ user, children }) => {
  return (
    <Query query={GET_ROLES} variables={{ user: user.shortName.toLowerCase() }}>
      {({ loading, error, data }) => {
        if (loading) return <StyledSpinner isLoading={true} />;
        if (error)
          return error.networkError ? NetworkError(error) : GraphqlError(error);
        return children(data.roleByUser);
      }}
    </Query>
  );
};

export default RoleQuery;
