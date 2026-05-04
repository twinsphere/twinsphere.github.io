# Statistics

The Statistics API provides access to historical timeseries data about your tenant — including twin object counts,
storage usage, and lookup data. Data is collected automatically every hour and stored for up to **5 years**.

## Get Statistics

Retrieves downsampled statistics timeseries data for a given time range.

> `GET https://{twinsphereTenantURL}/sphere/api/v1.0/statistics`

### Query Parameters

| Parameter | Type | Required |
|-----------|------|----------|
| `from` | ISO 8601 UTC DateTime | Yes |
| `to` | ISO 8601 UTC DateTime | Yes |

### Validation Rules

- `from` must be strictly before `to`
- The requested time range must not exceed **5 years**

### Example Request

```http
GET /sphere/api/v1.0/statistics?from=2024-01-01T00:00:00Z&to=2024-01-08T00:00:00Z
Authorization: Bearer {token}
```

### Example Response

```json
{
  "from": "2024-01-01T00:00:00Z",
  "to": "2024-01-08T00:00:00Z",
  "granularity": "Hourly",
  "series": [
    {
      "metricName": "shells_count",
      "instanceName": null,
      "dataPoints": [
        { "timestamp": "2024-01-01T00:00:00Z", "value": 42.0 },
        { "timestamp": "2024-01-01T01:00:00Z", "value": 42.0 }
      ]
    },
    {
      "metricName": "shell_descriptors_count",
      "instanceName": "registry-prod",
      "dataPoints": [
        { "timestamp": "2024-01-01T00:00:00Z", "value": 128.0 }
      ]
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `from` | DateTime | Echoes the requested start of the time range |
| `to` | DateTime | Echoes the requested end of the time range |
| `granularity` | string | The applied data granularity (see table below) |
| `series` | array | One entry per unique `(metricName, instanceName)` combination |
| `series[].metricName` | string | Identifier of the statistic (see metric names below) |
| `series[].instanceName` | string \| null | Registry/Discovery instance name; `null` for tenant-wide metrics |
| `series[].dataPoints` | array | Data points ordered by timestamp ascending |
| `series[].dataPoints[].timestamp` | DateTime | UTC timestamp of the start of the time bucket |
| `series[].dataPoints[].value` | double | Last measured value within that time bucket |

## Granularity

The response granularity is selected automatically based on the requested time range:

| Time Range | Granularity | Bucket Size |
|------------|-------------|-------------|
| Up to 7 days | `Hourly` | 1 hour |
| Up to 30 days | `SixHourly` | 6 hours |
| Up to 180 days | `Daily` | 1 day |
| Up to 1 year | `FourDaily` | 4 days |
| Up to 5 years | `Weekly` | 1 week |

!!! note "Adaptive granularity fallback"
    If fewer than 5 data points are found at the selected granularity, the API automatically retries
    with `Hourly` granularity to ensure data is returned.

## Metric Names

| Metric Name | Description | Instance Name |
|-------------|-------------|---------------|
| `shells_count` | Number of Asset Administration Shells | `null` |
| `submodels_count` | Number of Submodels | `null` |
| `concept_descriptions_count` | Number of Concept Descriptions | `null` |
| `files_count` | Number of files | `null` |
| `used_db_storage` | Database storage consumption in **bytes** | `null` |
| `used_blob_storage` | Blob storage consumption in **bytes** | `null` |
| `asset_links_count` | Number of asset links in a Discovery instance | Discovery instance name |
| `shell_descriptors_count` | Number of shell descriptors in a Registry instance | Registry instance name |

!!! note "Monitoring objects"
    In each twinsphere tenant exist one shell and one submodel for operational monitoring purposes. You are not able
    to access them via API but they are included in the numbers of the tenant statistics.

!!! note "Storage values"
    `used_db_storage` and `used_blob_storage` values are stored and returned in **bytes**.
    Convert to GB by dividing by 1,073,741,824 (1024³).
