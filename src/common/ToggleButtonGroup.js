import React from 'react';
import ToggleButton from './ToggleButton';
import styled from 'styled-components';

function createToggleButton({ onChange, selected, label }) {
  const value = label.toLowerCase();
  return (
    <ToggleButton
      key={value}
      onChange={onChange}
      value={value}
      selected={selected.toLowerCase() === value}
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
  const { className, currentSelected, onChange, buttons } = props;

  const radioButtons = buttons.map(button => {
    return createToggleButton({
      onChange,
      selected: currentSelected,
      label: button,
    });
  });

  return (
    <RadioButtonGroupStyled className={className}>
      {radioButtons}
    </RadioButtonGroupStyled>
  );
};

export default ToggleButtonGroup;
