import React from 'react';
import FilterList from './FilterList';
import Select from '../Select';
import { H4 } from '../Headers';

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

export class Cases extends React.Component {
  render() {
    const { currentCase, handleChange, cases } = this.props;

    const options = cases.map(({ id, name, caseVersion }) => ({
      value: id,
      label: `${name} (${caseVersion})`,
    }));
    return (
      <DatasetSelectorItem
        name="Case"
        selectedOption={{
          id: currentCase.id,
          label: `${currentCase.name} (${currentCase.caseVersion})`,
        }}
        options={options}
        onChange={selectedOption => handleChange(selectedOption)}
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
