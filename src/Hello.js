import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";

const GET_HELLO = gql`
  {
    hello
  }
`;

const Hello = () => (
  <Query query={GET_HELLO}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;
      return <div>{data.hello}</div>;
    }}
  </Query>
);

export default Hello;
