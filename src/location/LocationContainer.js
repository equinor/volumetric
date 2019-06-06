import React from 'react';
import { Query } from 'react-apollo';
import { GET_CASES } from '../common/Queries';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { GraphqlError, NetworkError } from '../common/ErrorHandling';
import { StyledSpinner } from '../common/Spinner';
import LocationComponent from './LocationComponent';
import { useUserSettings } from '../auth/AuthContext';

export const NoDataDiv = styled.div`
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function LocationContainer(props) {
  const { currentField, user } = useUserSettings();
  const linkedCase = (props.location.state || {}).linkedCase || undefined;

  if (currentField === 'No field') {
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
  }

  return (
    <Query query={GET_CASES} variables={{ field: currentField }}>
      {({ loading, error, data }) => {
        if (loading) return <StyledSpinner isLoading={true} />;
        if (error)
          return error.networkError ? NetworkError(error) : GraphqlError(error);
        return (
          <LocationComponent
            cases={data.cases}
            key={currentField}
            linkedCase={linkedCase}
          />
        );
      }}
    </Query>
  );
}

export default LocationContainer;
