import React from 'react';
import { CheckboxWithLabel } from '../Input';

class FilterItem extends React.Component {
  render() {
    const { handleFilterChange, category, datarow, checked } = this.props;
    let checkedState = checked.includes(datarow);
    return (
      <CheckboxWithLabel
        onChange={event => handleFilterChange(category, event)}
        value={datarow === null ? '' : datarow}
        checked={checkedState}
        label={datarow}
      />
    );
  }
}

class FilterList extends React.Component {
  render() {
    const { filters, handleFilterChange, category, checked } = this.props;

    const rows = filters.map(filter => (
      <FilterItem
        datarow={filter}
        handleFilterChange={handleFilterChange}
        category={category}
        checked={checked}
        key={filter}
      />
    ));

    return <div>{rows}</div>;
  }
}

export default FilterList;
