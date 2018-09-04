import React from 'react';
import styled from 'styled-components';
import { Fields, Models } from './filters/Filters';

const ModelSelectorStyled = styled.div`
  display: flex;
`;

export default ({ handleChange, field, model, data }) => {
  return (
    <ModelSelectorStyled>
      <React.Fragment>
        <Fields field={field} data={data} handleChange={handleChange} />
        <Models
          data={data.fields.find(otherField => otherField.name === field.value)}
          model={model}
          handleChange={handleChange}
        />
      </React.Fragment>
    </ModelSelectorStyled>
  );
};
