import React from 'react';
import { API_URL } from '../../common/variables';
import { FileInput } from './Input';
import styled from 'styled-components';
import { AuthConsumer } from '../../auth/AuthContext';
import { SmallSpinner } from '../../common/Spinner';

const ErrorText = styled.span`
  color: red;
  margin-left: 15px;
`;

const FileSelectorWrapper = styled.div`
  display: flex;
  align-items: center;
`;

class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
    this.handleUpload = this.handleUpload.bind(this);
    this.handleFormChange = props.handleFormChange;
    this.state = {
      errorText: null,
    };
  }

  handleUpload(token, event) {
    event.preventDefault();
    const { onChange } = this.props;

    const data = new FormData();
    const file = this.fileInput.current.files[0];
    data.append('file', file);

    if (file === undefined) {
      return;
    }

    this.handleFormChange('isLoading', true);

    fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: data,
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then(response => {
        response.json().then(body => {
          onChange(body);
        });
      })
      .catch(error => {
        console.error(error);
        this.setState({ errorText: error.message });
      })
      .finally(() => {
        this.handleFormChange('isLoading', false);
      });
  }

  render() {
    return (
      <FileSelectorWrapper>
        <AuthConsumer>
          {({ token }) => (
            <>
              <FileInput
                {...this.props}
                type="file"
                inputRef={this.fileInput}
                onChange={event => this.handleUpload(token, event)}
              />
              {this.state.errorText !== null && (
                <ErrorText>Error: {this.state.errorText}</ErrorText>
              )}
            </>
          )}
        </AuthConsumer>
        {this.props.isLoading && <SmallSpinner isLoading={true} />}
      </FileSelectorWrapper>
    );
  }
}

export default FileUpload;
