# Status

## Service Status Page

The twinsphere status page provides real-time and historical information about the operational state of our services.

**[status.twinsphere.io](https://status.twinsphere.io)**

Use the status page to check:

- **Current status** of all twinsphere services
- **Active incidents** with timeline updates and impact assessment
- **Scheduled maintenance** windows
- **Uptime history** over the past 90 days

## Public API

The status information is also available as a JSON API. No authentication is required — these endpoints are publicly accessible.

### Current Status

```text
GET https://status.twinsphere.io/api/v1/status
```

Returns the current status of all services, any active incidents, and active maintenance windows.

### Status History

```text
GET https://status.twinsphere.io/api/v1/status/history?days=90
```

Returns resolved incidents and completed maintenance within the specified time window.
The `days` parameter is optional and defaults to 90 (range: 1–365).

### Uptime

```text
GET https://status.twinsphere.io/api/v1/status/uptime?days=90
```

Returns per-service uptime percentages and daily status breakdown.
The `days` parameter is optional and defaults to 90 (range: 1–365).
