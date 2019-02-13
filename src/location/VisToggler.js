import React from 'react';
import Histogram from './charts/Histogram';
import styled from 'styled-components';
import Table from './Table';

import ToggleButtonGroup from '../common/ToggleButtonGroup';
import { StyledSpinner } from '../common/Spinner';
import AsyncRender from '../common/AsyncRender';
import BarChart from './charts/BarChart';

const VisSelector = styled(ToggleButtonGroup)`
  align-self: flex-end;
`;

const VisStyled = styled.div`
  margin-top: 40px;
`;

const NoData = styled.div`
  margin: 50px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: 24vh;
`;

const Plot = ({ data, filterMetrics }) => {
  const singleRealization = data.summedVolumetrics.length === 1;
  return singleRealization ? (
    <BarChart metrics={data.summedVolumetrics} filterMetrics={filterMetrics} />
  ) : (
    <Histogram {...data} filterMetrics={filterMetrics} />
  );
};

class VisToggler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showVis: 'plot',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(selectedVis) {
    this.setState({
      showVis: selectedVis,
    });
  }

  render() {
    const { data, isLoading, filterMetrics } = this.props;

    if (!isLoading && data.summedVolumetrics.length === 0) {
      return <NoData>No data...</NoData>;
    }

    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <VisSelector
            currentSelected={this.state.showVis}
            onChange={this.handleChange}
            buttons={['Plot', 'Table']}
          />
        </div>
        <VisStyled>
          <StyledSpinner isLoading={isLoading}>
            {this.state.showVis === 'table' && (
              <AsyncRender
                render={() => (
                  <Table
                    metrics={data.summedVolumetrics}
                    filterMetrics={filterMetrics}
                  />
                )}
              />
            )}

            {this.state.showVis === 'plot' && (
              <Plot data={data} filterMetrics={filterMetrics} />
            )}
          </StyledSpinner>
        </VisStyled>
      </div>
    );
  }
}

export default VisToggler;
