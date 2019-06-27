import React from 'react';
import FilterList from './FilterList';
import { H4 } from '../Headers';

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
