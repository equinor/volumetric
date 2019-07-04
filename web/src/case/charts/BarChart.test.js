import React from 'react';
import BarChart from './BarChart';
import { cases, volumetrics } from '../../utils/mockData';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <BarChart
      cases={cases}
      volumetrics={volumetrics}
      filterMetrics={['bulk', 'net', 'porv', 'hcpv', 'stoiip']}
    />,
    div,
  );
});
