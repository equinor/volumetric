import React from 'react';
import { CreatableSelect } from './common/CreatableSelect';
import FileUpload from './common/FileUpload';
import ImportButton from './ImportButton';
import { TextInput } from './common/Input';
import styled from 'styled-components';
import { StyledSpinner } from '../common/Spinner';
import { Redirect } from 'react-router';

const ImportWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputWrapper = styled.div`
  display: flex;
  margin: 20px 0;
`;

class ImportMetricsComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      field: null,
      model: null,
      filename: null,
      mutationStatus: '',
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
      data: { fields },
    } = this.props;

    switch (this.state.mutationStatus) {
      case 'error':
        return <div>Something went wrong!</div>;
      case 'loading':
        return <StyledSpinner isLoading={true} />;
      case 'done':
        return (
          <Redirect
            to={{
              pathname: '/',
              state: { field: this.state.field, model: this.state.model },
            }}
          />
        );
      default:
        return (
          <ImportWrapper>
            <h2>Import metrics</h2>
            <InputWrapper>
              <CreatableSelect
                label="Field"
                options={fields}
                selectedOption={this.state.field}
                onChange={selected =>
                  this.handleChange('field', selected.value)
                }
                placeholder="Select or create a field..."
              />
            </InputWrapper>
            <InputWrapper>
              <TextInput
                label="Model"
                onChange={e => this.handleChange('model', e.target.value)}
              />
            </InputWrapper>
            <InputWrapper>
              <FileUpload
                style={{ width: '100%' }}
                filename={this.state.filename}
                onChange={filename => this.handleChange('filename', filename)}
              />
            </InputWrapper>
            <InputWrapper>
              <ImportButton
                {...this.state}
                setMutationStatus={mutationStatus =>
                  this.setState({ mutationStatus: mutationStatus })
                }
              />
            </InputWrapper>
          </ImportWrapper>
        );
    }
  }
}

export default ImportMetricsComponent;
