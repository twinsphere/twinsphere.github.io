# DCC Connector

!!! warning
    The DCC connector is currently in **experimental** state and should only be used for prototypes /
    experimentation.

!!! warning "Not part of the AAS specification"
    The DCC connector is a twinsphere extension. It is not defined by the IDTA AAS API specification.

The twinsphere DCC connector turns a Digital Calibration Certificate (DCC) XML document into a Digital
Quality Document submodel in your twinsphere tenant. You upload the certificate as it is, and twinsphere
builds the submodel from it. The submodel can be linked to an asset administration shell in the same call.

Refer to the Swagger documentation (available at `/sphere/swagger/index.html`) for detailed information
on each parameter and return value.

## Certificate upload

<!-- markdownlint-disable line-length -->

| Operation | Method | Endpoint | Description |
|-----------|--------|----------|-------------|
| Upload certificate | `POST` | `/sphere/api/v1/dcc-connector` | Create or replace a Digital Quality Document submodel from a DCC XML document |

<!-- markdownlint-enable line-length -->

### Form fields

The request is sent as `multipart/form-data` with the following fields:

<!-- markdownlint-disable line-length -->

| Field | Required | Description |
|-------|----------|-------------|
| `submodelId` | yes | Identifier of the submodel to create or replace |
| `aasIdentifier` | no | Identifier of an existing asset administration shell the submodel is linked to. Omit it to create the submodel without a link |
| `file` | yes | The DCC XML document |

<!-- markdownlint-enable line-length -->

!!! important
    `submodelId` and `aasIdentifier` are passed as plain text identifiers. Do not base64-encode or
    otherwise transform them. This differs from the identifiers in the paths of the repository endpoints,
    which are encoded.

### Upload a certificate

> `POST https://{twinsphereTenantURL}/sphere/api/v1/dcc-connector`

#### Example Request

```http
POST /sphere/api/v1/dcc-connector
Authorization: Bearer {token}
Content-Type: multipart/form-data; boundary=boundary

--boundary
Content-Disposition: form-data; name="submodelId"

https://example.com/submodels/calibration-certificate
--boundary
Content-Disposition: form-data; name="aasIdentifier"

https://example.com/shells/pump-4711
--boundary
Content-Disposition: form-data; name="file"; filename="certificate.xml"
Content-Type: application/xml

{content of the DCC XML document}
--boundary--
```

#### Example Response (200 OK)

The response body is the submodel that was created or replaced.

## Replacing a submodel

Uploading a certificate under a `submodelId` that already exists replaces that submodel with the content of
the new certificate.

Linking the same submodel to the same shell twice does not create a second reference, so repeating an
upload with the same `aasIdentifier` leaves the shell unchanged.

## Status codes

<!-- markdownlint-disable line-length -->

| Status | Meaning |
|--------|---------|
| `200 OK` | The certificate was imported; the body contains the created or replaced submodel |
| `400 Bad Request` | The request is malformed, the certificate cannot be converted, or the given shell does not exist |
| `401 Unauthorized` | The request is not authenticated |
| `403 Forbidden` | You are not allowed to write the submodel, or the shell given in `aasIdentifier` |
| `409 Conflict` | A resource that is created or updated was modified by another process in the meantime |
| `422 Unprocessable Content` | A quota of your tenant is exhausted |

<!-- markdownlint-enable line-length -->

!!! note
    The submodel and the link to the shell are stored together or not at all.
