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

export const GET_UPLOADS = gql`
  query Uploads($user: String, $hours: Int) {
    tasks(user: $user, hours: $hours) {
      user
      caseName
      complete
      failed
      queuedAt
      id
      message
    }
  }
`;
