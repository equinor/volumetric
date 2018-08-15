import React from 'react';
import { StyledSpinner } from './Spinner';

class AsyncRender extends React.Component {
  /**
   * Delay the rendering of render prop, showing a Spinner while rendering.
   * @param props
   */
  constructor(props) {
    super();
    this.state = {
      shouldRender: false,
    };
  }

  renderCallback() {
    setTimeout(() => {
      this.setState(() => ({
        shouldRender: true,
      }));
    }, 0);
  }

  componentDidMount() {
    this.renderCallback();
  }

  render() {
    return (
      <StyledSpinner isLoading={!this.state.shouldRender}>
        {this.props.render()}
      </StyledSpinner>
    );
  }
}

export default AsyncRender;
