import styled from 'styled-components';
import React from 'react';
import Select from '../../common/Select';
import { capitalize } from './common/utils';
import { ALMOST_BLACK } from '../../common/variables';

export const LocationSelectorSelectStyled = styled.label`
  min-width: 200px;
  padding-right: 10px;
  margin-top: 20px;
  flex-grow: ${props => props.grow || '1'};
  font-weight: bolder;
  color: ${ALMOST_BLACK};
`;

const SelectStyled = styled(Select)`
  font-weight: normal;
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
  const selectorId = `location-selector-select-${selectorKey}`;
  return (
    <LocationSelectorSelectStyled grow={grow} for={selectorId}>
      {`${capitalize(selectorKey)}`}
      <SelectStyled
        id={selectorId}
        name={`location-selector-select-${selectorKey}`}
        value={value}
        onChange={onChange}
        options={options}
        isDisabled={isDisabled}
        placeholder={isLoading ? 'Loading...' : `Select ${selectorKey}...`}
        isLoading={isLoading}
      />
    </LocationSelectorSelectStyled>
  );
};
