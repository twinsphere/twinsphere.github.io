# File Filter Queries

The Twinsphere File Filter Queries allows for simplified searching of files. It uses a straightforward search model where
you can specify supported meta data properties. Based on this input, the filter returns the files that match
your criteria.

## Request

### Url

/sphere/api/v1.0/filter/files

### Query Parameters

- Limit
- Cursor

### Request Body

Include only the properties relevant to your request. Omit any fields that are unnecessary, empty, or set to their
default values (as these are treated as omitted). All provided filter parameters are combined using a logical AND.

```json
{
  "fileName": "string",
  "displayName": "string",
  "contentType": "string",
  "minimumFileSize": 0,
  "maximumFileSize": 0,
  "creationDateStart": "2025-10-27T13:56:19.594Z",
  "creationDateEnd": "2025-10-27T13:56:19.594Z",
  "updatedDateStart": "2025-10-27T13:56:19.594Z",
  "updatedDateEnd": "2025-10-27T13:56:19.594Z",
  "createdByPrincipal": "string",
  "updatedByPrincipal": "string",
  "documentClassification": "string",
  "customAttributes": [
    {
      "key": "string",
      "value": "string"
    }
  ]
}
```

**Properties with expected format or options**:

- File Sizes: Value in bytes
- Creation and Updated Dates: RFC 3339
- Principals: Full principal value, e.g. an e-mail address
- Document Classification: Classification ID according to VDI 2770. For more information,
  refer for example to the IDTA Submodel Handover documentation
- Custom Attributes: Any key–value pairs. Each key must be unique within the files meta data

## Regex Support

To use regular expressions instead of exact matches, prefix your regex with "**$regex=**" and provide it as a property
value.
If you need to use special characters in your pattern (such as *$ / . @ >*) you'll need to escape them with
double backslashes (\\\\).

The following file filter properties support regex:

- File Name
- Display Name

Example:

```json
{
  "fileName": "$regex=.*\\.pdf"
}
```
