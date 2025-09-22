# Search

twinsphere search is a feature that allows you to use Mongo Atlas Search queries to search for shells based on their
submodel data. A list of defined indexes and their schema is given below. Each index is language-specific and contains
only strings in a given language. We currently support English (en-US) and German (de-DE) languages only.

To search using one of the indexes, send a query via POST on the `/api/v3/sphere/search` endpoint. Take a look at the
Swagger for more API documentation around each parameter and return value.

## Shell Technical classifications

Index names:

- English: `search_shell_technical_classifications_en_index`
- German: `search_shell_technical_classifications_de_index`

> When writing queries, you need to include the language in both the index name and as a query string parameter for the
> HTTP request!

**Defined mappings**:

<!-- markdownlint-disable line-length -->

| name                                                           | field type         | explanation                                                                                         |
|----------------------------------------------------------------|--------------------|-----------------------------------------------------------------------------------------------------|
| classifications                                                | token              | Classifications is an array of string identifiers.                                                  |
| properties                                                     | stringFacet        | Properties in an array so that you can perform facet queries to find most used properties.          |
| 0 ... N properties extracted from the technical data submodels | token, stringFacet | Indexed as token to be used for filtering, and as a stringFacet to enable facets for each property. |

<!-- markdownlint-enable line-length -->

Data returned in the queries as results looks something like this (based on the language, example for German):

```json
{
   "_id": "shell-id-1",
    "classifications": [
      "24-11",
      "24-12",
      "24-15-22"
    ],
    "Breite": "17,6 mm",
    "Länge": "128,0 mm",
    "Nennstrom": "50,0 mA",

    // further properties ...

    "properties": [
        "Breite",
        "Länge",
        "Nennstrom"

        // all properties are also listed here in this list by their name
    ]
},
{
   "_id": "shell-id-2",
    "classifications": [
      "2-16",
      "24-12",
      "ABC"
    ],
    "Breite": "12,0 mm",
    "Länge": "12,0 mm",
    "Einbautiefe": "138,3 mm",

    // further properties ...

    "properties": [
        "Breite",
        "Länge",
        "Einbautiefe"
    ]
},

// ...
...
```

### General querying guidelines

- You can use `$search` or `$searchMeta` pipeline operators. `$search` returns the source objects, while `$searchMeta`
  only returns the metadata like facet counts.
- You can use aggregation pipelines in your queries, simply provide an JSON array:

```json
[
   // stage 1
   {
      "$search":{
         "index":"..."
      }
   },
   // stage 2
   {
      "$project":{
         "_id":1
      }
   },
   // ...
]
```

### Example building a product search

Let's say you want to build a classical product search, in which you want to show top used properties on the left side
of the screen in a tree view, and the results on the right side.

#### Most used properties

First, you could run a query to find all most used property for a given classification:

```json
{
  "$searchMeta": {
    "index": "search_shell_technical_classifications_de_index",
    "facet": {
      "operator": {
        "in": {
          "path": "classifications",
          "value": "24-11"
        }
      },
      "facets": {
        "mostUsedProperties": {
          "type": "string",
          "path": "properties"
        }
      }
    }
  }
}
```

#### Count the hits per property

Then, based on the results, you could calculate facets by including these N most used properties in a new query like
this:

```json
{
  "$searchMeta": {
    "index":
      "search_shell_technical_classifications_de_index",
    "facet": {
      "operator": {
        "in": {
          "path": "classifications",
          "value": "24-11",
        },
      },
      "facets": {
        "Breite": {
          "type": "string",
          "path": "Breite",
        },
        "Länge": {
          "type": "string",
          "path": "Länge",
        },
        "Nennstrom": {
          "type": "string",
          "path": "Nennstrom",
        },
      },
    },
  }
}
```

To get the actual data and not only facets, you can run the same exact query with the $search operator. However, for
performance reasons, you can actually fetch both the data and the metadata in a single query like this:

```json
[
  {
    "$search": {
      "index":
        "search_shell_technical_classifications_de_index",
      "facet": {
        "operator": {
          "in": {
            "path": "classifications",
            "value": "24-11",
          },
        },
        "facets": {
          "Breite": {
            "type": "string",
            "path": "Breite",
          },
          "Länge": {
            "type": "string",
            "path": "Länge",
          },
          "Nennstrom": {
            "type": "string",
            "path": "Nennstrom",
          },
        },
      },
    },
  },
  {
    "$facet": {
      "docs": [
        {
          "$replaceRoot": {
            "newRoot": "$$ROOT",
          },
        },
      ],
      "meta": [
        {
          "$replaceWith": "$$SEARCH_META",
        },
        {
          "$limit": 1,
        },
      ],
    },
  },
  {
    "$set": {
      "meta": {
        "$arrayElemAt": ["$meta", 0],
      },
    },
  },
]
```

