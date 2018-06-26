import React from 'react';
import { Query } from 'react-apollo';
import { GET_MODELS } from './ModelQueries';
import { Route } from 'react-router';
import VisContainer from './VisContainer';
import { LocationSelector } from './locationSelector';

const LocationContainer = props => {
  return (
    <Query query={GET_MODELS}>
      {({ loading, error, data }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error :(</p>;

        return (
          <React.Fragment>
            <LocationSelector {...props} data={data} />
            <Route
              path="/location/:locationId"
              render={props => <VisContainer {...props} />}
            />
          </React.Fragment>
        );
      }}
    </Query>
  );
};

export default LocationContainer;
