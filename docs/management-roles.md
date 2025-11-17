# twinsphere Roles

Here is a list of all available roles and their permissions, that you can set through Management API role assignment APIs.

<!-- markdownlint-disable line-length -->
| Role | Scope | Explanation |
|------|-------|-------------|
| organization-owner | organization | Full access rights across the organization |
| tenant-administrator | cloud tenant | Full access rights for a given tenant |
| tenant-global-writer | cloud tenant | Read and write permissions on all endpoints |
| tenant-global-reader | cloud tenant | Read permissions on all endpoints |
| tenant-metadata-writer | cloud tenant | Read and write permissions on all registry, discovery and concept descriptions endpoints (AAS metadata) |
| tenant-metadata-reader | cloud tenant | Read permissions on all registry, discovery and concept descriptions endpoints (AAS metadata) |
| tenant-push-service-writer | cloud tenant | Read and write permissions for push service feature endpoints |
| tenant-push-service-reader | cloud tenant | Read permissions for push service feature endpoints |
| tenant-search-user | cloud tenant | Permissions on all search feature endpoints |
| tenant-semantic-connector-reader | cloud tenant | Read permissions for the semantic connector feature endpoints |
| tenant-semantic-connector-writer | cloud tenant | Read and write permissions for the semantic connector feature endpoints |
<!-- markdownlint-enable line-length -->

> [IMPORTANT]
> The `organization-owner` role will not cascade and grant the `cloud tenant level`
rights at this point in time! Explicit cloud tenant role assignment is required!
