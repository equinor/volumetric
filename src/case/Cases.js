import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { CASE_FRAGMENT, GET_FIELDS } from '../common/Queries';
import { SmallSpinner, StyledSpinner } from '../common/Spinner';
import { GraphqlError, NetworkError } from '../common/ErrorHandling';
import styled from 'styled-components';
import { DANGER_COLOR, LIST_SEPARATOR_COLOR } from '../common/variables';
import gql from 'graphql-tag';
import Icon, { ICONS } from '../common/Icons';

const UL = styled.ul`
  list-style-type: none;
`;

const Case = styled.li`
  display: flex;
  padding: 20px;
  border-bottom: 1px solid ${LIST_SEPARATOR_COLOR};
`;

const CaseDescriptionStyled = styled.div`
  flex: 1;
`;

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
  background: ${DANGER_COLOR} none;
  color: white;
  border: none;
  padding: 15px 15px;
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

function CaseDescription({ label, value }) {
  return (
    <CaseDescriptionStyled>
      <div>{label}:</div>
      <div>{value}</div>
    </CaseDescriptionStyled>
  );
}

function CasesList({ fields }) {
  if (fields.length === 0) {
    return <div>No cases</div>;
  }

  return (
    <div>
      <h2>Cases</h2>
      <UL>
        {fields.map(field => (
          <li key={`field-${field.id}`}>
            <h3>
              <b>{field.name}</b>
            </h3>
            <UL>
              {field.cases.map(
                ({ id, name, caseVersion, caseType, isCurrentlyOfficial }) => {
                  return (
                    <Case key={`case-${id}`}>
                      <CaseDescription label="Name" value={name} />
                      <CaseDescription label="Version" value={caseVersion} />
                      <CaseDescription label="Type" value={caseType} />
                      <CaseDescription
                        label="Official"
                        value={isCurrentlyOfficial ? 'Yes' : 'No'}
                      />
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
                              <Icon icon={ICONS.cross} color="white" />
                            </DeleteButton>
                          );
                        }}
                      </Mutation>
                    </Case>
                  );
                },
              )}
            </UL>
          </li>
        ))}
      </UL>
    </div>
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

        return <CasesList {...data} />;
      }}
    </Query>
  );
}

export default Cases;
