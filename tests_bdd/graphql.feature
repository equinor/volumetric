Feature: GraphQL API

  Background: There are data in the system

    Given there are fields
      | name    |
      | Field 1 |
      | Field 2 |

    Given there are models
      | name    | user   | field   |
      | Model 1 | User 1 | Field 1 |
      | Model 2 | User 2 | Field 2 |

    Given there are locations
      | facies_name    | faultblock_name | zone_name | model_name |
      | Type Of Rock 1 | Fault Block 1   | Zone 1    | Model 1    |
      | Type Of Rock 2 | Fault Block 2   | Zone 2    | Model 1    |

    Given there are volumetrics
      | location_id | realization | grv | nrv | npv | hcpv | stoiip |
      | 1           | 1           | 0.1 | 0.2 | 0.3 | 0.4  | 0.5    |
      | 2           | 1           | 1.1 | 1.2 | 1.3 | 1.4  | 1.5    |


  Scenario: Query for fields
    When i make a graphql query
    """
    {
      fields {
        name
      }
    }
    """
    Then the graphql response should contain
    """
    {
      "data": {
        "fields": [
          {
            "name": "Field 1"
          },
          {
            "name": "Field 2"
          }
        ]
      }
    }
    """

  Scenario: Query for models
    Given i access the resource url "/graphql"
    When i make a graphql query
    """
    { fields { name models { name } } }
    """
    Then the graphql response should contain
    """
    {
      "data": {
        "fields": [
          {
            "name": "Field 1",
            "models": [
              {
                "name": "Model 1"
              }
            ]
          },
          {
            "name": "Field 2",
            "models": [
              {
                "name": "Model 2"
              }
            ]
          }
        ]
      }
    }
    """

  Scenario: Query for volumetrics
    Given i access the resource url "/graphql"
    When i make a graphql query
    """
    {
      calcOnVolumetrics(modelName: "Model 1", faultblockNames: "Fault Block 1", zoneNames: "Zone 1", faciesNames: "Type Of Rock 1") {
        zoneNames
        faciesNames
        faultblockNames
        p10: percentiles(percentile: 10) {
          grv
        }
        means {
          grv
        }
        volumetrics {
          id
          realization
          grv
        }
      }
    }
    """
    Then the graphql response should contain
    """
    {
      "data": {
        "calcOnVolumetrics": {
          "zoneNames": ["Zone 1"],
          "faciesNames": ["Type Of Rock 1"],
          "faultblockNames": ["Fault Block 1"],
          "p10": {
            "grv": 0.1
          },
          "means": {
            "grv": 0.1
          },
          "volumetrics": [
            {
              "id": 1,
              "realization": 1,
              "grv": 0.1
            }
          ]
        }
      }
    }
    """

  Scenario: Query for multiple volumetrics
    Given i access the resource url "/graphql"
    When i make a graphql query
    """
    {
      calcOnVolumetrics(modelName: "Model 1", faultblockNames: ["Fault Block 1", "Fault Block 2"]) {
        zoneNames
        faciesNames
        faultblockNames
        p10: percentiles(percentile: 10) {
          grv
        }
        means {
          grv
        }
        volumetrics {
          id
          realization
          grv
        }
      }
    }
    """
    Then the graphql response should contain
    """
    {
      "data": {
        "calcOnVolumetrics": {
          "zoneNames": null,
          "faciesNames": null,
          "faultblockNames": ["Fault Block 1", "Fault Block 2"],
          "p10": {
            "grv": 0.6000000000000001
          },
          "means": {
            "grv": 1.2000000000000002
          },
          "volumetrics": [
            {
              "id": 1,
              "realization": 1,
              "grv": 0.1
            },
            {
              "id": 2,
              "realization": 1,
              "grv": 1.1
            }
          ]
        }
      }
    }
    """