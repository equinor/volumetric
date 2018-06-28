import gql from 'graphql-tag';

export const GET_MODELS = gql`
  query Models {
    model {
      id
      name
      faultblocks {
        id
        name
        locations {
          id
          facies
        }
      }
      zones {
        id
        name
        locations {
          id
          facies
        }
      }
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
