import React from 'react';
import styled from 'styled-components';

const CheckboxLabel = styled.label`
  padding: 5px 0;
  display: block;
  cursor: pointer;
`;

const CheckBox = props => {
  return <input {...props} />;
};

class FilterItem extends React.Component {
  render() {
    const { handleFilterChange, category, datarow, checked } = this.props;
    let checkedState = checked.includes(datarow);
    return (
      <CheckboxLabel checked={checkedState}>
        <CheckBox
          onChange={event => handleFilterChange(category, event)}
          type="checkbox"
          value={datarow === null ? '' : datarow}
          checked={checkedState}
        />
        {datarow}
      </CheckboxLabel>
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
