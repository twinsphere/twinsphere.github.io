# VDI 2770 Connector

The twinsphere VDI 2770 connector turns a VDI 2770 documentation package into a Handover Documentation 2.0
submodel in your twinsphere tenant. You upload the package as it is. twinsphere builds the submodel from
the package metadata and stores the documents it contains as twinsphere files, which the submodel refers
to. You do not have to convert your documentation to AAS yourself. The package format is defined by
[VDI 2770 Blatt 1](https://www.vdi.de/en/home/vdi-standards/details/vdi-2770-blatt-1-operation-of-process-engineering-plants-minimum-requirements-for-digital-manufacturer-information-for-the-process-industry-fundamentals).

Refer to the Swagger documentation (available at `/sphere/swagger/index.html`) for detailed information
on each parameter and return value.

## Package upload

<!-- markdownlint-disable line-length -->

| Operation | Method | Endpoint | Description |
|-----------|--------|----------|-------------|
| Upload package | `POST` | `/sphere/api/v1/vdi2770-connector` | Create or replace a Handover Documentation 2.0 submodel from a VDI 2770 package |

<!-- markdownlint-enable line-length -->

### Form fields

The request is sent as `multipart/form-data` with the following fields:

<!-- markdownlint-disable line-length -->

| Field | Required | Description |
|-------|----------|-------------|
| `submodelId` | yes | Identifier of the submodel to create or replace |
| `aasIdentifier` | no | Identifier of an existing asset administration shell the submodel is linked to. Omit it to create the submodel without a link |
| `strict` | no | Set to `true` to report findings the VDI 2770 standard tolerates. Defaults to `false` |
| `file` | yes | The VDI 2770 package |

<!-- markdownlint-enable line-length -->

!!! important
    `submodelId` and `aasIdentifier` are passed as plain text identifiers. Do not base64-encode or
    otherwise transform them. This differs from the identifiers in the paths of the repository endpoints,
    which are encoded.

### Upload a package

> `POST https://{twinsphereTenantURL}/sphere/api/v1/vdi2770-connector`

#### Example Request

```http
POST /sphere/api/v1/vdi2770-connector
Authorization: Bearer {token}
Content-Type: multipart/form-data; boundary=boundary

--boundary
Content-Disposition: form-data; name="submodelId"

https://example.com/submodels/handover-documentation
--boundary
Content-Disposition: form-data; name="aasIdentifier"

https://example.com/shells/pump-4711
--boundary
Content-Disposition: form-data; name="file"; filename="documentation.zip"
Content-Type: application/zip

{binary content of the VDI 2770 package}
--boundary--
```

#### Example Response (200 OK)

The response body is the submodel that was created or replaced.

## Strict checking

Every package is checked against what the VDI 2770 standard requires before anything is stored.
Setting `strict` to `true` adds checks for findings the standard itself tolerates: files that are
contained in the package but not referenced by any document, document relationships that cannot be
resolved within the package, and `DocumentVersion` entries that use the same language more than once.

!!! note
    A package that is accepted by default can still be rejected with `strict` set. Start without it,
    and switch it on when you want those additional findings reported.

## Documents from the package

The documents contained in the package are stored as twinsphere files and referenced from the `File`
elements of the resulting submodel. There are two ways to download them:

- With the standard attachment endpoint
  `GET /api/v3.0/submodels/{submodelId}/submodel-elements/{idShortPath}/attachment`, which addresses a
  document by the idShort path of its `File` element. Nothing has to be read out of the submodel body
  beyond that path.
- With the file path held by the respective `File` element, through the regular
  [file endpoints](cloud-documentation.md#file-repository): `GET /sphere/api/v1/files/{filePath}`, like any
  other file in your tenant.

Both are path-based endpoints, so the identifier or file path in the URL is base64-url-encoded, unlike the
plain form fields of the upload.

!!! note
    No preview files are generated for the uploaded documents.

## Replacing a submodel

Uploading a package under a `submodelId` that already exists replaces that submodel with the content of
the new package. Correcting a package and uploading it again is the supported way to update the submodel.

Linking the same submodel to the same shell twice does not create a second reference, so repeating an
upload with the same `aasIdentifier` leaves the shell unchanged.

## Limits

Packages of up to 1 GiB are accepted. A larger package, or a package whose submodel would exceed the
submodel size limit of 10 MiB, is rejected with `413 Content Too Large`. The 10 MiB limit is the same for
every tenant and cannot be raised.

The submodel grows with the **number of documents** a package describes, not with the size of the package,
so the document count is what usually reaches the limit first - a package of a few hundred documents can
exceed it however small its files are. The submodel size is checked once the package has been transferred
and its documents stored, so the rejection arrives at the end of the upload.

!!! important
    A package has at most five minutes to reach the server. A transfer still running after that is cut and
    answered with `504 Gateway Timeout` or `499 Client Closed Request`, depending on the HTTP version used.

## Status codes

<!-- markdownlint-disable line-length -->

| Status | Meaning |
|--------|---------|
| `200 OK` | The package was imported; the body contains the created or replaced submodel |
| `400 Bad Request` | The request is malformed, the package does not meet the checks it was run against, or the given shell does not exist |
| `401 Unauthorized` | The request is not authenticated |
| `403 Forbidden` | You are not allowed to write the submodel, or the shell given in `aasIdentifier` |
| `409 Conflict` | A resource that is created or updated was modified by another process in the meantime |
| `413 Content Too Large` | The package, or the submodel produced from it, exceeds the size limit |
| `422 Unprocessable Content` | A quota of your tenant is exhausted |
| `503 Service Unavailable` | Too many uploads are in progress; retry after the number of seconds in the `Retry-After` header |

<!-- markdownlint-enable line-length -->

!!! note
    The submodel, the metadata of its documents and the link to the shell are stored together or not at
    all. Documents that were already uploaded when a later step fails remain stored, but no submodel
    refers to them.
