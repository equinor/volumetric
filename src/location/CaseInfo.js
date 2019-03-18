import React from 'react';
import styled from 'styled-components';
import { ALMOST_BLACK } from '../common/variables';

const DL = styled.dl`
  display: flex;
  color: ${ALMOST_BLACK};
`;

const DT = styled.dt`
  font-weight: 500;
  font-family: Equinor-Medium;

  :after {
    content: ':';
  }
`;

const DD = styled.dd`
  margin-left: 10px;
  margin-right: 25px;
`;

export default ({ currentCase }) => {
  return (
    <DL>
      <DT>Case Type</DT>
      <DD>{currentCase.caseType}</DD>
      <DT>Case Description</DT>
      <DD>{currentCase.description}</DD>
      <DT>Case id</DT>
      <DD>{currentCase.id}</DD>
    </DL>
  );
};
