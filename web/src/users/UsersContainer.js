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
import { GET_ROLES } from '../common/Queries';
import { errorToast } from '../common/toasts';

const EditButton = styled(FontAwesomeIcon)`
  margin-left: 20px;
  cursor: pointer;
  color: ${PRIMARY_COLOR};
`;

const NewMemberContainer = styled.div`
  max-width: 400px;
`;
const roles = ['reader', 'creator', 'fieldadmin'];
const SelectOptions = roles.map(role => ({
  value: role,
  label: prettyRole(role),
}));

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
      field
      role
      user
    }
  }
`;

const DELETE_ROLE = gql`
  mutation DeleteRole($field: String, $user: String) {
    deleteRole(field: $field, user: $user) {
      field
      user
    }
  }
`;

function DeleteButton({ field, user }) {
  const updateDeleteRole = cache => {
    const { rolesByField: roles } = cache.readQuery({
      query: GET_ROLES_IN_FIELD,
      variables: { field: field },
    });

    const filteredRoles = roles.filter(role => role.user !== user);
    cache.writeQuery({
      query: GET_ROLES_IN_FIELD,
      variables: { field: field },
      data: { rolesByField: [...filteredRoles] },
    });
  };

  return (
    <Mutation
      mutation={DELETE_ROLE}
      variables={{ field, user }}
      update={updateDeleteRole}
      optimisticResponse={{ deleteRole: { field, user } }}
      onError={() => errorToast('Failed to delete user.')}
    >
      {deleteRole => {
        return (
          <DeleteButtonStyled
            onClick={() => {
              if (
                window.confirm('Are you sure you want to delete this role?')
              ) {
                deleteRole();
              }
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

  const updateAssignRole = (cache, { data: { assignRole } }) => {
    const { rolesByField: roles } = cache.readQuery({
      query: GET_ROLES_IN_FIELD,
      variables: { field: field },
    });
    cache.writeQuery({
      query: GET_ROLES_IN_FIELD,
      variables: { field: field },
      data: { rolesByField: [assignRole, ...roles] },
    });
  };

  return (
    <Mutation
      mutation={ASSIGN_ROLE}
      update={updateAssignRole}
      variables={{
        field: field,
        role: selectedRole.value,
        user: selectedUser,
      }}
      optimisticResponse={{
        assignRole: {
          __typename: 'Role',
          field: field,
          role: selectedRole.value,
          user: selectedUser,
        },
      }}
      onError={() => errorToast('Failed to add user.')}
    >
      {assignRole => {
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
  const { setCurrentRole, user: currentUser } = useUserSettings();

  const updateAssignRole = (cache, { data: { assignRole } }) => {
    const { rolesByField } = cache.readQuery({
      query: GET_ROLES_IN_FIELD,
      variables: { field: field },
    });
    const role = rolesByField.find(role => role.user === assignRole.user);
    role.role = assignRole.role;
    cache.writeQuery({
      query: GET_ROLES_IN_FIELD,
      variables: { field: field },
      data: { rolesByField: [...rolesByField] },
    });
    //  Update roleByUser in case user updates self
    const currentUserName = currentUser.shortName.toLowerCase();
    if (currentUserName === assignRole.user) {
      const query = { query: GET_ROLES, variables: { user: currentUserName } };
      const { roleByUser } = cache.readQuery(query);
      roleByUser.find(role => role.field === field).role = assignRole.role;
      cache.writeQuery({
        ...query,
        data: {
          roleByUser: roleByUser,
        },
      });
      setCurrentRole(assignRole.role);
    }
  };

  return (
    <Mutation
      mutation={ASSIGN_ROLE}
      update={updateAssignRole}
      onError={() => errorToast('Failed to assign role.')}
    >
      {assignRole => {
        function selectedNewRole({ value: role }) {
          const newRole = { field, role, user: user.user };
          if (user.role !== role) {
            assignRole({
              variables: newRole,
              optimisticResponse: {
                assignRole: {
                  __typename: 'Role',
                  ...newRole,
                },
              },
            });
          } else {
            toggleEdit(false);
          }
        }

        return (
          <>
            <Row key={user.user}>
              <TD>{user.user}</TD>
              <TD>
                {editable ? (
                  <Select
                    options={SelectOptions}
                    value={user.role}
                    placeholder={prettyRole(user.role)}
                    onChange={value => selectedNewRole(value)}
                  />
                ) : (
                  <>
                    {prettyRole(user.role)}
                    <EditButton
                      icon={faPen}
                      onClick={() => toggleEdit(!editable)}
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
            return (
              <UserRow
                user={user}
                field={field}
                key={`${user.user}${user.role}`}
              />
            );
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
