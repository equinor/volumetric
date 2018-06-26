import React from 'react';
import findByType from '../../utils/findByType';
import FaciesContainer from './FaciesContainer';
import styled from 'styled-components';
import {LocationSelectorSelect} from './LocationSelect';

const ModelSelector = () => null;
const FaultblockSelector = () => null;
const ZoneSelector = () => null;
const FaciesSelector = () => null;

const getFindId = id => element => element.id === id;

const getOptions = (models, state, optionType) => {
  const selectedModel = state.model.selectedOption.value;
  if (models.length === 0) {
    return [];
  }
  return models
    .find(getFindId(selectedModel))
    [optionType].map(({ name, id }) => ({
      label: name,
      value: id,
    }));
};

const FlexWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

class LocationSelector extends React.Component {
  renderModelSelector() {
    const { children } = this.props;
    const component = findByType(children, ModelSelector);
    if (!component) {
      return null;
    }
    const { models, state, handleChange } = this.props;
    const modelOptions = models.map(({ name, id }) => ({
      label: name,
      value: id,
    }));
    const selectedModel = state.model.selectedOption;

    if (!selectedModel) {
        handleChange('model', modelOptions[0])
    }

    return (
      <LocationSelectorSelect
        grow="2"
        labelName="Model"
        selectorKey="model"
        value={selectedModel}
        onChange={selectedOption => handleChange('model', selectedOption)}
        options={modelOptions}
      />
    );
  }

  renderFaultblockSelector() {
    const { children } = this.props;
    const component = findByType(children, FaultblockSelector);
    if (!component) {
      return null;
    }
    const { models, state, handleChange } = this.props;
    const options = getOptions(models, state, 'faultblocks');

    const selected = state.faultblock.selectedOption;

    if (!selected) {
        handleChange('faultblock', options[0])
    }

    return (
      <LocationSelectorSelect
        labelName="Faultblock"
        selectorKey="faultblock"
        value={selected}
        onChange={selectedOption => handleChange('faultblock', selectedOption)}
        options={options}
      />
    );
  }

  renderZoneSelector() {
    const { children } = this.props;
    const component = findByType(children, ZoneSelector);
    if (!component) {
      return null;
    }
    const { models, state, handleChange } = this.props;
    const options = getOptions(models, state, 'zones');

    const selected = state.zone.selectedOption;

    if (!selected) {
        handleChange('zone', options[0])
    }

    return (
      <LocationSelectorSelect
        labelName="Zone"
        selectorKey="zone"
        value={selected}
        onChange={selectedOption => handleChange('zone', selectedOption)}
        options={options}
      />
    );
  }

  renderFaciesSelector() {
    const { children } = this.props;
    const component = findByType(children, FaciesSelector);
    if (!component) {
      return null;
    }
    return <FaciesContainer {...this.props} />;
  }

  render() {
    return (
      <FlexWrapper>
        {this.renderModelSelector()}
        {this.renderFaultblockSelector()}
        {this.renderZoneSelector()}
        {this.renderFaciesSelector()}
      </FlexWrapper>
    );
  }
}

LocationSelector.ModelSelector = ModelSelector;
LocationSelector.FaultblockSelector = FaultblockSelector;
LocationSelector.ZoneSelector = ZoneSelector;
LocationSelector.FaciesSelector = FaciesSelector;

export default LocationSelector;
