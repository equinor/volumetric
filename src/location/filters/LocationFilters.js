import React from 'react';
import { Filter } from './Filters';
import filterMetricsForPhase from '../../utils/filterMetricsForPhase';

const LocationFilters = ({
  handleFilterChange,
  checkedRegions,
  checkedZones,
  checkedFacies,
  checkedMetrics,
  currentCase,
  phase,
}) => {
  return (
    <React.Fragment>
      <Filter
        name="Metrics"
        filters={filterMetricsForPhase(currentCase.metrics, phase)}
        handleFilterChange={handleFilterChange}
        category="metrics"
        checked={checkedMetrics}
      />
      <Filter
        name="Regions"
        filters={currentCase.regions}
        handleFilterChange={handleFilterChange}
        category="regions"
        checked={checkedRegions}
      />
      <Filter
        name="Zones"
        filters={currentCase.zones}
        handleFilterChange={handleFilterChange}
        category="zones"
        checked={checkedZones}
      />
      {currentCase.facies[0] !== null && (
        <Filter
          name="Facies"
          filters={currentCase.facies}
          handleFilterChange={handleFilterChange}
          category="facies"
          checked={checkedFacies}
        />
      )}
    </React.Fragment>
  );
};

export default LocationFilters;
