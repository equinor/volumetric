import React from 'react';
import styled from 'styled-components';
import { RadioButtonStyled } from './RadioButton';
import { DEFAULT_COLOR, SELECTED_COLOR, HOVER_COLOR } from './variables';
import PropTypes from 'prop-types';

const ToggleButtonStyled = styled(RadioButtonStyled).attrs({
  hoverColor: HOVER_COLOR,
  selectedColor: SELECTED_COLOR,
  defaultColor: DEFAULT_COLOR,
})`
  padding: ${props => (props.padding ? props.padding : '15px 45px;')}
  ${props => props.fontSize && props.fontSize}
  margin: 2px;
  min-width: 40px;
`;

ToggleButtonStyled.displayName = 'ToggleButtonStyled';

const ToggleButton = props => {
  const { onChange, value, selected, buttonStyle } = props;

  const handleChange = event => {
    onChange(event.target.value);
  };

  return (
    <ToggleButtonStyled key={value} selected={selected} {...buttonStyle}>
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

ToggleButton.propTypes = {
  buttonStyle: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
};

export default ToggleButton;
