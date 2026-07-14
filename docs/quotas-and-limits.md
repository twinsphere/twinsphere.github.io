# Platform quotas and limits

There are two kinds of limits on the twinsphere platform:

- **Quotas** — soft "limits" on the *number* of entities you can create, per organization or
  per tenant. Every quota has a default, and the default can be raised for your organization or tenant
  on request. Quotas exist for two reasons: to prevent unbounded growth caused by
  misconfiguration, and to restrict and identify potentially unsupported patterns (for example,
  too many access policies).
- **Fixed limits** — non-configurable platform limits that cannot be changed.

The values below are the current defaults.

## Organization quotas

These cap the number of management entities in a single organization.

| Entity | Default limit |
|--------|---------------|
| Service accounts | 20 |
| User groups | 50 |
| Users (members) | 100 |
| Role assignments | 600 |

!!! note "Role assignments"
    The role-assignment quota counts organization-level and tenant-level (cloud) role assignments
    together toward the single limit.

## Cloud quotas (per tenant)

These cap the number of AAS entities stored in a single tenant. Registry and Discovery counts are
summed across all of a tenant's instances and reflect explicitly stored descriptors and asset links
(implicit, synthesized descriptors are not stored and do not count).

| Entity | Default limit |
|--------|---------------|
| Asset Administration Shells | 200,000 |
| Submodels | 500,000 |
| Concept Descriptions | 15,000 |
| Shell Descriptors (Registry) | 200,000 |
| Asset Links (Discovery) | 200,000 |
| Access Policies (ABAC) | 100 |

## Fixed limits

These are enforced on every request and cannot be raised.

| Limit | Value | Applies to |
|-------|-------|------------|
| Submodel size | 10 MiB | The serialized size of a single submodel |
| Secrets per service account | 10 | Client secrets on one service account |
| Members per user group | 200 | Members in a single user group |

!!! note "Submodel size and existing data"
    The submodel size limit is checked on create and on update. A submodel created before the limit
    was introduced may already exceed it; such a submodel stays editable and can be shrunk, but cannot
    grow further. A new submodel can never be created above the limit.

## When a limit is exceeded

A request that would exceed a quota or a fixed count limit is rejected and nothing is created.

| Condition | HTTP status | Error code |
|-----------|-------------|------------|
| Configurable quota exceeded | `422 Unprocessable Content` | `QUOTA_EXCEEDED` |
| Fixed count limit exceeded (secrets, group members) | `422 Unprocessable Content` | `LIMIT_EXCEEDED` |
| Submodel too large | `413 Payload Too Large` | `PAYLOAD_TOO_LARGE` |

## Requesting a quota increase

If your tenant or organization needs a higher quota, [contact us](contact.md). Fixed limits cannot be changed.
