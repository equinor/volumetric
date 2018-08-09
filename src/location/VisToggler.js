import React from 'react';
import Histogram from './charts/Histogram';
import BarChart from './charts/BarChart';
import styled from 'styled-components';
import Table from './Table';
import PTable from './P-Table';

import ToggleButtonGroup from '../common/ToggleButtonGroup';

const initialState = {
  showVis: 'plot',
};

const VisStyled = styled.div`
  margin-top: 40px;
`;

class VisToggler extends React.Component {
  constructor() {
    super();

    this.state = initialState;
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(selectedVis) {
    this.setState({ showVis: selectedVis });
  }

  render() {
    const { data } = this.props;
    return (
      <div>
        <ToggleButtonGroup
          currentSelected={this.state.showVis}
          onChange={this.handleChange}
          buttons={['Table', 'Plot', 'p-Values']}
        />
        <VisStyled>
          {this.state.showVis === 'table' && (
            <Table metrics={data.volumetrics} />
          )}

          {this.state.showVis === 'plot' && (
            <React.Fragment>
              <Histogram {...data} />
              <BarChart metrics={data.volumetrics} />
            </React.Fragment>
          )}

          {this.state.showVis === 'p-values' && (
            <React.Fragment>
              <PTable pValues={data} />
            </React.Fragment>
          )}
        </VisStyled>
      </div>
    );
  }
}

export default VisToggler;
