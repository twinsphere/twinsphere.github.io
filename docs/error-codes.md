# Error Codes

Every error response of the twinsphere APIs carries one or more messages. Each message has a machine-readable `code`
next to its human-readable `text`:

```json
{
  "messages": [
    {
      "code": "aas-not-found",
      "messageType": "Error",
      "text": "AAS 'https://example.com/aas/4711' does not exist.",
      "correlationId": "0HN8R3K2J5Q1V:00000001",
      "timestamp": "2026-11-06T09:41:12"
    }
  ]
}
```

- **`code`** identifies the error case. It stays stable across releases, so your client can react to it without
    parsing the text.
- **`text`** explains the error for a human reader. Its wording may change at any time, so do not parse it.
- **`correlationId`** identifies the request. Please quote it when you [contact us](contact.md) about an error.
- The **HTTP status** keeps its usual meaning. Several codes share one status, the code tells them apart.

A response can carry several messages, for example one per invalid value of a request. New codes may be added in
any release; treat an unknown code like the generic code of its HTTP status.

A few responses are produced before your request reaches the API, for example for an unknown route or an unsupported
content type. They come without a body or without a code; rely on their HTTP status.

!!! note "Changed in Cloud 1.33"
    Before Cloud 1.33, `code` carried the HTTP status as a string (for example `"404"`), apart from the four codes
    listed under [legacy codes](#legacy-codes). See the [release notes](cloud-release-notes.md#cloud-133).

## General codes

These codes are shared by the APIs, each API uses the ones that apply to it.

| Code | HTTP status | Meaning |
|------|-------------|---------|
| `validation-failed` | 400 | The request is invalid, the text names the offending value |
| `invalid-json` | 400 | The request body is not valid JSON or does not match the expected structure |
| `unauthorized` | 401 | The request carries no valid credentials |
| `forbidden` | 403 | You are not allowed to perform this operation |
| `not-found` | 404 | The requested resource does not exist |
| `already-exists` | 409 | A resource with this identity already exists |
| `concurrent-modification` | 409 | The data was changed by another request at the same time, repeat your request |
| `internal-error` | 500 | An unexpected error occurred, please contact us and quote the `correlationId` |
| `feature-not-activated` | 501 | The feature is not activated for your tenant |
| `bad-gateway` | 502 | A service required to process the request could not be reached |
| `service-unavailable` | 503 | The service cannot take the request right now, retry after the `Retry-After` header |
| `gateway-timeout` | 504 | A service required to process the request did not answer in time |

## Cloud API

### Resource codes

Codes for a missing, duplicate or concurrently changed resource name the resource type:
`<resource>-not-found` (404), `<resource>-already-exists` (409) and `<resource>-concurrent-modification` (409).

| Resource | Example code |
|----------|--------------|
| Asset Administration Shell | `aas-not-found` |
| Submodel | `submodel-not-found` |
| Submodel element | `submodel-element-not-found` |
| Concept description | `concept-description-not-found` |
| AAS descriptor | `aas-descriptor-not-found` |
| Submodel descriptor | `submodel-descriptor-not-found` |
| Asset link | `asset-link-not-found` |
| File | `file-not-found` |
| Access policy | `access-policy-not-found` |
| Push target | `push-target-not-found` |
| Push job | `push-job-not-found` |
| Job | `job-not-found` |
| Bulk operation | `bulk-operation-not-found` |
| BNAC fulfillment | `bnac-fulfillment-not-found` |

A request that refers to a resource which does not exist, for example in its body, is answered with 400 and
`unknown-aas`, `unknown-file` or `unknown-push-target`.

### Further codes

| Code | HTTP status | Meaning |
|------|-------------|---------|
| `invalid-identifier-encoding` | 400 | An identifier in the path is not valid base64url |
| `identifier-mismatch` | 400 | The identifier in the path does not match the id in the body |
| `invalid-file-path` | 400 | The file path is malformed or not a valid twinsphere file path |
| `invalid-query` | 400 | The [query](cloud-documentation.md#query-language) is not valid |
| `invalid-search-query` | 400 | The [search](cloud-search.md) query is invalid or cannot be executed |
| `invalid-aasx-file` | 400 | The uploaded AASX file is empty or has an unsupported content type |
| `invalid-aasx-package` | 400 | The AASX package cannot be opened or read |
| `missing-package-part` | 400 | A part referenced in the AASX package is missing |
| `invalid-vdi2770-file` | 400 | The uploaded VDI 2770 package is empty or has an unsupported content type |
| `invalid-vdi2770-package` | 400 | The VDI 2770 package cannot be converted, further messages give the details |
| `invalid-dcc` | 400 | The DCC cannot be converted to a submodel |
| `unknown-semantic-schema` | 400 | The XML document does not reference a semantic schema the connector knows |
| `semantic-schema-violation` | 400 | The XML document violates its semantic schema |
| `semantic-conversion-failed` | 400 | The semantic document cannot be converted to a submodel |
| `semantic-schema-not-found` | 404 | The requested semantic schema does not exist |
| `submodel-value-not-found` | 404 | The submodel has no elements with a value |
| `submodel-element-parent-not-found` | 404 | The parent element does not exist or cannot hold submodel elements |
| `submodel-reference-already-exists` | 409 | The AAS already references this submodel |
| `cursor-not-found` | 404 | The paging cursor does not exist for this AAS |
| `file-element-not-found` | 404 | The element does not exist or is neither a File nor a Blob |
| `attachment-not-found` | 404 | The File or Blob element has no attachment |
| `file-content-not-found` | 404 | The content of the file does not exist |
| `thumbnail-not-found` | 404 | The AAS has no thumbnail |
| `unmanaged-file-path` | 404 | The file was not uploaded to twinsphere, so it cannot be downloaded from here |
| `system-entity-locked` | 423 | The object is managed by twinsphere and cannot be modified |
| `QUOTA_EXCEEDED` | 422 | A [quota](quotas-and-limits.md) of your tenant is exhausted |
| `PAYLOAD_TOO_LARGE` | 413 | The submodel exceeds the [size limit](quotas-and-limits.md) |

### SAP BNAC Fulfillment Service

| Code | HTTP status | Meaning |
|------|-------------|---------|
| `bnac-configuration-not-found` | 404 | No BNAC configuration is stored for your tenant |
| `bnac-configuration-incomplete` | 400 | The BNAC configuration lacks what this operation needs, e.g. credentials |
| `invalid-bnac-configuration` | 400 | The BNAC configuration is invalid |
| `bnac-fulfillment-item-not-found` | 404 | The line item is not part of this fulfillment |
| `bnac-fulfillment-not-open` | 400 | The fulfillment is closed or finalized and cannot be changed anymore |
| `bnac-fulfillment-incomplete` | 400 | The fulfillment cannot be finalized yet, line items still lack equipment |
| `bnac-equipment-request-not-open` | 400 | The equipment request in SAP BNAC no longer accepts deliveries |
| `bnac-partner-unresolved` | 400 | The fulfillment has no resolved partner to share the equipment with |
| `bnac-partner-mismatch` | 400 | The fulfillment belongs to a different partner |
| `bnac-item-invalid-state` | 400 | The line item is not in a state that allows this action |
| `bnac-item-not-mapped` | 400 | No shell is mapped to the line item |
| `bnac-item-externally-assigned` | 400 | The line item carries equipment provided by someone else |
| `bnac-item-not-externally-assigned` | 400 | The line item carries no externally provided equipment |
| `bnac-item-already-delivered` | 400 | The line item was already delivered, deliver it again instead of remapping it |
| `bnac-shell-already-mapped` | 400 | The shell is already mapped to another line item of this fulfillment |
| `bnac-nameplate-missing` | 400 | The shell has no Digital Nameplate that SAP BNAC supports |
| `bnac-nameplate-ambiguous` | 400 | The shell has more than one Digital Nameplate of the same version |
| `bnac-shell-rejected` | 400 | SAP BNAC rejected the shell, the text lists its findings |

### Metamodel validation

Content that violates the AAS metamodel is rejected with 400 and one message per violation. The code names the
violated rule, for example `id-short-format` or `value-not-empty`. The text describes the violation, including the
AAS constraint (such as AASd-002), and ends with the path to the offending element.
[Common Validation Errors](tips-common-validation-errors.md) explains the most frequent violations and how to fix
them.

## Manage API

The Manage API passes on the codes of the Cloud API for the [tenant views](management-api.md) it offers, and the
codes of the ID Resolver for its rules. A tenant in planned maintenance answers with `TENANT_MAINTENANCE`.

| Code | HTTP status | Meaning |
|------|-------------|---------|
| `organization-not-found` | 404 | The organization does not exist |
| `tenant-not-found` | 404 | The tenant does not exist in the organization |
| `user-not-found` | 404 | The user does not exist |
| `user-already-member` | 400 | The user is already a member of the organization |
| `user-in-use` | 409 | The user still has role assignments, group memberships or licenses, remove them first |
| `user-group-not-found` | 404 | The user group does not exist |
| `user-group-already-exists` | 409 | A user group with this ID already exists |
| `user-group-in-use` | 409 | The user group still has role assignments, remove them first |
| `user-group-member-not-found` | 404 | The principal is not a member of the user group |
| `principal-not-found` | 404 | The principal does not exist |
| `principal-not-provisioned` | 403 | The principal has no twinsphere account in the organization yet |
| `principal-not-in-organization` | 403 | The principal is not assigned to the organization |
| `principal-context-not-found` | 404 | No twinsphere account exists for the principal |
| `role-assignment-not-found` | 404 | The role assignment does not exist |
| `role-assignment-already-exists` | 409 | The role assignment already exists |
| `unknown-role` | 400 | The role is not a valid organization role |
| `service-account-not-found` | 404 | The service account does not exist |
| `service-account-not-in-organization` | 403 | The service account belongs to another organization |
| `service-account-not-ready` | 400 | The service account could not be set up and cannot be used, please contact us |
| `service-account-secret-not-found` | 404 | The secret does not exist |
| `secret-expiry-out-of-range` | 400 | The expiry date of a secret must lie between 1 day and 2 years from now |
| `not-a-service-account` | 400 | The principal is not a service account |
| `system-service-account-creation-forbidden` | 403 | You are not allowed to create system service accounts |
| `system-service-account-protected` | 403 | System service accounts cannot be accessed or modified |
| `license-type-not-configured` | 400 | No quota is configured for this [license](management-licensing.md) type |
| `license-quota-exhausted` | 400 | No licenses of this type are left |
| `license-already-assigned` | 409 | The principal already holds this license |
| `license-not-assigned` | 404 | The principal does not hold this license |
| `license-requires-user` | 400 | User-bound licenses can only be assigned to users |
| `license-requires-member` | 400 | Licenses can only be assigned to members of the organization |
| `license-assignments-not-found` | 404 | No licenses are assigned in the organization |
| `LIMIT_EXCEEDED` | 422 | A fixed [limit](quotas-and-limits.md) is reached |
| `QUOTA_EXCEEDED` | 422 | A [quota](quotas-and-limits.md) of your organization is exhausted |
| `TENANT_MAINTENANCE` | 503 | The tenant is in planned maintenance, please try again later |
| `identity-provider-error` | 500 | The identity provider could not complete the request, retry or contact us |

### ID Resolver

| Code | HTTP status | Meaning |
|------|-------------|---------|
| `missing-id` | 400 | The ID to check is missing |
| `id-too-short` | 400 | The ID is shorter than the minimum length |
| `invalid-resolution-rule` | 400 | The [rule](management-resolver.md) is invalid, the text names the reason |
| `tenant-not-in-organization` | 400 | The rule points to a tenant outside the organization |
| `resolution-rule-not-found` | 404 | The rule does not exist in the organization |
| `no-matching-resolution-rule` | 404 | No rule matches the ID |
| `resolution-target-unavailable` | 404 | The matching rule points to a tenant that is not available anymore |
| `resolution-rule-already-exists` | 409 | A rule with this prefix and type already exists |
| `resolution-rule-prefix-overlap` | 409 | The prefix overlaps with a rule of another organization |

## Legacy codes

`QUOTA_EXCEEDED`, `LIMIT_EXCEEDED`, `PAYLOAD_TOO_LARGE` and `TENANT_MAINTENANCE` predate the kebab-case codes. They
keep their spelling, so clients relying on them continue to work.
