import {GET_FACIES, GET_METRICS, GET_MODELS} from '../plot/ModelQueries';


export const modelMocks = [
  {
    request: {
      query: GET_MODELS,
    },
    result: {
      data: {
        model: {
          "id": 52,
          "name": "cce11_unc",
          "faultblocks": [
            {
              "id": 607, "name": "Region1"
            },
            {
              "id": 608, "name": "Region2"
            }
          ],
          "zones": [
            {
              "id": "451", "name": "MaureenFm3"
            },
            {
              "id": "452", "name": "MaureenFm2"
            }
          ],
        },
      },
    },
  },
];

export const faciesMocks = [
  {
    request: {
      query: GET_FACIES,
    },
    result: {
      data: {
        "location": [{"id": "11845", "facies": "mudstone", "__typename": "LocationType"}, {
          "id": "11846",
          "facies": "calcite",
          "__typename": "LocationType"
        }, {"id": "11847", "facies": "CalcSlump", "__typename": "LocationType"}, {
          "id": "11848",
          "facies": "Orange",
          "__typename": "LocationType"
        }],
      },
    },
  },
];

export const volumetricsMocks = [
  {
    request: {
      query: GET_METRICS,
    },
    result: {
      data: {
        "volumetric": [{
          "id": 3225638,
          "realization": 0,
          "grv": 846092.59,
          "nrv": null,
          "npv": 846092.59,
          "hcpv": 306117.26,
          "stoiip": 225233.86,
          "__typename": "VolumetricType"
        }, {
          "id": 3225974,
          "realization": 1,
          "grv": 204609.76,
          "nrv": null,
          "npv": 204609.76,
          "hcpv": 76270.83,
          "stoiip": 57865.63,
          "__typename": "VolumetricType"
        }, {
          "id": 3226310,
          "realization": 2,
          "grv": 386774.96,
          "nrv": null,
          "npv": 386774.96,
          "hcpv": 134865.46,
          "stoiip": 97738.57,
          "__typename": "VolumetricType"
        }, {
          "id": 3226646,
          "realization": 3,
          "grv": 962742.64,
          "nrv": null,
          "npv": 962742.64,
          "hcpv": 355179.82,
          "stoiip": 310229.54,
          "__typename": "VolumetricType"
        }, {
          "id": 3226982,
          "realization": 5,
          "grv": 1477630.76,
          "nrv": null,
          "npv": 1477630.76,
          "hcpv": 534430.88,
          "stoiip": 425457.41,
          "__typename": "VolumetricType"
        }, {
          "id": 3227318,
          "realization": 6,
          "grv": 1022197.53,
          "nrv": null,
          "npv": 1022197.53,
          "hcpv": 368899.23,
          "stoiip": 292269.62,
          "__typename": "VolumetricType"
        }, {
          "id": 3227654,
          "realization": 7,
          "grv": 2074122.95,
          "nrv": null,
          "npv": 2074122.95,
          "hcpv": 756816.99,
          "stoiip": 607357.46,
          "__typename": "VolumetricType"
        }, {
          "id": 3227990,
          "realization": 8,
          "grv": 2610814.02,
          "nrv": null,
          "npv": 2610814.02,
          "hcpv": 948480.93,
          "stoiip": 802466.11,
          "__typename": "VolumetricType"
        }, {
          "id": 3228326,
          "realization": 9,
          "grv": 1071506.6,
          "nrv": null,
          "npv": 1071506.6,
          "hcpv": 384263.79,
          "stoiip": 319378.08,
          "__typename": "VolumetricType"
        }, {
          "id": 3294518,
          "realization": 314,
          "grv": 1953281.8,
          "nrv": null,
          "npv": 1953281.8,
          "hcpv": 706997.25,
          "stoiip": 589346.22,
          "__typename": "VolumetricType"
        }, {
          "id": 3294854,
          "realization": 315,
          "grv": 2120384.89,
          "nrv": null,
          "npv": 2120384.89,
          "hcpv": 763548.53,
          "stoiip": 613584.11,
          "__typename": "VolumetricType"
        }, {
          "id": 3295190,
          "realization": 316,
          "grv": 740633.09,
          "nrv": null,
          "npv": 740633.09,
          "hcpv": 261871.74,
          "stoiip": 200070.29,
          "__typename": "VolumetricType"
        }, {
          "id": 3295526,
          "realization": 317,
          "grv": 172095.29,
          "nrv": null,
          "npv": 172095.29,
          "hcpv": 62699.25,
          "stoiip": 42716.9,
          "__typename": "VolumetricType"
        }, {
          "id": 3345926,
          "realization": 499,
          "grv": 1953433.83,
          "nrv": null,
          "npv": 1953433.83,
          "hcpv": 695134.5,
          "stoiip": 562448.04,
          "__typename": "VolumetricType"
        }]
      }
    }
  },
];

