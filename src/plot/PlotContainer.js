import React from 'react';
import { Query } from 'react-apollo';
import LocationSelector from './locationSelector/LocationSelector';
import { GET_METRICS, GET_MODELS } from './ModelQueries';
import VisToggler from './VisToggler';
import styled from 'styled-components';

const hasSelectedAll = state =>
  Object.keys(state).reduce(
    (acc, cur) => acc && state[cur].selectedOption !== null,
    true,
  );

const LocationSelectorStyled = styled.div`
  margin-top: 30px;
  margin-bottom: 30px;
`;

const initialState = {
  model: {
    selectedOption: null
  },
  faultblock: {
    selectedOption: null
  },
  zone: {
    selectedOption: null
  },
  facies: {
    selectedOption: null
  }
};

const PlotContainerStyled = styled.div`
  margin-bottom: 50px;
`;

class PlotContainer extends React.Component {
  constructor() {
    super();

    this.state = initialState;
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(key, selectedOption) {
    if (key === 'model') {
      this.setState(
        Object.assign({}, initialState, {
          [key]: {
            selectedOption: selectedOption,
          },
        }),
      );
    } else if (key === 'faultblock' || key === 'zone') {
      this.setState({
        [key]: {
          selectedOption: selectedOption,
        },
        facies: {
          selectedOption: null,
        },
      });
    } else {
      this.setState({
        [key]: {
          selectedOption: selectedOption,
        },
      });
    }
  }

  render() {
    console.log(this.state);
    return (
      <Query query={GET_MODELS}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;

          const hasSelectedModel = this.state.model.selectedOption !== null;
          const hasSelectedFaultblock =
            this.state.faultblock.selectedOption !== null;
          const hasSelectedZone = this.state.zone.selectedOption !== null;
          const shouldRenderFacies =
            hasSelectedModel && hasSelectedFaultblock && hasSelectedZone;

          const selectedAll = hasSelectedAll(this.state);

          return (
            <PlotContainerStyled>
              <LocationSelectorStyled>
                <LocationSelector
                  handleChange={this.handleChange}
                  models={data.model}
                  state={this.state}
                >
                  <LocationSelector.ModelSelector />
                  {hasSelectedModel && <LocationSelector.ZoneSelector />}
                  {hasSelectedModel && <LocationSelector.FaultblockSelector />}
                  {shouldRenderFacies && <LocationSelector.FaciesSelector />}
                </LocationSelector>
              </LocationSelectorStyled>
              {selectedAll && (
                <Query
                  query={GET_METRICS}
                  variables={{
                    locationId: this.state.facies.selectedOption.value,
                  }}
                >
                  {({ loading, data }) => {
                    if (loading) {
                      return <div>Loading...</div>;
                    }
                    return <VisToggler data={data} />;
                  }}
                </Query>
              )}
            </PlotContainerStyled>
          );
        }}
      </Query>
    );
  }
}

export default PlotContainer;
