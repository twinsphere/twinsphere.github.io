# API Documentation

This documentation complements the [swagger documentation of our
API](https://conplement.cloud.twinsphere.io/swagger/index.html) and contains addition information and background to the
endpoints.

---

## Discovery

### Implicit Discovery

We have introduced a **proprietary comfort feature** that allows asset links to be retrieved without or in addition to
an existing "standard" discovery. Our Implicit Discovery works directly on the tenant's existing asset administration
shell repository data and creates shell descriptors on-the-fly when called.

The advantage of this feature is that all shells of your shell repository are hereby discoverable by default - without
the need of explicitly entering lookup data into a discovery. The limitation of it is that only those "local shell" are
discoverable and the quantity cannot be restricted or extended to shells of further (external) repositories. For
distributed scenarios you need to use a standard discovery.

The endpoints of our implicit discovery feature match IDTA's read service profile SSP-002 of the Discovery Service
Specification and are located at the top level of our api path:

> https://*{twinsphereTenantURL}*/api/*{api_version}*/lookup/shells

### Standard ("Explicit") Discovery

Of course twinsphere also offers the official discovery service as specified. It is even possible to have multiple
instances of discoveries with different sets of shell descriptors within one tenants.

All endpoints of our discovery feature match IDTA's full service profile SSP-001 of the Discovery Service Specification
and are separated under a freely definable instance name:

> https://*{twinsphereTenantURL}*/***{instanceName}***/api/*{api_version}*/lookup/shells

In order to obtain a new discovery instance please contact our [support team](contact.md).

---

## Shell Registry

### Implicit Shell Registry

We have introduced a **proprietary comfort feature** that allows shell descriptors to be retrieved without or in
addition to an existing "standard" shell registry. Our Implicit Shell Registry works directly on the tenant's existing
asset administration shell repository data and creates basic shell descriptors on-the-fly when called.

The advantage of this feature is that all shells of your shell repository are hereby registered by default - without the
need of explicitly entering descriptors into a registry. The limitation of it is that only local shells are retrievable
and their quantity cannot be restricted or extended to shells of further (external) repositories. For distributed
scenarios you need to use a standard registry.

You might think: What a pointless feature - after all, you are asking a twinsphere tenant where a shell is located that
is hosted by this very tenant. So the answer you'll get will always be "The shell is here with me!". However, the
advantage of this approach lies in simple client-centered use cases, where clients are able to follow the standard call
procedure (Discovery => Registry => Shell => Submodel) without you having to deal with shell registrations.

The endpoints of our Implicit Shell Registry feature correspond to the IDTA read service profile SSP-002 of the
Discovery Service Specification and are located at the top level of our api path:

> https://*{twinsphereTenantURL}*/api/*{api_version}*/shell-descriptors

### Standard ("Explicit") Shell Registry

Of course twinsphere also offers the official Asset Administration Shell Registry service as specified. It is even
possible to have multiple instances of registries with different sets of shell descriptors within one tenants.

All endpoints of our registry feature correspond to the IDTA full service profile SSP-001 of the Asset Administration
Shell Registry Service Specification and are separated under a freely definable instance name:

> https://*{twinsphereTenantURL}*/***{instanceName}***/api/*{api_version}*/shell-descriptors

In order to obtain such a new registry instance please contact our [support team](contact.md).

---

## Submodel Registry

### Implicit Submodel Registry

We have introduced a **proprietary comfort feature** that allows submodel descriptors to be retrieved without or in
addition to an existing "standard" submodel registry. Our Implicit Submodel Registry works directly on the tenant's
existing submodel repository data and creates basic submodel descriptors on-the-fly when called.

For the advantage and limitations of this feature are analog to those of our Implicit Shell Registry. Please refer
there.

The endpoints of our Implicit Submodel Registry feature correspond to the IDTA read service profile SSP-002 of the
Discovery Service Specification and are located at the top level of our api path:

> https://*{twinsphereTenantURL}*/api/*{api_version}*/submodel-descriptors

### Standard ("Explicit") Submodel Registry

> *Not yet available, coming soon...*

---

## Shell Repository

### Enhanced GET /shells

We have introduced an optional extra query parameter "assetKind" for filtering shells according to their asset kind.
Presently, the available asset kinds include:

- Instance
- Type

You can utilize this parameter within your existing /shells calls to filter based on the asset kind. If this parameter
isn't provided, all shells, regardless of their asset kind, will be returned.

Due to its optional nature, the parameter is a non-breaking extension of the standard.

---

## Submodel Repository

### Enhanced GET /submodels

We have introduced an optional extra query parameter "kind" for filtering submodels according to their kind. Presently,
the available kinds include:

- Instance
- Template

You can utilize this parameter within your existing /submodels calls to filter based on the kind. If this parameter
isn't provided, all submodels, regardless of their kind, will be returned.

Due to its optional nature, the parameter is a non-breaking extension of the standard.

---

## Concept Description Repository

Available and works :) Nothing special beyond the defined standard to document here.

---

## File Repository

