import React, { useState } from 'react';
import CaseSelector from './CaseSelector';
import CaseContainer from './CaseContainer';
import CaseInfo from './CaseInfo';
import { NoDataDiv } from './LocationContainer';

const LocationComponent = ({ cases, linkedCase }) => {
  if (cases.length === 0) {
    return (
      <NoDataDiv>
        <p>There are no cases for this field yet</p>
      </NoDataDiv>
    );
  }

  let defaultCase;

  if (linkedCase) {
    defaultCase = cases.find(otherCase => otherCase.id === linkedCase);
  } else {
    defaultCase = cases[0];
  }

  const [currentCase, setCurrentCase] = useState(defaultCase);

  const handleCaseChange = value => {
    const currentCase = cases.find(otherCase => otherCase.id === value.value);
    setCurrentCase(currentCase);
  };

  return (
    <div>
      <CaseSelector
        cases={cases}
        handleChange={handleCaseChange}
        currentCase={currentCase}
      />
      <CaseInfo currentCase={currentCase} />
      <CaseContainer caseId={currentCase.id} />
    </div>
  );
};

export default LocationComponent;
