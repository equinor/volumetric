import React from 'react';
import { Query } from 'react-apollo';
import { GraphqlError, NetworkError } from '../common/ErrorHandling';
import { GET_CASE } from '../common/Queries';
import { CaseComponent } from './CaseComponent';
import { StyledSpinner } from '../common/Spinner';

const CaseContainer = caseId => {
  return (
    <Query query={GET_CASE} variables={caseId}>
      {({ data, loading, error }) => {
        if (loading) return <StyledSpinner isLoading={true} />;
        if (error)
          return error.networkError ? NetworkError(error) : GraphqlError(error);
        return <CaseComponent {...data.case[0]} key={data.case[0].id} />;
      }}
    </Query>
  );
};

export default CaseContainer;
