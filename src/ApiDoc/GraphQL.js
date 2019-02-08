import React from 'react';
import { DocH2, CodeBox } from './common';

const GraphQL = () => {
  return (
    <div>
      <h4>GraphQL API</h4>
      <p>
        GraphQL is self documenting. If you want to explore what our GraphQL API
        can do you should connect to it through a GraphQL client, like GraphiQL.
        This is just an example.
      </p>
      <DocH2>Example</DocH2>
      <DocH2>
        Get summed volumetrics, means, and the 95'th percentile from volumetrics
        data in the case with id 1, in the "Tordis_Midtre2" region, that has
        "COAL" and "CALC" facies.
      </DocH2>
      <CodeBox>
        {`query{volumetrics(caseId:1, faciesNames: ["COAL", "CALC"], regionNames: "2015Tordis_Midtre2") {
  caseId
  regionNames
  faciesNames
  summedVolumetrics {
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
  percentiles(percentile:95) {
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
  means {
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
}`}
      </CodeBox>
      <DocH2>Response</DocH2>
      <CodeBox>
        {JSON.stringify(
          {
            data: {
              volumetrics: {
                caseId: 1,
                regionNames: ['2015Tordis_Midtre2'],
                faciesNames: ['COAL', 'CALC'],
                summedVolumetrics: [
                  {
                    bulk: 19542791.27,
                    net: 9771395.63,
                    porv: 1954279.15,
                    hcpv: 646876.84,
                    stoiip: 86525.3,
                    giip: 74090558.73,
                    associatedgas: 20766.08,
                    associatedliquid: 29636223.74,
                    recoverable: 85286689.49,
                  },
                ],
                percentiles: {
                  bulk: 19542791.27,
                  net: 9771395.63,
                  porv: 1954279.15,
                  hcpv: 646876.84,
                  stoiip: 86525.3,
                  giip: 74090558.73,
                  associatedgas: 20766.08,
                  associatedliquid: 29636223.74,
                  recoverable: 85286689.49,
                },
                means: {
                  bulk: 19542791.27,
                  net: 9771395.63,
                  porv: 1954279.15,
                  hcpv: 646876.84,
                  stoiip: 86525.3,
                  giip: 74090558.73,
                  associatedgas: 20766.08,
                  associatedliquid: 29636223.74,
                  recoverable: 85286689.49,
                },
              },
            },
          },
          null,
          2,
        )}
      </CodeBox>
    </div>
  );
};

export default GraphQL;
