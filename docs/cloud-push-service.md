# Push Service

The twinsphere push service allows you to push serialized asset administration shells
from your twinsphere tenant to any configured endpoint.
Refer to the Swagger documentation (available at `/sphere/swagger/index.html`) for detailed
information on each parameter and return value.

To send AAS data to a desired target, follow these steps:

1. Create a valid push target with
    1. a unique name to identify the target (choose a URL-friendly name — e.g. lowercase alphanumeric with hyphens
    — since it is used as a path parameter in API URLs)
    2. the target type (e.g. `azure-blob-storage`, `aasx-file-server`, `sharecat`, `sap-bnac`)
    3. the type-specific configuration including connection details and credentials
2. Create a new push job with
    1. the name of the target to push the data to
    2. the IDs of the shells and submodels you want to push
    3. the desired serialization format
    4. whether to include concept descriptions (boolean).

## Target management

Target management is performed through the `/sphere/api/v1/push/targets` endpoints.

<!-- markdownlint-disable line-length -->

| Operation | Method | Endpoint | Description |
|-----------|--------|----------|-------------|
| Create target | `POST` | `/sphere/api/v1/push/targets` | Create a new push target |
| List targets | `GET` | `/sphere/api/v1/push/targets` | Retrieve all configured push targets |
| Get target | `GET` | `/sphere/api/v1/push/targets/{name}` | Retrieve a specific push target by name |
| Update target | `PUT` | `/sphere/api/v1/push/targets/{name}` | Update an existing push target |
| Delete target | `DELETE` | `/sphere/api/v1/push/targets/{name}` | Delete a push target |

<!-- markdownlint-enable line-length -->

!!! important
    All credentials and secrets (SAS URLs, client secrets, access tokens) must be provided as **plain text**.
    Do not base64-encode or otherwise transform secret values before sending them.
    twinsphere will only store your credentials in encrypted form — they are never persisted as plain text.
    If a secret contains special characters like `"` or `\`, apply standard JSON string escaping
    (e.g. `\"`, `\\`). No additional encoding is required.

!!! note
    Please make sure that the target is reachable from the internet!

### Create Target

> `POST https://{twinsphereTenantURL}/sphere/api/v1/push/targets`

