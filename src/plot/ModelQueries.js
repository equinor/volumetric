import gql from 'graphql-tag';

export const GET_MODELS = gql`
  {
    model {
      id
      name
      faultblocks {
        id
        name
      }
      zones {
        id
        name
      }
    }
  }
`;

export const GET_FACIES = gql`
  query Locations($zoneId: ID!, $faultblockId: ID!) {
    location(zoneId: $zoneId, faultblockId: $faultblockId) {
      id
      facies
    }
  }
`;

export const GET_METRICS = gql`
  query Metrics($locationId: ID!) {
    volumetric(locationId: $locationId) {
      id
      realization
      grv
      nrv
      npv
      hcpv
      stoiip
    }
  }
`;
