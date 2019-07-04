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
import { getColorPalette } from '../../utils/colors';
import { CaseVersion } from './common/StatisticsDisplay';

export default ({ volumetrics, cases, filterMetrics }) => {
  const colorPalette = getColorPalette(volumetrics.length);
  const bars = volumetrics.map(({ summedVolumetrics: metrics }, index) =>
    filterMetrics.map(metricName => {
      const metricValue = metrics[0][metricName];
      return {
        x: metricName,
        y: metricValue,
        label: labelFormater(metricValue),
        color: colorPalette[index],
      };
    }),
  );
  const marginLeft = 85;
  return (
    <div>
      <PlotStyled>
        <PlotHeader>{`Single Realization Case`}</PlotHeader>
        <FlexibleXYPlot
          style={{ padding: '5px' }}
          xType={'ordinal'}
          margin={{ left: marginLeft, bottom: 100, top: 20 }}
          colorType="literal"
        >
          <VerticalGridLines />
          <HorizontalGridLines />
          {bars.map((bar, index) => (
            <VerticalBarSeries key={index} data={bar} stroke={'#243746'} />
          ))}
          <XAxis />
          <YAxis tickFormat={tick => labelFormater(tick)} />
          {bars.length === 1 && (
            <LabelSeries
              data={bars[0]}
              allowOffsetToBeReversed
              labelAnchorX={'middle'}
              labelAnchorY={'text-after-edge'}
            />
          )}
          <CenteredAxisLabel titleLength={11}>
            <tspan>
              Volume (m
              <tspan dy={-5}>3</tspan>)
            </tspan>
          </CenteredAxisLabel>
          <CenteredAxisLabel xAxis titleLength={7}>
            Metrics
          </CenteredAxisLabel>
          <CenteredAxisLabel xAxis titleLength={20} yOffset={1.85}>
            <tspan>Volumetrics</tspan>
          </CenteredAxisLabel>
        </FlexibleXYPlot>
      </PlotStyled>
      {cases &&
        volumetrics.map(({ caseId }, index) => (
          <CaseVersion key={index} borderColor={colorPalette[index]}>
            {cases.find(_case => _case.id === caseId).caseVersion}
          </CaseVersion>
        ))}
    </div>
  );
};
