import React, { useContext } from 'react';
import ImportStatus from './ImportStatus';
import { AuthContext } from '../auth/AuthContext';
import { H3 } from '../common/Headers';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { DARKER_SUCCESS_COLOR, SUCCESS_COLOR } from '../common/variables';

const WrappedH3 = styled(H3)`
  margin: 0;
`;

const ImportHeader = styled.div`
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LinkStyled = styled(Link)`
  padding: 8px 12px;
  text-decoration: none;
  color: white;
  border: 1px solid ${DARKER_SUCCESS_COLOR};
  background-color: ${SUCCESS_COLOR};
  border-radius: 4px;
  align-self: flex-end;
`;

const PageWrapper = styled.div`
  margin: 0 5vw;
`;

const ImportMetricsContainer = () => {
  const { user } = useContext(AuthContext);
  return (
    <PageWrapper>
      <ImportHeader>
        <WrappedH3>Import tasks</WrappedH3>
        <LinkStyled to="/import/new">Import new case</LinkStyled>
      </ImportHeader>
      <ImportStatus user={user.shortName} />
    </PageWrapper>
  );
};

export default ImportMetricsContainer;
