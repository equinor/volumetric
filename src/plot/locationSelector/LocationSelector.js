import React from 'react';
import Select from '../../common/Select';
import findByType from '../../utils/findByType';
import FaciesContainer from './FaciesContainer';
import styled from 'styled-components';

const ModelSelector = () => null;
const FaultblockSelector = () => null;
const ZoneSelector = () => null;
const FaciesSelector = () => null;

const getFindId = id => element => element.id === id;

const FlexWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const LocationSelectorSelectStyled = styled.div`
  min-width: 200px;
  padding-right: 10px;
  margin-top: 20px;
  flex-grow: ${props => props.grow || '1'};
`;

export const LocationSelectorSelect = ({
  labelName,
  selectorKey,
  options,
  value,
  onChange,
  isDisabled = false,
  grow,
}) => {
  return (
    <LocationSelectorSelectStyled grow={grow}>
      <Select
        name={`location-selector-select-${selectorKey}`}
        value={value}
        onChange={onChange}
        options={options}
        isDisabled={isDisabled}
        placeholder={`Select ${selectorKey}...`}
      />
    </LocationSelectorSelectStyled>
  );
};

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
    const selectedModel = state.model.selectedOption.value;
    const options = models
      .find(getFindId(selectedModel))
      .faultblocks.map(({ name, id }) => ({
        label: name,
        value: id,
      }));
    return (
      <LocationSelectorSelect
        labelName="Faultblock"
        selectorKey="faultblock"
        value={state.faultblock.selectedOption}
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
    const selectedModel = state.model.selectedOption.value;
    const options = models
      .find(getFindId(selectedModel))
      .zones.map(({ name, id }) => ({
        label: name,
        value: id,
      }));

    return (
      <LocationSelectorSelect
        labelName="Zone"
        selectorKey="zone"
        value={state.zone.selectedOption}
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
