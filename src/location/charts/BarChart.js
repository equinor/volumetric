import React from 'react';
import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  VerticalBarSeries,
  HorizontalGridLines,
  VerticalGridLines,
} from 'react-vis';
import { labelFormater } from '../../utils/text';
import CenteredAxisLabel from './common/CenteredAxisLabel';
import { PlotHeader, PlotStyled } from './common/PlotStyle';

const ignoreKeys = ['__typename', 'id', 'realization'];
const filterKeys = key => !ignoreKeys.includes(key);

export default ({ metrics }) => {
  const verticalBarSeriesList = metrics.map((row, index) => {
    const data = Object.keys(row)
      .filter(filterKeys)
      .map(key => ({ x: key, y: row[key] }));
    return <VerticalBarSeries key={`bar-series-${index}`} data={data} />;
  });

  const marginLeft = 75;

  return (
    <PlotStyled>
      <PlotHeader>All metrics</PlotHeader>
      <FlexibleXYPlot
        style={{ padding: '5px' }}
        xType={'ordinal'}
        margin={{ left: marginLeft, bottom: 100 }}
      >
        <VerticalGridLines />
        <HorizontalGridLines />
        {verticalBarSeriesList}
        <XAxis />
        <YAxis tickFormat={tick => labelFormater(tick)} />
        <CenteredAxisLabel title={'Value'} />
      </FlexibleXYPlot>
    </PlotStyled>
  );
};
