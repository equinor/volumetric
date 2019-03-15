import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { CASE_FRAGMENT, GET_FIELDS } from '../common/Queries';
import { SmallSpinner, StyledSpinner } from '../common/Spinner';
import { GraphqlError, NetworkError } from '../common/ErrorHandling';
import styled from 'styled-components';
import { DANGER_COLOR } from '../common/variables';
import gql from 'graphql-tag';
import Icon, { ICONS } from '../common/Icons';
import { PageLink } from '../common/Links';
import { ListPageWithActions } from '../common/Layouts';
import { Table, TH, TD, Row } from '../common/Table';

const DELETE_CASE = gql`
  mutation DeleteCase($id: Int!) {
    deleteCase(id: $id) {
      ok
      case {
        ...Case
      }
    }
  }
  ${CASE_FRAGMENT}
`;

const DeleteButton = styled.button`
  background: white none;
  border: 2px solid ${DANGER_COLOR};
  padding: 10px 10px;
  border-radius: 4px;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  display: flex;
  justify-content: center;
  align-items: center;

  :hover {
    filter: brightness(75%);
  }
`;

function CasesList({ fields }) {
  if (fields.length === 0) {
    return <div>No cases</div>;
  }

  return (
    <Table>
      <thead>
        <Row>
          <TH>Field</TH>
          <TH grow={2}>Case</TH>
          <TH>Version</TH>
          <TH>Type</TH>
          <TH>Imported</TH>
          <TH>Official</TH>
          <TH>Delete</TH>
        </Row>
      </thead>
      <tbody>
        {fields.map(field =>
          field.cases.map(
            (
              {
                id,
                name,
                caseVersion,
                caseType,
                isCurrentlyOfficial,
                createdDate,
              },
              index,
            ) => {
              return (
                <Row key={`case-${id}`}>
                  <TD>{index === 0 && field.name}</TD>
                  <TD grow={2}>{name}</TD>
                  <TD>{caseVersion}</TD>
                  <TD>{caseType}</TD>
                  <TD>{new Date(createdDate).toLocaleDateString()}</TD>
                  <TD>{isCurrentlyOfficial ? 'Yes' : 'No'}</TD>
                  <TD>
                    <Mutation
                      mutation={DELETE_CASE}
                      variables={{ id }}
                      refetchQueries={() => [{ query: GET_FIELDS }]}
                      awaitRefetchQueries={true}
                    >
                      {(deleteCase, { data, loading, error }) => {
                        if (loading) {
                          return <SmallSpinner isLoading={loading} />;
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
                  </TD>
                </Row>
              );
            },
          ),
        )}
      </tbody>
    </Table>
  );
}

function Cases() {
  return (
    <Query query={GET_FIELDS}>
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

        return (
          <ListPageWithActions
            title="Cases"
            links={() => (
              <>
                <PageLink to="/cases/import">List imports</PageLink>
                <PageLink to="/cases/import/new">Import new</PageLink>
              </>
            )}
          >
            <CasesList {...data} />
          </ListPageWithActions>
        );
      }}
    </Query>
  );
}

export default Cases;
