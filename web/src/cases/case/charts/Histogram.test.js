import React from 'react';
import Histogram from './Histogram';
import { GET_SELECTED_METRIC } from './common/MetricSelector';
import { cases, volumetrics } from '../../../utils/mockData';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';

const mocks = [
  {
    request: {
      query: GET_SELECTED_METRIC,
    },
    result: {
      data: {
        metrics: {
          selectedMetric: 'bulk',
          metrics: ['bulk', 'net', 'porv', 'hcpv', 'stoiip'],
        },
      },
    },
  },
];

it('renders without crashing', async () => {
  const div = document.createElement('div');

  // First render will give loading=true from the MockedProvider
  ReactDOM.render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Histogram
        volumetrics={volumetrics}
        cases={cases}
        selectedMetric={'bulk'}
        filterMetrics={['bulk', 'net', 'porv', 'hcpv', 'stoiip']}
      />
    </MockedProvider>,
    div,
  );

  // This will render the component again with loading=false and query data provided
  await wait(0);
});
