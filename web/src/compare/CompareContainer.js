import React from 'react';
import { Query } from 'react-apollo';
import { GraphqlError, NetworkError } from '../common/ErrorHandling';
import { GET_FULL_CASES } from '../common/Queries';
import { StyledSpinner } from '../common/Spinner';
import { useUserSettings } from '../auth/AuthContext';
import { NoField } from '../common/NoData';
import { getCompareCases } from '../common/queryParams';
import { CompareComponent } from './CompareComponent';

const CompareContainer = props => {
  const { currentField, user } = useUserSettings();
  if (currentField === 'No field') {
    return <NoField user={user} />;
  }
  return (
    <Query
      query={GET_FULL_CASES}
      variables={{
        field: currentField,
        caseIds: getCompareCases(props.history),
      }}
    >
      {({ data, loading, error }) => {
        if (loading) return <StyledSpinner isLoading={true} />;
        if (error)
          return error.networkError ? NetworkError(error) : GraphqlError(error);
        return (
          <div>
            <CompareComponent cases={data.cases} />
          </div>
        );
      }}
    </Query>
  );
};

export default CompareContainer;
