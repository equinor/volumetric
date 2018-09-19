import React from 'react';
import { Query } from 'react-apollo';
import { GET_FIELDS } from '../common/Queries';
import LocationComponent from './LocationComponent';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import GraphqlError from '../common/GraphqlErrorHandling';

const NoDataDiv = styled.div`
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default props => (
  <Query query={GET_FIELDS}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading</p>;
      if (error) return <GraphqlError graphError={error}/>;

      return data.fields[0] ? (
        <LocationComponent {...props} data={data} />
      ) : (
        <NoDataDiv>
          <div>
            No data. <Link to="/import">Import</Link> some..
          </div>
        </NoDataDiv>
      );
    }}
  </Query>
);
