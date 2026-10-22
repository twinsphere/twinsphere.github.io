# twinsphere Roles

Here is a list of all available roles and their permissions. You can assign them in the
[Manage UI](management-overview.md) or via the [Management API](management-api.md).

<!-- markdownlint-disable line-length -->
| Role | Scope | Explanation |
|------|-------|-------------|
| organization-owner | organization | Full access rights across the organization |
| tenant-administrator | cloud tenant | Full access rights for a given tenant. Required for security-relevant endpoints (e.g. ABAC policies) |
| tenant-global-writer | cloud tenant | Read and write permissions on all endpoints |
| tenant-global-reader | cloud tenant | Read permissions on all endpoints |
| tenant-metadata-writer | cloud tenant | Read and write permissions on all registry, discovery and concept descriptions endpoints (AAS metadata) |
| tenant-metadata-reader | cloud tenant | Read permissions on all registry, discovery and concept descriptions endpoints (AAS metadata) |
| tenant-push-service-writer | cloud tenant | Read and write permissions for push service feature endpoints. Push jobs can export all AAS data of the tenant |
| tenant-push-service-reader | cloud tenant | Read permissions for push service feature endpoints |
| tenant-search-user | cloud tenant | Permissions on all search feature endpoints. Search results contain the classifications and technical properties of all shells of the tenant |
| tenant-semantic-connector-reader | cloud tenant | Read permissions for the semantic connector feature endpoints. Can read any submodel of the tenant |
| tenant-semantic-connector-writer | cloud tenant | Read and write permissions for the semantic connector feature endpoints. Can create and replace any submodel of the tenant |
| tenant-bnac-fulfillment-viewer | cloud tenant | Read permissions for the [SAP BNAC Fulfillment Service](cloud-bnac-fulfillment.md) endpoints |
| tenant-bnac-fulfillment-operator | cloud tenant | Read and write permissions for the [SAP BNAC Fulfillment Service](cloud-bnac-fulfillment.md) endpoints. Can deliver any shell of the tenant, with the submodels it references, to SAP BNAC |
<!-- markdownlint-enable line-length -->

## Permission matrix

The matrix shows what each role grants in each area. Broader roles cover more areas, so you rarely need to assign
more than one role to a principal. If a principal has several roles, assigned directly or through user groups, it
gets the combined permissions of all of them.

### Areas

<!-- markdownlint-disable line-length -->

| Area | What it covers |
|------|----------------|
| Org | Managing the organization in the [Manage UI](management-overview.md) and the [Management API](management-api.md): users, user groups, service accounts and their secrets, role assignments, licenses, the activity log and the [ID Resolver](management-resolver.md) |
| ABAC | The tenant's [ABAC](cloud-abac.md) access policies and access checks |
| AAS data | The AAS data of the tenant: shells, submodels, files and thumbnails, serialization, the AAS query language, statistics etc. |
| AAS metadata | The shell and submodel registries, the discovery, and concept descriptions |
| Push | The [Push Service](cloud-push-service.md): push targets and push jobs |
| Search | The [Search](cloud-search.md) endpoints. Search only reads, so it has a single level of access |
| Semantic connector | The [Semantic Connector](cloud-semantic-connector.md) endpoints |
| BNAC | The [SAP BNAC Fulfillment Service](cloud-bnac-fulfillment.md): its configuration, fulfillments and jobs |

<!-- markdownlint-enable line-length -->

`R` stands for read access, `R+W` for read and write access, and `·` for no access. A `*` marks access that a role
gets through a feature rather than through the area's own endpoints: it is not limited by that area's roles or by
[ABAC](cloud-abac.md) policies. The footnotes say what each of these roles can reach.

<!-- markdownlint-disable line-length -->

| Role | Org | ABAC | AAS data | AAS metadata | Push | Search | Semantic connector | BNAC |
|------|:---:|:----:|:--------:|:------------:|:----:|:------:|:------------------:|:----:|
| organization-owner | R+W | R+W | R+W | R+W | R+W | R | R+W | R+W |
| tenant-administrator | partly¹ | R+W | R+W | R+W | R+W | R | R+W | R+W |
| tenant-global-writer | · | · | R+W | R+W | R+W | R | R+W | R+W |
| tenant-global-reader | · | · | R | R | R | R | R | R |
| tenant-metadata-writer | · | · | · | R+W | · | · | · | · |
| tenant-metadata-reader | · | · | · | R | · | · | · | · |
| tenant-push-service-writer | · | · | R*² | R*² | R+W | · | · | · |
| tenant-push-service-reader | · | · | · | · | R | · | · | · |
| tenant-search-user | · | · | R*³ | · | · | R | · | · |
| tenant-semantic-connector-writer | · | · | R+W*⁴ | · | · | · | R+W | · |
| tenant-semantic-connector-reader | · | · | R*⁵ | · | · | · | R | · |
| tenant-bnac-fulfillment-operator | · | · | R*⁶ | · | · | · | · | R+W |
| tenant-bnac-fulfillment-viewer | · | · | · | · | · | · | · | R |

<!-- markdownlint-enable line-length -->

¹ A tenant administrator can read the users, user groups and service accounts of the organization, and manage the
role assignments of the tenants it administers. Everything else in the Org area is reserved to organization owners.

² Push jobs can export any shell and submodel of the tenant to a push target, together with the concept descriptions
the exported submodels reference. Registries and discovery are not exported.

³ Search results contain the classifications and the technical properties (names and values) of every shell.

⁴ Can create and replace any submodel, including its security attributes.

⁵ Can read any submodel in its semantic form.

⁶ Delivering a fulfillment sends the mapped shell and every submodel it references to SAP BNAC. Any shell of the
tenant can be mapped.

ABAC policies restrict only the AAS data endpoints (shells, submodels, files). Grant the roles marked with `*` only
to principals that may see all AAS data of the tenant, for example integration service accounts.

The organization-owner role applies to every tenant of the organization. All other roles in the matrix are assigned
per tenant and grant access to that tenant only.
