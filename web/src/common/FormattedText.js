import React, { useState } from 'react';
import { labelFormater } from '../utils/text';
import { ALMOST_BLACK } from './variables';
import styled from 'styled-components';

const FormattedTextStyle = styled.div`
  padding: 3px 0 3px 6px;
  border-left: 3px solid ${props => props.borderColor || ALMOST_BLACK};
  cursor: pointer;
  min-width: 122px;
`;

const FormattedTextLabel = styled.span`
  font-weight: 500;
  font-family: Equinor-Medium,serif;
  color: ${ALMOST_BLACK}
  margin-right: 0.2222em;
  ::after {
    content: ':';
  }
`;

export function prettyRole(role) {
  switch (role) {
    case 'reader':
      return 'Reader';
    case 'creator':
      return 'Creator';
    case 'fieldadmin':
      return 'Field Admin';
    default:
      console.error('Tried to get name of unknown role');
      return 'None';
  }
}

export const FormattedText = props => {
  const { value, label } = props;
  const [formatLabel, setFormatLabel] = useState(true);

  return (
    <FormattedTextStyle
      onClick={() => setFormatLabel(!formatLabel)}
      borderColor={props.borderColor}
    >
      <FormattedTextLabel>{label}</FormattedTextLabel>
      {formatLabel ? labelFormater(value) : value}m<sup>3</sup>
    </FormattedTextStyle>
  );
};
