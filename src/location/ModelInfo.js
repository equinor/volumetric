import React from 'react';
import styled from 'styled-components';
import { ALMOST_BLACK } from '../common/variables';

const DL = styled.dl`
  display: flex;
  color: ${ALMOST_BLACK};
`;

const DT = styled.dt`
  font-weight: bold;

  :after {
    content: ':';
  }
`;

const DD = styled.dd`
  margin-left: 10px;
  margin-right: 25px;
`;

export default ({ model }) => {
  return (
    <DL>
      <DT>Model Type</DT>
      <DD>{model.modelType}</DD>
      <DT>Model Description</DT>
      <DD>{model.description}</DD>
    </DL>
  );
};
