import React from 'react';
import { GET_CASES } from '../common/Queries';
import { Query } from 'react-apollo';

import { useUserSettings } from '../auth/AuthContext';
import { StyledSpinner } from '../common/Spinner';
import { GraphqlError, NetworkError } from '../common/ErrorHandling';
import { CaseFilterComponent } from './CaseFilterComponent';
import { NoField } from '../common/NoData';
import { PageLink } from '../common/Links';
import { PRIMARY_COLOR } from '../common/variables';
import { ListPageWithActions } from '../common/Layouts';
import {
  getCompareCases,
  getCompareCasesQueryParams,
} from '../common/queryParams';

function CaseFilterPage(props) {
  const { currentField, user } = useUserSettings();
  const compareCases = getCompareCases(props.history);
  const toggleCompareCase = caseId => {
    const newCompareCases = compareCases.includes(caseId)
      ? compareCases.filter(otherCaseId => otherCaseId !== caseId)
      : [...compareCases, caseId];
    props.history.push(
      `${props.location.pathname}?${getCompareCasesQueryParams(
        newCompareCases,
      )}`,
    );
  };

  if (currentField === 'No field') {
    return <NoField user={user} />;
  }
  return (
    <Query query={GET_CASES} variables={{ field: currentField }}>
      {({ loading, error, data }) => {
        if (loading) return <StyledSpinner isLoading={true} />;
        if (error) {
          return error.networkError ? NetworkError(error) : GraphqlError(error);
        }
        return (
          <ListPageWithActions
            links={() => (
              <>
                <PageLink
                  color={PRIMARY_COLOR}
                  to={`/compare?${getCompareCasesQueryParams(compareCases)}`}
                >
                  Compare
                </PageLink>
              </>
            )}
          >
            <CaseFilterComponent
              {...props}
              cases={data.cases}
              toggleCompareCase={toggleCompareCase}
              compareCases={compareCases}
            />
          </ListPageWithActions>
        );
      }}
    </Query>
  );
}

export default CaseFilterPage;
