import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { ALMOST_BLACK } from './variables';

const InputStyled = styled.input`
  min-width: 20px;
  max-width: 100px;
  height: 16px;
  padding-right: 10px;
  margin: 10px;
  background-color: #efefef;
`;

export default InputStyled;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const Icon = styled.svg`
  fill: none;
  stroke: ${ALMOST_BLACK};
  stroke-width: 3px;
`;

const StyledCheckbox = styled.div`
  display: inline-block;
  width: 14px;
  height: 14px;
  ${props => (props.labelLeft ? 'margin-left: 5px' : 'margin-right: 5px')};
  border: 1px solid ${ALMOST_BLACK};
  transition: all 150ms;
  ${Icon} {
    visibility: ${props => (props.checked ? 'visible' : 'hidden')};
  }
`;

const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
`;

export const Checkbox = ({ className, checked, ...props }) => (
  <CheckboxContainer className={className}>
    <HiddenCheckbox checked={checked} {...props} />
    <StyledCheckbox checked={checked} labelLeft={props.labelLeft}>
      <Icon viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12" />
      </Icon>
    </StyledCheckbox>
  </CheckboxContainer>
);

Checkbox.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
};

const CheckboxLabel = styled.label`
  padding: 5px 0;
  cursor: pointer;
  ${props => props.block && 'display: block;'};
`;

export const CheckboxWithLabel = ({
  label,
  checked,
  labelLeft = false,
  block = true,
  ...props
}) => {
  return (
    <CheckboxLabel checked={checked} block={block}>
      {labelLeft && label}
      <Checkbox labelLeft={labelLeft} {...props} checked={checked} />
      {!labelLeft && label}
    </CheckboxLabel>
  );
};

CheckboxWithLabel.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  labelLeft: PropTypes.bool,
};

export const Button = styled.button`
  min-height: 30px;
`;
