import React from 'react';
import styled from 'styled-components';
import { useUserSettings } from '../auth/AuthContext';
import Dropdown from 'rc-dropdown';
import Menu, { Item as MenuItem } from 'rc-menu';
import 'rc-dropdown/assets/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons';
import { prettyRole } from '../common/FormatedText';

const FieldButton = styled.div`
  width: 100px;
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

const FieldRole = () => {
  const { user, currentField, setCurrentField } = useUserSettings();
  let menu;
  if (user.roles.length > 0) {
    const fields = user.roles.map(field => (
      <MenuItem key={field.field}>
        {field.field} ({prettyRole(field.role)})
      </MenuItem>
    ));
    menu = <Menu onSelect={({ key }) => setCurrentField(key)}>{fields}</Menu>;
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
