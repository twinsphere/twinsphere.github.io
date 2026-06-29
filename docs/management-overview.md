<!-- markdown-link-check-disable -->
# twinsphere Management

twinsphere Management lets administrators manage their organization: users, service accounts,
user groups, role-based access control (RBAC) and other features.

There are two equivalent ways to manage your organization — every operation is available in both:

- **Manage UI** — a web interface available at
  [https://manage.twinsphere.io](https://manage.twinsphere.io).
- **Management API** — the same operations are also available programmatically, see [API](management-api.md).

## What you can manage

- user management within an organization (inviting and removing users)
- service account management, including secrets, for headless (machine-to-machine) access
- organizing users and service accounts via user groups
- role-based access control (RBAC) at organization and cloud (per tenant) level, see [Roles](management-roles.md)
- AAS twinsphere-global ID resolution rules that map AAS ID or Asset ID prefixes to your organization's tenants

## Getting started

Initially, each organization has a single user with the rights to invite other users and create
service accounts.

You can invite any user to your organization using their twinsphere ID. If the user does not yet
have one, they can [register themselves](id-registration.md).