twinsphere is self-sufficiently capable of hosting and managing files and documents to be referenced from any submodel
within your tenant.

### twinsphere File Paths

The key concept behind the file repository are so called 'twinsphere file paths' (tfp). This feature enables clients to
reuse and share files between shells and submodels, eliminating the need to upload the same files multiple times.

A tfp follows a fixed format/pattern, for example:
`file:/dHdpbnNwaGVyZS1maWxl/cp/18ef5516-618b-4a97-ac4b-d47f5d5ee823/thumbnail.jpg`. It follows the file URI scheme (as
requested by the specifications in advance to v3.1) and consists of a static part, the tenant name, a unique documentId,
and a file name.

This tfp cannot be generated by the client. It is created by twinsphere when uploading a file to the repository (see
[Usage](#usage-of-file-api) below) and should be (re)used in submodels when referencing a file resources.

**Please notice**: A tfp is only valid in the context of a single tenant and is not reachable from outside this context.

### Usage of File API

twinsphere's file repository is accessible via the "files" endpoints at `https://{tenant_url}/api/v3.0/files…`

Once a file has been uploaded to the file repository it can be referenced by shells (as thumbnail) or submodels (as
attachment) using its corresponding tfp.

We recommend the following procedure:

1. `POST /files` to upload a document, tfp is returned
2. Remember the tfp and use it as File.value in submodels as required

**Please notice:** There is currently no way to search for a tfp in the file repository, as no metadata about the file
is stored apart from the file name - and this may not be unique in the repository.

Replacing an existing file by `PUT /files` will replace the files content while keeping its filename and tfp. So all
reference stay valid and now point to the new content.

To remove a file physically from the repository, you have to use the `DELETE /files` interface. Please be aware that
there is no check for existing references, so you may create invalid reference by deleting a file.

You can attach meta information to a twinsphere file at 
`https://{tenant_url}/sphere/api/v1.0/files/{tfp}/metadata` endpoint.

```json 
{
  "displayName": "string",
  "classification": "string",
  "attributes": {
    "key1": "string",
    "key2": "string",
    "key3": "string"
  }
}
```

- **displayName**: Custom name for the file.  
- **classification**: Must be a valid class ID as defined in **VDI 2770**.  
- **attributes**: Custom metadata as key–value pairs.

### Adaption of standard operations

The introduction of our file repository made it necessary to adapt the behavior of standard operations working with
files:

- `DELETE /attachment` and `DELETE /thumbnail`
    - Only removes file references from SM/AAS.
    - Deletion of file itself is only possible via `DELETE /files` (see above)
- `PUT /attachment` and `PUT /thumbnail`
    - Uploads new file to repo and updates this single reference with new twinsphere File Path.
    - Former file stays unchanged, still exists on file repo and its twinsphere File Path is still valid.
    - All other references to the former file stay untouched.
- `GET /serialization` for AASX packages
    - Packs all referenced files of resolvable tfps (file exists in tenant's file repository) and ignores invalid
    twinsphere File Paths (non-existing files)

Implications of this adapted behavior:

- If you (re-)upload a thumbnail or attachment via standard endpoints all referencing shells/submodels which used the
  previous file must be updated as well to use the updated file.
- A better way to update all references of an old file is to reupload the file via PUT /files. Its filename cannot be
  changed in this way though.
- If you update the thumbnail or attachment file value/path entry in the metamodel to something that does not resemble a
  twinsphere file path (e.g., `file:/aasx/file/thumbnail.jpg`), the download of the file will no longer work.
- If you update references to a file in a single submodel element (with "PUT attachment" or "PUT thumbnail"), all other
  references will still be valid but are not updated and point to the former file.

---

## Import

An AASX package can be uploaded via the import function. Currently, only one shell is supported. The import process is
not transactional, so the shell, submodels, and files may be partially created even in the event of an error. It is
important to note that an import always overwrites existing data.

A package is considered valid if:

- Successful validation
- Exactly one shell
- Other elements are optional

If a thumbnail is required, an asset thumbnail must be provided. Package thumbnails are ignored.

Currently, there is a limitation in "[Content_Types].xml". All paths are case-sensitive and must exactly match the
folder path within the package.

---

## Serialization

### /serialization

The serialization endpoint returns an environment that contains specified asset administration shells, submodels and
concept descriptions (see
[part 2 of the AAS specification](https://industrialdigitaltwin.org/wp-content/uploads/2023/06/IDTA-01002-3-0_SpecificationAssetAdministrationShell_Part2_API_.pdf#page=43)).

The desired return type can be specified using the "Accept" header parameter of the request. Valid return types include

- *application/xml* (default),
- *application/json*, and
- *application/asset-administration-shell-package+json*.

Packages currently contain the environment as JSON – XML coming soon.

#### ⚠️ Note

If you use the serialization in the Swagger UI there is one problem, you cannot set the accept header in the UI. You
have to go down to the `Responses` section and there, in the `200` section, choose the accept header value from the
drop down and send the request. Now you will get your correct serialized shell.

As mentioned in [this issue on github](https://github.com/swagger-api/swagger-ui/issues/9400), this is a Swagger UI /
OpenApi problem and can not be fixed.

As mentioned in [this issue on github](https://github.com/swagger-api/swagger-ui/issues/5217), Swagger UI produces an
corrupt File on using the Accept Header "*application/asset-administration-shell-package+json*". Using the API direct
with for example Postman or CURL gives the correct File.

### Serialization Modifiers

#### Level Modifier

> *Not yet available, coming soon...*

#### Content Modifier

You can use special content modifiers to get special serializations of the requested data, e.g. only the metadata of an
object.

##### Metadata ($metadata)

From IDTA Spec Part 2: *"Only metadata of an element or child elements is returned; the value is not."*

This is implemented for the following endpoints:

- GET `/submodel/{submodelIdentifier}/$metadata`

Let us give you an example for this endpoint with the nameplate submodel.

```json
{
  "idShort": "Nameplate",
  "id": "https://company.com/ids/sm/nameplate",
  "kind": "Instance",
  "semanticId": {
    "type": "ExternalReference",
    "keys": [
      {
        "type": "GlobalReference",
        "value": "https://admin-shell.io/zvei/nameplate/2/0/Nameplate"
      }
    ]
  },
  "modelType": "Submodel"
}
```

##### Value ($value)

> *Not yet available, coming soon...*

##### Reference ($reference)

This gives you the Reference object of an object or a list of reference objects on endpoints which works with many
objects. For example the shellIds of all shells in your repository.

From IDTA Spec Part 2: *"Only applicable to Referables. Only the reference to the found element is returned; potential
child elements are ignored."*

Actually it is not implemented for the for the Asset Administration Shell and Submodel endpoints

- /shells/{aasIdentifier}/$reference
- /shells/{aasIdentifier}/submodels/{submodelIdentifier}/$reference
- /shells/{aasIdentifier}/submodels/{submodelIdentifier}/submodel-elements/{idShortPath}/$reference

##### Path ($path)

From IDTA Spec Part 2: *"Returns the idShort of the requested element and a list of idShort paths to child elements if
the requested element is a Submodel, a SubmodelElementCollection, a SubmodelElementList, a AnnotatedRelationshipElement,
or an Entity."*

This is implemented for the following endpoints:

- GET `/submodel/{submodelIdentifier}/$path`

The return value for our Nameplate Submodel would be:

```json
[
  "URIOfTheProduct",
  "ManufacturerName",
  "ManufacturerProductDesignation",
  "ContactInformation",
  "ContactInformation.Company",
  "ContactInformation.CityTown",
  "ContactInformation.Phone",
  "ContactInformation.Phone.TelephoneNumber",
  "ContactInformation.Phone.TypeOfTelephone",
  "ContactInformation.Fax",
  "ContactInformation.Fax.FaxNumber",
  "ContactInformation.Fax.TypeOfFaxNumber",
  "ContactInformation.Street",
  "ContactInformation.Zipcode",
  "ContactInformation.AddressOfAdditionalLink",
  "ManufacturerProductRoot",
  "ManufacturerProductFamily",
  "OrderCodeOfManufacturer",
  "ProductArticleNumberOfManufacturer",
  "Markings",
  "Markings.Marking01",
  "Markings.Marking01.MarkingName",
  "Markings.Marking02",
  "Markings.Marking02.MarkingName",
  "Markings.Marking03",
  "Markings.Marking03.MarkingName"
]
```

#### Extent Modifier

Only applicable to BLOB elements.

The "extent" parameter controls whether embedded data is returned in base64 format or not. By default, if the parameter
is not provided, no embedded data is returned. The possible values are "WithBLOBValue" and "WithoutBLOBValue". The
default is "WithoutBlobValue".

There are only a few submodels that have BLOBs inside. But we can give you a generally example how the result with this
modifier will look like. The name of the BLOB is "Library".

Please note that this modifier is given as a query parameter on the endpoints.

This is implemented for the following endpoints:

- GET `/submodel/{submodelIdentifier}?extent=`

`WithoutBLOBValue`

```json
{
    "Library": {
        "contentType": "application/octet-stream"
    }
}
```

`WithBLOBValue`

```json
{
    "Library": {
        "contentType": "application/octet-stream"
        "value": "VGhpcyBpcyBteSBibG9i"
    }
}
```

---

## Pagination

Some data can be retrieved page by page. For this, you can pass a limit and a cursor.

The limit determines the maximum size of a page, and the cursor specifies the position from which data retrieval starts.
The result object of such a request contains the cursor value for the next request/page under paging_metadata.cursor.

Interface example:

```csharp
public async Task<IActionResult> GetAllAssetAdministrationShells(
        [FromQuery] List<string>? assetIds = null,
        [FromQuery] string? idShort = null,
        [FromQuery] int? limit = null,
        [FromQuery] string? cursor = null,
        [FromQuery] Core.AssetKind? assetKind = null)
```

Result Model:

```json
{
    "result": {},
    "paging_metadata": {
        "cursor": ""
    }
}
```
