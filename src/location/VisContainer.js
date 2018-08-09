import React from 'react';
import VisToggler from './VisToggler';
import Spinner from '../common/Spinner';
import styled from 'styled-components';

const StyledSpinner = styled(Spinner)`
  margin-top: 15vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VisContainer = ({data}) => {
  return (
    <StyledSpinner>
      <VisToggler data={data} />
    </StyledSpinner>
  );
};

export default VisContainer;
