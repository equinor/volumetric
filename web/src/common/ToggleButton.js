import React from 'react';
import styled from 'styled-components';
import { RadioButtonStyled } from './RadioButton';
import { DEFAULT_COLOR, PRIMARY_COLOR, HOVER_COLOR } from './variables';
import PropTypes from 'prop-types';

export const ToggleButtonStyled = styled(RadioButtonStyled).attrs({
  hoverColor: HOVER_COLOR,
  selectedColor: PRIMARY_COLOR,
  defaultColor: DEFAULT_COLOR,
})`
  padding: ${props => (props.padding ? props.padding : '5px 10px')};
  min-width: 40px;
  ${props => props.first && !props.last && 'border-radius: 4px 0px 0px 4px'};
  ${props => props.last && !props.first && 'border-radius: 0px 4px 4px 0px'};
  ${props => props.last && props.first && 'border-radius: 4px 4px 4px 4px'};
  ${props => !props.first && 'border-left: 0px'};
  flex-grow: 1;
`;

ToggleButtonStyled.displayName = 'ToggleButtonStyled';

const ToggleButton = props => {
  const {
    onChange,
    value,
    selected,
    buttonStyle,
    first,
    last,
    name,
    index,
  } = props;

  const handleChange = event => {
    onChange(event.target.value);
  };

  return (
    <ToggleButtonStyled
      key={value}
      selected={selected}
      {...buttonStyle}
      first={first}
      last={last}
    >
      <input
        type="radio"
        id={`${name}${index}`}
        name={name}
        onChange={handleChange}
        value={value}
        checked={selected}
      />
      {props.children}
    </ToggleButtonStyled>
  );
};

ToggleButton.propTypes = {
  buttonStyle: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
};

export default ToggleButton;
