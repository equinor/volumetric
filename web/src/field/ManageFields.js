import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import { ListPageWithActions } from '../common/Layouts';
import styled from 'styled-components';
import { SmallSpinner } from '../common/Spinner';
import { GraphqlError, NetworkError } from '../common/ErrorHandling';
import { gql } from 'apollo-boost';
import { TextInput } from '../import/common/Input';
import { H4 } from '../common/Headers';
import { SubmitButton } from '../common/Buttons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GET_ROLES } from '../common/Queries';
import { useUserSettings } from '../auth/AuthContext';

const ErrorText = styled.div`
  margin-top: 10px;
  color: red;
`;

const NewFieldContainer = styled.div`
  max-width: 400px;
`;

const CREATE_FIELD = gql`
  mutation CREATE_FIELD($name: String) {
    addField(name: $name) {
      error {
        id
        message
      }
      field {
        name
      }
      roles {
        field
        role
      }
    }
  }
`;

function AddField({ history }) {
  const [selectedField, setField] = useState('');
  const [validateError, setError] = useState('');
  const { user, setCurrentField } = useUserSettings();
  const notify = field =>
    toast(`New field ${field} created`, { hideProgressBar: true });

  return (
    <Mutation
      mutation={CREATE_FIELD}
      variables={{ name: selectedField }}
      update={(cache, { data: { addField } }) => {
        const query = {
          query: GET_ROLES,
          variables: {
            user: user.shortName.toLowerCase(),
          },
        };
        cache.writeQuery({
          ...query,
          data: {
            roleByUser: [...addField.roles],
          },
        });
      }}
      onCompleted={data => {
        if (data.addField.error.id !== '0') {
          setError(data.addField.error.message);
        } else {
          notify(data.addField.field.name);
          setError('');
          setCurrentField(data.addField.field.name);
        }
      }}
    >
      {(createField, { loading, error }) => {
        if (loading) {
          return <SmallSpinner isLoading={loading} />;
        }
        if (error) {
          return error.networkError ? (
            <NetworkError {...error} />
          ) : (
            <GraphqlError {...error} />
          );
        }
        return (
          <NewFieldContainer>
            <H4>New Field</H4>
            {validateError && <ErrorText>{validateError}</ErrorText>}
            <form
              onSubmit={e => {
                e.preventDefault();
                createField();
                setField('');
              }}
            >
              <TextInput
                onChange={e => setField(e.target.value)}
                placeholder="Enter new field name..."
                value={selectedField}
              />
              <SubmitButton type="submit" disabled={!selectedField}>
                Submit
              </SubmitButton>
            </form>
          </NewFieldContainer>
        );
      }}
    </Mutation>
  );
}

function FieldManagement(props) {
  return (
    <ListPageWithActions title="Manage fields" links={() => <></>}>
      <AddField {...props} />
    </ListPageWithActions>
  );
}

export default FieldManagement;
