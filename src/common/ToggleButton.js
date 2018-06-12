import React from 'react';
import styled from 'styled-components';

const SELECTED_COLOR = 'rgb(18, 147, 154)';
const DEFAULT_COLOR = 'white';
const HOVER_COLOR = 'gray';

const ToggleButtonStyled = styled.label`
  padding: 15px 45px;
  margin: 2px;
  min-width: 40px;
  text-align: center;

  input {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  input[type='radio'] {
    visibility: hidden;
  }

  &:hover {
    ${props =>
      !props.selected &&
      `
        cursor: pointer;
        background-color: ${HOVER_COLOR};
        border: 1px solid ${HOVER_COLOR};
        color: ${DEFAULT_COLOR};
      `};
  }

  background-color: ${props =>
    props.selected ? SELECTED_COLOR : DEFAULT_COLOR};
  border: 1px solid ${SELECTED_COLOR};
  color: ${props => (props.selected ? DEFAULT_COLOR : SELECTED_COLOR)};
`;

export default props => {
  const { onChange, value, selected } = props;

  const handleChange = event => {
    onChange(event.target.value);
  };

  return (
    <ToggleButtonStyled key={value} selected={selected}>
      <input
        type="radio"
        onChange={handleChange}
        value={value}
        checked={selected}
      />
      {props.children}
    </ToggleButtonStyled>
  );
};
