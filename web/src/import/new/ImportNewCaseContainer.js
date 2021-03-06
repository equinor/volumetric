import React from 'react';
import ImportNewCaseComponent from './ImportNewCaseComponent';
import { Query } from 'react-apollo';
import { StyledSpinner } from '../../common/Spinner';
import { gql } from 'apollo-boost';
import { useUserSettings } from '../../auth/AuthContext';

const GET_CASE_TYPES = gql`
  query CaseTypes {
    caseTypes
  }
`;

const ImportNewCaseContainer = props => {
  const { user, currentField } = useUserSettings();

  return (
    <Query query={GET_CASE_TYPES} fetchPolicy="cache-and-network">
      {({ loading: loadingOne, error: errorOne, data }) => {
        if (errorOne) {
          return <div>Something went wrong!</div>;
        }
        return (
          <StyledSpinner isLoading={loadingOne}>
            <ImportNewCaseComponent
              {...props}
              data={data}
              user={user}
              currentField={currentField}
              key={currentField}
            />
          </StyledSpinner>
        );
      }}
    </Query>
  );
};

export default ImportNewCaseContainer;
