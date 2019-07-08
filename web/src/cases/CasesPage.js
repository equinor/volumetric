import React from 'react';
import { CaseContainer } from './case';
import { Route, Switch } from 'react-router';
import CaseFilerPage from './CaseFilterPage';
import { CompareContainer } from '../compare';

const CasesPage = ({ match }) => {
  return (
    <Switch>
      <Route exact path={`${match.path}/`} component={CaseFilerPage} />
      <Route
        exact
        path={`${match.path}/compare`}
        component={CompareContainer}
      />
      <Route exact path={`${match.path}/:caseId`} component={CaseContainer} />
    </Switch>
  );
};

export default CasesPage;
