import gql from 'graphql-tag';

export const GET_FIELDS = gql`
  query Fields {
    field{
        name
    }
  }
`;

export const GET_MODELS = gql`
  query Models($fieldName: String) {
    models (fieldName: $fieldName ){
        name
    }
  }
`;

export const GET_MODEL = gql`
  query Model($modelName: String) {
    model (modelName: $modelName ){
        name
        faultblocks
        zones
        facies
    }
  }
`;

export const GET_METRICS = gql`
  query Metrics($modelName: String, $faciesName: [String], $faultblockName: [String], $zoneName: [String]) {
    calcOnVolumetrics(modelName: $modelName, faciesName: $faciesName, faultblockName: $faultblockName, zoneName: $zoneName) {
       volumetrics{
           realization
           grv
           nrv
           npv
           hcpv
           stoiip
       }
        p90: percentiles(percentile: 90) {
            stoiip
            nrv
            hcpv
            npv
            grv
        }
        p10: percentiles(percentile: 10) {
            stoiip
            nrv
            hcpv
            npv
            grv
        }
        p50: percentiles(percentile: 50) {
            stoiip
            nrv
            hcpv
            npv
            grv
        }
        means {
            stoiip
            nrv
            hcpv
            npv
            grv
        }
    }
  }
`;

export const GET_FACIES = gql`
  query Facies($locationId: ID!) {
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
