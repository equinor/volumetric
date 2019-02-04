import React from 'react';
import {CodeBox, InlineCode} from "./common";
import {H2} from "../common/Headers";

const Intro = () => {
  return (
    <div>
      <H2>API</H2>
      <p>
        The API is available at <InlineCode>/api</InlineCode>.<br/>
        Volumetrics has two different API's. A REST API and a GraphQL API.
        For basic usage we recommend using the REST API.
      </p>
      <p>
        Both API's requires authorization, which is done by setting a HTTP Header.<br/>
        The format is as follows;
      </p>
      <CodeBox>
        {`Authorization: Bearer <My-Personal-And-Very-Secret-Access-Token>`}
      </CodeBox>
    </div>
  )
};

export default Intro;
