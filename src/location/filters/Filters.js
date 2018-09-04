import React from 'react';
import FilterList from './FilterList';
import Select from '../../common/Select';
import { H4 } from '../../common/Headers';

const DatasetSelectorItem = ({ name, selectedOption, onChange, options }) => {
  return (
    <div style={{ flexGrow: 1 }}>
      <H4>{name}</H4>
      <Select
        options={options}
        value={selectedOption}
        placeholder={`Select ${name}`}
        onChange={onChange}
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
        options={data.fields.map(({ name }) => ({ value: name, label: name }))}
        onChange={selectedOption => handleChange('field', selectedOption)}
        category="fields"
      />
    );
  }
}

export class Models extends React.Component {
  render() {
    const { data, model, handleChange } = this.props;

    const models =
      data !== undefined
        ? data.models.map(({ id, name, modelVersion }) => ({
            value: id,
            label: `${name} (${modelVersion})`,
          }))
        : [];

    return (
      <DatasetSelectorItem
        name="Model"
        selectedOption={model}
        options={models}
        onChange={selectedOption => handleChange('model', selectedOption)}
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
