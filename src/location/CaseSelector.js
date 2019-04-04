import React from 'react';
import styled from 'styled-components';
import { Fields, Cases } from './filters/Filters';

const ModelSelectorStyled = styled.div`
  display: flex;
`;

export default ({ handleChange, field, currentCase, fields }) => {
  return (
    <ModelSelectorStyled>
      <React.Fragment>
        <Fields field={field} fields={fields} handleChange={handleChange} />
        <Cases
          fields={fields.fields.find(
            otherField => otherField.name === field.value,
          )}
          currentCase={currentCase}
          handleChange={handleChange}
        />
      </React.Fragment>
    </ModelSelectorStyled>
  );
};
