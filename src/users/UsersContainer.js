import React, { useState } from 'react';
import { Mutation, Query } from 'react-apollo';
import { ListPageWithActions } from '../common/Layouts';
import { Row, Table, TD, TH } from '../common/Table';
import styled from 'styled-components';
import { SmallSpinner, StyledSpinner } from '../common/Spinner';
import { GraphqlError, NetworkError } from '../common/ErrorHandling';
import { gql } from 'apollo-boost';
import { TextInput } from '../import/common/Input';
import Select from '../common/Select';
import { DANGER_COLOR, PRIMARY_COLOR } from '../common/variables';
import { H4 } from '../common/Headers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen';
import Icon, { ICONS } from '../common/Icons';
import { prettyRole } from '../common/FormattedText';
import {
  DeleteButton as DeleteButtonStyled,
  SubmitButton,
} from '../common/Buttons';
import { useUserSettings } from '../auth/AuthContext';

const EditButton = styled(FontAwesomeIcon)`
  margin-left: 20px;
  cursor: pointer;
  color: ${PRIMARY_COLOR};
`;

const NewMemberContainer = styled.div`
  max-width: 400px;
`;

const SelectOptions = [
  { value: 'reader', label: 'Reader' },
  { value: 'creator', label: 'Creator' },
  { value: 'fieldadmin', label: 'Field Admin' },
];

const GET_ROLES_IN_FIELD = gql`
  query RolesByField($field: String) {
    rolesByField(field: $field) {
      field
      role
      user
    }
  }
`;

const ASSIGN_ROLE = gql`
  mutation AssignRole($field: String, $role: String, $user: String) {
    assignRole(field: $field, role: $role, user: $user) {
      role {
        field
        role
        user
      }
    }
  }
`;

const DELETE_ROLE = gql`
  mutation DeleteRole($field: String, $user: String) {
    deleteRole(field: $field, user: $user) {
      role {
        field
        user
      }
    }
  }
`;

function DeleteButton({ field, user }) {
  return (
    <Mutation
      mutation={DELETE_ROLE}
      variables={{ field: field, user: user }}
      update={cache => {
        let roles = cache.readQuery({
          query: GET_ROLES_IN_FIELD,
          variables: { field: field },
        });
        const index = roles.rolesByField.findIndex(role => role.user === user);
        roles.rolesByField.splice(index, 1);
        cache.writeQuery({
          query: GET_ROLES_IN_FIELD,
          variables: { field: field },
          data: { rolesByField: [...roles.rolesByField] },
        });
      }}
    >
      {(deleteRole, { loading, error }) => {
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
          <DeleteButtonStyled
            onClick={() => {
              deleteRole();
            }}
          >
            <Icon icon={ICONS.cross} color={DANGER_COLOR} size={12} />
          </DeleteButtonStyled>
        );
      }}
    </Mutation>
  );
}

function AddUser({ field }) {
  const [selectedRole, setRole] = useState('');
  const [selectedUser, setUser] = useState('');

  return (
    <Mutation
      mutation={ASSIGN_ROLE}
      update={(cache, { data: { assignRole } }) => {
        const roles = cache.readQuery({
          query: GET_ROLES_IN_FIELD,
          variables: { field: field },
        });
        cache.writeQuery({
          query: GET_ROLES_IN_FIELD,
          variables: { field: field },
          data: { rolesByField: [assignRole.role, ...roles.rolesByField] },
        });
      }}
      variables={{
        field: field,
        role: selectedRole.value,
        user: selectedUser,
      }}
    >
      {(assignRole, { loading, error }) => {
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
          <NewMemberContainer>
            <H4>New Member</H4>
            <TextInput
              onChange={e => setUser(e.target.value)}
              placeholder="Enter users shortname..."
              value={selectedUser}
            />
            <Select
              options={SelectOptions}
              value={selectedRole}
              placeholder={`Select Role`}
              onChange={value => setRole(value)}
            />
            <SubmitButton
              onClick={() => {
                assignRole();
                setRole('');
                setUser('');
              }}
              disabled={!(selectedRole && selectedUser)}
            >
              Add user
            </SubmitButton>
          </NewMemberContainer>
        );
      }}
    </Mutation>
  );
}

function UserRow({ user, field }) {
  const [editable, toggleEdit] = useState(false);
  const [selectedRole, setRole] = useState(user.role);

  return (
    <Mutation
      mutation={ASSIGN_ROLE}
      update={(cache, { data: { assignRole } }) => {
        let roles = cache.readQuery({
          query: GET_ROLES_IN_FIELD,
          variables: { field: field },
        });
        const index = roles.rolesByField.findIndex(
          role => role.user === user.user,
        );
        roles.rolesByField[index] = assignRole.role;
        cache.writeQuery({
          query: GET_ROLES_IN_FIELD,
          variables: { field: field },
          data: { rolesByField: [...roles.rolesByField] },
        });
      }}
    >
      {(assignRole, { loading, error }) => {
        if (loading) {
          return (
            <Row>
              <TD>
                <SmallSpinner isLoading={loading} />
              </TD>
            </Row>
          );
        }
        if (error) {
          return error.networkError ? (
            <NetworkError {...error} />
          ) : (
            <GraphqlError {...error} />
          );
        }

        function selectedNewRole(value) {
          setRole(value.value);
          toggleEdit(false);
          assignRole({
            variables: { field: field, role: value.value, user: user.user },
          });
        }

        return (
          <>
            <Row key={user.user}>
              <TD>{user.user}</TD>
              <TD>
                {editable ? (
                  <Select
                    options={SelectOptions}
                    value={selectedRole}
                    placeholder={prettyRole(selectedRole)}
                    onChange={value => selectedNewRole(value)}
                  />
                ) : (
                  <>
                    {prettyRole(user.role)}
                    <EditButton
                      icon={faPen}
                      onClick={() => toggleEdit(editable ? false : true)}
                    />
                  </>
                )}
              </TD>
              <TD>
                <DeleteButton field={field} user={user.user} />
              </TD>
            </Row>
          </>
        );
      }}
    </Mutation>
  );
}

function ExistingUsers({ roles, field }) {
  return (
    <>
      <H4>Existing Members</H4>
      <Table>
        <thead>
          <Row>
            <TH>User</TH>
            <TH>Role</TH>
            <TH>Remove</TH>
          </Row>
        </thead>
        <tbody>
          {roles.map(user => {
            return <UserRow user={user} field={field} key={user.user} />;
          })}
        </tbody>
      </Table>
    </>
  );
}

function UserManagement() {
  const { currentField } = useUserSettings();
  return (
    <ListPageWithActions title="Manage users" links={() => <></>}>
      <Query query={GET_ROLES_IN_FIELD} variables={{ field: currentField }}>
        {({ loading, error, data }) => {
          if (loading) {
            return <StyledSpinner isLoading={true} />;
          }
          if (error) {
            return error.networkError ? (
              <NetworkError {...error} />
            ) : (
              <GraphqlError {...error} />
            );
          }

          return (
            <>
              <AddUser field={currentField} />
              <ExistingUsers roles={data.rolesByField} field={currentField} />
            </>
          );
        }}
      </Query>
    </ListPageWithActions>
  );
}

export default UserManagement;
