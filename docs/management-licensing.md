<!-- markdown-link-check-disable -->
# twinsphere Licensing

Licensing controls which twinsphere capabilities your organization and its members can use. You can
review your organization's licensing and assign per-user capabilities to members - in the
[Manage UI](management-overview.md) or via the [Management API](management-api.md). These management
operations require the `organization-owner` [role](management-roles.md); individual members can
always see their own licenses via the [`/me` endpoint](management-api.md#self-check-via-me-endpoint).

There are two kinds of licenses.

## Organization licenses

Organization licenses are entitlements granted to your whole organization as part of your
subscription (for example `studio-access`). Every member benefits from them and there is nothing to
assign. They are provisioned for you by twinsphere and shown in your organization's licensing
overview.

## User-bound licenses (seats)

User-bound licenses are per-user capabilities (for example `studio-creator`) that come as a limited
pool of **seats**. Your subscription defines the seat **quota** for each user-bound license; as an
organization owner you decide which members occupy those seats.

For each user-bound license the licensing overview shows:

- **quota** — the total number of seats available
- **assigned** — how many seats are currently in use
- **remaining** — how many seats are still free
- the members currently holding a seat

### Assigning and releasing seats

As an organization owner you can:

- **assign** a seat to a member, as long as a seat is still free and the member does not already
  hold one
- **release** a seat, returning it to the pool for someone else
