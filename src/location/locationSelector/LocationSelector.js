import React from 'react';
import styled from 'styled-components';
import { LocationSelectorSelect } from './LocationSelect';
import { Redirect } from 'react-router';

const getOptions = (models, state, optionType) => {
  const selectedModel = state.model.value;
  return models
    .find(element => element.id === selectedModel)
    [optionType].map(({ name, id }) => ({
      label: name,
      value: id,
    }));
};

const getLocations = (models, state) => {
  const model = models.find(model => model.id === state.model.value);
  const faultblock = model.faultblocks.find(
    faultblock => faultblock.id === state.faultblock.value,
  );
  const zone = model.zones.find(zone => zone.id === state.zone.value);
  return faultblock.locations.filter(fLocation =>
    zone.locations.some(zLocation => zLocation.id === fLocation.id),
  );
};

const FlexWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const getStateFromLocationId = (models, locationId) => {
  const model = models.find(model => {
    return model.faultblocks.some(faultblock =>
      faultblock.locations.some(location => location.id === locationId),
    );
  });
  const faultblock = model.faultblocks.find(faultblock =>
    faultblock.locations.some(location => location.id === locationId),
  );
  const zone = model.zones.find(zone =>
    zone.locations.some(location => location.id === locationId),
  );
  const location = zone.locations.find(location => location.id === locationId);

  return {
    model: {
      value: model.id,
      label: model.name,
    },
    faultblock: {
      value: faultblock.id,
      label: faultblock.name,
    },
    zone: {
      value: zone.id,
      label: zone.name,
    },
    facies: {
      value: location.id,
      label: location.facies || 'Default facies',
    },
  };
};

const LocationSelectorStyled = styled.div`
  margin-top: 30px;
  margin-bottom: 30px;
`;

class LocationSelector extends React.Component {
  constructor(props) {
    super(props);
    const {
      data: { model: models },
      match: {
        params: { locationId },
      },
    } = props;

    const defaultLocationId = models[0].faultblocks[0].locations[0].id;

    this.state = getStateFromLocationId(
      models,
      locationId || defaultLocationId,
    );
  }

  static getDerivedStateFromProps(props, state) {
    const locationId = props.match.params.locationId;
    if (locationId !== undefined && locationId !== state.facies.value) {
      return getStateFromLocationId(props.data.model, locationId);
    }
    return null;
  }

  renderModelSelector() {
    const {
      data: { model: models },
      history,
    } = this.props;
    const modelOptions = models.map(({ name, id }) => ({
      label: name,
      value: id,
    }));
    const selectedModel = this.state.model;

    const onChange = selectedOption => {
      const model = models.find(model => model.id === selectedOption.value);
      const zone = model.zones[0];
      const faultblock = model.faultblocks[0];
      const state = {
        model: {
          value: model.id,
          label: model.name,
        },
        zone: {
          value: zone.id,
          label: zone.name,
        },
        faultblock: {
          value: faultblock.id,
          label: faultblock.name,
        },
      };
      const location = getLocations(models, state)[0];
      state.facies = {
        value: location.id,
        label: location.facies,
      };
      this.setState(state);
      history.push(`/location/${location.id}`);
    };

    return (
      <LocationSelectorSelect
        grow="2"
        labelName="Model"
        selectorKey="model"
        value={selectedModel}
        onChange={onChange}
        options={modelOptions}
      />
    );
  }

  renderFaultblockSelector() {
    const {
      data: { model: models },
      history,
    } = this.props;
    const options = getOptions(models, this.state, 'faultblocks');

    const onChange = selectedOption => {
      const state = {
        model: this.state.model,
        zone: this.state.zone,
        faultblock: selectedOption,
      };
      const location = getLocations(models, state)[0];
      state.facies = {
        value: location.id,
        label: location.facies,
      };
      this.setState(state);
      history.push(`/location/${location.id}`);
    };

    return (
      <LocationSelectorSelect
        labelName="Faultblock"
        selectorKey="faultblock"
        value={this.state.faultblock}
        onChange={onChange}
        options={options}
      />
    );
  }

  renderZoneSelector() {
    const {
      data: { model: models },
      history,
    } = this.props;
    const options = getOptions(models, this.state, 'zones');

    const onChange = selectedOption => {
      const state = {
        model: this.state.model,
        faultblock: this.state.faultblock,
        zone: selectedOption,
      };
      const location = getLocations(models, state)[0];
      state.facies = {
        value: location.id,
        label: location.facies,
      };
      this.setState(state);
      history.push(`/location/${location.id}`);
    };

    return (
      <LocationSelectorSelect
        labelName="Zone"
        selectorKey="zone"
        value={this.state.zone}
        onChange={onChange}
        options={options}
      />
    );
  }

  renderFaciesSelector() {
    const {
      data: { model: models },
      history,
      match: { params },
    } = this.props;

    const locations = getLocations(models, this.state);
    const hasFacies = locations[0].facies !== null;

    const options = locations.map(({ facies, id }) => ({
      label: facies || 'Default facies',
      value: id,
    }));

    return (
      <LocationSelectorSelect
        labelName="Facies"
        selectorKey="facies"
        isDisabled={!hasFacies}
        onChange={selectedOption => {
          this.setState({
            facies: selectedOption,
          });
          history.push(`/location/${selectedOption.value}`);
        }}
        value={options.find(option => option.value === params.locationId)}
        options={options}
      />
    );
  }

  render() {
    const {
      match: { params },
    } = this.props;

    if (params.locationId === undefined) {
      return <Redirect to={`/location/${this.state.facies.value}`} />;
    }

    return (
      <LocationSelectorStyled>
        <FlexWrapper>
          {this.renderModelSelector()}
          {this.renderFaultblockSelector()}
          {this.renderZoneSelector()}
          {this.renderFaciesSelector()}
        </FlexWrapper>
      </LocationSelectorStyled>
    );
  }
}

export default LocationSelector;
