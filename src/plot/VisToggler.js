import React from 'react';
import BarChart from './BarChart';
import styled from 'styled-components';
import Table from './Table';
import ToggleButtonGroup from '../common/ToggleButtonGroup';

const initialState = {
  showTable: false,
};

const VisStyled = styled.div`
  margin-top: 40px;
  display: flex;
`;

class VisToggler extends React.Component {
  constructor() {
    super();

    this.state = initialState;
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(selectedVis) {
    console.log(selectedVis);
    if (selectedVis === 'table') {
      this.setState({ showTable: true });
    } else {
      this.setState({ showTable: false });
    }
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
            <BarChart metrics={volumetric} />
          )}
        </VisStyled>
      </div>
    );
  }
}

export default VisToggler;
