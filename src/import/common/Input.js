import React from 'react';
import styled from 'styled-components';

const Input = styled.input`
  display: block;
  font-family: Equinor-Regular, sans-serif;
  font-size: 16px;
  padding: 2px 8px;
`;

const TextInputStyled = styled(Input)`
  border-radius: 4px;
  border: 1px solid hsl(0, 0%, 80%);
  min-height: 32px;
  margin: 1px 0;
`;

const FileInputHidden = styled(Input)`
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
`;

export const Label = styled.label`
  display: flex;
  flex-direction: column;
  margin: 15px 0;
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
  min-height: 34px;
  padding: 0 10px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: white;
  min-width: 300px;
  margin-right: 10px;

  :focus-within {
    outline: 1px dotted #212121;
    outline: 5px auto -webkit-focus-ring-color;
  }

  :hover {
    background-color: lightgray;
  }
`;

export const FileInput = ({ inputRef, onChange, filename }) => {
  const buttonText = filename ? filename : 'Select file...';
  return (
    <FileInputLabel>
      {buttonText}
      <FileInputHidden ref={inputRef} type="file" onChange={onChange} />
    </FileInputLabel>
  );
};
