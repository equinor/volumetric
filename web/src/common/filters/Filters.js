import React from 'react';
import FilterList from './FilterList';
import { H4 } from '../Headers';
import styled from 'styled-components';
import { LINK_COLOR } from '../variables';

const ShowTotalsButton = styled.button`
  font-family: Equinor-Medium, serif;
  font-weight: 500;
  color: ${LINK_COLOR};

  // Button as link style
  background: none;
  border: none;
  padding: 0 !important;
  /*border is optional*/
  text-decoration: underline solid ${LINK_COLOR};
  cursor: pointer;
  height: fit-content;
  margin-left: 35px;

  :focus {
    outline: none;
  }
`;

const ShowTotals = ({ filters, checked, setFilterState, category }) => {
  const showingTotals = filters.every(filter => checked.includes(filter));
  if (showingTotals) {
    return (
      <ShowTotalsButton onClick={() => setFilterState(category, [])}>
        Clear
      </ShowTotalsButton>
    );
  }
  return (
    <ShowTotalsButton onClick={() => setFilterState(category, filters)}>
      Show totals
    </ShowTotalsButton>
  );
};

export const Filter = props => {
  const {
    name,
    category,
    filters,
    handleFilterChange,
    setFilterState,
    showTotals = false,
    checked,
  } = props;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <H4>{name}</H4>
        {showTotals && (
          <ShowTotals
            category={category}
            filters={filters}
            checked={checked}
            setFilterState={setFilterState}
          />
        )}
      </div>
      <FilterList
        filters={filters}
        handleFilterChange={handleFilterChange}
        category={category}
        checked={checked}
      />
    </div>
  );
};
