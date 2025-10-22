# Release Notes of twinsphere Server / API

The twinsphere Server follows the semantic versioning format in the form major.minor.patch:
[https://semver.org/](https://semver.org/).

## Cloud 1.20

*23-Oct-2025*

- **[Files]** Automatic capture of metadata on twinsphere files during file upload
- **[Files]** Data migration of existing twinsphere files to adhere to new metadata concept
- **[Files]** Introduced new file metadata API endpoints for adding even more (custom) metadata to twinsphere files

## Cloud 1.19.1

*22-Oct-2025*

- **[DevOps]** Cluster Optimization: Introduced "tiers" tenant level for an optimized resource request/limit configuration
- **[DataMgmt]** Introduced optimistic concurrency handling for most of our CRUD operations
- **[ManageAPI]**  Added /me endpoint showing organizations and tenant assignments of logged in user

## Cloud 1.19

*20-Oct-2025*

- **[OrgMgmt]** Unified RBAC: New roles added
- **[ManageAPI]** Added role assignment endpoints
- **[ManageAPI]** Added user invite functionality to assign users to organizations
- **[ManageAPI]** Added service account functionality (with basic secret rotation)
- **[Bugfix]** Fixed /import validation to ignore File SME with empty value (was too strict before)

## Cloud 1.18

*12-Aug-2025*

- **[IDTA]** Now supporting meta-model specification V3.0.2 
- **[IDTA]** Now supporting API specificiation V3.0.4
- **[Push]** Added POST endpoint to sphere API for registration of new Push Targets
- **[Push]** Added new Push Target support for AASX File Servers
- **[Files]** Redesign of twinsphere's file handling including support for external file references - finally :)
    - Added support for Blob SME to the /attachment endpoints
    - Kept functionality with twinsphere file paths (TFS) in File SME for /attachement and package serialization
    - External file links are treated as such and not as files (package serialization inludes link not file and /attachment supports blobs and TFS only)
- **[Bugfix]** Fixed encoding of location header value in operation PostSubmodel

## Cloud 1.17

*11-Jul-2025*

- **[OrgMgmt]** Introduced organizations to group and manage users and tenants
    - Initial setup of organizations
    - Migration of all existing users to organizations
- **[OrgMgmt]** New internal Principal context service
    - Keeps the centralized info on "principals" (users and service accounts)
    - Informs about assigned organizations, tenants, roles, etc.
- **[ManageAPI]** New twinsphere Management Service
    - Public API which exposes automation endpoints for customers (for all product areas)
    - New get tenants endpoint
- **[Cloud]** New internal Cloud Automation Service
    - Used internally for tenant management and automation
- **[Security]** Established secure inter-service communication between all twinsphere services

## Cloud 1.16.1

*09-Jul-2025*

- **[Filter]** Added further shell properties displayName, idShort and aas-id to [Filter Queries](cloud-filter-queries.md)

## Cloud 1.16

*13-Jun-2025*

- **[Filter]** Introduction of Filter Queries feature, see [documentation](cloud-filter-queries.md) for more information

## Archive

### Cloud 1.15

*24-Apr-2025*

- **[SemConn]** Introduction of Semantic Connector feature, see [documentation](cloud-semantic-connector.md) for more
  information

### Cloud 1.14

*10-Mar-2025*

- **[Security]** New "showcase mode" removes security layer/need for authentication on a tenant (useful for hackathons
  etc.)
- **[Docs]** Viewer Release Notes are now separated and not included anymore to these Server release notes
- **[Docs]** Updated viewer and validator pages

### Cloud 1.13

*06-Feb-2025*

- **[Auth]** Added support for Azure Entra ID authentication federation (enabling SSO for customers)
- **[Auth]** Enhanced twinsphere ID login screen with twinsphere branding (logo, colors, ...)
- **[API]** Introduced content Modifier $value for a value only representation of submodels / submodel elements
- **[API]** Extended the SM repository with an [optional kind filter](cloud-documentation.md#enhanced-get-submodels)
  enabling querying of templates or instances only
- **[Push]** Introduced push feature for pushing shells, submodels & concept descriptions to configurable targets
    - Currently only Azure blob storage targets supported (MVP)
    - more target types to be added soon (like remote shell/submodel repositories)
- **[Docs]** Added [technical documentation on twinsphere ID](cloud-auth.md)
- **[Docs]** Documented reason and workaround for creation of invalid package files by [AASX
  serialization](cloud-documentation.md#serialization)
- **[Bugfix]** Prevented returning status code 500 on not decodable twinsphere file paths on file GET, PUT, DELETE
  endpoints

### Cloud 1.12

*28-Nov-2024*

- **[Viewer]** Authentication by twinsphere ID
    - Basic Auth was removed and replaced by a login button (twinsphere ID user needed)
    - Initial default user created for every tenant
- **[API]** Content modifier $metadata, $reference and $path are now fully available
- **[Search]** Enhanced security by filtering undesired requests
- **[Auth]** Added branding to twinsphere ID login screen and emails
- **[Viewer]** Redesigned app navigation
- **[Bugfix]** Input parameter(s) assetIds of following endpoints GET /lookup/shells and GET /shells now only accepts
  valid JSON of type specificAssetId as specified (accepted direct assetId value before)
- **[Bugfix]** Adapted viewer to respect input format serialization of assetIds Parameter(s) for discovery endpoint GET
  /lookup/shells

### Cloud 1.11.1

*07-Nov-2024*

- **[Bugfix]** Viewer now correctly displays internal segments of time series submodels

### Cloud 1.11

*06-Nov-2024*

- **[API]** Introduction of API-Endpoints to interact with submodels on submodel element level (CRUD)
    - Please be aware that change events will not yet be fired when changes on element level take place.
- **[API]** Removed SM-Superpaths for now due to Issue #260 · admin-shell-io/aas-specs-api

### Cloud 1.10.1

*29-Oct-2024*

- **[Viewer]** Added rendering of Entity and RelationshipElement types to generic view enabling display of BoM submodels

### Cloud 1.10

*09-Oct-2024*

- **[Auth]** Added the possibility for twinsphere ID human users to login to twinsphere's Swagger UI
- **[Security]** Introduced Patch & Update Management Process to keep all component up to date

### Cloud 1.9.4

*12-Sep-2024*

- **[Search]** Added complete end-to-end example for building a search based UI and pagination example in docs
- **[Search]** Introduced language specific indexing, increased indexing performance and optimized of index disk size

### Cloud 1.9.3

*11-Sep-2024*

- **[DevOps]** Moved all twinsphere production cloud (shared) tenants to a dedicated kubernetes cluster

### Cloud 1.9.2

*28-Aug-2024*

- **[Search]** We added the real names of the properties in all available languages and the unit of the value from the
  linked concept description to the collection object
- **[Bugfix]** /serialization now complies to the specified file name convention by naming the aas-spec file inside a
  created package /aasx/data.{xml|json}

### Cloud 1.9.1

*13-Aug-2024*

- **[API]** Introduction of proprietary Implicit Shell Registry for on-the-fly generation of basic shell descriptors
  based on existing shell repo data
- **[API]** Introduction of proprietary Implicit Submodel Registry for on-the-fly generation of basic submodel
  descriptors based on existing submodel repo data
- **[API]** Made some input params optional for GET /shell-descriptors (assetIds) and GET /lookup/shells (assetKind and
  assetType)
    - see [Registry-Lookup should not expect assetKind and assetType as mandatory input - Issue #298 -
    admin-shell-io/aas-specs-api (github.com)](https://github.com/admin-shell-io/aas-specs-api/issues/298)
    - see [Discovery-Lookup not consistently specified in Part 2 and OpenAPI spec- Issue #301 -
    admin-shell-io/aas-specs-api (github.com)](https://github.com/admin-shell-io/aas-specs-api/issues/301)

### Cloud 1.9

*07-Aug-2024*

- **[Bugfix]** /import now ignores package thumbnails. Instead default thumbnails of assets are used.
- **[Security]** Introduced vulnerability & patch level scanning
- **[Search]** Extended search index now supports user-defined aggregations on Properties and MultiLanguageProperties of
  Technical Data submodel
- **[Auth]** Introduction of OAuth2 JWT authentication (in addition to Basic Auth)
    - based on a *twinsphere ID* identity provider using Azure Entra ID
    - make it possible to use machine identity login with OAuth2 client credentials grant
    - server swagger UI now accepts an JWT token to authenticate (human login via client credentials grant)
- **[Auth]** Introduction of mandatory role based authorization for the server (RBAC)
    - added "reader" and "contributor" roles
    - in case of basic auth usage, the granted authorization is "contributor". This enables the the further usage of
    all server api endpoints
- **[Security]** Enabled twinsphere ID security logging

### Cloud 1.8

*18-Jul-2024*

- Added logging of all access to key store
- Introduction of twinsphere's search feature
    - First index on type shell classifications of technical data submodels available (more to follow)
    - New API endpoint /search for posting MongoDB queries based on available indexes
- Change Events are now an optional tenant feature and deactivated by default (opt-in, saves resource costs)

### Cloud 1.7

*23-May-2024*

- Introduction of File Repository for management of files (endpoints /api/v3.0/files…)
    - Files are identified by a so called twinsphere File Path which is valid in the context of a twinsphere tenant
    - Files can be referenced by shells or submodels using their twinsphere File Path
- Adaption of existing file endpoints
    - DELETE /attachment and DELETE /thumbnail
        - now only remove file references from SM/AAS
        - Deletion of file itself is only possible via DELETE /files (attention: no check for existing references)
    - PUT /attachment and PUT /thumbnail
        - Upload new file and update reference with its new twinsphere File Path
        - Former referenced file stays unchanged and its twinsphere File Path is still valid
    - GET /serialization for AASX packages
        - Packs file which can be found and ignores invalid twinsphere File Paths (non-existing files)

### Cloud 1.6

*22-Apr-2024*

- New optional query parameter in GET /shells enables filtering by asset type (e.g. only type shells)
- Restriction of endpoints with pagination to return a maximum of 250 list elements each (limit parameter)
- [Bugfix] Endpoints with pagination now no longer return a cursor attribute in the PagingMetadata object when the end
  of the result has been reached.

### Cloud 1.5.1

*15-Apr-2024*

<!-- markdownlint-disable no-inline-html -->

- Introduction of “friendly” tenant names in the URLs: <tenant-name>.cloud.twinsphere.io
    - By default, Tenant was accessible via a maximum 6-character <tenant-tag>
    - Alternatively, now any <tenant-name> can be assigned to the URL
    - When using such a <tenant-name>, the previous <tenant-tag> URL remains temporarily accessible until 10-May-2024
- [Bugfix] /serialization now also generates valid AASX packages in the case of AAS/SM without referenced files

<!-- markdownlint-enable no-inline-html -->

### Cloud 1.5

*09-Apr-2024*

<!-- markdownlint-disable no-inline-html -->

- Accessibility of the twinsphere Server API under new domain <tenant-tag>.cloud.twinsphere.io
    - Previous URL <tenant-tag>.aas.conplement.cloud remains temporarily accessible until 10-May-2024
- AAS Registry Service
    - Multiple independent instances can be used, each with a separate database
    - Optional service, must first be set up by the twinsphere team under a freely selectable instance name
    - API accessible at <tenant-tag>.cloud.twinsphere.io/{instance}/api/v3.0/shell-descriptors
- Discovery Service
    - Multiple independent instances can be used, each with a separate database
    - Optional service, must first be set up by the twinsphere team under a freely selectable instance name
    - API accessible at <tenant-tag>.cloud.twinsphere.io/{instance}/api/v3.0/lookup/shells
    - Runs in parallel to “implicit discovery”, which enables a lookup of all assets/AAS contained in the AAS repository
    (“DiscoveryRead”)
- [Bugfix] Preflight with direct API access from the browser now possible without any problems

<!-- markdownlint-enable no-inline-html -->

### Cloud 1.4

*27-Mar-2024*

- Separation of the submodel repository and conversion of the SM repo superpaths to the original root paths
    - Original SM repo superpaths are still temporarily available via redirects
- Introduction of referable file paths to reuse uploaded files and avoid file duplicates
- HTTP Access Headers of the API now allow access from any Origins (Access-Control-Allow-Origin: *)
    - Facilitates the direct integration of the twinsphere API into frontend applications

### Cloud 1.3.1

*15-Mar-2024*

- Gzip compression of the message payload of the change events
    - Allows the transport of larger submodels beyond the Azure Event Grid MQTT message size limit of 512kB
    - For usage and notes see [Change Events](cloud-change-events.md#topics-message-contracts-and-qos)
- Update of the aas-core-works metamodel to v1.0.1
    - [Bugfix] for Origin URL in packaging (see [release aas-package3-csharp
    1.0.1](https://github.com/aas-core-works/aas-package3-csharp/releases/tag/v1.0.1))
    - relevant for validation of the metamodel (see [release aas-core3.0-csharp
    1.0.1](https://github.com/aas-core-works/aas-core3.0-csharp/releases/tag/v1.0.1))

### Cloud 1.3

*13-Mar-2024*

<!-- markdownlint-disable no-inline-html -->

- Change event mechanism for cyclical information about changes to AAS & SM
    - For setup and usage please refer to [Change Events](cloud-change-events.md)
    - Payload of the event contains changed state of the changed AAS /SMs
- [Bugfix] GET /shells/<aasId>/submodels now returns none instead of incorrectly all available SMs for shells without
  SMs

<!-- markdownlint-enable no-inline-html -->

### Cloud 1.2.1

 *28-Feb-2024*

- [Bugfix] Fixed GetThumbnail operation for existing thumbnails (no more 404 "Document mapping was not found..." )

### Cloud 1.2

*27-Feb-2024*

- Introduction of a change log
    - Logging of any creation, modification and deletion of AAS and SM
    - Purely internal function required by the change events mechanism
- Job Scheduler component “Weaver”
    - Necessary structures for setting up regularly running jobs
    - e.g. in preparation for the change events mechanism
- Change Log Cleanup Job
    - Regularly cleans up the change log and thus saves storage costs
- Extension of internal service monitoring
- Improved validation by updating to the latest metamodel aas-core3.0-csharp v1.0
- [Bugfix] Prevention of multiple output of file attachments during serialization
- [Bugfix] Exclusive inclusion of referenced concept descriptions in serialized AASX packages
- [Bugfix] Extent modifier now only filters blobs and no more Base64 strings (“StatusValue” bug)
- [Bugfix] AASX package serialization no longer returns a 404 error code for assets without thumbnail

### Cloud 1.1.3

*15-Feb-2024*

- [Bugfix] Fixed missing query param assetIds for API endpoint /shells/$references

### Cloud 1.1.2

*12-Feb-2024*

- [Bugfix] /serialization now produces correct results for request on only AAS- or SM-IDs
- [Bugfix] a revised swagger.json now also enables automated client generation with NSwag

### Cloud 1.1.1

*07-Feb-2024*

- [Bugfix] Correction of our monitoring components (only internal)

### Cloud 1.1

*15-Feb-2024*

- Serialization interface to output specific asset administration shells and submodels in the desired format
    - Return formats include JSON, XML and AASX
    - Realizes the download of AASX packages, including those that only (should) contain a subset of SMs
    - Returned either with or without concept descriptions
- Pagination for page-by-page retrieval of list data
    - All GET operations that can potentially return larger data sets have been equipped with pagination
- Extent modifier for filtering BLOB elements for certain requests
    - Binary data embedded in submodels does not have to be retrieved/serialized if required
- Content modifier $metadata
    - Only returns meta information of an element, not its value.
- Content modifier $reference
    - Only returns the reference to found elements
- Content modifier $path
    - Returns the idShort of the requested element and a list of idShort paths to subordinate elements.

### Cloud 1.0.2

*16-Jan-2024*

- [Bugfix] Spec-compliant result objects are now returned for unsuccessful API requests
- [Bugfix] API now supports Base64URL-encoded identifiers with and (new) also without padding
    - See [Base64 with padding or not - Issue #42 - admin-shell-io/aas-specs-api
    (github.com)](https://github.com/admin-shell-io/aas-specs-api/issues/42)
    - Usage note: When using in Swagger, please specify the padding characters (=) non-url-encoded if required, as this
    client performs url-safe-encoding anyway - it is best to omit them altogether.

### Cloud 1.0

*22-Dez-2023*

- Creation and deletion of submodel references in an existing AAS
- Concept Description Repository
    - Create, modify, delete and retrieve concept descriptions
- Import endpoint now also processes the concept descriptions of an AASX package
- [Bugfix] POST/PUT methods produce an error 500 with invalid JSON (e.g. only {}) in case of an error

### Cloud 0.4

*12-Dez-2023*

- Creation, modification and deletion of asset administration shells
- Retrieving and changing the asset information of an AAS
- Creation, modification and deletion of submodels
- Modification and deletion of thumbnails and other files/documents

### Cloud 0.3.4

*10-Nov-2023*

- [Bugfix] Optional XML prolog in aas-spec file within AASX package now possible

### Cloud 0.3.3

*07-Nov-2023*

- [Bugfix] Sphere import endpoint does now overwrite shell/submodel data.

### Cloud 0.3.2

*06-Nov-2023*

- [Bugfix] return pageable at GetAllSubmodellReferences
- Enhanced Swagger API documentation

### Cloud 0.3

*31-Oct-2023*

- AASX Import (Part 2: without Concept Descriptions)
    - Included AAS, submodels and files are imported
    - Currently no processing of concept descriptions
- Discovery from globalAssetId or specificAssetId to aasId (for QR code resolution)
- Retrieval of AAS, submodels, thumbnails and other files/documents

### Cloud 0.2

*20-Oct-2023*

- Basic Auth for (initially simple) access protection of the API
- Upload and retrieval of AAS
- Import AASX package (part 1: processing of AAS and SM only)
    - Proprietary endpoint for upload via SDK

### Cloud 0.1

*09-Oct-2023*

- Architecture of the platform
- Automation of the infrastructure as infrastructure-as-code
- Setting up build servers and CI/CD pipelines
