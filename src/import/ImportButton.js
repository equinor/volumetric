import React from 'react';

import { Button } from './common/Input';

const ImportButton = ({ importCase, disabled }) => {
  return (
    <Button disabled={disabled} onClick={importCase}>
      Submit
    </Button>
  );
};

export default ImportButton;