export const volumetrics = {
  "data": {
    "volumetric": [{
      "id": 3225638,
      "realization": 0,
      "grv": 846092.59,
      "nrv": null,
      "npv": 846092.59,
      "hcpv": 306117.26,
      "stoiip": 225233.86,
      "__typename": "VolumetricType"
    }, {
      "id": 3225974,
      "realization": 1,
      "grv": 204609.76,
      "nrv": null,
      "npv": 204609.76,
      "hcpv": 76270.83,
      "stoiip": 57865.63,
      "__typename": "VolumetricType"
    }, {
      "id": 3226310,
      "realization": 2,
      "grv": 386774.96,
      "nrv": null,
      "npv": 386774.96,
      "hcpv": 134865.46,
      "stoiip": 97738.57,
      "__typename": "VolumetricType"
    }, {
      "id": 3226646,
      "realization": 3,
      "grv": 962742.64,
      "nrv": null,
      "npv": 962742.64,
      "hcpv": 355179.82,
      "stoiip": 310229.54,
      "__typename": "VolumetricType"
    }, {
      "id": 3226982,
      "realization": 5,
      "grv": 1477630.76,
      "nrv": null,
      "npv": 1477630.76,
      "hcpv": 534430.88,
      "stoiip": 425457.41,
      "__typename": "VolumetricType"
    }, {
      "id": 3227318,
      "realization": 6,
      "grv": 1022197.53,
      "nrv": null,
      "npv": 1022197.53,
      "hcpv": 368899.23,
      "stoiip": 292269.62,
      "__typename": "VolumetricType"
    }, {
      "id": 3227654,
      "realization": 7,
      "grv": 2074122.95,
      "nrv": null,
      "npv": 2074122.95,
      "hcpv": 756816.99,
      "stoiip": 607357.46,
      "__typename": "VolumetricType"
    }, {
      "id": 3227990,
      "realization": 8,
      "grv": 2610814.02,
      "nrv": null,
      "npv": 2610814.02,
      "hcpv": 948480.93,
      "stoiip": 802466.11,
      "__typename": "VolumetricType"
    }, {
      "id": 3228326,
      "realization": 9,
      "grv": 1071506.6,
      "nrv": null,
      "npv": 1071506.6,
      "hcpv": 384263.79,
      "stoiip": 319378.08,
      "__typename": "VolumetricType"
    }, {
      "id": 3294518,
      "realization": 314,
      "grv": 1953281.8,
      "nrv": null,
      "npv": 1953281.8,
      "hcpv": 706997.25,
      "stoiip": 589346.22,
      "__typename": "VolumetricType"
    }, {
      "id": 3294854,
      "realization": 315,
      "grv": 2120384.89,
      "nrv": null,
      "npv": 2120384.89,
      "hcpv": 763548.53,
      "stoiip": 613584.11,
      "__typename": "VolumetricType"
    }, {
      "id": 3295190,
      "realization": 316,
      "grv": 740633.09,
      "nrv": null,
      "npv": 740633.09,
      "hcpv": 261871.74,
      "stoiip": 200070.29,
      "__typename": "VolumetricType"
    }, {
      "id": 3295526,
      "realization": 317,
      "grv": 172095.29,
      "nrv": null,
      "npv": 172095.29,
      "hcpv": 62699.25,
      "stoiip": 42716.9,
      "__typename": "VolumetricType"
    }, {
      "id": 3345926,
      "realization": 499,
      "grv": 1953433.83,
      "nrv": null,
      "npv": 1953433.83,
      "hcpv": 695134.5,
      "stoiip": 562448.04,
      "__typename": "VolumetricType"
    }]
  }};
