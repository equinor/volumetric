import React from 'react';
import styled from 'styled-components';

const ToggleButtonStyled = styled.label`
  padding: 15px 45px;
  margin: 2px;
  min-width: 40px;

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
        background-color: gray;
        border: 1px solid gray;
        color: white;
      `};
  }

  background-color: ${props =>
    props.selected ? 'rgb(18, 147, 154)' : 'white'};
  border: 1px solid rgb(18, 147, 154);
  color: ${props => (props.selected ? 'white' : 'rgb(18, 147, 154)')};
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
