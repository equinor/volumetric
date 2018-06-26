import React from 'react';
import {LocationSelectorSelect} from './LocationSelect';

const NO_FACIES_LABEL = 'Default facies';

export default ({locations, state, handleChange, disabled}) => {
    if (disabled) {
        const {id: value} = locations[0];
        const defaultValue = {value, label: NO_FACIES_LABEL};
        if (
            !state.selectedOption ||
            state.selectedOption.value !== defaultValue.value
        ) {
            handleChange('facies', defaultValue);
        }
        return (
            <LocationSelectorSelect
                labelName="Facies"
                selectorKey="facies"
                isDisabled={true}
                value={defaultValue}
                options={[defaultValue]}
            />
        );
    }

    const options = locations.map(({facies, id}) => ({
        label: facies,
        value: id,
    }));
    const selectedOption = state.selectedOption;

    if (selectedOption === null) {
        handleChange('facies', options[0]);
    }

    return (
        <LocationSelectorSelect
            labelName="Facies"
            selectorKey="facies"
            onChange={selectedOption => handleChange('facies', selectedOption)}
            value={selectedOption}
            options={options}
        />
    );
};