To create a target, choose a unique name and provide the type-specific configuration
(see [Supported Targets](#supported-targets) below).

#### Example Request

```http
POST /sphere/api/v1/push/targets
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "{your-custom-target-name}",
  "type": "azure-blob-storage",
  "configuration": {
    "blobContainerSasUrl": "https://..."
  }
}
```

#### Example Response (201 Created)

```json
{
  "name": "{your-custom-target-name}",
  "type": "azure-blob-storage",
  "configuration": {
    "blobContainerSasUrl": "https://..."
  }
}
```

### Update Target

> `PUT https://{twinsphereTenantURL}/sphere/api/v1/push/targets/{name}`

The update request uses the same configuration body as the create request, but the `name` field
is not required — the target is identified by the `{name}` path parameter.

#### Example Request

```http
PUT /sphere/api/v1/push/targets/{name}
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "azure-blob-storage",
  "configuration": {
    "blobContainerSasUrl": "https://..."
  }
}
```

The response is `204 No Content` — no body is returned on a successful update.

### Supported Targets

#### Azure Blob Storage

To connect to Azure Blob Storage, you need to create a Blob container in advance.
Issue a Shared Access Signature (SAS) token with full rights and provide the "Blob SAS URL"
in the configuration body as shown in the example below:

```json
{
  "name": "{your-custom-target-name}",
  "type": "azure-blob-storage",
  "configuration": {
    "blobContainerSasUrl": "https://..."
  }
}
```

!!! note
    The `blobContainerSasUrl` must include the host, blob container name, and the SAS token
    required for the connection. Make sure to use a URL starting with *https*.
    For more information on how to obtain your container SAS URL,
    visit: [Azure Storage SAS Overview](https://learn.microsoft.com/en-us/azure/storage/common/storage-sas-overview)

#### AASX File Server

To connect to the AASX File Server, you need to create a target with a configuration as shown in the example below:

```json
{
  "name": "{your-custom-target-name}",
  "type": "aasx-file-server",
  "configuration": {
    "credentials": {
      "accessTokenUrl": "https://{domain}/{path}/token",
      "clientId": "{id}",
      "clientSecret": "{secret}"
    },
    "destination": {
      "endpointUrl": "https://{domain}/{path}/upload"
    }
  }
}
```

!!! note
    - The AASX File Server only supports the `application/asset-administration-shell-package+json` serialization format.
    - All URLs must be absolute and point to your access token or push target resource.

#### Sharecat (experimental)

!!! warning
    The Sharecat target is currently in **experimental** state and should only be used for prototypes / experimentation.

To connect to Sharecat, you need to create a target with a configuration as shown in the example below:

```json
{
  "name": "{your-custom-target-name}",
  "type": "sharecat",
  "configuration": {
    "credentials": {
      "accessTokenUrl": "https://{domain}/{path}/token",
      "clientId": "{id}",
      "clientSecret": "{secret}"
    },
    "destination": {
      "baseUrl": "https://{domain}/{path}/workspaces",
      "workspaceId": "{id}",
      "parentId": "{id}"
    }
  }
}
```

!!! note
    - Sharecat only supports the `application/asset-administration-shell-package+json` serialization format.
    - All URLs must be absolute and point to your access token or push target resource.
    - The destination's `workspaceId` and `parentId` are specific IDs of the Sharecat ecosystem.

#### SAP Business Network Asset Collaboration (experimental)

!!! warning
    The SAP BNAC target is currently in **experimental** state and should only be used for prototypes / experimentation.

To connect to SAP Business Network Asset Collaboration (SAP BNAC), you need an SAP Asset Intelligence Network
subscription with API access. Create a target with a configuration as shown in the example below:

```json
{
  "name": "{your-custom-target-name}",
  "type": "sap-bnac",
  "configuration": {
    "credentials": {
      "accessTokenUrl": "https://{domain}/oauth/token",
      "clientId": "{id}",
      "clientSecret": "{secret}"
    },
    "destination": {
      "apiBaseUrl": "https://{domain}",
      "businessPartnerId": "{your-business-partner-id}",
      "groupId": "{your-authorization-group-id}"
    }
  }
}
```

!!! note
    - All configuration fields (`apiBaseUrl`, `businessPartnerId`, `groupId`, and the `credentials`)
      are required.
    - SAP BNAC always uses the `application/asset-administration-shell-package+json` serialization format.
      The `serializationFormat` field in the push job request is ignored for SAP BNAC targets.
    - The `apiBaseUrl` is the base URL of your SAP BNAC API instance
      (e.g. `https://ain.{landscape}.business-network.cloud.sap`).
    - The `businessPartnerId` identifies your organization in SAP BNAC and is sent as the
      `x-businesspartner-id` header.
    - The `groupId` is the SAP BNAC authorization group the created equipment is published and shared
      with. Different targets can point at different authorization groups.
    - For OAuth credentials, only SAP service keys of type `instance-secret` (default) or
      `binding-secret` are supported.
    - Supported submodel types:
        - Handover Documentation V2.0 (SemanticId `0173-1#01-AHF578#003`) — **recommended**.
        - Handover Documentation V1.2 (SemanticId `0173-1#01-AHF578#001`) — supported, but SAP BNAC
          currently accepts only a single primary `DocumentId` per Handover Documentation submodel,
          so a V1.2 submodel may contain only one `Document`. Prefer V2.0, which has no such limit.
        - Nameplate V3.0 (SemanticId `https://admin-shell.io/idta/nameplate/3/0/Nameplate`)
    - SAP BNAC requires exactly one Nameplate V3.0 submodel per shell in the push job.
    - SAP BNAC only supports exactly one shell per push job. The `shellIds` array must contain exactly one entry.

## Job management

To push data from your twinsphere repository to one of your targets, you need to create a push job.
Push jobs are managed through the `/sphere/api/v1/push/jobs` endpoints.

<!-- markdownlint-disable line-length -->

| Operation | Method | Endpoint | Description |
|-----------|--------|----------|-------------|
| Create job | `POST` | `/sphere/api/v1/push/jobs` | Create a new push job |
| Get job status | `GET` | `/sphere/api/v1/push/jobs/{id}` | Query the state of a push job |

<!-- markdownlint-enable line-length -->

Since push jobs can take some time to complete, an asynchronous REST pattern is used.
A POST to `/sphere/api/v1/push/jobs` returns an identifier that you can use
with a GET to `/sphere/api/v1/push/jobs/{id}` to query the state of the job.

We currently support pushing of shells, submodels, and concept descriptions. The supported
output serialization formats are:

- application/json
- application/xml
- application/asset-administration-shell-package+json

### Create Job

> `POST https://{twinsphereTenantURL}/sphere/api/v1/push/jobs`

!!! note
    The `shellIds` and `submodelIds` must be provided as plain text identifiers — do not base64-encode
    or otherwise transform them.

#### Example Request

```http
POST /sphere/api/v1/push/jobs
Authorization: Bearer {token}
Content-Type: application/json

{
  "pushTargetName": "{your-custom-target-name}",
  "serializationFormat": "application/json",
  "shellIds": ["{shell-id}"],
  "submodelIds": ["{submodel-id-1}", "{submodel-id-2}"],
  "includeConceptDescriptions": true
}
```

#### Example Response (201 Created)

```json
{
  "identifier": "{job-id}",
  "state": "processing",
  "createdOn": "2025-05-28T12:00:00Z",
  "updatedOn": "2025-05-28T12:00:00Z",
  "message": null,
  "pushTargetName": "{your-custom-target-name}",
  "serializationFormat": "application/json",
  "shellIds": ["{shell-id}"],
  "submodelIds": ["{submodel-id-1}", "{submodel-id-2}"],
  "includeConceptDescriptions": true,
  "metadata": null
}
```

Use the returned `identifier` to poll the job status.

### Get Job Status

> `GET https://{twinsphereTenantURL}/sphere/api/v1/push/jobs/{id}`

#### Example Request

```http
GET /sphere/api/v1/push/jobs/{id}
Authorization: Bearer {token}
```

#### Example Response (200 OK)

```json
{
  "identifier": "{job-id}",
  "state": "completed",
  "createdOn": "2025-05-28T12:00:00Z",
  "updatedOn": "2025-05-28T12:01:30Z",
  "message": null,
  "pushTargetName": "{your-custom-target-name}",
  "serializationFormat": "application/json",
  "shellIds": ["{shell-id}"],
  "submodelIds": ["{submodel-id-1}", "{submodel-id-2}"],
  "includeConceptDescriptions": true,
  "metadata": {}
}
```

The `state` field indicates the current status of the job:

| State | Description |
|-------|-------------|
| `processing` | The job is currently running |
| `completed` | The job finished successfully |
| `failed` | The job failed — check the `message` field for the error reason |

The `metadata` field may contain additional target-specific information once the job completes
(see [SAP BNAC push jobs](#sap-bnac-push-jobs-experimental)).

If a job fails, the `message` field contains the error reason.
Most issues occur due to invalid target configuration parameters or
network connectivity issues between the twinsphere service and the target.

If you cannot resolve the issue based on the error message,
[please contact our support](contact.md) for further assistance.

### SAP BNAC push jobs (experimental)

When creating a push job for an SAP BNAC target, create a standard push job request:

```http
POST /sphere/api/v1/push/jobs
Authorization: Bearer {token}
Content-Type: application/json

{
  "pushTargetName": "{your-sap-bnac-target-name}",
  "serializationFormat": "application/asset-administration-shell-package+json",
  "shellIds": ["{shell-id}"],
  "submodelIds": ["{nameplate-submodel-id}", "{handover-doc-submodel-id}"],
  "includeConceptDescriptions": true
}
```

The AASX package is uploaded to SAP BNAC and processed asynchronously. twinsphere polls the SAP BNAC
processing status internally and waits for completion before marking the push job as completed.

Once completed, the push job's `metadata` field contains:

- `handleId` — identifies the uploaded package in SAP BNAC
- `sapBnacStatus` — the full SAP BNAC status response as a JSON string, useful for diagnosing validation errors

#### Equipment publishing and sharing

After a successful upload, twinsphere resolves the equipment created from the package, publishes it,
and shares it with the SAP BNAC authorization group configured as the target's `groupId`.

!!! note
    If any step in this chain (upload, processing, publish, or share) fails, the push job is marked
    `failed`. Each step is idempotent, so you can simply create a new push job with the same shell and
    submodels to retry the whole flow — re-running it does not create duplicates: SAP BNAC updates the
    existing equipment instead of creating a second one, and re-publishing or re-sharing an already
    published/shared equipment is a no-op.
