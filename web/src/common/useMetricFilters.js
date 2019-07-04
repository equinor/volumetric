import { useReducer } from 'react';

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
        ? { [key]: [...state[key], value] }
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

export function useMetricFilters(phases, metrics) {
  const initialState = {
    phase: phases[0],
    regions: [],
    zones: [],
    facies: [],
    metrics: [],
    selectedMetric: metrics[0],
  };

  return useReducer(reducer, initialState);
}
