import React from 'react';
import { Query } from 'react-apollo';
import { GraphqlError, NetworkError } from '../../common/ErrorHandling';
import { GET_CASE } from '../../common/Queries';
import { CaseComponent } from './CaseComponent';
import { StyledSpinner } from '../../common/Spinner';
import CaseInfo from './CaseInfo';
import { useUserSettings } from '../../auth/AuthContext';
import { NoDataDiv, NoField } from '../../common/NoData';

const CaseContainer = props => {
  const { currentField, user } = useUserSettings();
  if (currentField === 'No field') {
    return <NoField user={user} />;
  }
  const caseId = props.match.params.caseId;
  if (!caseId) {
    return <NoDataDiv>Unknown case.</NoDataDiv>;
  }
  return (
    <Query query={GET_CASE} variables={{ caseId }}>
      {({ data, loading, error }) => {
        if (loading) return <StyledSpinner isLoading={true} />;
        if (error)
          return error.networkError ? NetworkError(error) : GraphqlError(error);
        return (
          <div>
            <CaseInfo currentCase={data.case} />
            <CaseComponent {...data.case} />
          </div>
        );
      }}
    </Query>
  );
};

export default CaseContainer;
