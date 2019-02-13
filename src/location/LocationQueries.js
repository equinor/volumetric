import { gql } from 'apollo-boost';

const METRICS_FRAGMENT = gql`
  fragment AllMetrics on Metrics {
    stoiip
    net
    hcpv
    porv
    bulk
    giip
    associatedgas
    associatedliquid
    recoverable
  }
`;

export const GET_METRICS = gql`
  query Metrics(
    $caseId: Int!
    $faciesNames: [String]
    $regionNames: [String]
    $zoneNames: [String]
    $phase: PhaseEnum!
  ) {
    volumetrics(
      caseId: $caseId
      faciesNames: $faciesNames
      regionNames: $regionNames
      zoneNames: $zoneNames
      phase: $phase
    ) {
      summedVolumetrics {
        realization
        ...AllMetrics
      }
      p90: percentiles(percentile: 90) {
        ...AllMetrics
      }
      p10: percentiles(percentile: 10) {
        ...AllMetrics
      }
      p50: percentiles(percentile: 50) {
        ...AllMetrics
      }
      means {
        ...AllMetrics
      }
    }
  }
  ${METRICS_FRAGMENT}
`;
