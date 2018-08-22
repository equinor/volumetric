import React from 'react';
import styled from 'styled-components';

const Input = styled.input`
  display: block;
`;

const TextInputStyled = styled(Input)`
  border-radius: 4px;
  border: 1px solid hsl(0, 0%, 80%);
  min-height: 30px;
`;

const FileInputHidden = styled(Input)`
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
`;

export const Button = styled.button`
  min-height: 30px;
`;

export const Label = styled.label`
  min-width: 300px;
  display: flex;
  flex-direction: column;
`;

export const TextInput = ({ label, ...props }) => {
  return (
    <Label>
      {label}
      <TextInputStyled type="text" {...props} />
    </Label>
  );
};

const FileInputLabel = styled(Label)`
  border-radius: 4px;
  border: 1px solid hsl(0, 0%, 80%);
  min-height: 30px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: lightgray;

  :hover {
    background-color: gray;
  }
`;

export const FileInput = ({ inputRef, onChange, filename }) => {
  const buttonText = filename ? filename : 'Select file...';
  return (
    <FileInputLabel>
      {buttonText}
      <FileInputHidden innerRef={inputRef} type="file" onChange={onChange} />
    </FileInputLabel>
  );
};
