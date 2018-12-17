import React from 'react';
import ImportMetricsComponent from './ImportMetricsComponent';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { StyledSpinner } from '../common/Spinner';
import { GET_FIELDS } from '../common/Queries';

const GET_CASE_TYPES = gql`
  query CaseTypes {
    caseTypes
  }
`;

const ImportMetricsContainer = props => {
  return (
    <Query query={GET_FIELDS}>
      {({ loading: loadingOne, error: errorOne, data: dataOne }) => {
        return (
          <Query query={GET_CASE_TYPES}>
            {({ loading: loadingTwo, error: errorTwo, data: dataTwo }) => {
              if (errorOne || errorTwo) {
                return <div>Something went wrong!</div>;
              }
              return (
                <StyledSpinner isLoading={loadingOne || loadingTwo}>
                  <ImportMetricsComponent
                    {...props}
                    data={{ ...dataOne, ...dataTwo }}
                  />
                </StyledSpinner>
              );
            }}
          </Query>
        );
      }}
    </Query>
  );
};

export default ImportMetricsContainer;
