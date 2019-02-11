import React from 'react';
import { FlexibleXYPlot, XAxis, YAxis, VerticalBarSeries } from 'react-vis';
import { labelFormater } from '../../utils/text';
import CenteredAxisLabel from './common/CenteredAxisLabel';
import { PlotHeader, PlotStyled } from './common/PlotStyle';
import MetricSelector from './common/MetricSelector';
import { capitalize } from '../common/utils';
import StatisticsDisplay from './common/StatisticsDisplay';

const getMinMax = array => ({
  min: Math.min(...array),
  max: Math.max(...array),
});

const fillBuckets = (data, bucketCount, bucketSize, min) => {
  const buckets = new Array(bucketCount).fill(0);
  // Find what bucket each value corresponds to
  const valuesToBucketArray = data.map(value =>
    Math.floor((value - min) / bucketSize),
  );
  // Count how many values are in each bucket
  valuesToBucketArray.forEach(bucketIndex =>
    bucketIndex === bucketCount
      ? buckets[bucketCount - 1]++
      : buckets[bucketIndex]++,
  );
  // Calculate percentage
  return buckets.map(nofValues => (nofValues / data.length) * 100);
};

const BucketRange = ({ bottomBucket, topBucket, isLast }) => (
  <tspan>
    <tspan x="0">[{bottomBucket}-</tspan>
    <tspan x="0" dy="1.3em">
      {topBucket}
      {isLast ? ']' : '>'}
    </tspan>
  </tspan>
);

const getBucketFormater = (bucketData, bucketCount) => bucketIndex => {
  const { bottomBucket, topBucket } = bucketData[bucketIndex];
  switch (parseInt(bucketIndex, 10)) {
    case 0: // First bucket
      return <BucketRange bottomBucket={bottomBucket} topBucket={topBucket} />;
    case bucketCount - 1: // Last bucket
      return (
        <BucketRange bottomBucket={bottomBucket} topBucket={topBucket} isLast />
      );
    default:
      return (
        <tspan x="0" dy="1.15em">
          {`<${topBucket}`}
        </tspan>
      );
  }
};

const getHistogramData = (data, bucketCount = 10) => {
  const { min, max } = getMinMax(data);
  const bucketRange = max - min;
  const bucketSize = bucketRange / bucketCount;
  const buckets = fillBuckets(data, bucketCount, bucketSize, min);
  return {
    histogramData: buckets.map((value, index) => {
      return {
        x: index,
        y: value,
      };
    }),
    bucketData: buckets.map((value, index) => {
      return {
        bottomBucket: labelFormater(bucketSize * index + min),
        topBucket: labelFormater(bucketSize * (index + 1) + min),
      };
    }),
  };
};

const HistogramChart = ({ summedVolumetrics: metrics, selectedMetric }) => {
  const marginLeft = 75;
  const data = metrics.map(metric => {
    return metric[selectedMetric];
  });
  const bucketCount = 10;
  const { histogramData, bucketData } = getHistogramData(data, bucketCount);
  const bucketFormater = getBucketFormater(bucketData, bucketCount);
  return (
    <FlexibleXYPlot
      style={{ padding: '5px' }}
      xType={'ordinal'}
      margin={{ left: marginLeft, bottom: 85 }}
    >
      <VerticalBarSeries data={histogramData} />
      <XAxis
        style={{
          ticks: {
            fontSize: '0.9em',
          },
        }}
        tickFormat={bucketFormater}
      />
      <YAxis />
      <CenteredAxisLabel titleLength={27}>
        Percent of realizations (%)
      </CenteredAxisLabel>
      <CenteredAxisLabel xAxis titleLength={18}>
        <tspan>
          Bucket ranges (m
          <tspan baselineShift="super">3</tspan>)
        </tspan>
      </CenteredAxisLabel>
    </FlexibleXYPlot>
  );
};

export default props => {
  return (
    <PlotStyled>
      <MetricSelector
        renderHeader={selectedMetric => (
          <PlotHeader>{`${capitalize(selectedMetric)} histogram`}</PlotHeader>
        )}
        renderVis={selectedMetric => (
          <HistogramChart {...props} selectedMetric={selectedMetric} />
        )}
        renderStats={selectedMetric => (
          <StatisticsDisplay {...props} selectedMetric={selectedMetric} />
        )}
      />
    </PlotStyled>
  );
};
