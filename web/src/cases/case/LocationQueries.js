import { gql } from 'apollo-boost/lib/index';

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
    $caseIds: [Int]!
    $faciesNames: [String]
    $regionNames: [String]
    $zoneNames: [String]
    $phase: PhaseEnum!
  ) {
    volumetrics(
      caseIds: $caseIds
      faciesNames: $faciesNames
      regionNames: $regionNames
      zoneNames: $zoneNames
      phase: $phase
    ) {
      caseId
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
