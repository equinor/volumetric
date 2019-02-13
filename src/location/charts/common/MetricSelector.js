import React from 'react';
import {
  DEFAULT_COLOR,
  HOVER_COLOR,
  SELECTED_COLOR,
} from '../../../common/variables';
import RadioButton, { RadioButtonStyled } from '../../../common/RadioButton';
import styled from 'styled-components';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';

const MetricSelectorStyled = styled.div`
  display: flex;
  padding: 10px 25px;
`;

const MetricRadioButtonStyle = styled(RadioButtonStyled).attrs({
  hoverColor: HOVER_COLOR,
  selectedColor: SELECTED_COLOR,
  defaultColor: DEFAULT_COLOR,
})`
  padding: 5px 10px;
  min-width: 40px;
  ${props => props.first && 'border-radius: 4px 0px 0px 4px'};
  ${props => props.last && 'border-radius: 0px 4px 4px 0px'};
  ${props => !props.first && 'border-left: 0px'};
  flex-grow: 1;
`;

export const GET_SELECTED_METRIC = gql`
  {
    metrics {
      selectedMetric @client
    }
  }
`;

export default props => {
  const { renderHeader, renderVis, renderStats, filterMetrics } = props;

  return (
    <Query query={GET_SELECTED_METRIC}>
      {({ data, client, loading }) => {
        if (loading) return null;
        const { selectedMetric } = data.metrics;
        return (
          <React.Fragment>
            {renderHeader(selectedMetric)}
            <MetricSelectorStyled>
              {filterMetrics.map((metric, index) => {
                const isSelected = selectedMetric === metric.toLowerCase();
                return (
                  <MetricRadioButtonStyle
                    key={`metric-selector-btn-${metric}`}
                    selected={isSelected}
                    first={index === 0}
                    last={index === filterMetrics.length - 1}
                  >
                    <RadioButton
                      onChange={selectedMetric =>
                        client.writeData({
                          data: {
                            metrics: {
                              __typename: 'Metrics',
                              selectedMetric: selectedMetric,
                            },
                          },
                        })
                      }
                      selected={isSelected}
                      value={metric.toLowerCase()}
                    >
                      {metric}
                    </RadioButton>
                  </MetricRadioButtonStyle>
                );
              })}
            </MetricSelectorStyled>
            {renderVis && renderVis(selectedMetric)}
            {renderStats && renderStats(selectedMetric)}
          </React.Fragment>
        );
      }}
    </Query>
  );
};
