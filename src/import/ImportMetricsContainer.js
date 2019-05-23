import React from 'react';
import ImportStatus from './ImportStatus';
import { useUserSettings } from '../auth/AuthContext';
import { PageLink } from '../common/Links';
import { ListPageWithActions } from '../common/Layouts';
import { ALMOST_BLACK } from '../common/variables';

const ImportMetricsContainer = () => {
  const { user, currentField } = useUserSettings();
  return (
    <ListPageWithActions
      title="My imports"
      links={() => (
        <>
          <PageLink color={ALMOST_BLACK} to="/cases">
            All cases
          </PageLink>
          <PageLink to="/cases/import/new">Import new case</PageLink>
        </>
      )}
    >
      <ImportStatus user={user.shortName} field={currentField} />
    </ListPageWithActions>
  );
};

export default ImportMetricsContainer;
