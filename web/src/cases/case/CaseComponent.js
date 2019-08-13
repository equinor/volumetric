import React from 'react';
import { H4 } from '../../common/Headers';
import styled from 'styled-components';
import ToggleButtonGroup from '../../common/ToggleButtonGroup';
import filterMetricsForPhase from '../../utils/filterMetricsForPhase';
import { Query } from 'react-apollo';
import { GET_METRICS } from './LocationQueries';
import { GraphqlError, NetworkError } from '../../common/ErrorHandling';
import VisToggler from './VisToggler';
import { Filter, LocationFilters } from '../../common/filters';
import { useMetricFilters } from '../../common/useMetricFilters';

export const FilterPage = styled.div`
  display: flex;
  flex-flow: row;
`;

const VisWithData = ({
  metrics,
  caseId,
  selectedMetrics: {
    facies: selectedFacies,
    regions: selectedRegions,
    zones: selectedZones,
    metrics: selectedMetrics,
    phase: selectedPhase,
    selectedMetric,
  },
  setSelectedMetric,
}) => {
  const variables = { caseIds: [caseId], phase: selectedPhase.toUpperCase() };
  if (selectedFacies && selectedFacies.length > 0)
    variables['faciesNames'] = selectedFacies;
  if (selectedRegions && selectedRegions.length > 0)
    variables['regionNames'] = selectedRegions;
  if (selectedZones && selectedZones.length > 0)
    variables['zoneNames'] = selectedZones;

  const filterMetrics = filterMetricsForPhase(
    selectedMetrics.length > 0 ? selectedMetrics : metrics,
    selectedPhase,
  );

  return (
    <Query query={GET_METRICS} variables={variables}>
      {({ loading, error, data }) => {
        if (error)
          return error.networkError ? NetworkError(error) : GraphqlError(error);
        return (
          <VisToggler
            volumetrics={!loading && data.volumetrics[0]}
            isLoading={loading}
            filterMetrics={filterMetrics}
            selectedMetric={selectedMetric}
            setSelectedMetric={setSelectedMetric}
          />
        );
      }}
    </Query>
  );
};

const ContentWrapper = styled.div`
  flex-grow: 1;
  margin-left: 50px;
`;

export const FilterWrapper = styled.div`
  min-width: 200px;
`;

const PhaseButtonGroup = styled(ToggleButtonGroup)`
  max-width: 200px;
`;

export const CaseComponent = props => {
  const { id, phases, metrics, facies, regions, zones } = props;

  const [state, dispatch] = useMetricFilters(phases, metrics);

  return (
    <>
      <FilterPage>
        <FilterWrapper>
          <div>
            <H4>Phase</H4>
            <PhaseButtonGroup
              buttons={phases}
              currentSelected={state.phase}
              buttonStyle={{ padding: '5px 10px;', fontSize: '16px;' }}
              onChange={phase =>
                dispatch({ type: 'PHASE_FILTER_CHANGE', phase })
              }
            />
          </div>
          <Filter
            name="Metrics"
            filters={filterMetricsForPhase(metrics, state.phase)}
            handleFilterChange={(_, { target: { checked, value } }) => {
              dispatch({
                type: 'METRIC_FILTER_CHANGE',
                checked,
                value,
              });
            }}
            category="metrics"
            checked={state.metrics}
          />
          <LocationFilters
            currentCase={{ regions, facies, zones }}
            setFilterState={(category, values) =>
              dispatch({
                type: 'LOCATION_FILTER_SET',
                category,
                values,
              })
            }
            handleFilterChange={(category, { target: { checked, value } }) => {
              dispatch({
                type: 'LOCATION_FILTER_CHANGE',
                category,
                checked,
                value,
              });
            }}
            checkedRegions={state.regions}
            checkedZones={state.zones}
            checkedFacies={state.facies}
          />
        </FilterWrapper>
        <ContentWrapper>
          <VisWithData
            selectedMetrics={state}
            metrics={metrics}
            caseId={id}
            setSelectedMetric={selectedMetric =>
              dispatch({ type: 'SET_SELECTED_METRIC', selectedMetric })
            }
          />
        </ContentWrapper>
      </FilterPage>
    </>
  );
};
