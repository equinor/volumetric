import React from 'react';
import { GET_FIELDS } from '../common/Queries';
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
      field {
        name
        cases {
          id
          name
          caseVersion
          caseType
          description
          isOfficial
          isCurrentlyOfficial
          regions
          zones
          facies
        }
      }
    }
  }
`;

const updateCache = (cache, { data: { importCase } }) => {
  const { fields } = cache.readQuery({ query: GET_FIELDS });
  cache.writeQuery({
    query: GET_FIELDS,
    data: {
      fields: [
        ...fields.filter(fieldObj => fieldObj.name !== importCase.field.name),
        importCase.field,
      ],
    },
  });
};

export default ({ history, ...props }) => {
  return (
    <Mutation
      mutation={IMPORT_CASE}
      update={(cache, response) => updateCache(cache, response)}
      onCompleted={() => history.push('/')}
    >
      {(importCase, { loading, error }) => {
        if (error) return <div>error</div>;

        return (
          <StyledSpinner isLoading={loading}>
            {props.children(importCase)}
          </StyledSpinner>
        );
      }}
    </Mutation>
  );
};
