import React from 'react';
import {DEFAULT_COLOR, HOVER_COLOR, METRICS, SELECTED_COLOR} from '../../../common/variables';
import RadioButton, {RadioButtonStyled} from '../../../common/RadioButton';
import styled from 'styled-components';

const initialState = {
    selectedMetric: METRICS[0].toLowerCase(),
};

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

class MetricSelector extends React.Component {
    constructor() {
        super();

        this.state = initialState;
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(selectedMetric) {
        this.setState({selectedMetric: selectedMetric});
    }

    render() {
        const {children} = this.props;

        const childrenWithProps = React.Children.map(children, child =>
            React.cloneElement(child, {selectedMetric: this.state.selectedMetric})
        );

        return (
            <React.Fragment>
                <MetricSelectorStyled>
                    {
                        METRICS.map((metric, index) => {
                            const isSelected = this.state.selectedMetric === metric.toLowerCase();
                            return (
                                <MetricRadioButtonStyle
                                    key={`metric-selector-btn-${metric}`}
                                    selected={isSelected}
                                    first={index===0}
                                    last={index === METRICS.length - 1}
                                >
                                    <RadioButton
                                        onChange={this.handleChange}
                                        selected={isSelected}
                                        value={metric.toLowerCase()}
                                    >
                                        {metric}
                                    </RadioButton>
                                </MetricRadioButtonStyle>
                            );
                        })
                    }
                </MetricSelectorStyled>
                {
                    childrenWithProps
                }
            </React.Fragment>
        );
    }
}

export default MetricSelector;
