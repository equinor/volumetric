import React, { useContext } from 'react';
import ImportNewCaseComponent from './ImportNewCaseComponent';
import { Query } from 'react-apollo';
import { StyledSpinner } from '../../common/Spinner';
import { gql } from 'apollo-boost';
import { AuthContext } from '../../auth/AuthContext';

const GET_CASE_TYPES = gql`
  query Fields {
    fields(orderBy: "name") {
      name
      cases(orderBy: "name") {
        id
        name
      }
    }
    caseTypes
  }
`;

const ImportNewCaseContainer = props => {
  const { user } = useContext(AuthContext);
  return (
    <Query query={GET_CASE_TYPES} fetchPolicy="cache-and-network">
      {({ loading: loadingOne, error: errorOne, data }) => {
        if (errorOne) {
          return <div>Something went wrong!</div>;
        }
        return (
          <StyledSpinner isLoading={loadingOne}>
            <ImportNewCaseComponent {...props} data={data} user={user} />
          </StyledSpinner>
        );
      }}
    </Query>
  );
};

export default ImportNewCaseContainer;
