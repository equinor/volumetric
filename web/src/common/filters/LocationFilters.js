import React from 'react';
import { Filter } from './Filters';

const LocationFilters = ({
  handleFilterChange,
  setFilterState,
  checkedRegions,
  checkedZones,
  checkedFacies,
  currentCase,
}) => {
  return (
    <React.Fragment>
      <Filter
        showTotals
        setFilterState={setFilterState}
        name="Regions"
        filters={currentCase.regions}
        handleFilterChange={handleFilterChange}
        category="regions"
        checked={checkedRegions}
      />
      <Filter
        showTotals
        setFilterState={setFilterState}
        name="Zones"
        filters={currentCase.zones}
        handleFilterChange={handleFilterChange}
        category="zones"
        checked={checkedZones}
      />
      {currentCase.facies[0] !== null && (
        <Filter
          showTotals
          setFilterState={setFilterState}
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
