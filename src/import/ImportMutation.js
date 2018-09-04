import React from 'react';
import { GET_FIELDS } from '../common/Queries';
import { gql } from 'apollo-boost';
import { Mutation } from 'react-apollo';
import { StyledSpinner } from '../common/Spinner';

const IMPORT_MODEL = gql`
  mutation ImportModel(
    $filename: String!
    $field: String!
    $model: String!
    $modelVersion: String!
    $modelType: ModelTypeEnum!
    $description: String
    $isOfficial: Boolean
    $officialFromDate: DateTime
    $officialToDate: DateTime
  ) {
    importModel(
      filename: $filename
      field: $field
      model: $model
      modelVersion: $modelVersion
      modelType: $modelType
      description: $description
      isOfficial: $isOfficial
      officialFromDate: $officialFromDate
      officialToDate: $officialToDate
    ) {
      ok
      field {
        name
        models {
          id
          name
          modelVersion
          modelType
          description
          isOfficial
          isCurrentlyOfficial
          faultblocks
          zones
          facies
        }
      }
    }
  }
`;

const updateCache = (cache, { data: { importModel } }) => {
  const { fields } = cache.readQuery({ query: GET_FIELDS });
  cache.writeQuery({
    query: GET_FIELDS,
    data: {
      fields: [
        ...fields.filter(fieldObj => fieldObj.name !== importModel.field.name),
        importModel.field,
      ],
    },
  });
};

export default ({ history, ...props }) => {
  return (
    <Mutation
      mutation={IMPORT_MODEL}
      update={(cache, response) => updateCache(cache, response)}
      onCompleted={() => history.push('/')}
    >
      {(importModel, { loading, error }) => {
        if (error) return <div>error</div>;

        return (
          <StyledSpinner isLoading={loading}>
            {props.children(importModel)}
          </StyledSpinner>
        );
      }}
    </Mutation>
  );
};
