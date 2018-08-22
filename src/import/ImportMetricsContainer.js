import React from 'react';
import { GET_FIELDS } from '../common/Queries';
import ImportMetricsComponent from './ImportMetricsComponent';
import { Query } from 'react-apollo';

const ImportMetricsContainer = () => {
  return (
    <Query query={GET_FIELDS}>
      {({ loading, error, data }) => {
        if (loading || error) {
          return null; // TODO: spinner magic
        }
        return <ImportMetricsComponent data={data} />;
      }}
    </Query>
  );
};

export default ImportMetricsContainer;
