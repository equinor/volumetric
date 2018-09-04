import React from 'react';
import { API_URL } from '../../common/variables';
import { FileInput } from './Input';
import styled from 'styled-components';

const ErrorText = styled.span`
  color: red;
  margin-left: 15px;
`;

class FileUpload extends React.Component {
  state = {
    errorText: null,
  };

  constructor() {
    super();
    this.fileInput = React.createRef();
    this.handleUpload = this.handleUpload.bind(this);
  }

  handleUpload(event) {
    event.preventDefault();
    const { onChange } = this.props;

    const data = new FormData();
    const file = this.fileInput.current.files[0];
    data.append('file', file);

    if (file === undefined) {
      return;
    }

    fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: data,
    })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then(response => {
        response.json().then(body => {
          onChange(body.filename);
        });
      })
      .catch(error => {
        console.log(error);
        this.setState({ errorText: error.message });
      });
  }

  render() {
    return (
      <div>
        <FileInput
          {...this.props}
          type="file"
          inputRef={this.fileInput}
          onChange={this.handleUpload}
        />
        {this.state.errorText !== null && (
          <ErrorText>Error: {this.state.errorText}</ErrorText>
        )}
      </div>
    );
  }
}

export default FileUpload;
