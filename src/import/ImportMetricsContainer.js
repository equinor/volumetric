import React, { useContext } from 'react';
import ImportStatus from './ImportStatus';
import { AuthContext } from '../auth/AuthContext';
import { PageLink } from '../common/Links';
import { ListPageWithActions } from '../common/Layouts';

const ImportMetricsContainer = () => {
  const { user } = useContext(AuthContext);
  return (
    <ListPageWithActions
      title="Imports"
      links={() => (
        <>
          <PageLink to="/cases">List cases</PageLink>
          <PageLink to="/cases/import/new">Import new case</PageLink>
        </>
      )}
    >
      <ImportStatus user={user.shortName} />
    </ListPageWithActions>
  );
};

export default ImportMetricsContainer;
