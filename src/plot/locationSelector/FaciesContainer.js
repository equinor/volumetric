import React from 'react';
import { Query } from 'react-apollo';
import FaciesSelector from './FaciesSelector';
import { GET_FACIES } from '../ModelQueries';

const findIds = (models, { model, faultblock, zone }) => {
  const faultblockId = faultblock.selectedOption.value;
  const zoneId = zone.selectedOption.value;
  return { faultblockId, zoneId };
};

export default props => {
  const { state, handleChange, models } = props;

  const ids = findIds(models, state);

  return (
    <Query query={GET_FACIES} variables={ids}>
      {({ loading, error, data }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error :(</p>;
        const hasFacies = data.location[0].facies !== null;

        return (
          <FaciesSelector
            disabled={!hasFacies}
            handleChange={handleChange}
            state={state.facies}
            locations={data.location}
          />
        );
      }}
    </Query>
  );
};
