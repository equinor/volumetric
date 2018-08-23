import React from 'react';
import FilterList from './FilterList';
import Select from '../../common/Select';
import { H4 } from '../../common/Headers';

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
      <H4>{name}</H4>
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
        name="Field"
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
        name="Model"
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
      <H4>{name}</H4>
      <FilterList
        filters={filters}
        handleFilterChange={handleFilterChange}
        category={category}
        checked={checked}
      />
    </div>
  );
};
