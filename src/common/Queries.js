import { gql } from 'apollo-boost';

export const GET_FIELDS = gql`
  query Fields {
    fields(orderBy: "name") {
      name
      models(orderBy: "name") {
        name
        faultblocks
        zones
        facies
      }
    }
  }
`;
