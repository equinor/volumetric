import React from 'react';
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalBarSeries,
  HorizontalGridLines,
  VerticalGridLines,
} from 'react-vis';
import { format } from 'd3-format';

const ignoreKeys = ['__typename', 'id', 'realization'];
const filterKeys = key => !ignoreKeys.includes(key);

const getYRange = data => {
  const yArray = data.map(({ x, y }) => y);
  return { min: Math.min(...yArray), max: Math.max(...yArray) };
};

const CustomAxisLabel = (
  props /*: {
    title: string,
    xAxis: boolean,
    // note these next two are passed down from the parent XYPlot/Flexible*XYPlot
    innerWidth: number,
    innerHeight: number
}*/,
) => {
  // since we rotate the y label, we have to adjust it to center
  // (ideally we'd rotate about the correct origin, but i couldn't get that working)
  const yLabelOffset = {
    y: props.innerHeight / 2 + props.title.length * 3, // '3' might be different for you depending on your font size/char width
    x: 10,
  };

  const xLabelOffset = {
    x: props.innerWidth / 2,
    y: 1.2 * props.innerHeight, // 1.2 was enough for me to get it below x axis. you may need a diff't #
  };
  const transform = props.xAxis
    ? `translate(${xLabelOffset.x}, ${xLabelOffset.y})`
    : `translate(${yLabelOffset.x}, ${yLabelOffset.y}) rotate(-90)`;

  return (
    <g transform={transform}>
      <text>{props.title}</text>
    </g>
  );
};

CustomAxisLabel.displayName = 'CustomAxisLabel';
CustomAxisLabel.requiresSVG = true;

export default ({ metrics }) => {
  const row = metrics[0];
  const data = Object.keys(row)
    .filter(filterKeys)
    .map(key => ({ x: key, y: row[key] }));

  return (
    <XYPlot
      style={{ padding: '5px' }}
      xType={'ordinal'}
      width={800}
      height={400}
      margin={{ left: 75, bottom: 100 }}
    >
      <VerticalGridLines />
      <HorizontalGridLines />
      <VerticalBarSeries data={data} />
      <XAxis />
      <YAxis tickFormat={tick => format('2.1s')(tick)} />
      <CustomAxisLabel title={'Value'} />
      <CustomAxisLabel title={'Metric'} xAxis />
    </XYPlot>
  );
};
