import React from 'react';
import { gql } from 'apollo-boost';
import { Mutation } from 'react-apollo';
import { StyledSpinner } from '../common/Spinner';
import { GET_UPLOADS, TASK_FRAGMENT } from '../common/Queries';
import { GraphqlError, NetworkError } from '../common/ErrorHandling';

const IMPORT_CASE = gql`
  mutation ImportCase(
    $filename: String!
    $field: String!
    $case: String!
    $caseVersion: String!
    $caseType: CaseTypeEnum!
    $description: String
    $isOfficial: Boolean
    $officialFromDate: DateTime
    $officialToDate: DateTime
  ) {
    importCase(
      filename: $filename
      fileFormat: FMU
      field: $field
      case: $case
      caseVersion: $caseVersion
      caseType: $caseType
      description: $description
      isOfficial: $isOfficial
      officialFromDate: $officialFromDate
      officialToDate: $officialToDate
    ) {
      ok
      validationError {
        id
        message
      }
      task {
        ...Task
      }
    }
  }
  ${TASK_FRAGMENT}
`;

export default ({ history, user, ...props }) => {
  return (
    <Mutation
      mutation={IMPORT_CASE}
      onCompleted={() => history.push('/import')}
      update={(
        cache,
        {
          data: {
            importCase: { task },
          },
        },
      ) => {
        try {
          const variables = { user: user.shortName.toLowerCase() };
          const { tasks } = cache.readQuery({ query: GET_UPLOADS, variables });
          cache.writeQuery({
            query: GET_UPLOADS,
            data: { tasks: [task, ...tasks] },
            variables,
          });
        } catch (e) {
          console.debug('No cache for tasks');
        }
      }}
    >
      {(importCase, { loading, error, data }) => {
        if (error)
          return error.networkError ? NetworkError(error) : GraphqlError(error);

        return (
          <StyledSpinner isLoading={loading}>
            {props.children(importCase, data)}
          </StyledSpinner>
        );
      }}
    </Mutation>
  );
};
