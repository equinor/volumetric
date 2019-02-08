import React from 'react';
import { H2 } from '../common/Headers';

const Contact = () => {
  return (
    <div>
      <H2>Get help or report a bug</H2>
      <p>
        The Volumetric project is still under development and is not ready for
        use in production.
      </p>
      <p>
        We encourage all users to report bugs and provide feedback in our Slack
        channel. It is also possible to ask for help there.
      </p>
      <p>
        <b>Slack: </b>The channel #volumetric_develop
      </p>
      <p>
        <b>Email: </b>volumetric_develop@equinor.com
      </p>
    </div>
  );
};

export default Contact;
