# Shell Filter Queries

The Twinsphere Shell Filter Queries allows for simplified searching of shells. It uses a straightforward search model where
you can specify supported shell and submodel properties. Based on this input, the filter returns the shells that match
your criteria.

## Request

### Url

/sphere/api/v1.0/filter/shells

### Query Parameters

- Limit
- Cursor

### Request Body

Include only the properties relevant to your request. Omit any fields that are unnecessary, empty, or set to their
default values (as these are treated as omitted). All provided filter parameters are combined using a logical AND.

```json
{
  "language": "string",
  "shellFilter": {
    "id": "string",
    "globalAssetId": "string",
    "idShort": "string",
    "assetKind": "Type",
    "displayName": "string"
  },
  "submodelFilter": {
    "semanticId": "string",
    "nameplateFilter": {
      "productArticleNumberOfManufacturer": "string",
      "orderCodeOfManufacturer": "string",
      "manufacturerProductDesignation": "string",
      "serialNumber": "string",
      "yearOfConstructionMin": 0,
      "yearOfConstructionMax": 0,
      "manufacturerName": "string"
    }
  }
}
```

**Properties with expected format or options**:

- language: Accepts any language key, such as "en-US", "en", "us", or "de". If no language is specified, the search will
  be performed across all languages
- assetKind: "Instance" or "Type"
- yearOfConstructionMin: Positive Number e.g: 2025
- yearOfConstructionMax: Positive Number e.g: 2025

## Regex Support

To use regular expressions instead of exact matches, prefix your regex with "**$regex=**" and provide it as a property
value.

For example:

**$regex=**conplement.*

### Shell Regex Support

- id
- idshort
- displayname
- globalAssetId
- semanticId

### Nameplate Regex Support

- productArticleNumberOfManufacturer
- orderCodeOfManufacturer
- manufacturerProductDesignation
- serialNumber
- manufacturerName
