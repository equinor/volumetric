import React from 'react';
import { H3 } from './Headers';
import styled from 'styled-components';

const WrappedH3 = styled(H3)`
  margin: 0;
`;

const ImportHeader = styled.div`
  margin: 20px 0 50px 0;
  display: flex;
  align-items: center;
`;

const LinksStyled = styled.div`
  margin-left: auto;
`;

export function ListPageWithActions({ title, links, children }) {
  return (
    <div>
      <ImportHeader>
        <WrappedH3>{title}</WrappedH3>
        <LinksStyled>{links()}</LinksStyled>
      </ImportHeader>
      {children}
    </div>
  );
}
