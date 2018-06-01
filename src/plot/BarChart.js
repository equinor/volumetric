import React from 'react';
import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  VerticalBarSeries,
  HorizontalGridLines,
  VerticalGridLines,
} from 'react-vis';
import { format } from 'd3-format';
import styled from 'styled-components';

const ignoreKeys = ['__typename', 'id', 'realization'];
const filterKeys = key => !ignoreKeys.includes(key);

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
    x: props.innerWidth / 2 + props.rightOffset - props.title.length * 3,
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

const PlotStyled = styled.div`
  flex-grow: 1;
  height: 400px;
  min-width: 600px;
`;

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
      <FlexibleXYPlot
        style={{ padding: '5px' }}
        xType={'ordinal'}
        margin={{ left: marginLeft, bottom: 100 }}
      >
        <VerticalGridLines />
        <HorizontalGridLines />
        {verticalBarSeriesList}
        <XAxis />
        <YAxis tickFormat={tick => format('2.1s')(tick)} />
        <CustomAxisLabel title={'Value'} />
        <CustomAxisLabel rightOffset={marginLeft} title={'Metric'} xAxis />
      </FlexibleXYPlot>
    </PlotStyled>
  );
};
