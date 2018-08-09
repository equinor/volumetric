import React from 'react';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { GET_METRICS, GET_MODEL } from './ModelQueries';
import VisContainer from './VisContainer';
import {
  Fields,
  Models,
  Faultblocks,
  Zones,
  Facies,
} from './locationSelector/Filters';
import { ColumnStyled } from './locationSelector/common/Styled';
import Spinner from '../common/Spinner';

const SelectorWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px 0 30px 0;
`;
const FetchButton = styled.button`
  height: 30px;
  width: 450px;
  border: 1px solid black;
  background-color: #009c9c;
  font-size: 20px;
  color: white;
  align-self: flex-end;
`;

const StyledSpinner = styled(Spinner)`
  margin-top: 15vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VisWithData = ({ model, facies, faultblocks, zones }) => (
  <Query
    query={GET_METRICS}
    variables={{
      modelName: model,
      faciesName: facies,
      faultblockName: faultblocks,
      zoneName: zones,
    }}
  >
    {({ loading, error, data }) => {
      if (error) return <p>Error :(</p>;

      return (
        <StyledSpinner isLoading={loading}>
          <VisContainer data={data.calcOnVolumetrics} />
        </StyledSpinner>
      );
    }}
  </Query>
);

const ModelFilters = ({
  model,
  allChecked,
  handleBoxChange,
  checkedFaultblocks,
  checkedZones,
  checkedFacies,
}) => {
  if (model === '') {
    return (
      <ColumnStyled>
        <p>Select a model</p>
      </ColumnStyled>
    );
  }

  return (
    <Query
      query={GET_MODEL}
      variables={{
        modelName: model,
      }}
    >
      {({ loading, error, data }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error :(</p>;
        return (
          <React.Fragment>
            <Faultblocks
              data={data}
              allChecked={allChecked.faultblocks}
              handleBoxChange={handleBoxChange}
              checked={checkedFaultblocks}
            />
            <Zones
              data={data}
              allChecked={allChecked.zones}
              handleBoxChange={handleBoxChange}
              checked={checkedZones}
            />
            <Facies
              data={data}
              allChecked={allChecked.facies}
              handleBoxChange={handleBoxChange}
              checked={checkedFacies}
            />
          </React.Fragment>
        );
      }}
    </Query>
  );
};

const DatasetSelectorStyled = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

class LocationWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.handleBoxChange = this.handleBoxChange.bind(this);
    this.state = {
      field: '',
      model: '',
      faultblocks: [],
      zones: [],
      facies: [],
      allChecked: {
        faultblocks: false,
        zones: false,
        facies: false,
      },
    };
  }

  handleBoxChange = (category, event, allRows) => {
    this.setState({ shouldRenderVis: false });

    // Clear state if a different field is selected
    if (category === 'fields') {
      this.setState({
        field: event.target.value,
        model: '',
        faultblocks: '',
        zones: '',
        facies: '',
      });
    }

    // Clear state, excluded field, if a different model is selected
    if (category === 'models') {
      this.setState({
        model: event.target.value,
        faultblocks: '',
        zones: '',
        facies: '',
      });
    } else {
      if (event.target.checked) {
        if (category === 'fields' || category === 'models') {
          return;
        }

        // If the 'all' checkbox is ticked, set the 'all' state for this category to true and update state to contain all the values
        if (event.target.value === 'all') {
          let allChecked = { ...this.state.allChecked };
          allChecked[category] = true;
          this.setState({ allChecked });
          this.setState({ [category]: allRows });
        }
        // If it was not a 'all box' that was ticked, append it's value to the state and unset 'all'
        if (event.target.value !== 'all') {
          this.setState({
            [category]: [...this.state[category], event.target.value],
          });
        }
      }
      // If a box get unchecked, unset 'all'
      if (event.target.checked === false) {
        let allChecked = { ...this.state.allChecked };
        allChecked[category] = false;
        this.setState({ allChecked });

        // If 'all' get unchecked, clear state for that category
        if (event.target.value === 'all') {
          this.setState({ [category]: [] });

          // If it was not a 'all' box, remove the value from the category array state
        } else {
          const array = [...this.state[category]];
          const index = array.indexOf(event.target.value);
          array.splice(index, 1);
          this.setState({ [category]: array });
        }
      }
    }
  };

  render() {
    return (
      <div>
        <SelectorWrapper>
          <ColumnStyled left>
            <DatasetSelectorStyled>
              <Fields
                fields={this.state.field}
                handleBoxChange={this.handleBoxChange}
              />
              <Models
                model={this.state.model}
                fieldName={this.state.field}
                handleBoxChange={this.handleBoxChange}
              />
            </DatasetSelectorStyled>
          </ColumnStyled>
          <ModelFilters
            allChecked={this.state.allChecked}
            model={this.state.model}
            handleBoxChange={this.handleBoxChange}
            checkedFaultblocks={this.state.faultblocks}
            checkedZones={this.state.zones}
            checkedFacies={this.state.facies}
          />
        </SelectorWrapper>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <FetchButton onClick={() => this.setState({ shouldRenderVis: true })}>
            Fetch data
          </FetchButton>
        </div>
        {this.state.shouldRenderVis && <VisWithData {...this.state} />}
      </div>
    );
  }
}

export default LocationWrapper;
