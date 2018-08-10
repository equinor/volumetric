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
      | 0           | 1           | 0.1 | 0.2 | 0.3 | 0.4  | 0.5    |
      | 1           | 1           | 0.1 | 0.2 | 0.3 | 0.4  | 0.5    |


  Scenario: Query for fields
    Given i access the resource url "/graphql"
    When i make a "POST" request
    """
    {
      "query" : "{ field { name } }"
    }
    """
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "data": {
        "field": [
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
    When i make a "POST" request
    """
    {
      "query" : "{ models { name } }"
    }
    """
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "data": {
        "models": [
          {
            "name": "Model 1"
          },
          {
            "name": "Model 2"
          }
        ]
      }
    }
    """

  Scenario: Query for locations
    Given i access the resource url "/graphql"
    When i make a "POST" request
    """
    {
      "query" : "{ locations { id  } }"
    }
    """
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "data": {
        "locations": [
          {
            "id": 1
          },
          {
            "id": 2
          }
        ]
      }
    }
    """

# TODO: fix'em
# Scenario: Query for volumetrics
#    Given i access the resource url "/graphql"
#    When i make a "POST" request
#    """
#    {
#        "query" : "{ volumetric(modelName: "Model 1") { id realization } }"
#    }
#    """
#    Then the response status should be "OK"
#    And the response should contain
#    """
#    {
#      "data": {
#        "volumetric": [
#          {
#            "id": 1,
#            "realization": 1
#          },
#          {
#            "id": 2,
#            "realization": 1
#          }
#        ]
#      }
#    }
#    """
#
#  Scenario: Query for single location with volumetrics
#    Given i access the resource url "/graphql"
#    When i make a "POST" request
#    """
#    {
#      "query" : "{ location(id: 1) { id facies volumetrics { realization grv stoiip nrv npv } } }"
#    }
#    """
#    Then the response status should be "OK"
#    And the response should contain
#    """
#    {
#      "data": {
#        "location": [
#          {
#            "id": "1",
#            "facies": "Type Of Rock 1",
#            "volumetrics": [
#              {
#                "realization": 1,
#                "grv": 0.1,
#                "stoiip": 0.5,
#                "nrv": 0.2,
#                "npv": 0.3
#              }
#            ]
#          }
#        ]
#      }
#    }
#    """