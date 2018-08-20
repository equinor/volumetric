import React from 'react';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Button } from './common/Input';
import { GET_FIELDS } from '../common/Queries';

const IMPORT_MODEL = gql`
  mutation ImportModel($field: String!, $model: String, $filename: String!) {
    importModel(field: $field, model: $model, filename: $filename) {
      ok
      field {
        name
        models {
          name
          faultblocks
          zones
          facies
        }
      }
    }
  }
`;

const updateCache = (cache, { data: { importModel } }, field) => {
  const { fields } = cache.readQuery({ query: GET_FIELDS });
  cache.writeQuery({
    query: GET_FIELDS,
    data: {
      fields: [
        ...fields.filter(fieldObj => fieldObj.name !== field),
        importModel.field,
      ],
    },
  });
};

const ImportButton = ({
  setMutationStatus,
  field,
  model,
  filename,
  importModel,
}) => {
  return (
    <Button
      disabled={!(field && filename)}
      onClick={() => {
        setMutationStatus('loading');
        importModel({ variables: { field, model, filename } })
          .then(response => {
            if (!response.data.importModel.ok) {
              setMutationStatus('error');
            } else {
              setMutationStatus('done');
            }
          })
          .catch(() => {
            setMutationStatus('error');
          });
      }}
    >
      Submit
    </Button>
  );
};

const ImportButtonWithMutation = props => {
  const { field } = props;
  return (
    <Mutation
      mutation={IMPORT_MODEL}
      update={(cache, response) => updateCache(cache, response, field)}
    >
      {importModel => <ImportButton importModel={importModel} {...props} />}
    </Mutation>
  );
};

export default ImportButtonWithMutation;
