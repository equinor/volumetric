import React from 'react';
import {Query} from 'react-apollo';
import FaciesSelector from './FaciesSelector';
import {GET_FACIES} from '../ModelQueries';
import {LocationSelectorSelectStyled} from './LocationSelect';
import Select from '../../common/Select';

const findIds = (models, {model, faultblock, zone}) => {
    const faultblockId = faultblock.selectedOption.value;
    const zoneId = zone.selectedOption.value;
    return {faultblockId, zoneId};
};

export default props => {
    const {state, handleChange, models} = props;

    const ids = findIds(models, state);

    return (
        <Query query={GET_FACIES} variables={ids}>
            {({loading, error, data}) => {
                if (loading) return <LocationSelectorSelectStyled><Select isLoading={true}/></LocationSelectorSelectStyled>;
                if (error) return <p>Error :(</p>;
                if (!(data.location && data.location[0])) {
                    return null;
                }
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
