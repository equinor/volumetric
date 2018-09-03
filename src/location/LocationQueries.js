import { gql } from 'apollo-boost';

export const GET_METRICS = gql`
  query Metrics(
    $modelId: Int!
    $faciesNames: [String]
    $faultblockNames: [String]
    $zoneNames: [String]
  ) {
    volumetrics(
      modelId: $modelId
      faciesNames: $faciesNames
      faultblockNames: $faultblockNames
      zoneNames: $zoneNames
    ) {
      summedVolumetrics {
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
