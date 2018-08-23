import React from 'react';
import Histogram from './charts/Histogram';
import styled from 'styled-components';
import Table from './Table';

import ToggleButtonGroup from '../common/ToggleButtonGroup';
import { StyledSpinner } from '../common/Spinner';
import AsyncRender from '../common/AsyncRender';

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

class VisToggler extends React.Component {
  constructor() {
    super();
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
    const { data, isLoading } = this.props;

    if (!isLoading && data.volumetrics.length === 0) {
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
                render={() => <Table metrics={data.volumetrics} />}
              />
            )}

            {this.state.showVis === 'plot' && <Histogram {...data} />}
          </StyledSpinner>
        </VisStyled>
      </div>
    );
  }
}

export default VisToggler;
