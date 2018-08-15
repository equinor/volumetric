import React from 'react';
import { labelFormater } from '../utils/text';
import { ALMOST_BLACK } from './variables';
import styled from 'styled-components';

const FormatedTextStyle = styled.div`
  padding: 3px 0 3px 6px;
  border-left: 3px solid ${ALMOST_BLACK};
  cursor: pointer;
  min-width: 10em;
`;

const FormatedTextLabel = styled.span`
  font-weight: bold;
`;

export class FormatedText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formatLabel: true,
    };
  }

  render() {
    const { value, label } = this.props;

    return (
      <FormatedTextStyle
        onClick={() => this.setState({ formatLabel: !this.state.formatLabel })}
      >
        <FormatedTextLabel>{label}: </FormatedTextLabel>
        {this.state.formatLabel ? labelFormater(value) : value}
      </FormatedTextStyle>
    );
  }
}
