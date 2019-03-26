import React from 'react';
import styled from 'styled-components';
import ImportMutation from './ImportMutation';
import { H3 } from '../../common/Headers';
import ImportForm from './ImportForm';

const ImportWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 15vw;
`;

class ImportNewCaseComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filename: null,
      field: null,
      case: '',
      caseVersion: '',
      caseType: props.data.caseTypes[0],
      description: '',
      isOfficial: false,
      officialFromDate: new Date(),
      officialToDate: new Date(),
      isLoading: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(key, selectedOption) {
    this.setState({
      [key]: selectedOption,
    });
  }

  render() {
    const {
      data: { fields, caseTypes },
      user,
    } = this.props;
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
        <ImportMutation {...this.props}>
          {(importCase, data) => {
            return (
              <ImportForm
                formState={this.state}
                importCase={importCase}
                mutationData={data}
                handleFormChange={this.handleChange}
                user={user}
                fields={fields}
                caseTypes={caseTypes}
              />
            );
          }}
        </ImportMutation>
      </ImportWrapper>
    );
  }
}

export default ImportNewCaseComponent;
