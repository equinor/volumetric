import React from 'react';

import { Button } from './common/Input';

const ImportButton = ({ importModel, disabled }) => {
  return (
    <Button disabled={disabled} onClick={importModel}>
      Submit
    </Button>
  );
};

export default ImportButton;
