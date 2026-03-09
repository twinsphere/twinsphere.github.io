# Attribute-Based Access Control (ABAC)

## Overview

Twinsphere implements an Attribute-Based Access Control (ABAC) system for fine-grained
authorization of resources. Unlike traditional Role-Based Access Control (RBAC), ABAC evaluates
access requests based on attributes of the principal (user/service), the action being performed,
and the resource being accessed.

!!! note "Cloud-Only Feature"

    ABAC is a feature of the twinsphere Cloud AAS Repository only. In contrast,
    [RBAC roles](management-roles.md) apply across the entire twinsphere platform.

Both RBAC and ABAC can be used together to provide a robust security model. Keep in mind that
RBAC roles are evaluated first, and if access is granted via RBAC, ABAC policies are not checked.

## Key Concepts

### Principals

A **principal** is the entity requesting access. This can be:

- A user identified by email (e.g., `alice@example.com`)
- A service account identified by a UUID (e.g., `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)
- A [group](management-overview.md#user-groups) (e.g., `group@factory-admins`)

Policies can target specific principals or use special values:

- `*` (wildcard) - Matches any **authenticated** principal
- `$ANONYMOUS` - Matches **unauthenticated** (anonymous) requests

**Important**: The wildcard `*` only matches authenticated users. To allow anonymous access,
you must explicitly use `$ANONYMOUS`.

### Actions

An **action** represents what the principal wants to do with the resource. Supported actions are:

- `READ` - View/retrieve the resource
- `WRITE` - Create or update the resource
- `DELETE` - Remove the resource
- `*` (wildcard) - Matches any action

### Resources and Security Attributes

**Resources** are the entities being protected (e.g., Asset Administration Shells).
Each resource can have **security attributes** that define its security classification.

Security attributes are defined in the resource's `extensions` array with the prefix
`twinsphere.io/security-attribute/`:

```json
{
  "extensions": [
    {
      "name": "twinsphere.io/security-attribute/location",
      "value": "berlin"
    },
    {
      "name": "twinsphere.io/security-attribute/confidentiality",
      "value": "high"
    }
  ],
  "idShort": "EXAMPLE_SHELL",
  "id": "526028ed-e52e-42ac-87e0-7e202c957468",
  "assetInformation": {
    "assetKind": "Instance",
    "globalAssetId": "urn:conplement:aas:type:526028ed-e52e-42ac-87e0-7e202c957468"
  },
  "modelType": "AssetAdministrationShell"
}
```

!!! note "Supported Extensions"

    Security attribute extensions are supported on **Asset Administration Shells**
    and **Submodels** at the top (root) level of each entity.
    For **Files**, security attributes are defined via
    [file attributes](cloud-documentation.md#usage-of-file-api) instead of extensions.

### Policies

A **policy** defines who (principals) can do what (actions) on which resources
(defined by resource attributes). A policy consists of:

| Field | Description |
|-------|-------------|
| `name` | Human-readable policy identifier |
| `principals` | List of principal identifiers or `*` for any |
| `actions` | List of allowed actions (`READ`, `WRITE`, `DELETE`) or `*` for any |
| `resources` | Dictionary of security attribute key-value pairs |

### Files

Files in the [file repository](cloud-documentation.md#file-repository) can also be protected by
security attributes. Unlike Shells and Submodels, file security attributes are defined via
[file attributes](cloud-documentation.md#usage-of-file-api) rather than extensions.

- When uploading files as **attachments** or **thumbnails**, they initially **inherit the security
  attributes** of their parent (Shell or Submodel). These inherited attributes can be changed
  afterwards for each file individually.

### Strict Attribute Matching

The ABAC system uses **strict exact matching** for resource attributes:

- A policy matches a resource **only if** the policy and resource have the **exact same attribute keys**
- All attribute values must match (policy wildcards `*` match any value)
- Partial matches are **not allowed** - a policy with 2 attributes will never match a resource with 1 or 3 attributes

**This design ensures predictable access control behavior and prevents accidental access grants.**

### Special Behaviors with ABAC

Some operations exhibit special behavior when ABAC policies are in effect:

- **Listing resources**: Always returns `200 OK`, but the result set only contains
  resources the principal is authorized to access. Specifying IDs as a filter on a list
  endpoint does **not** result in `403` -- unauthorized resources are simply excluded from the
  response.
- **Retrieving a single resource**: Returns `403 Forbidden` if the principal is not authorized
  to access the requested resource.
- **Import**: If any of the imported Shells or Submodels are not granted by the principal's
  ABAC policies, the import will **partially fail** -- only the authorized entities are imported.
- **Serialization by ID**: Returns `403 Forbidden` if the principal is not authorized to
  access the requested resource. This is an explicit opt-in operation, not a filter.
- **Files**: File contents are always filtered based on the principal's access rights. Any
  files the principal cannot access are **replaced with a placeholder access-denied file**.

## Example Scenario

### Resources (Shells)

**Shell 1: Berlin Factory Sensor (High Confidentiality)**
```json
{
  "extensions": [
    { "name": "twinsphere.io/security-attribute/location", "value": "berlin" },
    { "name": "twinsphere.io/security-attribute/confidentiality", "value": "high" }
  ],
  "idShort": "BerlinSensor001",
  "id": "sensor-001"
}
```

**Shell 2: Munich Factory Sensor (Normal Confidentiality)**
```json
{
  "extensions": [
    { "name": "twinsphere.io/security-attribute/location", "value": "munich" },
    { "name": "twinsphere.io/security-attribute/confidentiality", "value": "normal" }
  ],
  "idShort": "MunichSensor001",
  "id": "sensor-002"
}
```

**Shell 3: Public Documentation**
```json
{
  "extensions": [
    { "name": "twinsphere.io/security-attribute/visibility", "value": "public" }
  ],
  "idShort": "PublicDocs",
  "id": "docs-001"
}
```

### Policies

**Policy 1: Berlin Engineers - READ High Confidentiality**
```json
{
  "name": "berlin-engineers-read-high",
  "principals": ["alice@example.com", "bob@example.com"],
  "actions": ["READ"],
  "resources": {
    "twinsphere.io/security-attribute/location": "berlin",
    "twinsphere.io/security-attribute/confidentiality": "high"
  }
}
```

**Policy 2: Factory Admins - Full Access to Any Location and Any Confidentiality**
```json
{
  "name": "factory-admins-full-access",
  "principals": ["group@factory-admins"],
  "actions": ["*"],
  "resources": {
    "twinsphere.io/security-attribute/location": "*",
    "twinsphere.io/security-attribute/confidentiality": "*"
  }
}
```

**Policy 3: Anyone Authenticated Can READ Internal Content**
```json
{
  "name": "internal-read",
  "principals": ["*"],
  "actions": ["READ"],
  "resources": {
    "twinsphere.io/security-attribute/visibility": "internal"
  }
}
```

**Policy 4: Anonymous Users Can READ Public Content**
```json
{
  "name": "anonymous-public-read",
  "principals": ["$ANONYMOUS"],
  "actions": ["READ"],
  "resources": {
    "twinsphere.io/security-attribute/visibility": "public"
  }
}
```

### Access Evaluation Examples

<!-- markdownlint-disable line-length -->
| Principal | Action | Resource | Result | Reason |
|-----------|--------|----------|--------|--------|
| `alice@example.com` | READ | Shell 1 (berlin, high) | ✅ Allowed | Matches Policy 1 exactly |
| `alice@example.com` | WRITE | Shell 1 (berlin, high) | ❌ Denied | Policy 1 only allows READ |
| `alice@example.com` | READ | Shell 2 (munich, normal) | ❌ Denied | Location doesn't match Policy 1 |
| `group@factory-admins` | DELETE | Shell 1 (berlin, high) | ✅ Allowed | Matches Policy 2 (wildcards) |
| `group@factory-admins` | READ | Shell 3 (public) | ❌ Denied | Attribute keys don't match Policy 2 |
| `random@user.com` | READ | Shell with visibility=internal | ✅ Allowed | Matches Policy 3 (wildcard principal) |
| `random@user.com` | READ | Shell 1 (berlin, high) | ❌ Denied | No policy matches |
| (anonymous) | READ | Shell with visibility=public | ✅ Allowed | Matches Policy 4 ($ANONYMOUS principal) |
| (anonymous) | READ | Shell with visibility=internal | ❌ Denied | Policy 3 only applies to authenticated users |
| `alice@example.com` | READ | Shell with visibility=public | ❌ Denied | Policy 4 only applies to anonymous users |
| `alice@example.com` (member of `group@factory-admins`) | READ | Shell with location=usa, confidentiality=secret | ✅ Allowed | Matches Policy 2 via group membership (wildcard confidentiality) |
<!-- markdownlint-enable line-length -->

## Best Practices

### Policy Design Guidelines

1. **Use Specific Policies**: Prefer multiple specific policies over broad wildcard policies
2. **Principle of Least Privilege**: Grant only the minimum access required
3. **Group Similar Access**: Use groups for principals with identical access needs
4. **Document Policy Intent**: Use descriptive policy names that explain the purpose
5. **Test Before Production**: Validate access patterns in a test environment first

### Attribute Naming Conventions

- Use lowercase with hyphens: `department`, `data-type`, `access-level`
- Be consistent across your organization
- Document all valid attribute values
- Consider using enums for attribute values where possible

### Introducing New Security Attributes

When adding a new security attribute to your system, follow this migration strategy to avoid access disruptions:

#### Step 1: Create New Policies First

Before adding the new attribute to resources, create policies that include the new attribute combination:

```json
// Existing policy (keep active)
{
  "name": "berlin-read-v1",
  "principals": ["alice@example.com"],
  "actions": ["READ"],
  "resources": {
    "twinsphere.io/security-attribute/location": "berlin"
  }
}

// New policy with additional attribute (add this)
{
  "name": "berlin-read-department-v2",
  "principals": ["alice@example.com"],
  "actions": ["READ"],
  "resources": {
    "twinsphere.io/security-attribute/location": "berlin",
    "twinsphere.io/security-attribute/department": "engineering"
  }
}
```

#### Step 2: Migrate Resources Gradually

Update resources to include the new attribute:

```json
// Before
{
  "extensions": [
    { "name": "twinsphere.io/security-attribute/location", "value": "berlin" }
  ]
}

// After
{
  "extensions": [
    { "name": "twinsphere.io/security-attribute/location", "value": "berlin" },
    { "name": "twinsphere.io/security-attribute/department", "value": "engineering" }
  ]
}
```

#### Step 3: Clean Up Old Policies

Once all resources have been migrated to include the new attribute, remove the old policies.

## Policy Management API

!!! info "Required Roles"

    Policy management endpoints require the **`tenant-administrator`** or **`organization-owner`** role.

| Operation | Method | Endpoint | Description |
|-----------|--------|----------|-------------|
| Create Policy | `POST` | `/sphere/api/v1/access-policies` | Create a new access policy |
| List Policies | `GET` | `/sphere/api/v1/access-policies` | Retrieve all access policies |
| Get Policy | `GET` | `/sphere/api/v1/access-policies/{policyId}` | Retrieve a specific policy by ID |
| Update Policy | `PUT` | `/sphere/api/v1/access-policies/{policyId}` | Update an existing policy |
| Delete Policy | `DELETE` | `/sphere/api/v1/access-policies/{policyId}` | Delete a policy |

## Access Check API

<!-- markdownlint-disable line-length -->
| Operation | Method | Endpoint | Description |
|-----------|--------|----------|-------------|
| Check Access by Principal | `GET` | `/sphere/api/v1/security/check?principal={principal}` | Returns all resource attribute combinations and RBAC roles for a given principal |
| Check My Access | `GET` | `/sphere/api/v1/security/check/me` | Returns all resource attribute combinations and RBAC roles for the currently authenticated user |
<!-- markdownlint-enable line-length -->