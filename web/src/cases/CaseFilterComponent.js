import React, { useState } from 'react';
import styled from 'styled-components';
import { CaseItem } from './CaseItem';
import { Filter } from '../common/filters';
import { FilterPage, FilterWrapper } from './case/CaseComponent';
import { getVisibility } from '../common/visibility';
import { GET_CASES, SHORT_CASE_FRAGMENT } from '../common/Queries';
import { Mutation } from 'react-apollo';
import { useUserSettings } from '../auth/AuthContext';
import { gql } from 'apollo-boost';
import { errorToast } from '../common/toasts';

const CasesStyled = styled.div`
  width: 100%;
`;

const DELETE_CASE = gql`
  mutation DeleteCase($id: Int!) {
    deleteCase(id: $id) {
      ok
      case {
        ...ShortCase
      }
    }
  }
  ${SHORT_CASE_FRAGMENT}
`;

const Cases = props => {
  const { cases, toggleCompareCase, compareCases } = props;
  const { currentField } = useUserSettings();

  if (cases.length === 0) {
    return <CasesStyled>No cases..</CasesStyled>;
  }
  return (
    <Mutation
      mutation={DELETE_CASE}
      update={(cache, { data: { deleteCase } }) => {
        const query = { query: GET_CASES, variables: { field: currentField } };
        const { cases } = cache.readQuery(query);
        cache.writeQuery({
          ...query,
          data: {
            cases: cases.filter(_case => _case.id !== deleteCase.case.id),
          },
        });
      }}
      onError={() => errorToast('Failed to delete case.')}
    >
      {deleteCase => {
        return (
          <CasesStyled>
            {cases.map(_case => (
              <CaseItem
                {...props}
                key={_case.id}
                _case={_case}
                toggleCompareCase={() => toggleCompareCase(_case.id)}
                checked={compareCases.includes(_case.id)}
                deleteCase={id =>
                  deleteCase({
                    variables: { id },
                    optimisticResponse: {
                      deleteCase: {
                        ok: true,
                        case: {
                          ..._case,
                          __typename: 'Case',
                        },
                        __typename: 'DeleteCase',
                      },
                    },
                  })
                }
              />
            ))}
          </CasesStyled>
        );
      }}
    </Mutation>
  );
};

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
