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
      />
    );
  }
}

export class Cases extends React.Component {
  render() {
    const { data, currentCase, handleChange } = this.props;

    const cases =
      data !== undefined
        ? data.cases.map(({ id, name, caseVersion }) => ({
            value: id,
            label: `${name} (${caseVersion})`,
          }))
        : [];

    return (
      <DatasetSelectorItem
        name="Case"
        selectedOption={currentCase}
        options={cases}
        onChange={selectedOption => handleChange('currentCase', selectedOption)}
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
