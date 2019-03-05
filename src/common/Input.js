import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const InputStyled = styled.input`
  min-width: 20px;
  max-width: 100px;
  height: 16px;
  padding-right: 10px;
  margin: 10px;
  background-color: #efefef;
`;

export default InputStyled;

export const CheckBox = props => {
  return <input type="checkbox" {...props} />;
};

CheckBox.propTypes = {
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
      <CheckBox {...props} checked={checked} />
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
