import React from 'react';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { GET_METRICS } from './LocationQueries';
import { Filter } from './filters/Filters';
import CaseSelector from './CaseSelector';
import VisToggler from './VisToggler';
import CaseInfo from './CaseInfo';
import { H4 } from '../common/Headers';
import ToggleButtonGroup from '../common/ToggleButtonGroup';
import filterMetricsForPhase from '../utils/filterMetricsForPhase';

const FilterPage = styled.div`
  display: flex;
  flex-flow: row;
`;

const VisWithData = ({
  currentCase,
  facies,
  regions,
  zones,
  phase,
  metrics,
}) => {
  const variables = { caseId: currentCase.value, phase: phase.toUpperCase() };
  if (facies && facies.length > 0) variables['faciesNames'] = facies;
  if (regions && regions.length > 0) variables['regionNames'] = regions;
  if (zones && zones.length > 0) variables['zoneNames'] = zones;
  if (metrics.length === 0) {
    metrics = currentCase.availableMetrics;
  }
  metrics = filterMetricsForPhase(metrics, phase);

  return (
    <Query query={GET_METRICS} variables={variables}>
      {({ loading, error, data }) => {
        if (error) return <p>Error :(</p>;

        return (
          <VisToggler
            data={data.volumetrics}
            isLoading={loading}
            filterMetrics={metrics}
          />
        );
      }}
    </Query>
  );
};

const LocationFilters = ({
  handleFilterChange,
  checkedRegions,
  checkedZones,
  checkedFacies,
  checkedMetrics,
  currentCase,
  phase,
}) => {
  return (
    <React.Fragment>
      <Filter
        name="Metrics"
        filters={filterMetricsForPhase(currentCase.metrics, phase)}
        handleFilterChange={handleFilterChange}
        category="metrics"
        checked={checkedMetrics}
      />
      <Filter
        name="Regions"
        filters={currentCase.regions}
        handleFilterChange={handleFilterChange}
        category="regions"
        checked={checkedRegions}
      />
      <Filter
        name="Zones"
        filters={currentCase.zones}
        handleFilterChange={handleFilterChange}
        category="zones"
        checked={checkedZones}
      />
      {currentCase.facies[0] !== null && (
        <Filter
          name="Facies"
          filters={currentCase.facies}
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

const PhaseButtonGroup = styled(ToggleButtonGroup)`
  max-width: 200px;
`;

class LocationComponent extends React.Component {
  constructor(props) {
    super(props);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleCaseSelectorChange = this.handleCaseSelectorChange.bind(this);

    const field = this.props.data.fields[0];
    const currentCase = field.cases[0];
    this.state = {
      field: {
        label: field.name,
        value: field.name,
      },
      currentCase: {
        label: `${currentCase.name} (${currentCase.caseVersion})`,
        value: currentCase.id,
        availableMetrics: currentCase.metrics,
      },
      phase: currentCase.phases[0],
      regions: [],
      zones: [],
      facies: [],
      metrics: [],
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

  handleCaseSelectorChange(key, value) {
    const { data } = this.props;
    const stateChanges = {
      [key]: value,
      regions: [],
      zones: [],
      facies: [],
    };
    if (key === 'field') {
      const firstCase = data.fields.find(field => field.name === value.value)
        .cases[0];
      stateChanges['currentCase'] = {
        label: `${firstCase.name} (${firstCase.caseVersion})`,
        value: firstCase.id,
        availableMetrics: firstCase.metrics,
      };
      stateChanges['phase'] = firstCase.phases[0];
    } else {
      const currentCase = data.fields
        .find(field => field.name === this.state.field.value)
        .cases.find(otherCase => otherCase.id === value.value);
      stateChanges['phase'] = currentCase.phases[0];
    }
    this.setState(stateChanges);
  }

  render() {
    const { data } = this.props;
    const currentCase = data.fields
      .find(field => field.name === this.state.field.value)
      .cases.find(otherCase => otherCase.id === this.state.currentCase.value);

    return (
      <div>
        <CaseSelector
          {...this.state}
          handleChange={this.handleCaseSelectorChange}
          data={data}
        />
        {this.state.currentCase.value && <CaseInfo currentCase={currentCase} />}
        <FilterPage>
          <FilterWrapper>
            <div>
              <H4>Phase</H4>
              <PhaseButtonGroup
                buttons={currentCase.phases}
                currentSelected={this.state.phase}
                buttonStyle={{ padding: '5px 10px;', fontSize: '16px;' }}
                onChange={phase => this.setState({ phase })}
              />
            </div>
            <LocationFilters
              currentCase={currentCase}
              handleFilterChange={this.handleFilterChange}
              checkedRegions={this.state.regions}
              checkedZones={this.state.zones}
              checkedFacies={this.state.facies}
              checkedMetrics={this.state.metrics}
              phase={this.state.phase}
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
