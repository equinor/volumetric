Feature: GraphQL API

  Background: There are data in the system

    Given there are fields
      | name    |
      | Field 1 |
      | Field 2 |

    Given there are cases
      | name   | case_version | case_type  | description                               | is_official | is_shared | created_user | field   |
      | Case 1 | 1            | SEGMENT    | Testing the description is very important | True        | True      | The Stig     | Field 1 |
      | Case 2 | 11           | FULL_FIELD | description here                          | False       | False     | The Stig     | Field 2 |

    Given there are locations
      | facies_name    | region_name | zone_name | case_id |
      | Type Of Rock 1 | Region 1    | Zone 1    | 1       |
      | Type Of Rock 2 | Region 2    | Zone 2    | 1       |

    Given there are realizations
      | realization | iteration | location_id |
      | 1           | 1         | 1           |
      | 1           | 1         | 2           |
      | 1           | 2         | 2           |
      | 1           | 3         | 2           |
      | 1           | 4         | 2           |

    Given there are volumetrics
      | realization_id | phase | bulk | net  | porv | hcpv | stoiip | phase | giip | associatedgas | associatedliquid | recoverable |
      | 1              | GAS   | 0.1  | 0.2  | 0.3  | 0.4  | 0.5    | GAS   | 0.7  | 0.8           | 0.9              | 0.99        |
      | 2              | GAS   | 11.1 | 11.2 | 11.3 | 11.4 | 11.5   | GAS   | 11.7 | 11.8          | 11.9             | 11.99       |
      | 3              | GAS   | 12.1 | 12.2 | 12.3 | 12.4 | 12.5   | GAS   | 12.7 | 12.8          | 12.9             | 12.99       |
      | 4              | GAS   | 13.1 | 13.2 | 13.3 | 13.4 | 13.5   | GAS   | 13.7 | 13.8          | 13.9             | 13.99       |
      | 5              | GAS   | 1.1  | 1.2  | 1.3  | 1.4  | 1.5    | GAS   | 1.7  | 1.8           | 1.9              | 1.99        |

    Given max_iter_volumetrics is fresh

  Scenario: Query for cases
    Given I am an application admin
    When I make a graphql query
    """
    { cases(fieldName: "Field 1") { name isOfficial } }
    """
    Then the graphql response should contain
    """
    {
      "data": {
        "cases": [
          {
            "name": "Case 1",
            "isOfficial": true
          }
        ]
      }
    }
    """

  Scenario: Query for volumetrics
    Given I am an application admin
    When I make a graphql query
    """
    {
      volumetrics(caseId: 1, regionNames: "Region 1", zoneNames: "Zone 1", faciesNames: "Type Of Rock 1", phase: GAS) {
        caseId
        zoneNames
        faciesNames
        regionNames
        p10: percentiles(percentile: 10) {
          bulk
        }
        means {
          bulk
        }
      }
    }
    """
    Then the graphql response should contain
    """
    {
      "data": {
        "volumetrics": {
          "caseId": 1,
          "zoneNames": ["Zone 1"],
          "faciesNames": ["Type Of Rock 1"],
          "regionNames": ["Region 1"],
          "p10": {
            "bulk": 0.1
          },
          "means": {
            "bulk": 0.1
          }
        }
      }
    }
    """

  Scenario: Query for multiple volumetrics with multiple iterations
    Given I am an application admin
    When I make a graphql query
    """
    {
      volumetrics(caseId: 1, regionNames: ["Region 1", "Region 2"], phase: GAS) {
        zoneNames
        faciesNames
        regionNames
        p10: percentiles(percentile: 10) {
          bulk
        }
        means {
          bulk
        }
        summedVolumetrics {
          realization
          bulk
        }
      }
    }
    """
    Then the graphql response should contain
    """
    {
      "data": {
        "volumetrics": {
          "zoneNames": null,
          "faciesNames": null,
          "regionNames": ["Region 1", "Region 2"],
          "p10": {
            "bulk": 37.5
          },
          "means": {
            "bulk": 37.5
          },
          "summedVolumetrics": [
            {
              "realization": 1,
              "bulk": 37.5
            }
          ]
        }
      }
    }
    """
