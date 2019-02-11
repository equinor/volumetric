import React from 'react';
import styled from 'styled-components';
import ImportMutation from './ImportMutation';
import { H2 } from '../common/Headers';
import moment from 'moment';
import { AuthConsumer } from '../auth/AuthContext';
import ImportForm from './ImportForm';
import { Link } from 'react-router-dom';

const ImportWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

class ImportMetricsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filename: null,
      field: null,
      case: null,
      caseVersion: null,
      caseType: props.data.caseTypes[0],
      description: null,
      isOfficial: false,
      officialFromDate: moment(),
      officialToDate: moment(),
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
    } = this.props;
    return (
      <AuthConsumer>
        {({ user }) => (
          <ImportWrapper>
            <H2>Import metrics</H2>
            <p>
              Files that are going to be imported must conform to the
              FMU-standard. This standard can be found here;
              <a href="https://wiki.equinor.com/wiki/index.php/FMU_standards#Volumetric_files">
                wiki.equinor.com/wiki/index.php/FMU_standards#Volumetric_files.
              </a>
            </p>
            <p>
              The only required headers in the CSV-file are "REGION" and "ZONE".
              Any of the metric headers may be omitted. Case metadata will be
              added through the web form.
            </p>
            <ImportMutation {...this.props}>
              {(importCase, data) => {
                if (
                  data &&
                  !data.importCase.validationError &&
                  data.importCase.ok
                ) {
                  return (
                    <div>
                      The case is being imported,{' '}
                      <Link to="/">go here to see it!</Link>
                    </div>
                  );
                }

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
        )}
      </AuthConsumer>
    );
  }
}

export default ImportMetricsComponent;
