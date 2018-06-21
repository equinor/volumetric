import React from 'react';
import { FlexibleXYPlot, XAxis, YAxis, VerticalBarSeries } from 'react-vis';
import { format } from 'd3-format';
import CenteredAxisLabel from './common/CenteredAxisLabel';
import { PlotHeader, PlotStyled } from './common/PlotStyle';
import MetricSelector from './common/MetricSelector';

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
  valuesToBucketArray.forEach(
    bucketIndex =>
      bucketIndex === bucketCount
        ? buckets[bucketCount - 1]++
        : buckets[bucketIndex]++,
  );
  // Calculate percentage
  return buckets.map(nofValues => (nofValues / data.length) * 100);
};

const labelFormater = format('.4~s');

const getBucketName = (bucketSize, index, bucketCount, min) => {
  const bottomBucketLimitLabel = labelFormater(bucketSize * index + min);
  const topBucketLimitLabel = labelFormater(bucketSize * (index + 1) + min);
  const firstBucket = 0;
  const lastBucket = bucketCount - 1;

  switch (index) {
    case firstBucket:
      return `[${bottomBucketLimitLabel} - ${topBucketLimitLabel}>`;
    case lastBucket:
      return `[${bottomBucketLimitLabel} - ${topBucketLimitLabel}]`;
    default:
      return `< ${topBucketLimitLabel}`;
  }
};

const getHistogramData = (data, bucketCount = 10) => {
  const { min, max } = getMinMax(data);
  const bucketRange = max - min;
  const bucketSize = bucketRange / bucketCount;
  const buckets = fillBuckets(data, bucketCount, bucketSize, min);
  return buckets.map((value, index) => {
    return {
      x: getBucketName(bucketSize, index, bucketCount, min),
      y: value,
    };
  });
};

const HistogramChart = ({ metrics, selectedMetric }) => {
  const marginLeft = 75;
  const data = metrics.map(metric => {
    return metric[selectedMetric];
  });

  const histogramData = getHistogramData(data);
  return (
    <FlexibleXYPlot
      style={{ padding: '5px' }}
      xType={'ordinal'}
      margin={{ left: marginLeft, bottom: 50 }}
    >
      <VerticalBarSeries data={histogramData} />
      <XAxis
        style={{
          ticks: {
            fontSize: '0.9em',
          },
        }}
      />
      <YAxis tickFormat={tick => `${tick} %`} />
      <CenteredAxisLabel title={'Percent of realizations'} />
    </FlexibleXYPlot>
  );
};

export default ({ ...props }) => {
  return (
    <PlotStyled>
      <PlotHeader>Metric histogram</PlotHeader>
      <MetricSelector>
        <HistogramChart {...props} />
      </MetricSelector>
    </PlotStyled>
  );
};
