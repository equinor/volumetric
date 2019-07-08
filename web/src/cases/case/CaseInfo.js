import React from 'react';
import styled from 'styled-components';
import { ALMOST_BLACK } from '../../common/variables';
import { getVisibility } from '../../common/visibility';

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

export default ({
  currentCase: {
    caseType,
    description,
    id,
    isCurrentlyOfficial,
    isOfficial,
    isShared,
  },
}) => {
  return (
    <DL>
      <DT>Case Type</DT>
      <DD>{caseType}</DD>
      <DT>Case Description</DT>
      <DD>{description}</DD>
      <DT>Case id</DT>
      <DD>{id}</DD>
      <DT>Visibility</DT>
      <DD>{getVisibility(isOfficial, isShared)}</DD>
      {isOfficial && (
        <>
          <DT>Current official case</DT>
          <DD>{isCurrentlyOfficial ? 'Yes' : 'No'}</DD>
        </>
      )}
    </DL>
  );
};
