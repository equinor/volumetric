import { gql } from 'apollo-boost';

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
        bulk
        net
        porv
        hcpv
        stoiip
        giip
        associatedgas
        associatedliquid
        recoverable
      }
      p90: percentiles(percentile: 90) {
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
      p10: percentiles(percentile: 10) {
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
      p50: percentiles(percentile: 50) {
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
      means {
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
    }
  }
`;
