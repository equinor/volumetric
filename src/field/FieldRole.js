import React from 'react';
import styled from 'styled-components';
import { useFieldValue } from './FieldContext';
import Dropdown from 'rc-dropdown';
import Menu, { Item as MenuItem } from 'rc-menu';
import 'rc-dropdown/assets/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons';
import { prettyRole } from '../common/FormatedText';

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

const DownArrow = styled(FontAwesomeIcon)`
  margin-left: 5px;
`;

function getRoleOfField(field, roles) {
  function isSameField(element) {
    return element.field === field;
  }

  return roles[roles.findIndex(isSameField)].role;
}

const FieldRole = () => {
  const [{ roles, currentField }, dispatch] = useFieldValue();
  let menu;
  if (roles !== '') {
    const fields = roles.map(field => (
      <MenuItem key={field.field}>
        {field.field} ({prettyRole(field.role)})
      </MenuItem>
    ));
    menu = (
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
  } else {
    menu = (
      <Menu defaultActiveFirst={true}>
        <MenuItem key={'none'}>{'No fields'}</MenuItem>
      </Menu>
    );
  }
  return (
    <FieldWrapper>
      <Dropdown trigger={['click']} overlay={menu} animation="slide-up">
        <FieldButton>
          {currentField}
          <DownArrow icon={faAngleDoubleDown} />
        </FieldButton>
      </Dropdown>
    </FieldWrapper>
  );
};

export default FieldRole;
