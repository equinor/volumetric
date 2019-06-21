import React from 'react';
import styled from 'styled-components';
import { Cases } from '../common/filters/Filters';

const ModelSelectorStyled = styled.div`
  display: flex;
`;

export default ({ handleChange, currentCase, cases }) => {
  return (
    <ModelSelectorStyled>
      <Cases
        cases={cases}
        currentCase={currentCase}
        handleChange={handleChange}
      />
    </ModelSelectorStyled>
  );
};