Please check the [Mongo Atlas Search facet documentation](https://www.mongodb.com/docs/atlas/atlas-search/facet/) for
reference.

#### Further subquerying

If you allow the user to apply further criteria to search, such as a combination of AND and OR conditions on certain
properties and values, then you can construct your queries using multiple nested compound operators. The query below
uses `should` for OR conditions and nests them under a `must` operator to perform an AND condition. All hits where
`Länge` is either `101 mm` or `105 mm` and `Breite` is `50 mm` are returned.

```json
// ...
      "facet": {
        "operator": {
          "compound": {
            "filter": {
              "in": {
                "path": "classifications",
                "value": "24-11",
              },
            },

            "must": [
              {
                "compound": {
                  "should": [
                    {
                      "equals": {
                        "path": "Länge",
                        "value": "101 mm",
                      },
                    },
                    {
                      "equals": {
                        "path": "Länge",
                        "value": "105 mm",
                      },
                    },
                  ],
                  "minimumShouldMatch": 1,
                },
              },
              {
                "compound": {
                  "should": [
                    {
                      "equals": {
                        "path": "Breite",
                        "value": "50 mm",
                      },
                    },
                  ],
                  "minimumShouldMatch": 1,
                },
              },
            ],
          },
        },
        "facets": {
  // ...
```

### Pagination

To get only certain amount of `docs` but all of the metadata, in-build search pagination feature can be used. Mongo
search pagination is cursor-based, which means that every returned document has an unique position which you could use
in your next query to request searching before or after this position.

To extend on our last query from above, we could use pagination like this:

```json
[
  {
    "$search": {
      "index":
        "search_shell_technical_classifications_de_index",

      // this is a token from a document retrieved in the previous query (can be the last document on the last page)
      "searchAfter": "CABCVABCCAPw==",

      "facet": {
        "operator": {
          "in": {
            "path": "classifications",
            "value": "24-11",
          },
        },
        "facets": {
          "Breite": {
            "type": "string",
            "path": "Länge",
          },
          "Länge": {
            "type": "string",
            "path": "Länge",
          },
          "Nennstrom": {
            "type": "string",
            "path": "Nennstrom",
          },
        },
      },
    },
  },
  {
    // for each of the returned documents we want to also include the cursor in a new field called paginationToken
    "$addFields": {
      "paginationToken" : { "$meta" : "searchSequenceToken" }
    }
  },
  {
    // page of 20 documents
    "$limit": 20
  },
  {
    "$facet": {
      "docs": [
        {
          "$replaceRoot": {
            "newRoot": "$$ROOT",
          },
        },
      ],
      "meta": [
        {
          "$replaceWith": "$$SEARCH_META",
        },
        {
          "$limit": 1,
        },
      ],
    },
  },
  {
    "$set": {
      "meta": {
        "$arrayElemAt": ["$meta", 0],
      },
    },
  },
]
```

### Formatting of values

Values delivered by search are preformatted for the language requested. For example, "de" index would deliver 100.000,99
and "en" index would deliver "100,000.99". Formatting rules are based on the XSD data type declared on the valueType
property (of the SubmodelElement). Our logic is implemented as follows:

- Values are formatted depending on the target culture numerical, datetime and other settings.
- We keep all the decimals, no rounding will be performed.
- We drop the trailing zeroes (e.g. 100.000,00 becomes 100.000) for all numerical types.
- Unit of measure from the concept descriptions is always added on the end of the value.

### Special cases

#### Indexing

- We currently only support **Property** and **MultiLanguageProperty** submodel elements.
- For property names, concept descriptions data from the repository is used. Matching is done based on the semantic
  identifier of each of the properties.
- For values we use the value from the property itself and combine it with the **unit** from the concept description
  data.
- Multiple properties with the same property name are NOT supported. This situation could occur for several reasons:
    - shell reference multiple technical data submodels with same properties
    - two properties with different semantic identifiers have same text in a given language
    - if **same** properties are found, only the first one will be used and the rest will not be indexed

#### Querying

- When querying, it is important to note that the property names could contain special Mongo symbols such as `.` or `$`.
  Most queries should work without problem since Mongo supports such property names, but some operators, like `$project`
  might not work correctly.
