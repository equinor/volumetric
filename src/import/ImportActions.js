import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { Button } from '../common/Input';
import {
  ALMOST_BLACK,
  DARKER_SUCCESS_COLOR,
  NEUTRAL_SEPARATOR_COLOR,
  SUCCESS_COLOR,
} from '../common/variables';

const SubmitButton = styled(Button)`
  background: ${props =>
      props.disabled ? NEUTRAL_SEPARATOR_COLOR : SUCCESS_COLOR}
    none;
  color: white;
  border: 1px solid
    ${props =>
      props.disabled ? NEUTRAL_SEPARATOR_COLOR : DARKER_SUCCESS_COLOR};
  border-radius: 4px;
  padding: 8px 14px;
  font: inherit;
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
  outline: inherit;
`;

export const CancelLink = styled(Link)`
  text-decoration: none;
  padding: 8px 14px;
  color: ${ALMOST_BLACK};
  border: 1px solid ${ALMOST_BLACK};
  border-radius: 4px;
`;

export const ImportButton = ({ importCase, disabled }) => {
  return (
    <SubmitButton disabled={disabled} onClick={importCase}>
      Submit
    </SubmitButton>
  );
};
