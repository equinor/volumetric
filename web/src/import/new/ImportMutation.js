import React from 'react';
import { gql } from 'apollo-boost';
import { Mutation } from 'react-apollo';
import { StyledSpinner } from '../../common/Spinner';
import { GET_IMPORTS, TASK_FRAGMENT } from '../../common/Queries';
import { GraphqlError, NetworkError } from '../../common/ErrorHandling';

const IMPORT_CASE = gql`
  mutation ImportCase(
    $filename: String!
    $filehash: String!
    $field: String!
    $case: String!
    $caseVersion: String!
    $caseType: CaseTypeEnum!
    $description: String
    $isOfficial: Boolean
    $isShared: Boolean
    $officialFromDate: DateTime
    $officialToDate: DateTime
  ) {
    importCase(
      filename: $filename
      filehash: $filehash
      fileFormat: FMU
      field: $field
      case: $case
      caseVersion: $caseVersion
      caseType: $caseType
      description: $description
      isOfficial: $isOfficial
      isShared: $isShared
      officialFromDate: $officialFromDate
      officialToDate: $officialToDate
    ) {
      ok
      validationError {
        file {
          valid
          message
        }
        version {
          valid
          message
        }
        allValid
      }
      task {
        ...Task
      }
    }
  }
  ${TASK_FRAGMENT}
`;

export default ({ history, user, currentField, ...props }) => {
  return (
    <Mutation
      mutation={IMPORT_CASE}
      onCompleted={data => {
        if (data.importCase.validationError.allValid) {
          history.push('/cases/import');
        }
      }}
      update={(
        cache,
        {
          data: {
            importCase: { task, validationError },
          },
        },
      ) => {
        if (!validationError.allValid) return;
        try {
          const variables = {
            field: currentField,
            user: user.shortName.toLowerCase(),
          };
          const { tasks } = cache.readQuery({ query: GET_IMPORTS, variables });
          cache.writeQuery({
            query: GET_IMPORTS,
            data: { tasks: [task, ...tasks] },
            variables,
          });
        } catch (e) {
          console.error(e);
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
