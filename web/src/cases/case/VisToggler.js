import React from 'react';
import Histogram from './charts/Histogram';
import styled from 'styled-components';
import Table from './Table';

import ToggleButtonGroup from '../../common/ToggleButtonGroup';
import { StyledSpinner } from '../../common/Spinner';
import AsyncRender from '../../common/AsyncRender';
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

export const Plot = ({
  volumetrics,
  cases,
  filterMetrics,
  selectedMetric,
  setSelectedMetric,
}) => {
  const singleRealizationMetrics = volumetrics.filter(
    ({ summedVolumetrics }) => summedVolumetrics.length === 1,
  );
  const multiRealizationMetrics = volumetrics.filter(
    ({ summedVolumetrics }) => summedVolumetrics.length !== 1,
  );
  return (
    <div>
      {singleRealizationMetrics.length > 0 && (
        <BarChart
          volumetrics={singleRealizationMetrics}
          filterMetrics={filterMetrics}
          cases={cases}
        />
      )}
      {multiRealizationMetrics.length > 0 && (
        <Histogram
          cases={cases}
          volumetrics={multiRealizationMetrics}
          filterMetrics={filterMetrics}
          selectedMetric={selectedMetric}
          setSelectedMetric={setSelectedMetric}
        />
      )}
    </div>
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
    const {
      volumetrics,
      isLoading,
      filterMetrics,
      selectedMetric,
      setSelectedMetric,
    } = this.props;
    const metrics = volumetrics.summedVolumetrics;

    if (!isLoading && metrics.length === 0) {
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
                  <Table metrics={metrics} filterMetrics={filterMetrics} />
                )}
              />
            )}

            {this.state.showVis === 'plot' && (
              <Plot
                volumetrics={[volumetrics]}
                filterMetrics={filterMetrics}
                selectedMetric={selectedMetric}
                setSelectedMetric={setSelectedMetric}
              />
            )}
          </StyledSpinner>
        </VisStyled>
      </div>
    );
  }
}

export default VisToggler;
