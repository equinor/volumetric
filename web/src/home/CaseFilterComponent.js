import React, { useState } from 'react';
import styled from 'styled-components';
import { CaseItem } from './CaseItem';
import { Filter } from '../common/filters';
import { FilterPage, FilterWrapper } from '../case/CaseComponent';
import { getVisibility } from '../common/visibility';

const CasesStyled = styled.div`
  width: 100%;
`;

const Cases = ({ cases, toggleCompareCase, compareCases }) => (
  <CasesStyled>
    {cases.map(_case => (
      <CaseItem
        key={_case.id}
        _case={_case}
        toggleCompareCase={() => toggleCompareCase(_case.id)}
        checked={compareCases.includes(_case.id)}
      />
    ))}
  </CasesStyled>
);

const Filters = ({ filterChange, filterState, cases }) => {
  return (
    <>
      <Filter
        name="Visibility"
        filters={['Private', 'Shared', 'Official']}
        handleFilterChange={filterChange}
        category="visibility"
        checked={filterState.visibility}
      />
      <Filter
        name="Case"
        filters={[...new Set(cases.map(_case => _case.name))]}
        handleFilterChange={filterChange}
        category="case"
        checked={filterState.case}
      />
    </>
  );
};

export function CaseFilterComponent(props) {
  const [filterState, setFilterState] = useState({
    visibility: [],
    case: [],
  });

  const filterChange = (category, event) => {
    const value = event.target.value;
    setFilterState({
      ...filterState,
      [category]: filterState[category].includes(value)
        ? filterState[category].filter(otherValue => otherValue !== value)
        : [...filterState[category], value],
    });
  };

  let filteredCases =
    filterState.visibility.length > 0
      ? props.cases.filter(({ isOfficial, isShared }) =>
          filterState.visibility.includes(getVisibility(isOfficial, isShared)),
        )
      : props.cases;
  filteredCases =
    filterState.case.length > 0
      ? filteredCases.filter(({ name }) => filterState.case.includes(name))
      : filteredCases;
  return (
    <FilterPage>
      <FilterWrapper>
        <Filters
          filterChange={filterChange}
          filterState={filterState}
          cases={props.cases}
        />
      </FilterWrapper>
      <Cases {...props} cases={filteredCases} />
    </FilterPage>
  );
}
