import React from 'react';
import { Query } from 'react-apollo';
import { GET_FIELDS } from './ModelQueries';
import LocationComponent from './LocationComponent';

export default () => (
  <Query query={GET_FIELDS}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading</p>;
      if (error) return <p>Error :(</p>;

      return <LocationComponent data={data} />;
    }}
  </Query>
);
