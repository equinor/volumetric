import React from 'react';
import { Link } from 'react-router-dom';
import { Mutation, Query } from 'react-apollo';
import { FULL_CASE_FRAGMENT, GET_CASES } from '../common/Queries';
import { SmallSpinner, StyledSpinner } from '../common/Spinner';
import { GraphqlError, NetworkError } from '../common/ErrorHandling';
import { ALMOST_BLACK, DANGER_COLOR } from '../common/variables';
import gql from 'graphql-tag';
import Icon, { ICONS } from '../common/Icons';
import { PageLink } from '../common/Links';
import { ListPageWithActions } from '../common/Layouts';
import { OverflowTD, Row, Table, TH } from '../common/Table';
import { getFormattedDate } from '../utils/date';
import { useUserSettings } from '../auth/AuthContext';
import { DeleteButton } from '../common/Buttons';
import { H4 } from '../common/Headers';
import styled from 'styled-components';

const DELETE_CASE = gql`
  mutation DeleteCase($id: Int!) {
    deleteCase(id: $id) {
      ok
      case {
        ...FullCase
      }
    }
  }
  ${FULL_CASE_FRAGMENT}
`;

const SubListHeader = styled(H4)`
  margin-top: 50px;
  margin-bottom: 5px;
  font-size: 17px;
  margin-left: 5px;
`;

const CaseTable = styled(Table)`
  margin-bottom: 70px;
`;

function CasesList({ cases, user, currentField, isOfficials }) {
  if (cases.length === 0) {
    return <div style={{ marginLeft: '5px' }}>No cases</div>;
  }

  return (
    <CaseTable>
      <thead>
        <Row>
          <TH grow={2}>Case</TH>
          <TH>Version</TH>
          <TH>Type</TH>
          <TH>Imported</TH>
          {isOfficials && <TH>Currently official</TH>}
          <TH>View</TH>
          <TH>Delete</TH>
        </Row>
      </thead>
      <tbody>
        {cases.map(
          ({
            id,
            name,
            caseVersion,
            caseType,
            isCurrentlyOfficial,
            createdDate,
            createdUser,
          }) => {
            // If the user did not import the case, or the user is not a FieldAdmin, the "DeleteButton" is disabled.
            const disableDelete = !(
              createdUser.toUpperCase() === user.shortName || user.isFieldAdmin
            );
            return (
              <Row key={`case-${id}`}>
                <OverflowTD grow={2}>{name}</OverflowTD>
                <OverflowTD>{caseVersion}</OverflowTD>
                <OverflowTD>{caseType}</OverflowTD>
                <OverflowTD>{getFormattedDate(createdDate)}</OverflowTD>
                {isOfficials && (
                  <OverflowTD>{isCurrentlyOfficial ? 'Yes' : 'No'}</OverflowTD>
                )}
                <OverflowTD>
                  <Link to={`/case/${id}`}>View</Link>
                </OverflowTD>
                <OverflowTD>
                  <Mutation
                    mutation={DELETE_CASE}
                    variables={{ id }}
                    refetchQueries={() => [
                      {
                        query: GET_CASES,
                        variables: { field: currentField },
                      },
                    ]}
                    awaitRefetchQueries={true}
                  >
                    {(deleteCase, { data, loading, error }) => {
                      if (loading) {
                        return <SmallSpinner isLoading={loading} />;
                      }
                      if (error) {
                        return error.networkError ? (
                          <NetworkError {...error} />
                        ) : (
                          <GraphqlError {...error} />
                        );
                      }
                      return (
                        <DeleteButton
                          onClick={() => {
                            if (
                              window.confirm(
                                'Are you sure you want to delete this case?',
                              )
                            ) {
                              deleteCase();
                            }
                          }}
                          disabled={disableDelete}
                        >
                          <Icon
                            icon={ICONS.cross}
                            color={DANGER_COLOR}
                            size={12}
                          />
                        </DeleteButton>
                      );
                    }}
                  </Mutation>
                </OverflowTD>
              </Row>
            );
          },
        )}
      </tbody>
    </CaseTable>
  );
}

function Cases() {
  const { user, currentField } = useUserSettings();
  return (
    <Query query={GET_CASES} variables={{ field: currentField }}>
      {({ loading, error, data }) => {
        if (loading) {
          return <StyledSpinner isLoading={true} />;
        }
        if (error) {
          return error.networkError ? (
            <NetworkError {...error} />
          ) : (
            <GraphqlError {...error} />
          );
        }

        const cases = data.cases;

        return (
          <ListPageWithActions
            title="All cases"
            links={() => (
              <>
                <PageLink color={ALMOST_BLACK} to="/cases/import">
                  My imports
                </PageLink>
                <PageLink to="/cases/import/new">Import new case</PageLink>
              </>
            )}
          >
            <SubListHeader>Official cases</SubListHeader>
            <CasesList
              cases={cases.filter(_case => _case.isOfficial === true)}
              user={user}
              currentField={currentField}
              isOfficials
            />
            <SubListHeader>Shared cases</SubListHeader>
            <CasesList
              cases={cases.filter(_case => !_case.isOfficial && _case.isShared)}
              user={user}
              currentField={currentField}
            />
            <SubListHeader>My cases</SubListHeader>
            <CasesList
              cases={cases.filter(
                _case => !_case.isOfficial && !_case.isShared,
              )}
              user={user}
              currentField={currentField}
            />
          </ListPageWithActions>
        );
      }}
    </Query>
  );
}

export default Cases;
