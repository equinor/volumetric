import React from 'react';
import Histogram from './charts/Histogram';
import BarChart from './charts/BarChart';
import styled from 'styled-components';
import Table from './Table';
import ToggleButtonGroup from '../common/ToggleButtonGroup';

const initialState = {
  showTable: false,
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
    this.setState({ showTable: selectedVis === 'table' });
  }

  render() {
    const { data } = this.props;
    const { volumetric } = data;
    return (
      <div>
        <ToggleButtonGroup
          currentSelected={this.state.showTable ? 'table' : 'plot'}
          onChange={this.handleChange}
          buttons={['Table', 'Plot']}
        />
        <VisStyled>
          {this.state.showTable ? (
            <Table metrics={volumetric} />
          ) : (
            <React.Fragment>
              <Histogram metrics={volumetric} />
              <BarChart metrics={volumetric} />
            </React.Fragment>
          )}
        </VisStyled>
      </div>
    );
  }
}

export default VisToggler;
