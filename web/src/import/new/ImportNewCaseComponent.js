import React, { useReducer } from 'react';
import styled from 'styled-components';
import ImportMutation from './ImportMutation';
import { H3 } from '../../common/Headers';
import ImportForm from './ImportForm';

const ImportWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 15vw;
`;

function reducer(state, action) {
  switch (action.type) {
    case 'VISIBILITY':
      switch (action.visibility) {
        case 'private':
          return {
            ...state,
            formState: {
              ...state.formState,
              isShared: false,
              isOfficial: false,
            },
          };
        case 'shared':
          return {
            ...state,
            formState: {
              ...state.formState,
              isShared: true,
              isOfficial: false,
            },
          };
        case 'official':
          return {
            ...state,
            formState: {
              ...state.formState,
              isShared: true,
              isOfficial: true,
            },
          };
        default:
          throw new Error(`${action.visibility} is not allowed`);
      }
    case 'RESET_HAS_CHANGED':
      return {
        ...state,
        hasChanged: {
          filename: false,
          version: false,
        },
      };
    default:
      return {
        ...state,
        formState: {
          ...state.formState,
          [action.key]: action.selectedOption,
        },
        hasChanged: {
          ...state.hasChanged,
          [action.key]: true,
        },
      };
  }
}

const ImportNewCaseComponent = props => {
  const { data, user, currentField } = props;
  const { caseTypes } = data;
  const initialState = {
    formState: {
      filename: null,
      filehash: null,
      field: currentField,
      case: '',
      caseVersion: '',
      caseType: data.caseTypes[0],
      description: '',
      isOfficial: false,
      isShared: false,
      officialFromDate: new Date(),
      officialToDate: new Date(),
      isLoading: false,
    },
    hasChanged: {
      filename: false,
      caseVersion: false,
    },
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ImportWrapper>
      <H3>Import metrics</H3>
      <p>
        Files that are going to be imported must conform to the FMU-standard.
        This standard can be found here;{' '}
        <a href="https://wiki.equinor.com/wiki/index.php/FMU_standards#Volumetric_files">
          wiki.equinor.com/wiki/index.php/FMU_standards#Volumetric_files.
        </a>
      </p>
      <p>
        The only required headers in the CSV-file are "REGION" and "ZONE". Any
        of the metric headers may be omitted. Case metadata will be added
        through the web form.
      </p>
      <ImportMutation {...props}>
        {(importCase, data) => {
          return (
            <ImportForm
              formState={state.formState}
              hasChanged={state.hasChanged}
              resetHasChanged={() => dispatch({ type: 'RESET_HAS_CHANGED' })}
              setVisibility={visibility =>
                dispatch({ type: 'VISIBILITY', visibility })
              }
              importCase={importCase}
              mutationData={data}
              handleFormChange={(key, selectedOption) =>
                dispatch({ key, selectedOption })
              }
              user={user}
              currentField={currentField}
              caseTypes={caseTypes}
            />
          );
        }}
      </ImportMutation>
    </ImportWrapper>
  );
};

export default ImportNewCaseComponent;
