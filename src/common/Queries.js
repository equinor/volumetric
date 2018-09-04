import { gql } from 'apollo-boost';

export const GET_FIELDS = gql`
  query Fields {
    fields(orderBy: "name") {
      name
      models(orderBy: "name") {
        id
        name
        modelVersion
        modelType
        description
        isOfficial
        isCurrentlyOfficial
        faultblocks
        zones
        facies
      }
    }
  }
`;
