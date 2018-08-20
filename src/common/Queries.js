import { gql } from 'apollo-boost';

export const GET_FIELDS = gql`
  query Fields {
    fields {
      name
      models {
        name
        faultblocks
        zones
        facies
      }
    }
  }
`;
