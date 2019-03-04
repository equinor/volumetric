import React from 'react';
import PropTypes from 'prop-types';

const CenteredAxisLabel = (
  props /*: {
    xAxis: boolean,
    // note these next two are passed down from the parent XYPlot/Flexible*XYPlot
    innerWidth: number,
    innerHeight: number,
    yOffset: float,
}*/,
) => {
  // since we rotate the y label, we have to adjust it to center
  // (ideally we'd rotate about the correct origin, but i couldn't get that working)

  const { yOffset = 1.25 } = props;

  const yLabelOffset = {
    y: props.innerHeight / 2 + props.titleLength * 3, // '3' might be different for you depending on your font size/char width
    x: 20,
  };

  const xRightOffset = props.rightOffset || 60;
  const xLabelOffset = {
    x: props.innerWidth / 2 + xRightOffset - props.titleLength * 3,
    y: yOffset * props.innerHeight, // 1.2 was enough for me to get it below x axis. you may need a diff't #
  };
  const transform = props.xAxis
    ? `translate(${xLabelOffset.x}, ${xLabelOffset.y})`
    : `translate(${yLabelOffset.x}, ${yLabelOffset.y}) rotate(-90)`;

  return (
    <g transform={transform}>
      <text>{props.children}</text>
    </g>
  );
};

CenteredAxisLabel.propTypes = {
  titleLength: PropTypes.number.isRequired,
  innerWidth: PropTypes.number,
  innerHeight: PropTypes.number,
  rightOffset: PropTypes.number,
  yOffset: PropTypes.number,
  xAxis: PropTypes.bool,
};
CenteredAxisLabel.requiresSVG = true;

export default CenteredAxisLabel;
