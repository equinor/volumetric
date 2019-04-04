import { gql } from 'apollo-boost';

export const FULL_CASE_FRAGMENT = gql`
  fragment FullCase on Case {
    id
    name
    caseVersion
    caseType
    description
    isOfficial
    isCurrentlyOfficial
    createdDate
    regions
    zones
    facies
    phases
    metrics
  }
`;

export const GET_CASE = gql`
  query Case($caseId: Int) {
    case(caseId: $caseId) {
      ...FullCase
    }
  }
  ${FULL_CASE_FRAGMENT}
`;

export const SHORT_CASE_FRAGMENT = gql`
  fragment ShortCase on Case {
    id
    name
    caseVersion
    caseType
    description
    isOfficial
    isCurrentlyOfficial
    createdDate
  }
`;

export const GET_FIELDS = gql`
  query Fields {
    fields(orderBy: "name") {
      name
      cases(orderBy: "name") {
        ...ShortCase
      }
    }
  }
  ${SHORT_CASE_FRAGMENT}
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
