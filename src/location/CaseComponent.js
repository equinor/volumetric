import React, { useReducer } from 'react';
import { H4 } from '../common/Headers';
import styled from 'styled-components';
import ToggleButtonGroup from '../common/ToggleButtonGroup';
import filterMetricsForPhase from '../utils/filterMetricsForPhase';
import { Query } from 'react-apollo';
import { GET_METRICS } from './LocationQueries';
import { GraphqlError, NetworkError } from '../common/ErrorHandling';
import VisToggler from './VisToggler';
import { Filter, LocationFilters } from './filters';

const FilterPage = styled.div`
  display: flex;
  flex-flow: row;
`;

const VisWithData = ({
  currentCase,
  facies,
  regions,
  zones,
  phase,
  metrics,
  selectedMetric,
  setSelectedMetric,
}) => {
  const variables = { caseId: currentCase.id, phase: phase.toUpperCase() };
  if (facies && facies.length > 0) variables['faciesNames'] = facies;
  if (regions && regions.length > 0) variables['regionNames'] = regions;
  if (zones && zones.length > 0) variables['zoneNames'] = zones;
  if (metrics.length === 0) {
    metrics = currentCase.metrics;
  }
  metrics = filterMetricsForPhase(metrics, phase);

  return (
    <Query query={GET_METRICS} variables={variables}>
      {({ loading, error, data }) => {
        if (error)
          return error.networkError ? NetworkError(error) : GraphqlError(error);
        return (
          <VisToggler
            data={data.volumetrics}
            isLoading={loading}
            filterMetrics={metrics}
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

const FilterWrapper = styled.div`
  min-width: 200px;
`;

const PhaseButtonGroup = styled(ToggleButtonGroup)`
  max-width: 200px;
`;

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOCATION_FILTER_CHANGE': {
      const { checked, value, category: key } = action;
      return {
        ...state,
        [key]: checked
          ? [...state[key], value]
          : state[key].filter(item => item !== value),
      };
    }
    case 'METRIC_FILTER_CHANGE': {
      const key = 'metrics';
      const { checked, value } = action;
      let nextState = checked
        ? {
            [key]: state.currentCase.metrics.filter(metric =>
              [...state[key], value].includes(metric),
            ),
          }
        : { [key]: state[key].filter(item => item !== value) };
      const isValidMetric =
        nextState.metrics.includes(state.selectedMetric) ||
        nextState.metrics.length === 0;
      if (!isValidMetric) {
        nextState.selectedMetric = nextState.metrics[0];
      }
      return {
        ...state,
        ...nextState,
      };
    }
    case 'PHASE_FILTER_CHANGE':
      return {
        ...state,
        phase: action.phase,
      };
    case 'SET_SELECTED_METRIC':
      return {
        ...state,
        selectedMetric: action.selectedMetric,
      };
    default:
      throw new Error(`Unknown action type ${action.type}`);
  }
};

export const CaseComponent = props => {
  const { caseVersion, phases, metrics, id, name } = props;
  const initialState = {
    currentCase: {
      ...props,
      label: `${name} (${caseVersion})`,
      value: id,
    },
    phase: phases[0],
    regions: [],
    zones: [],
    facies: [],
    metrics: [],
    selectedMetric: metrics[0],
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <FilterPage>
        <FilterWrapper>
          <div>
            <H4>Phase</H4>
            <PhaseButtonGroup
              buttons={state.currentCase.phases}
              currentSelected={state.phase}
              buttonStyle={{ padding: '5px 10px;', fontSize: '16px;' }}
              onChange={phase =>
                dispatch({ type: 'PHASE_FILTER_CHANGE', phase })
              }
            />
          </div>
          <Filter
            name="Metrics"
            filters={filterMetricsForPhase(
              state.currentCase.metrics,
              state.phase,
            )}
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
            currentCase={state.currentCase}
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
            {...state}
            setSelectedMetric={selectedMetric =>
              dispatch({ type: 'SET_SELECTED_METRIC', selectedMetric })
            }
          />
        </ContentWrapper>
      </FilterPage>
    </>
  );
};
