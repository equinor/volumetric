import React from 'react';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { GET_METRICS } from './LocationQueries';
import { Fields, Models, Filter } from './filters/Filters';
import VisToggler from './VisToggler';

const FilterPage = styled.div`
  display: flex;
  flex-flow: row;
`;

const VisWithData = ({ model, facies, faultblocks, zones }) => {
  const variables = { modelName: model };
  if (facies && facies.length > 0) variables['faciesName'] = facies;
  if (faultblocks && faultblocks.length > 0)
    variables['faultblockName'] = faultblocks;
  if (zones && zones.length > 0) variables['zoneName'] = zones;

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
  model,
  allChecked,
  handleFilterChange,
  checkedFaultblocks,
  checkedZones,
  checkedFacies,
  data,
}) => {
  return (
    <React.Fragment>
      <Filter
        name="Faultblocks"
        filters={data.faultblocks}
        handleFilterChange={handleFilterChange}
        category="faultblocks"
        checked={checkedFaultblocks}
      />
      <Filter
        name="Zones"
        filters={data.zones}
        handleFilterChange={handleFilterChange}
        category="zones"
        checked={checkedZones}
      />
      {data.facies[0] !== null && (
        <Filter
          name="Facies"
          filters={data.facies}
          handleFilterChange={handleFilterChange}
          category="facies"
          checked={checkedFacies}
        />
      )}
    </React.Fragment>
  );
};

const ModelSelectorStyled = styled.div`
  display: flex;
`;

const ModelSelector = ({ handleChange, field, model, data }) => {
  return (
    <ModelSelectorStyled>
      <React.Fragment>
        <Fields field={field} data={data} handleChange={handleChange} />
        <Models
          data={data.fields.find(otherField => otherField.name === field)}
          model={model}
          handleChange={handleChange}
        />
      </React.Fragment>
    </ModelSelectorStyled>
  );
};

const ContentWrapper = styled.div`
  flex-grow: 1;
  margin-left: 50px;
`;

class LocationComponent extends React.Component {
  constructor(props) {
    super(props);
    this.handleFilterChange = this.handleFilterChange.bind(this);

    this.state = {
      field: this.props.data.fields[0].name,
      model: this.props.data.fields[0].models[0].name,
      faultblocks: [],
      zones: [],
      facies: [],
    };
  }

  handleFilterChange = (category, event) => {
    // Clear state, excluded field, if a different model is selected
    const { checked, value } = event.target;

    this.setState(prevState => {
      return checked
        ? { [category]: [...prevState[category], value] }
        : { [category]: prevState[category].filter(item => item !== value) };
    });
  };

  render() {
    const { data } = this.props;

    return (
      <div>
        <ModelSelector
          {...this.state}
          handleChange={(key, value) => {
            const stateChanges = {
              [key]: value,
              faultblocks: [],
              zones: [],
              facies: [],
            };
            if (key === 'field') {
              stateChanges['model'] = data.fields.find(
                field => field.name === value,
              ).models[0].name;
            }
            this.setState(stateChanges);
          }}
          data={data}
        />
        <FilterPage>
          <div>
            <LocationFilters
              data={data.fields
                .find(field => field.name === this.state.field)
                .models.find(model => model.name === this.state.model)}
              model={this.state.model}
              handleFilterChange={this.handleFilterChange}
              checkedFaultblocks={this.state.faultblocks}
              checkedZones={this.state.zones}
              checkedFacies={this.state.facies}
            />
          </div>
          <ContentWrapper>
            <VisWithData {...this.state} />
          </ContentWrapper>
        </FilterPage>
      </div>
    );
  }
}

export default LocationComponent;
