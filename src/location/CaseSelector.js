import React from 'react';
import styled from 'styled-components';
import { Cases } from './filters/Filters';

const ModelSelectorStyled = styled.div`
  display: flex;
`;

export default ({ handleChange, field, currentCase, fields }) => {
  return (
    <ModelSelectorStyled>
      <React.Fragment>
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
