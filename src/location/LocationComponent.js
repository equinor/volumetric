import React from 'react';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { GET_METRICS } from './LocationQueries';
import { Filter } from './filters/Filters';
import ModelSelector from './ModelSelector';
import VisToggler from './VisToggler';
import ModelInfo from './ModelInfo';

const FilterPage = styled.div`
  display: flex;
  flex-flow: row;
`;

const VisWithData = ({ model, facies, faultblocks, zones }) => {
  const variables = { modelId: model.value };
  if (facies && facies.length > 0) variables['faciesNames'] = facies;
  if (faultblocks && faultblocks.length > 0)
    variables['faultblockNames'] = faultblocks;
  if (zones && zones.length > 0) variables['zoneNames'] = zones;

  return (
    <Query query={GET_METRICS} variables={variables}>
      {({ loading, error, data }) => {
        if (error) return <p>Error :(</p>;

        return <VisToggler data={data.calcOnVolumetrics} isLoading={loading} />;
      }}
    </Query>
  );
};

const LocationFilters = ({
  handleFilterChange,
  checkedFaultblocks,
  checkedZones,
  checkedFacies,
  model,
}) => {
  return (
    <React.Fragment>
      <Filter
        name="Faultblocks"
        filters={model.faultblocks}
        handleFilterChange={handleFilterChange}
        category="faultblocks"
        checked={checkedFaultblocks}
      />
      <Filter
        name="Zones"
        filters={model.zones}
        handleFilterChange={handleFilterChange}
        category="zones"
        checked={checkedZones}
      />
      {model.facies[0] !== null && (
        <Filter
          name="Facies"
          filters={model.facies}
          handleFilterChange={handleFilterChange}
          category="facies"
          checked={checkedFacies}
        />
      )}
    </React.Fragment>
  );
};

const ContentWrapper = styled.div`
  flex-grow: 1;
  margin-left: 50px;
`;

const FilterWrapper = styled.div`
  min-width: 200px;
`;

class LocationComponent extends React.Component {
  constructor(props) {
    super(props);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleModelSelectorChange = this.handleModelSelectorChange.bind(this);

    const field = this.props.data.fields[0];
    const model = field.models[0];

    this.state = {
      field: {
        label: field.name,
        value: field.name,
      },
      model: {
        label: `${model.name} (${model.modelVersion})`,
        value: model.id,
      },
      faultblocks: [],
      zones: [],
      facies: [],
    };
  }

  handleFilterChange(category, event) {
    const { checked, value } = event.target;

    this.setState(prevState => {
      return checked
        ? { [category]: [...prevState[category], value] }
        : { [category]: prevState[category].filter(item => item !== value) };
    });
  }

  handleModelSelectorChange(key, value) {
    const { data } = this.props;
    const stateChanges = {
      [key]: value,
      faultblocks: [],
      zones: [],
      facies: [],
    };
    if (key === 'field') {
      const firstModel = data.fields.find(field => field.name === value.value)
        .models[0];
      stateChanges['model'] = {
        label: `${firstModel.name} (${firstModel.modelVersion})`,
        value: firstModel.id,
      };
    }
    this.setState(stateChanges);
  }

  render() {
    const { data } = this.props;
    const currentModel = data.fields
      .find(field => field.name === this.state.field.value)
      .models.find(model => model.id === this.state.model.value);

    return (
      <div>
        <ModelSelector
          {...this.state}
          handleChange={this.handleModelSelectorChange}
          data={data}
        />
        {this.state.model.value && <ModelInfo model={currentModel} />}
        <FilterPage>
          <FilterWrapper>
            <LocationFilters
              model={currentModel}
              handleFilterChange={this.handleFilterChange}
              checkedFaultblocks={this.state.faultblocks}
              checkedZones={this.state.zones}
              checkedFacies={this.state.facies}
            />
          </FilterWrapper>
          <ContentWrapper>
            <VisWithData {...this.state} />
          </ContentWrapper>
        </FilterPage>
      </div>
    );
  }
}

export default LocationComponent;
