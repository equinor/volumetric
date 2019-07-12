import { gql } from 'apollo-boost';

export const FULL_CASE_FRAGMENT = gql`
  fragment FullCase on Case {
    id
    name
    fieldName
    caseVersion
    caseType
    description
    isOfficial
    isShared
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
    isShared
    isCurrentlyOfficial
    createdDate
    createdUser
  }
`;

export const GET_FULL_CASES = gql`
  query FullCases($field: String!, $caseIds: [Int]) {
    cases(fieldName: $field, caseIds: $caseIds, orderBy: "name") {
      ...FullCase
    }
  }
  ${FULL_CASE_FRAGMENT}
`;

export const GET_CASES = gql`
  query Cases($field: String!, $caseIds: [Int]) {
    cases(fieldName: $field, caseIds: $caseIds, orderBy: "name") {
      ...ShortCase
    }
  }
  ${SHORT_CASE_FRAGMENT}
`;

export const GET_ROLES = gql`
  query Roles($user: String) {
    roleByUser(user: $user) {
      field
      role
    }
  }
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

export const GET_IMPORTS = gql`
  query Imports($user: String, $field: String, $hours: Int) {
    tasks(user: $user, field: $field, hours: $hours) {
      ...Task
    }
  }
  ${TASK_FRAGMENT}
`;
