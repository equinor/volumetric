import React from 'react';
import { Query } from 'react-apollo';
import { GET_CASES } from '../common/Queries';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { GraphqlError, NetworkError } from '../common/ErrorHandling';
import { StyledSpinner } from '../common/Spinner';
import LocationComponent from './LocationComponent';
import { isCreator, useFieldValue } from '../field/FieldContext';

const NoDataDiv = styled.div`
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function LocationContainer() {
  const [{ currentField, currentRole, roles }] = useFieldValue();
  return (
    <Query query={GET_CASES} variables={{ field: currentField }}>
      {({ loading, error, data }) => {
        if (loading) return <StyledSpinner isLoading={true} />;
        if (error)
          return error.networkError ? NetworkError(error) : GraphqlError(error);
        return data.fields[0] ? (
          <LocationComponent fields={data} key={currentField} />
        ) : (
          <NoDataDiv>
            <div>
              {roles === '' ? (
                <p>You don't have access to any fields.</p>
              ) : (
                <div>
                  {isCreator(currentRole) ? (
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
      }}
    </Query>
  );
}

export default LocationContainer;
