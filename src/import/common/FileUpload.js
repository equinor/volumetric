import React from 'react';
import { API_URL } from '../../common/variables';
import { FileInput } from './Input';

class FileUpload extends React.Component {
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
      });
  }

  render() {
    return (
      <FileInput
        {...this.props}
        type="file"
        inputRef={this.fileInput}
        onChange={this.handleUpload}
      />
    );
  }
}

export default FileUpload;
