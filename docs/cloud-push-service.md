# Push Service

The twinsphere push service allows you to push serialized asset administration shells
from your twinsphere tenant to any configured endpoint.
Refer to the Swagger documentation (available at `/sphere/swagger/index.html`) for detailed
information on each parameter and return value.

To send AAS data to a desired target, follow these steps:

1. Create a valid push target with
    1. a unique name to identify the target (choose a URL-friendly name — e.g. lowercase alphanumeric with hyphens
    — since it is used as a path parameter in API URLs)
    2. the target type (e.g. `azure-blob-storage`, `aasx-file-server`, `sharecat`)
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

If a job fails, the `message` field contains the error reason.
Most issues occur due to invalid target configuration parameters or
network connectivity issues between the twinsphere service and the target.

If you cannot resolve the issue based on the error message,
[please contact our support](contact.md) for further assistance.
