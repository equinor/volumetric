import React from 'react';
import {
  FlexibleXYPlot,
  HorizontalGridLines,
  LabelSeries,
  VerticalBarSeries,
  VerticalGridLines,
  XAxis,
  YAxis,
} from 'react-vis';
import { labelFormater } from '../../utils/text';
import CenteredAxisLabel from './common/CenteredAxisLabel';
import { PlotHeader, PlotStyled } from './common/PlotStyle';

export default ({ metrics, filterMetrics }) => {
  const singleRealization = metrics[0];
  const labeledData = filterMetrics.map(key => ({
    x: key,
    y: singleRealization[key],
    label: labelFormater(singleRealization[key]),
  }));

  const marginLeft = 75;

  return (
    <PlotStyled>
      <PlotHeader>{`Single Realization Case`}</PlotHeader>
      <FlexibleXYPlot
        style={{ padding: '5px' }}
        xType={'ordinal'}
        margin={{ left: marginLeft, bottom: 100, top: 100 }}
      >
        <VerticalGridLines />
        <HorizontalGridLines />
        <VerticalBarSeries data={labeledData} />
        <XAxis />
        <YAxis tickFormat={tick => labelFormater(tick)} />
        <LabelSeries
          data={labeledData}
          allowOffsetToBeReversed
          labelAnchorX={'middle'}
          labelAnchorY={'after-edge'}
        />
        <CenteredAxisLabel yAxis titleLength={40} YOffset={1.85}>
          <tspan>
            Volume in cubic squared (m
            <tspan baselineShift="super">3</tspan>)
          </tspan>
        </CenteredAxisLabel>
        <CenteredAxisLabel xAxis titleLength={20} YOffset={1.85}>
          <tspan>Volumetrics</tspan>
        </CenteredAxisLabel>
      </FlexibleXYPlot>
    </PlotStyled>
  );
};
