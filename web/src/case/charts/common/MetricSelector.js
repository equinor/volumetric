import React from 'react';
import { ToggleButtonStyled } from '../../../common/ToggleButton';
import RadioButton from '../../../common/RadioButton';
import styled from 'styled-components';

const MetricSelectorStyled = styled.div`
  display: flex;
  padding: 10px 25px;
`;

export default props => {
  const {
    renderHeader,
    renderVis,
    renderStats,
    filterMetrics,
    selectedMetric,
    setSelectedMetric,
  } = props;
  return (
    <React.Fragment>
      {renderHeader(selectedMetric)}
      <MetricSelectorStyled>
        {filterMetrics.map((metric, index) => {
          const isSelected = selectedMetric === metric.toLowerCase();
          return (
            <ToggleButtonStyled
              key={`metric-selector-btn-${metric}`}
              selected={isSelected}
              first={index === 0}
              last={index === filterMetrics.length - 1}
            >
              <RadioButton
                onChange={selectedMetric => setSelectedMetric(selectedMetric)}
                selected={isSelected}
                value={metric.toLowerCase()}
              >
                {metric}
              </RadioButton>
            </ToggleButtonStyled>
          );
        })}
      </MetricSelectorStyled>
      {renderVis && renderVis(selectedMetric)}
      {renderStats && renderStats(selectedMetric)}
    </React.Fragment>
  );
};
