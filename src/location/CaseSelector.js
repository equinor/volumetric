import React from 'react';
import styled from 'styled-components';
import { Fields, Cases } from './filters/Filters';

const ModelSelectorStyled = styled.div`
  display: flex;
`;

export default ({ handleChange, field, currentCase, data }) => {
  return (
    <ModelSelectorStyled>
      <React.Fragment>
        <Fields field={field} data={data} handleChange={handleChange} />
        <Cases
          data={data.fields.find(otherField => otherField.name === field.value)}
          currentCase={currentCase}
          handleChange={handleChange}
        />
      </React.Fragment>
    </ModelSelectorStyled>
  );
};
