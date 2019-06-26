import React from 'react';
import styled from 'styled-components';
import filterMetricsForPhase from '../utils/filterMetricsForPhase';
import { Query } from 'react-apollo';
import { GET_METRICS } from '../case/LocationQueries';
import { GraphqlError, NetworkError } from '../common/ErrorHandling';
import { useMetricFilters } from '../common/useMetricFilters';
import { MetricFilters } from '../common/filters/MetricFilters';
import { Plot } from '../case/VisToggler';
import { StyledSpinner } from '../common/Spinner';

export const FilterPage = styled.div`
  display: flex;
  flex-flow: row;
`;

const ContentWrapper = styled.div`
  flex-grow: 1;
  margin-left: 50px;
`;

export const FilterWrapper = styled.div`
  min-width: 200px;
`;

function mergeCases(mergeKey, cases) {
  return [
    ...cases.reduce(
      (acc, _case) => new Set([...acc, ..._case[mergeKey]]),
      new Set(),
    ),
  ];
}

const MetricsQuery = ({
  caseIds,
  selectedMetrics: {
    facies: selectedFacies,
    regions: selectedRegions,
    zones: selectedZones,
    phase: selectedPhase,
  },
  children,
}) => {
  const variables = { caseIds: caseIds, phase: selectedPhase.toUpperCase() };
  if (selectedFacies && selectedFacies.length > 0)
    variables['faciesNames'] = selectedFacies;
  if (selectedRegions && selectedRegions.length > 0)
    variables['regionNames'] = selectedRegions;
  if (selectedZones && selectedZones.length > 0)
    variables['zoneNames'] = selectedZones;

  return (
    <Query query={GET_METRICS} variables={variables}>
      {({ loading, error, data }) => {
        if (error)
          return error.networkError ? NetworkError(error) : GraphqlError(error);
        return children(data.volumetrics, loading);
      }}
    </Query>
  );
};

export const CompareComponent = ({ cases }) => {
  const metrics = mergeCases('metrics', cases);
  const regions = mergeCases('regions', cases);
  const zones = mergeCases('zones', cases);
  const facies = mergeCases('facies', cases);
  const phases = mergeCases('phases', cases);

  const [state, dispatch] = useMetricFilters(phases, metrics);

  const filterMetrics = filterMetricsForPhase(
    state.metrics.length > 0 ? state.metrics : metrics,
    state.phase,
  );

  return (
    <>
      <FilterPage>
        <MetricFilters
          selectedFilters={state}
          metrics={metrics}
          phases={phases}
          regions={regions}
          zones={zones}
          facies={facies}
          locationFilterChange={(category, { target: { checked, value } }) => {
            dispatch({
              type: 'LOCATION_FILTER_CHANGE',
              category,
              checked,
              value,
            });
          }}
          phaseFilterChange={phase =>
            dispatch({ type: 'PHASE_FILTER_CHANGE', phase })
          }
          metricFilterChange={(_, { target: { checked, value } }) => {
            dispatch({
              type: 'METRIC_FILTER_CHANGE',
              checked,
              value,
            });
          }}
        />
        <ContentWrapper>
          <MetricsQuery
            selectedMetrics={state}
            caseIds={cases.map(_case => _case.id)}
          >
            {(volumetrics, loading) => (
              <StyledSpinner isLoading={loading}>
                <Plot
                  cases={cases}
                  volumetrics={volumetrics}
                  isLoading={loading}
                  filterMetrics={filterMetrics}
                  selectedMetric={state.selectedMetric}
                  setSelectedMetric={selectedMetric =>
                    dispatch({ type: 'SET_SELECTED_METRIC', selectedMetric })
                  }
                />
              </StyledSpinner>
            )}
          </MetricsQuery>
        </ContentWrapper>
      </FilterPage>
    </>
  );
};
