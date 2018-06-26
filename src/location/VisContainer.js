import React from 'react';
import { GET_METRICS } from './ModelQueries';
import { Query } from 'react-apollo';
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

const VisContainer = ({ match }) => {
  return (
    <Query
      query={GET_METRICS}
      variables={{
        locationId: match.params.locationId,
      }}
    >
      {({ loading, data }) => {
        return (
          <StyledSpinner isLoading={loading}>
            <VisToggler data={data} />
          </StyledSpinner>
        );
      }}
    </Query>
  );
};

export default VisContainer;
