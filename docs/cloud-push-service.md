# Push Service

The twinsphere push service allows you to push serialized asset administration shells
from your twinsphere tenant to any of the configurable endpoints.
Take a look at the Swagger for more API documentation around each parameter and return value.

To send AAS data to a desired target, the following procedure must be followed:

1. Create a valid target
2. Create a new push job with
    1. the name of the target to push the data to
    2. the IDs of the shells and submodels you want to push
    3. the desired serialization format
    4. boolean if to include concept descriptions.

## Target management

Target management is performed through `/sphere/push/targets/*` endpoints.

To create or update a target, use the `/sphere/push/targets/{name}` endpoint
(you need to choose a name for the target yourself), and post the JSON configuration
as the body depending on the target itself (see supported targets below).

Please note that all connection information of targets will be handled as secret
by twinsphere and only stored in encrypted form.

!!! note
    Please make sure that the target is reachable from the internet!

### Supported Targets

#### Azure Blob Storage

To connect to the Azure Blob Storage, you need to create a Blob container in advance.
Please issue a Shared access token with full rights and insert the "Blob SAS URL" with
the configuration body as in the example below:

```json
{
  "name": "{your-custom-target-name}",
  "type": "azure-blob-storage",
  "configuration": {
    "blobContainerSasUrl": "..."
  }
}
```

!!! note
    blobContainerSasUrl should include the http target, blob container name and the secret
    required for the connection! Make sure to use the URL value starting with *https*.
    For more information on how to obtain your container SAS URL
    visit: [Azure Storage SAS Overview](https://learn.microsoft.com/en-us/azure/storage/common/storage-sas-overview)

#### AASX File Server

To connect to the AASX File Server, you need to create a target with a configuration as given in the example below:

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
    - A name is not required in the request body when calling the update target endpoint.

#### Sharecat (experimental)

To connect to Sharecat, you need to create a target with a configuration as given in the example below:

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

> **Note**
>
> - The Sharecat target is currently in **experimental** state and may be modified or removed in future releases.
> - Sharecat only supports the `application/asset-administration-shell-package+json` serialization format.
> - All URLs must be absolute and point to your access token or push target resource.
> - The destination's `workspaceId` and `parentId` are specific Ids of the Sharecat eco-system.
> - A name is not required in the request body when calling the update target endpoint.

## Job management

To perform a push from twinsphere repository to one of your targets, you have to create a push job.
Push jobs are managed through `/sphere/push/jobs/*` endpoints.

Since push jobs can take longer time to perform, asynchronous REST pattern is used.
Job you POST on `/sphere/push/jobs` will return an identifier, which you can use
with GET on `/sphere/push/jobs/{id}` to query the state of the job.

Refer to Swagger documentation (on `/swagger/index.html`) for the push job configuration options.
We currently support pushing of shells, submodels and concept descriptions. Output serialization
formats supported are:

- application/json
- application/xml
- application/asset-administration-shell-package+json

If the job failed, you can see the reason inside the message property.
Most issue occur due to invalid target configuration parameters or
network connectivity issues between the twinsphere service and the target itself.

If you can not do anything with the error in the message,
[please contact our support](contact.md) and ask for more detailed help.
