import React from 'react';
import { H4 } from '../common/Headers';
import styled from 'styled-components';
import ToggleButtonGroup from '../common/ToggleButtonGroup';
import filterMetricsForPhase from '../utils/filterMetricsForPhase';
import { Query } from 'react-apollo';
import { GET_METRICS } from './LocationQueries';
import { GraphqlError, NetworkError } from '../common/ErrorHandling';
import { Filter } from './filters/Filters';
import VisToggler from './VisToggler';

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
  selectedMetric,
  setSelectedMetric,
}) => {
  const variables = { caseId: currentCase.id, phase: phase.toUpperCase() };
  if (facies && facies.length > 0) variables['faciesNames'] = facies;
  if (regions && regions.length > 0) variables['regionNames'] = regions;
  if (zones && zones.length > 0) variables['zoneNames'] = zones;
  if (metrics.length === 0) {
    metrics = currentCase.metrics;
  }
  metrics = filterMetricsForPhase(metrics, phase);

  return (
    <Query query={GET_METRICS} variables={variables}>
      {({ loading, error, data }) => {
        if (error)
          return error.networkError ? NetworkError(error) : GraphqlError(error);
        return (
          <VisToggler
            data={data.volumetrics}
            isLoading={loading}
            filterMetrics={metrics}
            selectedMetric={selectedMetric}
            setSelectedMetric={setSelectedMetric}
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

export class CaseComponent extends React.Component {
  state = {
    currentCase: {
      ...this.props,
      label: `${this.props.name} (${this.props.caseVersion})`,
      value: this.props.id,
    },
    phase: this.props.phases[0],
    regions: [],
    zones: [],
    facies: [],
    metrics: [],
    selectedMetric: this.props.metrics[0],
  };

  handleFilterChange = (category, event) => {
    const { checked, value } = event.target;
    this.setState(prevState => {
      if (category === 'metrics') {
        let nextState = checked
          ? {
              [category]: this.state.currentCase.metrics.filter(metric =>
                [...prevState[category], value].includes(metric),
              ),
            }
          : { [category]: prevState[category].filter(item => item !== value) };
        const isValidMetric =
          nextState.metrics.includes(prevState.selectedMetric) ||
          nextState.metrics.length === 0;
        if (!isValidMetric) {
          nextState.selectedMetric = nextState.metrics[0];
        }
        return nextState;
      }
      return checked
        ? { [category]: [...prevState[category], value] }
        : { [category]: prevState[category].filter(item => item !== value) };
    });
  };

  render() {
    return (
      <>
        <FilterPage>
          <FilterWrapper>
            <div>
              <H4>Phase</H4>
              <PhaseButtonGroup
                buttons={this.state.currentCase.phases}
                currentSelected={this.state.phase}
                buttonStyle={{ padding: '5px 10px;', fontSize: '16px;' }}
                onChange={phase => this.setState({ phase })}
              />
            </div>
            <LocationFilters
              currentCase={this.state.currentCase}
              handleFilterChange={this.handleFilterChange}
              checkedRegions={this.state.regions}
              checkedZones={this.state.zones}
              checkedFacies={this.state.facies}
              checkedMetrics={this.state.metrics}
              phase={this.state.phase}
            />
          </FilterWrapper>
          <ContentWrapper>
            <VisWithData
              {...this.state}
              setSelectedMetric={selectedMetric =>
                this.setState({ selectedMetric })
              }
            />
          </ContentWrapper>
        </FilterPage>
      </>
    );
  }
}
