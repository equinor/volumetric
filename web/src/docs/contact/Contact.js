import React from 'react';
import { H2 } from '../../common/Headers';
import styled from 'styled-components';

const Bold = styled.span`
  font-family: Equinor-Medium;
  font-weight: 400;
`;

const Contact = () => {
  return (
    <div>
      <H2 id="contact">Get help or report a bug</H2>
      <p>
        The Volumetric project is still under development and is not ready for
        use in production.
      </p>
      <p>
        We encourage all users to report bugs and provide feedback in our Slack
        channel. It is also possible to ask for help there.
      </p>
      <p>
        <Bold>Slack: </Bold>The channel{' '}
        <a
          href="https://equinor.slack.com/messages/volumetric"
          target="_blank"
          rel="noopener noreferrer"
        >
          #volumetric
        </a>
      </p>
    </div>
  );
};

export default Contact;
