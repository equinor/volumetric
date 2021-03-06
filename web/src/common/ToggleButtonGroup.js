import React from 'react';
import ToggleButton from './ToggleButton';
import styled from 'styled-components';
import PropTypes from 'prop-types';

function createToggleButton({
  onChange,
  selected,
  label,
  buttonStyle,
  name,
  index,
  first,
  last,
}) {
  const value = label.toLowerCase();
  return (
    <ToggleButton
      key={value}
      onChange={onChange}
      value={value}
      selected={selected.toLowerCase() === value}
      buttonStyle={buttonStyle}
      name={name}
      index={index}
      first={first}
      last={last}
    >
      {label}
    </ToggleButton>
  );
}

const RadioButtonGroupStyled = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const ToggleButtonGroup = props => {
  const { className, currentSelected, onChange, buttons, buttonStyle } = props;

  const radioButtons = buttons.map((button, index) => {
    return createToggleButton({
      onChange,
      selected: currentSelected,
      label: button,
      name: 'visibility',
      buttonStyle,
      index,
      last: index === buttons.length - 1,
      first: index === 0,
    });
  });

  return (
    <RadioButtonGroupStyled className={className}>
      <fieldset style={{ border: '0' }}>{radioButtons}</fieldset>
    </RadioButtonGroupStyled>
  );
};

ToggleButtonGroup.propTypes = {
  currentSelected: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  buttons: PropTypes.array.isRequired,
  buttonStyle: PropTypes.object,
};

export default ToggleButtonGroup;
