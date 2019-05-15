import React from 'react';
import styled from 'styled-components';
import { useFieldValue } from './FieldContext';
import Dropdown from 'rc-dropdown';
import Menu, { Item as MenuItem } from 'rc-menu';
import 'rc-dropdown/assets/index.css';

const FieldButton = styled.button`
  width: 100;
  border: 0;
  background-color: transparent;
  cursor: pointer;
  font-family: Equinor-Regular, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

const FieldWrapper = styled.div`
  display: flex;
  float: right;
`;

const DownArrow = styled.div`
  border: double black;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  margin-left: 6px;
`;

function prettyRole(role) {
  switch (role) {
    case 'reader':
      return 'Reader';
    case 'creator':
      return 'Creator';
    case 'fieldadmin':
      return 'Field Admin';
    default:
      return 'None';
  }
}

function getRoleOfField(field, roles) {
  function isSameField(element) {
    return element.field === field;
  }
  return roles[roles.findIndex(isSameField)].role;
}

const FieldRole = () => {
  const [{ roles, currentField }, dispatch] = useFieldValue();
  const fields = roles.map(field => (
    <MenuItem key={field.field}>
      {field.field} ({prettyRole(field.role)})
    </MenuItem>
  ));
  const menu = (
    <Menu
      onSelect={({ key }) =>
        dispatch({
          currentField: key,
          currentRole: getRoleOfField(key, roles),
        })
      }
    >
      {fields}
    </Menu>
  );
  return (
    <FieldWrapper>
      <Dropdown trigger={['click']} overlay={menu} animation="slide-up">
        <FieldButton>
          {currentField}
          <DownArrow />
        </FieldButton>
      </Dropdown>
    </FieldWrapper>
  );
};

export default FieldRole;
