import React, { useContext } from 'react';
import { Query, Mutation } from 'react-apollo';
import { FULL_CASE_FRAGMENT, GET_FIELDS } from '../common/Queries';
import { SmallSpinner, StyledSpinner } from '../common/Spinner';
import { GraphqlError, NetworkError } from '../common/ErrorHandling';
import { ALMOST_BLACK, DANGER_COLOR } from '../common/variables';
import gql from 'graphql-tag';
import Icon, { ICONS } from '../common/Icons';
import { PageLink } from '../common/Links';
import { ListPageWithActions } from '../common/Layouts';
import { Table, TH, OverflowTD, Row } from '../common/Table';
import { getFormattedDate } from '../utils/date';
import { AuthContext } from '../auth/AuthContext';
import { GET_CASES } from '../common/Queries';
import { useFieldValue } from '../field/FieldContext';
import { DeleteButton } from '../common/Buttons';

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

function CasesList({ fields, user }) {
  if (fields.length === 0) {
    return <div>No cases</div>;
  }

  return (
    <Table>
      <thead>
        <Row>
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
                createdUser.toUpperCase() === user.shortName ||
                user.isFieldAdmin
              );
              return (
                <Row key={`case-${id}`}>
                  <OverflowTD grow={2}>{name}</OverflowTD>
                  <OverflowTD>{caseVersion}</OverflowTD>
                  <OverflowTD>{caseType}</OverflowTD>
                  <OverflowTD>{getFormattedDate(createdDate)}</OverflowTD>
                  <OverflowTD>{isCurrentlyOfficial ? 'Yes' : 'No'}</OverflowTD>
                  <OverflowTD>
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
          ),
        )}
      </tbody>
    </Table>
  );
}

function Cases() {
  const { user } = useContext(AuthContext);
  const [{ currentField }] = useFieldValue();
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

        return (
          <ListPageWithActions
            title="Cases"
            links={() => (
              <>
                <PageLink color={ALMOST_BLACK} to="/cases/import">
                  My imports
                </PageLink>
                <PageLink to="/cases/import/new">Import new</PageLink>
              </>
            )}
          >
            <CasesList {...data} user={user} />
          </ListPageWithActions>
        );
      }}
    </Query>
  );
}

export default Cases;
