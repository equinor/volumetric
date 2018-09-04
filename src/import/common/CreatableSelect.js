import React from 'react';
import Creatable from 'react-select/lib/Creatable';

export const CreatableSelect = ({
  options,
  selectedOption,
  placeholder = 'Select or create an item',
  ...props
}) => {
  return (
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
  );
};
