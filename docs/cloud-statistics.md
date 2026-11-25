# Statistics

The Statistics API provides access to historical timeseries data about your tenant — including twin object counts,
storage usage, and lookup data. The counts are exact and follow every change within seconds, the storage is measured
regularly, and the data is stored for up to **5 years**.

## How the data is collected

| Data | Updated |
|------|---------|
| All counts except `blob_count` | With every create and delete, within seconds |
| `used_db_storage` | Every 5 minutes |
| `used_blob_storage` and `blob_count` | Every hour |

The values are kept per minute for **90 days**, and per hour and per day for **5 years**.

!!! note "Data from before Cloud 1.33"
    Before Cloud 1.33 the counts were estimates that were collected every hour. These values are kept.

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
      "metricName": "shell_descriptors_count",
      "instanceName": "registry-prod",
      "dataPoints": [
        { "timestamp": "2024-01-01T00:00:00Z", "value": 128 },
        { "timestamp": "2024-01-01T01:00:00Z", "value": 128 }
      ]
    },
    {
      "metricName": "shells_count",
      "instanceName": null,
      "dataPoints": [
        { "timestamp": "2024-01-01T00:00:00Z", "value": 42 },
        { "timestamp": "2024-01-01T01:00:00Z", "value": 45 }
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
| `series[].dataPoints[].timestamp` | DateTime | UTC timestamp of the start of the step |
| `series[].dataPoints[].value` | number | Value at the end of that step, always a whole number |

## Granularity

The response granularity is selected automatically based on the length of the requested time range:

| Time Range | Granularity | Step |
|------------|-------------|------|
| Up to 6 hours | `Minutely` | 1 minute |
| Up to 1 day | `FiveMinutely` | 5 minutes |
| Up to 7 days | `Hourly` | 1 hour |
| Up to 30 days | `SixHourly` | 6 hours |
| Up to 366 days | `Daily` | 1 day |
| Up to 5 years | `Weekly` | 1 week |

!!! note "Ranges older than 90 days"
    The values per minute are kept for 90 days. A time range of up to 1 day that starts on a day which began more
    than 90 days ago is returned with `Hourly` granularity.

!!! note "Ranges from before Cloud 1.33"
    Values per minute exist from the upgrade of your tenant to Cloud 1.33 on. A time range of up to 1 day that
    starts before the upgrade is returned with `Hourly` granularity.

!!! note "Adaptive granularity fallback"
    If fewer than 5 data points are found at a granularity coarser than `Hourly`, the data is returned with `Hourly`
    granularity.

## Data points

- A **count** has a data point in every step, from its first known value on. A step without a change repeats the
    value of the step before.
- A **storage value** and `blob_count` have a data point only in the steps in which they were measured. With
    `Minutely` granularity, `used_db_storage` has a data point every 5 minutes. With `Minutely` and `FiveMinutely`
    granularity, `used_blob_storage` and `blob_count` have one data point per hour.
- Steps that start after the time of the request are left out.
- A series without a data point in the time range is left out of the response.

## Metric Names

| Metric Name | Description | Instance Name |
|-------------|-------------|---------------|
| `shells_count` | Number of Asset Administration Shells | `null` |
| `submodels_count` | Number of Submodels | `null` |
| `concept_descriptions_count` | Number of Concept Descriptions | `null` |
| `files_count` | Number of files | `null` |
| `used_db_storage` | Database storage consumption in **bytes** | `null` |
| `used_blob_storage` | Blob storage consumption in **bytes** | `null` |
| `blob_count` | Number of objects in the blob storage | `null` |
| `asset_links_count` | Number of asset links in a Discovery instance | Discovery instance name |
| `shell_descriptors_count` | Number of shell descriptors in a Registry instance | Registry instance name |
| `submodel_descriptors_count` | Number of submodel descriptors in a Registry instance | Registry instance name |

!!! note "Storage values"
    `used_db_storage` and `used_blob_storage` values are stored and returned in **bytes**.
    Convert to GB by dividing by 1,073,741,824 (1024³).
