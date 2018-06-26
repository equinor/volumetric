import styled from 'styled-components';
import React from 'react';
import Select from '../../common/Select';

export const LocationSelectorSelectStyled = styled.div`
  min-width: 200px;
  padding-right: 10px;
  margin-top: 20px;
  flex-grow: ${props => props.grow || '1'};
`;

export const LocationSelectorSelect = ({
                                           labelName,
                                           selectorKey,
                                           options,
                                           value,
                                           onChange,
                                           isDisabled = false,
                                           isLoading = false,
                                           grow,
                                       }) => {
    return (
        <LocationSelectorSelectStyled grow={grow}>
            <Select
                name={`location-selector-select-${selectorKey}`}
                value={value}
                onChange={onChange}
                options={options}
                isDisabled={isDisabled}
                placeholder={`Select ${selectorKey}...`}
                isLoading={isLoading}
            />
        </LocationSelectorSelectStyled>
    );
};