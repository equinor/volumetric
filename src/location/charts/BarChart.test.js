import React from 'react';
import BarChart from './BarChart';
import { volumetrics } from '../../utils/mockData';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <BarChart metrics={volumetrics.data.summedVolumetrics} />,
    div,
  );
});
