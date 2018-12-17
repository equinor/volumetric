import { gql } from 'apollo-boost';

export const GET_FIELDS = gql`
  query Fields {
    fields(orderBy: "name") {
      name
      cases(orderBy: "name") {
        id
        name
        caseVersion
        caseType
        description
        isOfficial
        isCurrentlyOfficial
        regions
        zones
        facies
      }
    }
  }
`;
