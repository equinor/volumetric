import React from 'react';
import styled from 'styled-components';
import {H2} from '../common/Headers';

const Response = styled.h2`
   color: #3c4146;
   font-size: 18px;
   font-weight: 300;
   margin-bottom: 0;
`;

const Heavy = styled.b`
  font-weight: 200;
  font-size: 18px;
  color: #3c4146;
`;

const CodeBox = styled.pre`
  font-size: 13px;
  border: 1px solid #cacaca;
  line-height: 1.4em;
  padding: 10px;
  overflow: auto;
  border-radius: 3px;
  background-color: #fafafb;
  color: #393939;
  margin-top: 0;
  font-family: Consolas,"Liberation Mono",Menlo,Courier,monospace;
`;

const ApiDoc = () => {
  return (
    <div>
      <H2>API</H2>
      <p>
        The API is available at <Heavy>https://volumetric.equinor.com/api.</Heavy><br/>
        Volumetrics has two different API's. A REST API and a GraphQL API.
        For basic usage we recommend using the REST API.
      </p>
      <h4>REST API</h4>
        <Response>Get a single case</Response>
          <CodeBox>
            GET /api/case/:case_id
          </CodeBox>
        <Response>Example</Response>
          <CodeBox>
            curl https://volumetric.equinor.com/api/case/1
          </CodeBox>
        <Response>Response</Response>
          <CodeBox>
            {JSON.stringify(
              {
                "case":{
                  "id":1,
                  "name":"sf01rms_faciesseed",
                  "created_user":"anon",
                  "case_type":"SEGMENT",
                  "created_date":"2019-01-22T08:51:24.193246+00:00",
                  "case_version":"first",
                  "description":"This is a case description",
                  "is_official":true,
                  "official_from_date":"2012-04-23T18:25:43.511000+00:00",
                  "official_to_date":null,
                  "field_name":"Tordis",
                  "locations":[
                    {
                      "id":1,
                      "region_name":"2015Tordis_Midtre2",
                      "zone_name":"Below_Brent_3_1",
                      "facies_name":null,
                      "license":"Custom license",
                      "realizations":[
                        {
                          "id":1,
                          "realization":0,
                          "iteration":1,
                          "volumetrics":[
                            {
                              "id":1,
                              "phase":"GAS",
                              "bulk":1355281.01,
                              "net":342588.80,
                              "porv":101009.62,
                              "hcpv":74624.52,
                              "stoiip":57848.47,
                              "giip":null,
                              "associatedgas":null,
                              "associatedliquid":null,
                              "recoverable":null
                            }
                            ]
                        }
                        ]
                    }
                  ]
                }
              }, null, 2)}
          </CodeBox>
      <h4>GraphQL API</h4>
      <p>
        GraphQL is self documenting. If you want to explore what our GraphQL API can do you should connect to it through
        a GraphQL client, like GraphiQL. This is just an example.
      </p>
      <Response>Example</Response>
      <Response>
        Get summed volumetrics, means, and the 95'th percentile from volumetrics data in the case with id 1, in
        the "Tordis_Midtre2" region, that has "COAL" and "CALC" facies.
      </Response>
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
}`
            }</CodeBox>
      <Response>Response</Response>
      <CodeBox>
        {JSON.stringify(
          {
            "data": {
              "volumetrics": {
                "caseId": 1,
                "regionNames": [
                  "2015Tordis_Midtre2"
                ],
                "faciesNames": [
                  "COAL",
                  "CALC"
                ],
                "summedVolumetrics": [
                  {
                    "bulk": 19542791.27,
                    "net": 9771395.63,
                    "porv": 1954279.15,
                    "hcpv": 646876.84,
                    "stoiip": 86525.3,
                    "giip": 74090558.73,
                    "associatedgas": 20766.08,
                    "associatedliquid": 29636223.74,
                    "recoverable": 85286689.49
                  }
                ],
                "percentiles": {
                  "bulk": 19542791.27,
                  "net": 9771395.63,
                  "porv": 1954279.15,
                  "hcpv": 646876.84,
                  "stoiip": 86525.3,
                  "giip": 74090558.73,
                  "associatedgas": 20766.08,
                  "associatedliquid": 29636223.74,
                  "recoverable": 85286689.49
                },
                "means": {
                  "bulk": 19542791.27,
                  "net": 9771395.63,
                  "porv": 1954279.15,
                  "hcpv": 646876.84,
                  "stoiip": 86525.3,
                  "giip": 74090558.73,
                  "associatedgas": 20766.08,
                  "associatedliquid": 29636223.74,
                  "recoverable": 85286689.49
                }
              }
            }
          }, null, 2)}
      </CodeBox>
    </div>
  );
};

export default ApiDoc;
