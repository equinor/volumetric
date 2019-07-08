import React from 'react';
import ImportStatus from './ImportStatus';
import { useUserSettings } from '../auth/AuthContext';
import { PageLink } from '../common/Links';
import { ListPageWithActions } from '../common/Layouts';
import { Route } from 'react-router';
import { ImportNewCase } from './index';

const ImportMetricsContainer = ({ match }) => {
  const { user, currentField } = useUserSettings();
  return (
    <div>
      <Route
        exact
        path={`${match.path}/`}
        render={() => (
          <ListPageWithActions
            title="My imports"
            links={() =>
              user.isCreator && (
                <PageLink to={`${match.url}/new`}>Import new case</PageLink>
              )
            }
          >
            <ImportStatus user={user.shortName} field={currentField} />
          </ListPageWithActions>
        )}
      />
      {user.isCreator && (
        <Route
          exact
          path={`${match.path}/new`}
          render={routerProps => <ImportNewCase {...routerProps} />}
        />
      )}
    </div>
  );
};

export default ImportMetricsContainer;
