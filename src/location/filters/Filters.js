import React from 'react';
import styled from 'styled-components';
import FilterList from './FilterList';
import Select from '../../common/Select';

const TableDescriber = styled.h4`
  margin-bottom: 10px;
`;

const FilterHeader = styled.h4`
  font-size: 14px;
  margin-bottom: 10px;
`;

const DatasetSelectorItem = ({
  name,
  data,
  selectedOption,
  onChange,
  isLoading,
}) => {
  let options, value;
  if (!isLoading) {
    options = data.map(({ name }) => ({ value: name, label: name }));
    value =
      selectedOption !== ''
        ? { value: selectedOption, label: selectedOption }
        : undefined;
  }
  return (
    <div style={{ flexGrow: 1 }}>
      <TableDescriber>{name}</TableDescriber>
      <Select
        options={options}
        value={value}
        placeholder={`Select ${name}`}
        onChange={onChange}
        isLoading={isLoading}
      />
    </div>
  );
};

export class Fields extends React.Component {
  render() {
    const { data, field, handleChange } = this.props;

    return (
      <DatasetSelectorItem
        name="Fields"
        selectedOption={field}
        data={data.fields}
        onChange={value => handleChange('field', value.value)}
        category="fields"
      />
    );
  }
}

export class Models extends React.Component {
  render() {
    const { data, model, handleChange } = this.props;

    const models = data !== undefined ? data.models : [];

    return (
      <DatasetSelectorItem
        name="Models"
        selectedOption={model}
        data={models}
        onChange={value => handleChange('model', value.value)}
        category="models"
      />
    );
  }
}

export const Filter = props => {
  const { name, category, filters, handleFilterChange, checked } = props;
  return (
    <div>
      <FilterHeader>{name}</FilterHeader>
      <FilterList
        filters={filters}
        handleFilterChange={handleFilterChange}
        category={category}
        checked={checked}
      />
    </div>
  );
};

export class Faultblocks extends React.Component {
  render() {
    const { data, handleBoxChange, checked } = this.props;
    return (
      <Filter
        name="Faultblocks"
        filters={data.model.faultblocks}
        handleBoxChange={handleBoxChange}
        category="faultblocks"
        checked={checked}
      />
    );
  }
}

export class Zones extends React.Component {
  render() {
    const { data, handleBoxChange, checked } = this.props;
    return (
      <Filter
        name="Zones"
        filters={data.model.zones}
        handleBoxChange={handleBoxChange}
        category="zones"
        checked={checked}
      />
    );
  }
}

export class Facies extends React.Component {
  render() {
    const { data, handleBoxChange, checked } = this.props;
    return (
      <Filter
        name="facies"
        filters={data.model.facies}
        handleBoxChange={handleBoxChange}
        category="facies"
        checked={checked}
      />
    );
  }
}
