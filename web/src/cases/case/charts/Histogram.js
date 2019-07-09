import React from 'react';
import { FlexibleXYPlot, VerticalBarSeries, XAxis, YAxis } from 'react-vis';
import { labelFormater } from '../../../utils/text';
import CenteredAxisLabel from './common/CenteredAxisLabel';
import { PlotHeader, PlotStyled } from './common/PlotStyle';
import MetricSelector from './common/MetricSelector';
import StatisticsDisplay from './common/StatisticsDisplay';
import { getColorPalette } from '../../../utils/colors';

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

const BucketRange = props => {
  const { bottomBucket, topBucket, isLast, dy, transform, textAnchor } = props;
  // Placement of tick is not handled automatically when the tick is a complex element like this one.
  // Need to add dy, transform and textAnchor to text-element. Given as props from react-vis
  return (
    <text dy={dy} transform={transform} textAnchor={textAnchor}>
      <tspan x="0">[{bottomBucket}-</tspan>
      <tspan x="0" dy="1.3em">
        {topBucket}
        {isLast ? ']' : '>'}
      </tspan>
    </text>
  );
};

const getBucketFormatter = (bucketData, bucketCount) => (
  value,
  bucketIndex,
) => {
  let { bottomBucket, topBucket } = bucketData[bucketIndex];

  bottomBucket = labelFormater(bottomBucket);
  topBucket = labelFormater(topBucket);

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

const getHistogramData = (volumetrics, bucketCount = 10) => {
  const data = volumetrics.reduce((acc, metrics) => [...acc, ...metrics], []);
  const { min, max } = getMinMax(data);
  const bucketRange = max - min;
  const bucketSize = bucketRange / bucketCount;

  // return a single bucket when all values are equal
  if (min === max) {
    return {
      bars: [[{ x: 1, y: 100 }]],
      bucketFormatter: () => labelFormater(min),
    };
  }
  const bars = volumetrics.map(metrics =>
    fillBuckets(metrics, bucketCount, bucketSize, min),
  );
  const bucketData = bars[0].map((value, index) => {
    return {
      bottomBucket: bucketSize * index + min,
      topBucket: bucketSize * (index + 1) + min,
    };
  });
  return {
    bars: bars.map(bar =>
      bar.map((value, index) => {
        return {
          x: index,
          y: value,
        };
      }),
    ),
    bucketFormatter: getBucketFormatter(bucketData, bucketCount),
  };
};

const HistogramChart = ({ volumetrics, selectedMetric }) => {
  const marginLeft = 75;
  const flat_volumetrics = volumetrics.map(({ summedVolumetrics: metrics }) =>
    metrics.map(metric => {
      return metric[selectedMetric];
    }),
  );
  const { bars, bucketFormatter } = getHistogramData(flat_volumetrics);
  const colorPalette = getColorPalette(bars.length);
  return (
    <>
      <FlexibleXYPlot
        style={{ padding: '5px' }}
        xType={'ordinal'}
        margin={{ left: marginLeft, bottom: 85 }}
        colorType="literal"
      >
        {bars.map((bar, index) => (
          <VerticalBarSeries
            key={index}
            data={bar.map(mark => ({ ...mark, color: colorPalette[index] }))}
            stroke={'#243746'}
          />
        ))}
        <XAxis
          style={{
            ticks: {
              marginTop: '20px',
              fontSize: '11px',
            },
          }}
          tickValues={bars[0].map(({ x }) => x)}
          tickFormat={bucketFormatter}
        />
        <YAxis />
        <CenteredAxisLabel titleLength={27}>
          Percent of realizations (%)
        </CenteredAxisLabel>
        <CenteredAxisLabel xAxis titleLength={18}>
          <tspan>
            Bucket ranges (m
            <tspan dy={-5}>3</tspan>)
          </tspan>
        </CenteredAxisLabel>
      </FlexibleXYPlot>
    </>
  );
};

export default props => {
  const {
    filterMetrics,
    selectedMetric,
    setSelectedMetric,
    volumetrics,
    cases,
  } = props;
  const firstCaseMetrics = volumetrics[0].summedVolumetrics;
  const numberOfRealizations =
    firstCaseMetrics[firstCaseMetrics.length - 1].realization + 1;
  return (
    <PlotStyled>
      <MetricSelector
        filterMetrics={filterMetrics}
        selectedMetric={selectedMetric}
        setSelectedMetric={setSelectedMetric}
        renderHeader={() => (
          <PlotHeader>{`Multi Realization Case ${
            volumetrics.length === 1 ? `(${numberOfRealizations})` : ''
          }`}</PlotHeader>
        )}
        renderVis={selectedMetric => (
          <HistogramChart
            volumetrics={volumetrics}
            selectedMetric={selectedMetric}
          />
        )}
        renderStats={selectedMetric => (
          <StatisticsDisplay
            cases={cases}
            volumetrics={volumetrics}
            selectedMetric={selectedMetric}
          />
        )}
      />
    </PlotStyled>
  );
};
