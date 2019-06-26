import React from 'react';
import { H4 } from '../Headers';
import { Filter } from './Filters';
import filterMetricsForPhase from '../../utils/filterMetricsForPhase';
import { LocationFilters } from './index';
import { FilterWrapper } from '../../compare/CompareComponent';
import ToggleButtonGroup from '../ToggleButtonGroup';
import styled from 'styled-components';

const PhaseButtonGroup = styled(ToggleButtonGroup)`
  max-width: 200px;
`;

export const MetricFilters = ({
  selectedFilters,
  regions,
  facies,
  zones,
  metrics,
  phases,
  locationFilterChange,
  metricFilterChange,
  phaseFilterChange,
}) => {
  return (
    <FilterWrapper>
      <div>
        <H4>Phase</H4>
        <PhaseButtonGroup
          buttons={phases}
          currentSelected={selectedFilters.phase}
          buttonStyle={{ padding: '5px 10px;', fontSize: '16px;' }}
          onChange={phaseFilterChange}
        />
      </div>
      <Filter
        name="Metrics"
        filters={filterMetricsForPhase(metrics, selectedFilters.phase)}
        handleFilterChange={metricFilterChange}
        category="metrics"
        checked={selectedFilters.metrics}
      />
      <LocationFilters
        currentCase={{ regions, facies, zones }}
        handleFilterChange={locationFilterChange}
        checkedRegions={selectedFilters.regions}
        checkedZones={selectedFilters.zones}
        checkedFacies={selectedFilters.facies}
      />
    </FilterWrapper>
  );
};
