import React from 'react';
import {CodeBox, DocH2} from "./common";

const RestApi = () => {
  return (
    <div>
      <h4>REST API</h4>
      <DocH2>Get a single case</DocH2>
      <CodeBox>
        GET /api/case/:case_id
      </CodeBox>
      <DocH2>Example</DocH2>
      <CodeBox>
        curl -H "Authorization: Bearer
        eyJ0eXAiOiJKV1QiLCJh.eyJhdWQiOiJjMDQ5ZODdiYzFjODU0M2M.Do4kieCvC-FUOeohH9QG-Myh"
        https://volumetric.equinor.com/api/case/1
      </CodeBox>
      <DocH2>Response</DocH2>
      <CodeBox>
        {JSON.stringify(
          {
            "case": {
              "id": 1,
              "name": "sf01rms_faciesseed",
              "created_user": "anon",
              "case_type": "SEGMENT",
              "created_date": "2019-01-22T08:51:24.193246+00:00",
              "case_version": "first",
              "description": "This is a case description",
              "is_official": true,
              "official_from_date": "2012-04-23T18:25:43.511000+00:00",
              "official_to_date": null,
              "field_name": "Tordis",
              "locations": [
                {
                  "id": 1,
                  "region_name": "2015Tordis_Midtre2",
                  "zone_name": "Below_Brent_3_1",
                  "facies_name": null,
                  "license": "Custom license",
                  "realizations": [
                    {
                      "id": 1,
                      "realization": 0,
                      "iteration": 1,
                      "volumetrics": [
                        {
                          "id": 1,
                          "phase": "GAS",
                          "bulk": 1355281.01,
                          "net": 342588.80,
                          "porv": 101009.62,
                          "hcpv": 74624.52,
                          "stoiip": 57848.47,
                          "giip": null,
                          "associatedgas": null,
                          "associatedliquid": null,
                          "recoverable": null
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          }, null, 2)}
      </CodeBox>
    </div>
  )
};

export default RestApi;