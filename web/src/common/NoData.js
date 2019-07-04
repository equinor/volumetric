import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const NoDataDiv = styled.div`
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const NoField = ({ user }) => {
  return (
    <NoDataDiv>
      <div>
        {user.roles.length === 0 ? (
          <p>You don't have access to any fields.</p>
        ) : (
          <div>
            {user.isCreator ? (
              <React.Fragment>
                <Link to="/cases/import/new">Import</Link> some..
              </React.Fragment>
            ) : (
              'You need to have the role "Creator" to be able to import data.'
            )}
          </div>
        )}
      </div>
    </NoDataDiv>
  );
};
