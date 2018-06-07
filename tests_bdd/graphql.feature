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

    Given there are fault blocks
      | name          | model   |
      | Fault Block 1 | Model 1 |
      | Fault Block 2 | Model 2 |

    Given there are zones
      | name   | model   |
      | Zone 1 | Model 1 |
      | Zone 2 | Model 2 |

    Given there are locations
      | facies         | fault_block   | zone   |
      | Type Of Rock 1 | Fault Block 1 | Zone 1 |
      | Type Of Rock 2 | Fault Block 2 | Zone 2 |

    Given there are volumetrics
      | location_id | realization | grv | nrv | npv | hcpv | stoiip |
      | 0           | 1           | 0.1 | 0.2 | 0.3 | 0.4  | 0.5    |
      | 1           | 1           | 0.1 | 0.2 | 0.3 | 0.4  | 0.5    |


  Scenario: Query for fields
    Given i access the resource url "/graphql"
    When i make a "POST" request
    """
    {
      "query" : "{ field { id name } }"
    }
    """
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "data": {
        "field": [
          {
            "id": "1",
            "name": "Field 1"
          },
          {
            "id": "2",
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
      "query" : "{ model { id name } }"
    }
    """
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "data": {
        "model": [
          {
            "id": 1,
            "name": "Model 1"
          },
          {
            "id": 2,
            "name": "Model 2"
          }
        ]
      }
    }
    """

  Scenario: Query for fault blocks
    Given i access the resource url "/graphql"
    When i make a "POST" request
    """
    {
      "query" : "{ faultblock { id name } }"
    }
    """
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "data": {
        "faultblock": [
          {
            "id": 1,
            "name": "Fault Block 1"
          },
          {
            "id": 2,
            "name": "Fault Block 2"
          }
        ]
      }
    }
    """

  Scenario: Query for zones
    Given i access the resource url "/graphql"
    When i make a "POST" request
    """
    {
      "query" : "{ zone { id name } }"
    }
    """
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "data": {
        "zone": [
          {
            "id": "1",
            "name": "Zone 1"
          },
          {
            "id": "2",
            "name": "Zone 2"
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
      "query" : "{ location { id  } }"
    }
    """
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "data": {
        "location": [
          {
            "id": "1"
          },
          {
            "id": "2"
          }
        ]
      }
    }
    """

  Scenario: Query for volumetrics
    Given i access the resource url "/graphql"
    When i make a "POST" request
    """
    {
      "query" : "{ volumetric { id realization  } }"
    }
    """
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "data": {
        "volumetric": [
          {
            "id": 1,
            "realization": 1
          },
          {
            "id": 2,
            "realization": 1
          }
        ]
      }
    }
    """

  Scenario: Query for single location with volumetrics
    Given i access the resource url "/graphql"
    When i make a "POST" request
    """
    {
      "query" : "{ location(id: 1) { id facies volumetrics { realization grv stoiip nrv npv } } }"
    }
    """
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "data": {
        "location": [
          {
            "id": "1",
            "facies": "Type Of Rock 1",
            "volumetrics": [
              {
                "realization": 1,
                "grv": 0.1,
                "stoiip": 0.5,
                "nrv": 0.2,
                "npv": 0.3
              }
            ]
          }
        ]
      }
    }
    """