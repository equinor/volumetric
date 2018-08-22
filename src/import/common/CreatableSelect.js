import React from 'react';
import Creatable from 'react-select/lib/Creatable';
import { Label } from './Input';

export const CreatableSelect = ({
  options,
  selectedOption,
  label,
  placeholder = 'Select or create an item',
  ...props
}) => {
  return (
    <Label>
      {label}
      <Creatable
        options={options.map(field => ({
          label: field.name,
          value: field.name,
        }))}
        value={
          selectedOption !== null
            ? { value: selectedOption, label: selectedOption }
            : undefined
        }
        placeholder={placeholder}
        {...props}
      />
    </Label>
  );
};
