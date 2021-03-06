import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

export const RadioButtonStyled = styled.label`
  text-align: center;
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */

  input[type='radio'] {
    opacity: 0;
    position: absolute;
  }

  &:hover {
    ${props =>
      !props.selected &&
      `
        cursor: pointer;
        background-color: ${props => props.hoverColor};
        border: 1px solid ${props => props.hoverColor};
        color: ${props => props.defaultColor};
      `};
  }
  background-color: ${props =>
    props.selected ? props.selectedColor : props.defaultColor};
  border: 1px solid ${props => props.selectedColor};
  color: ${props =>
    props.selected ? props.defaultColor : props.selectedColor};
`;

RadioButtonStyled.propTypes = {
  hoverColor: PropTypes.string,
  defaultColor: PropTypes.string,
  selectedColor: PropTypes.string,
};

const RadioButton = props => {
  const { onChange, value, selected } = props;

  const handleChange = event => {
    onChange(event.target.value);
  };

  return (
    <React.Fragment>
      <input
        type="radio"
        onChange={handleChange}
        value={value}
        checked={selected}
      />
      {props.children}
    </React.Fragment>
  );
};

RadioButton.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
};

export default RadioButton;
