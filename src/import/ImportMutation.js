import React from 'react';
import { gql } from 'apollo-boost';
import { Mutation } from 'react-apollo';
import { StyledSpinner } from '../common/Spinner';

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
    }
  }
`;

export default ({ history, ...props }) => {
  return (
    <Mutation mutation={IMPORT_CASE}>
      {(importCase, { loading, error, data }) => {
        if (error) return <div>Something went wrong</div>;

        return (
          <StyledSpinner isLoading={loading}>
            {props.children(importCase, data)}
          </StyledSpinner>
        );
      }}
    </Mutation>
  );
};
