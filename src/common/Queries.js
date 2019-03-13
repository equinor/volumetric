import { gql } from 'apollo-boost';

export const CASE_FRAGMENT = gql`
  fragment Case on Case {
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
    phases
    metrics
  }
`;

export const GET_FIELDS = gql`
  query Fields {
    fields(orderBy: "name") {
      name
      cases(orderBy: "name") {
        ...Case
      }
    }
  }
  ${CASE_FRAGMENT}
`;

export const TASK_FRAGMENT = gql`
  fragment Task on Task {
    id
    user
    caseName
    complete
    failed
    queuedAt
    message
  }
`;

export const GET_UPLOADS = gql`
  query Uploads($user: String, $hours: Int) {
    tasks(user: $user, hours: $hours) {
      ...Task
    }
  }
  ${TASK_FRAGMENT}
`;
