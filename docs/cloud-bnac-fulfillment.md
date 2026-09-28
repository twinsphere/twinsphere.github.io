# SAP BNAC Fulfillment Service

!!! warning
    SAP BNAC Fulfillment Service is currently in **experimental** state and should only be used for prototypes /
    experimentation.

!!! warning "Known limitations"
    - **Automatic matching does not check the requesting partner.** When two partners send requests with the
      same purchase order number and line, a shell prepared for one of them can be delivered to and shared with
      the other. If you accept requests from more than one partner, use [manual processing](#manual-processing),
      or make sure that your partners' purchase order data never overlaps. An improvement for this topic is
      coming soon.
    - **Documents do not reach SAP BNAC yet.** A delivery creates the equipment and a document for each document
      of the Handover Documentation, but the files are not attached to these documents, and the documents are
      not linked to the equipment. The delivery still succeeds. This is a known bug at the moment and we are working on it.
    - **SAP BNAC import limits apply.** SAP BNAC accepts packages smaller than 400 MB only.

twinsphere Cloud offers first-class integration with SAP Business Network Asset Collaboration (SAP BNAC), so that
your customers receive the digital twins of the devices they ordered from you directly in SAP BNAC, built from the
asset administration shells you already maintain in twinsphere.

In SAP BNAC, a customer who has ordered devices from you asks for their digital data by sending you
an **equipment request**. The request lists one **line item** per device, identified by the purchase order and the
line within it.

The SAP BNAC Fulfillment Service answers these requests from your twinsphere tenant. twinsphere picks up the
equipment requests your customers send you, finds the shell for each line item, delivers it to SAP BNAC as
equipment, shares that equipment with the customer and assigns it to the line item. Once every line item is
answered, the request is handed back to your customer for review. You keep your device data in twinsphere,
and you do not have to enter anything in SAP BNAC by hand.

The following terms are used throughout this page:

<!-- markdownlint-disable line-length -->

| Term | Meaning |
|------|---------|
| Equipment request | A customer's request in SAP BNAC for the data of the devices it ordered from you |
| Line item | One requested device within an equipment request |
| Equipment | The SAP BNAC record of a device, created from the shell and submodels twinsphere delivers |
| Partner | A customer you accept equipment requests from, identified by its SAP BNAC business partner id |
| Authorization group | The SAP BNAC group equipment is shared into, so that only the partner of that group can see it |
| Fulfillment | twinsphere's record of one equipment request: its state, its line items and what was delivered for each |

<!-- markdownlint-enable line-length -->

Refer to the Sphere Server Swagger documentation (available on your tenant at `/sphere/swagger/index.html`) for
detailed information on each parameter and return value.

## Prerequisites

- **An SAP BNAC subscription with API access.** SAP BNAC runs as an instance in a subaccount of your SAP
  Business Technology Platform (SAP BTP) account. Create a service key on that instance; it holds the
  connection details and credentials twinsphere needs (see [Configuration](#configuration)).
- **An authorization group for each partner.** Equipment is shared into the partner's authorization group,
  so the group has to exist in SAP BNAC before anything can be delivered to that partner.
- **SAP BNAC Fulfillment Service activated for your tenant.** [Contact us](contact.md) to have it activated.
- **One of the following roles** on the tenant:

<!-- markdownlint-disable line-length -->

| Role | Access |
|------|--------|
| `tenant-bnac-fulfillment-viewer` | Read the configuration, the fulfillments and the jobs |
| `tenant-bnac-fulfillment-operator` | Everything the viewer can, plus changing the configuration and starting syncs, deliveries and finalizations |

<!-- markdownlint-enable line-length -->

`tenant-administrator`, `tenant-global-writer` and the organization owner have operator access as well;
`tenant-global-reader` has viewer access. See [Roles](management-roles.md) for how roles are assigned.

## Configuration

A tenant has exactly one BNAC configuration. It specifies how twinsphere reaches SAP BNAC, your identity in BNAC, how
equipment requests are processed, and which partners you accept equipment requests from.

<!-- markdownlint-disable line-length -->

| Operation | Method | Endpoint | Description |
|-----------|--------|----------|-------------|
| Get configuration | `GET` | `/sphere/api/v1/bnac/configuration` | Returns the configuration, with the client secret masked |
| Set configuration | `PUT` | `/sphere/api/v1/bnac/configuration` | Creates or replaces the configuration, except the credentials |
| Set credentials | `PUT` | `/sphere/api/v1/bnac/configuration/credentials` | Sets or rotates the credentials |

<!-- markdownlint-enable line-length -->

### Set the configuration

> `PUT https://{twinsphereTenantURL}/sphere/api/v1/bnac/configuration`

#### Example Request

```http
PUT /sphere/api/v1/bnac/configuration
Authorization: Bearer {token}
Content-Type: application/json

{
  "bnacApiBaseUrl": "...",
  "myBusinessPartnerId": "{your-business-partner-id}",
  "processing": "automatic",
  "autoFinalize": false,
  "partners": [
    {
      "name": "Musterchemie GmbH",
      "businessPartnerId": "{partner-business-partner-id}",
      "authorizationGroupId": "{partner-authorization-group-id}"
    }
  ]
}
```

<!-- markdownlint-disable line-length -->

| Field | Required | Description | Hint |
|-------|----------|-------------|------|
| `bnacApiBaseUrl` | yes | Base URL of the SAP BNAC API | In the SAP BTP cockpit, open your subaccount → **Services** → **Instances and Subscriptions** → **Instances**, and view the service key of your SAP BNAC instance (the link in the **Credentials** column). Take the value of `endpoints.ain.url` |
| `myBusinessPartnerId` | yes | Your own business partner id in SAP BNAC | In SAP BNAC, open the **Company Profile** app → **External IDs** and take the **Object ID**. It is a 32-character hexadecimal id |
| `processing` | no | `automatic` or `manual`, see [Processing modes](#processing-modes). Defaults to `automatic` | |
| `autoFinalize` | no | Marks the equipment request as "done" from your side, as soon as every line item is answered. Must be `false` with `manual` processing. Defaults to `false` | |
| `partners[].name` | yes | Your name for the partner, shown on its fulfillments | Free text, for example the company name the partner has in the SAP BNAC **Business Partners** |
| `partners[].businessPartnerId` | yes | The partner's business partner id in SAP BNAC. Equipment requests are attributed to a partner by it, so it must be unique across partners | The partner's own id from its **Company Profile** app, so ask the partner for it. Or configure the other fields first: a request from a partner that is not configured yet appears as a `partner-not-configured` fulfillment |
| `partners[].authorizationGroupId` | yes | The authorization group equipment for this partner is shared into | In SAP BNAC, open the **Network Authorizations** app → **Groups** and select the group; the id is part of the page URL |

<!-- markdownlint-enable line-length -->

!!! note
    `autoFinalize` is off by default on purpose. Marking an equipment request as "done" cannot be undone
    from your side; only the customer can send it back to you. Review a few requests before you switch it on.

An equipment request from a business partner that is not in `partners` is recorded, but nothing is
delivered for it. Add the partner to the configuration, and the request is processed with the next sync.

### Set the credentials

> `PUT https://{twinsphereTenantURL}/sphere/api/v1/bnac/configuration/credentials`

twinsphere signs in to SAP BNAC with the OAuth client credentials of a BNAC service key.

All values are in the service key of your SAP BNAC instance. In the SAP BTP cockpit, open your
subaccount → **Services** → **Instances and Subscriptions** → **Instances**, and view the key through the link in
the **Credentials** column. If the instance has no key yet, select it and create one under **Service Keys**.

#### Example Request

```http
PUT /sphere/api/v1/bnac/configuration/credentials
Authorization: Bearer {token}
Content-Type: application/json

{
  "authenticationBaseUrl": "https://...",
  "clientId": "{client-id}",
  "clientSecret": "{client-secret}"
}
```

<!-- markdownlint-disable line-length -->

| Field | Description | Hint |
|-------|-------------|------|
| `authenticationBaseUrl` | Base URL of the OAuth server of your SAP BTP subaccount | `uaa.url` in the service key |
| `clientId` | OAuth client id | `uaa.clientid` in the service key |
| `clientSecret` | OAuth client secret | `uaa.clientsecret` in the service key |

<!-- markdownlint-enable line-length -->

The client secret is stored encrypted and is never returned.

## How a request is processed

Once an hour, and whenever you start a [sync](#syncs) yourself, twinsphere asks SAP BNAC for the equipment
requests that are waiting for you. A request it sees for the first time is stored as a **fulfillment**.
Every fulfillment that is not finished yet is then synced: twinsphere reads the request and its
line items from SAP BNAC again and brings the fulfillment in line with them.

In [automatic processing](#automatic-processing), the sync then takes the request as far as it can:
it finds a shell for each line item, delivers it, and, with `autoFinalize`, finalizes the request once every
line item is answered.

In [manual processing](#manual-processing), the sync stops after reading, and you trigger each of these steps yourself.

Delivering a line item takes the following steps in SAP BNAC:

1. The shell and the submodels it references are uploaded to BNAC as equipment.
2. The equipment is published and shared into the partner's authorization group.
3. The equipment is assigned to the line item.

**Finalizing** a request (the *Recommend* action in the SAP BNAC UI) hands it back to your customer for review.
Your customer then either confirms the result, or sends the request back to you. A request that comes back
is picked up by the next sync and processed again like any other.

### Equipment request status (BNAC side)

The `requestStatusCode` of a fulfillment is the status of the equipment request in SAP BNAC, as of
`lastSyncedAt`. Deliveries and finalizations change the status in SAP BNAC; the fulfillment shows the new
status after the next sync.

<!-- markdownlint-disable line-length -->

| BNAC Code | Status | What it means for you |
|------|--------|-----------------------|
| `1` | Draft | Your customer is still editing the request. It is not picked up yet. |
| `2` | Author Action | The request is back with your customer. Nothing can be delivered until it is submitted again. |
| `3` | Rejected | The request was rejected. The fulfillment is closed. |
| `4` | Completed | The request was finalized and waits for your customer's review. |
| `5` | In Process | The request is being answered. The first equipment twinsphere assigns moves a submitted request to in process. |
| `6` | Submitted | Your customer has sent the request to you, and nothing has been answered yet. This is the state before "in process". |
| `7` | Confirmed | Your customer has confirmed the result. The request has ended. |
| `9` | Deleted | The request was deleted. The fulfillment is closed. |

<!-- markdownlint-enable line-length -->

Only requests in `5` In Process or `6` Submitted are processed. A request that returns to one of them, for
example because your customer sent it back, is processed again.

### Fulfillment states (twinsphere side)

<!-- markdownlint-disable line-length -->

| State | Meaning |
|-------|---------|
| `open` | No line item carries equipment yet |
| `partially-fulfilled` | Some line items carry equipment |
| `fulfilled` | Every line item carries equipment |
| `partner-not-configured` | The request comes from a business partner that is not in your configuration. Nothing is delivered until you [add the partner](#set-the-configuration) |
| `finalized` | The request was finalized and handed back to your customer |
| `closed` | The request ended without being finalized by twinsphere, for example because it was rejected, deleted, or completed in SAP BNAC directly |

<!-- markdownlint-enable line-length -->

The first three states follow from the line items and change whenever a line item does, including when
SAP BNAC reports line items that were added or removed. A `finalized` or `closed` fulfillment becomes
`open`, `partially-fulfilled` or `fulfilled` again when its request returns to In Process or Submitted.

The `lastError` of a fulfillment tells why the last sync or finalization of the request as a whole did not
succeed. It is absent once a later attempt succeeds.

### Line item states

<!-- markdownlint-disable line-length -->

| State | Meaning |
|-------|---------|
| `unmatched` | No shell answers the line item yet |
| `matched` | A shell answers the line item, but it has not been delivered yet |
| `equipment-shared` | The equipment was created and shared, but not yet assigned to the line item |
| `equipment-assigned` | The equipment is assigned to the line item |

<!-- markdownlint-enable line-length -->

`matchSource` says how the shell was chosen:

| Value | Meaning |
|-------|---------|
| `automatic` | Found by its shell extensions, see [Matching shells](#matching-shells) |
| `manual` | Pinned through the [mapping endpoint](#pin-a-shell) |
| `external` | The line item already carried equipment in SAP BNAC that twinsphere did not deliver |

twinsphere never overwrites equipment it did not deliver. An `external` line item is shown as
`equipment-assigned` and cannot be mapped or delivered. It returns to `unmatched` once the equipment is
removed from the line item in SAP BNAC.

Every sync compares the line items with what SAP BNAC reports for them. The `lastError` of a line item tells
why its last delivery did not succeed, or which difference the sync found, for example:

- **Your customer rejected the equipment.** The line item stays `equipment-assigned` and keeps the error.
  Correct the data and [deliver](#deliver-a-line-item) the line item again, or [pin](#pin-a-shell) another
  shell.
- **The equipment was removed from the line item in SAP BNAC.** The line item returns to `matched`. In
  automatic processing, the same sync delivers it again; in manual processing, deliver it yourself.
- **SAP BNAC reports equipment other than the one twinsphere assigned.** The line item keeps the error, so
  that you can check the line item in SAP BNAC.

A line item that SAP BNAC no longer reports is removed from the fulfillment.

## Processing modes

The `processing` field of the [configuration](#set-the-configuration) decides whether twinsphere answers
equipment requests on its own, or only when you ask it to.

### Automatic processing

With `processing` set to `automatic`, every sync matches, delivers and, with `autoFinalize`, finalizes on
its own. Mark your shells with the extensions below, and requests are answered without any further action.

Line items that cannot be answered stay open, and the sync tries again the next time. A line item whose
delivery failed carries the reason in its `lastError` and is delivered again by the next sync.

With `autoFinalize` set to `true`, a sync finalizes a request once it is `fulfilled` and no line item carries
an error. A request whose customer rejected one of the equipment is therefore not finalized again until
that line item is corrected.

#### Matching shells

A sync finds the shell for a line item by the extensions on the shell. Add them to the shell itself, not to
one of its submodels:

<!-- markdownlint-disable line-length -->

| Extension name | Required | Value |
|----------------|----------|-------|
| `twinsphere.io/bnac/purchase-order` | yes | The purchase order number of the line item |
| `twinsphere.io/bnac/purchase-order-line-item` | yes | The line within the purchase order |
| `twinsphere.io/bnac/operator-equipment-id` | no | Your customer's own identifier for the device, when the line item names one |

<!-- markdownlint-enable line-length -->

```json
{
  "id": "https://example.com/shells/pump-4711",
  "extensions": [
    { "name": "twinsphere.io/bnac/purchase-order", "valueType": "xs:string", "value": "4500012345" },
    { "name": "twinsphere.io/bnac/purchase-order-line-item", "valueType": "xs:string", "value": "00010" },
    { "name": "twinsphere.io/bnac/operator-equipment-id", "valueType": "xs:string", "value": "P-101" }
  ],
  "assetInformation": { "assetKind": "Instance", "globalAssetId": "https://example.com/assets/pump-4711" }
}
```

A shell answers a line item:

- when both the purchase order and the line match exactly. They are compared as text, so `00010` and `10` are
  different lines. Use the values exactly as your customer entered them in SAP BNAC.
- and when it either names no operator equipment id, or the same one as the line item. A shell that names a different one
  is meant for another device and is never used for this line item.

A shell that names the line item's operator equipment id is preferred over one that names none. When several
shells are equally suitable, the one with more `twinsphere.io/bnac/` extensions is used; the choice is
always the same for the same shells.

Matching only fills line items that have no shell yet. Changing the extensions of a shell later does not
change a line item it already answers. To have such a line item matched again, [release](#release-a-shell)
its shell, or [pin](#pin-a-shell) another one.

### Manual processing

With `processing` set to `manual`, the syncs still pick up new requests once an hour and keep every
fulfillment in line with SAP BNAC, but they never change anything in SAP BNAC. Shells are not matched by
their extensions. Each step is an operation you call yourself, so you see its outcome and its errors
directly. `autoFinalize` must be `false` in this mode.

A typical client does the following:

1. **Find open work:** `GET /sphere/api/v1/bnac/fulfillments?state=open&state=partially-fulfilled`. A
   fulfillment that has just been discovered has no line items yet; they appear with its first sync, shortly
   after.
2. **Prepare the data:** create the shell and its submodels, see [Data requirements](#data-requirements). The
   shell needs no BNAC extensions.
3. **Pin the shell** to the line item, see [Pin a shell](#pin-a-shell).
4. **Deliver the line item**, see [Deliver a line item](#deliver-a-line-item), and follow the job until it has
   `succeeded` or `failed`.
5. **Finalize the request**, see [Finalize a request](#finalize-a-request), once every line item is answered.

## Data requirements

SAP BNAC creates the equipment from the AAS package twinsphere delivers. The package contains the shell,
every submodel the shell references, and their concept descriptions. twinsphere sends it as it is; SAP BNAC
validates it, and a package it does not accept fails the delivery with SAP BNAC's reason in `lastError`.

SAP BNAC requires the following submodels:

- **Nameplate V3.0** (SemanticId `https://admin-shell.io/idta/nameplate/3/0/Nameplate`), exactly one per shell.
  SAP BNAC creates the equipment from it.
- **Handover Documentation V2.0** (SemanticId `0173-1#01-AHF578#003`) for the documentation — recommended.
- **Handover Documentation V1.2** (SemanticId `0173-1#01-AHF578#001`) is supported as well, but SAP BNAC
  accepts only one `Document` in it. Prefer V2.0, which has no such limit.

SAP BNAC identifies equipment by the serial number of the device. Delivering a shell again therefore updates
the existing equipment instead of creating a second one.

## Endpoints

Operations marked **async** answer `202 Accepted` right away and run as a [job](#jobs) in the background; all
others answer directly with their result. The complete OpenAPI specification of these endpoints is available in
the Sphere Server Swagger documentation on your tenant, at `/sphere/swagger/index.html`.

<!-- markdownlint-disable line-length -->

| Operation | Method | Endpoint | Execution | Description |
|-----------|--------|----------|-----------|-------------|
| List fulfillments | `GET` | `/sphere/api/v1/bnac/fulfillments` | sync | Lists the fulfillments, newest first |
| Get fulfillment | `GET` | `/sphere/api/v1/bnac/fulfillments/{fulfillmentId}` | sync | Returns one fulfillment with its line items |
| List line items | `GET` | `/sphere/api/v1/bnac/fulfillments/{fulfillmentId}/items` | sync | Returns the line items of a fulfillment |
| Get line item | `GET` | `/sphere/api/v1/bnac/fulfillments/{fulfillmentId}/items/{itemId}` | sync | Returns one line item |
| Sync all | `POST` | `/sphere/api/v1/bnac/fulfillments/sync` | async (job) | Queues a sync of all equipment requests |
| Sync fulfillment | `POST` | `/sphere/api/v1/bnac/fulfillments/{fulfillmentId}/sync` | async (job) | Queues a sync of one fulfillment |
| Pin a shell | `PUT` | `/sphere/api/v1/bnac/fulfillments/{fulfillmentId}/items/{itemId}/mapping` | sync | Sets the shell that answers a line item |
| Release a shell | `DELETE` | `/sphere/api/v1/bnac/fulfillments/{fulfillmentId}/items/{itemId}/mapping` | sync | Removes the shell from a line item |
| Deliver a line item | `POST` | `/sphere/api/v1/bnac/fulfillments/{fulfillmentId}/items/{itemId}/deliver` | async (job) | Queues the delivery of one line item |
| Finalize a request | `POST` | `/sphere/api/v1/bnac/fulfillments/{fulfillmentId}/finalize` | async (job) | Queues the finalization of a request |
| List jobs | `GET` | `/sphere/api/v1/bnac/fulfillments/jobs` | sync | Lists the jobs, newest first |
| Get job | `GET` | `/sphere/api/v1/bnac/fulfillments/jobs/{jobId}` | sync | Returns one job |

<!-- markdownlint-enable line-length -->

### List fulfillments

> `GET https://{twinsphereTenantURL}/sphere/api/v1/bnac/fulfillments`

<!-- markdownlint-disable line-length -->

| Parameter | Description |
|-----------|-------------|
| `state` | Fulfillment state, see [Fulfillment states](#fulfillment-states-twinsphere-side) |
| `partnerId` | Business partner id of the requester |
| `equipmentRequestId` | Id of the equipment request in SAP BNAC |
| `caseId` | Case number SAP BNAC shows for the equipment request |
| `limit` | Page size, at most 50. Defaults to 25 |
| `cursor` | Cursor from `paging_metadata` of the previous page, see [Pagination](cloud-documentation.md#pagination) |

<!-- markdownlint-enable line-length -->

Repeat a parameter to match any of its values, for example `?state=open&state=partially-fulfilled`.
Different parameters are combined, so a fulfillment has to match all of them.

#### Example Response (200 OK)

```json
{
  "paging_metadata": {},
  "result": [
    {
      "identifier": "{fulfillment-id}",
      "equipmentRequestId": "{equipment-request-id}",
      "caseId": "1000123",
      "description": "Pumps for plant extension",
      "requesterBusinessPartnerId": "{partner-business-partner-id}",
      "partnerName": "Musterchemie GmbH",
      "authorizationGroupId": "{partner-authorization-group-id}",
      "requestStatusCode": "5",
      "discoveredAt": "2026-09-28T09:15:02+00:00",
      "lastSyncedAt": "2026-09-28T10:15:04+00:00",
      "state": "partially-fulfilled",
      "items": [
        {
          "identifier": "{item-id-1}",
          "purchaseOrder": "4500012345",
          "purchaseOrderLineItem": "00010",
          "operatorEquipmentId": "P-101",
          "state": "equipment-assigned",
          "matchedShellId": "https://example.com/shells/pump-4711",
          "matchSource": "automatic",
          "assignedEquipmentId": "{equipment-id}"
        },
        {
          "identifier": "{item-id-2}",
          "purchaseOrder": "4500012345",
          "purchaseOrderLineItem": "00020",
          "state": "unmatched"
        }
      ]
    }
  ]
}
```

Fields without a value are left out of the response.

### Syncs

`POST /sphere/api/v1/bnac/fulfillments/sync` does what the hourly sync does: it picks up requests that have
not been seen yet and queues a sync of every fulfillment that is not finished. The `result.summary` of the job
tells what it found:

| Field | Meaning |
|-------|---------|
| `equipmentRequestsListed` | Equipment requests SAP BNAC listed as waiting for you |
| `fulfillmentsDiscovered` | Requests seen for the first time and stored as fulfillments |
| `jobsQueued` | Fulfillment syncs queued |
| `alreadyQueued` | Fulfillment syncs that were already waiting from an earlier sync |
| `discoveryFailures` | One message per equipment request that could not be read from SAP BNAC |

`POST /sphere/api/v1/bnac/fulfillments/{fulfillmentId}/sync` syncs a single fulfillment, for example right
after you created the shells for it, instead of waiting for the next hourly sync.

!!! note
    A sync job succeeds even when single line items could not be delivered. It fails only when the request
    itself could not be processed. Check the `lastError` of the fulfillment and of its line items to see what
    did not go through.

### Pin a shell

> `PUT https://{twinsphereTenantURL}/sphere/api/v1/bnac/fulfillments/{fulfillmentId}/items/{itemId}/mapping`

```json
{
  "shellId": "https://example.com/shells/pump-4711"
}
```

Sets the shell for the line item, in place of the one [matching](#matching-shells) would choose.
In manual processing, this is the only way to give a line item a shell. The request answers directly with
`204 No Content`; the shell is delivered by the next [delivery](#deliver-a-line-item) or, in automatic
processing, by the next sync.

A line item that was already delivered can be given another shell. It then returns to `matched`, and the new
shell is delivered in its place. Pinning is refused with `400 Bad Request` when:

- the shell does not exist, or it already answers another line item of the same request,
- the line item carries equipment twinsphere did not deliver (`external`),
- the same shell was already delivered for the line item — [deliver](#deliver-a-line-item) the line item
  again instead,
- the fulfillment is `finalized` or `closed`.

### Release a shell

> `DELETE https://{twinsphereTenantURL}/sphere/api/v1/bnac/fulfillments/{fulfillmentId}/items/{itemId}/mapping`

Removes the shell from a line item that has not been delivered yet (`matched`). The line item returns to
`unmatched`. In automatic processing, the next sync matches it again; in manual processing, it stays
open until you pin a shell.

### Deliver a line item

> `POST https://{twinsphereTenantURL}/sphere/api/v1/bnac/fulfillments/{fulfillmentId}/items/{itemId}/deliver`

Queues the delivery of the line item's shell. Use it to deliver a pinned shell in manual processing, and to
deliver a line item again after its shell or submodels changed, so that the equipment in SAP BNAC is updated.

### Finalize a request

> `POST https://{twinsphereTenantURL}/sphere/api/v1/bnac/fulfillments/{fulfillmentId}/finalize`

```json
{
  "allowIncomplete": false
}
```

Queues the finalization of the request, which hands it back to your customer for review. The body is
optional.

By default, every line item has to carry equipment. Set `allowIncomplete` to `true` to finalize a request in
which some line items are still open; at least one line item has to carry equipment either way.

!!! important
    A finalization cannot be undone from your side. Only your customer can send the request back to you.

## Jobs

Syncs, deliveries and finalizations run as jobs in the background, because they depend on SAP BNAC. The
endpoints that start them answer `202 Accepted` with the job in the body and its address in the `Location`
header. Get the job from there until its `state` is `succeeded` or `failed`.

### Get a job

> `GET https://{twinsphereTenantURL}/sphere/api/v1/bnac/fulfillments/jobs/{jobId}`

#### Example Response (200 OK)

```json
{
  "identifier": "{job-id}",
  "kind": "deliver-item",
  "trigger": "user-request",
  "state": "succeeded",
  "queuedAt": "2026-09-28T10:20:00+00:00",
  "startedAt": "2026-09-28T10:20:01+00:00",
  "completedAt": "2026-09-28T10:20:43+00:00",
  "attempts": 1,
  "parameters": {
    "fulfillmentId": "{fulfillment-id}",
    "itemId": "{item-id-1}"
  },
  "result": {
    "delivery": {
      "itemState": "equipment-assigned",
      "assignedEquipmentId": "{equipment-id}"
    }
  }
}
```

<!-- markdownlint-disable line-length -->

| Field | Values |
|-------|--------|
| `kind` | `tenant-sync` (sync all), `sync-fulfillment`, `deliver-item`, `finalize` |
| `trigger` | `user-request` when started through the API, `schedule` for the hourly sync and the fulfillment syncs it queues |
| `state` | `pending` (waiting to start), `running`, `succeeded`, `failed` |
| `error` | Why the job failed. Only set when `state` is `failed` |
| `result` | `summary` for `tenant-sync`, `delivery` for `deliver-item`. Only set when `state` is `succeeded` |

<!-- markdownlint-enable line-length -->

`GET /sphere/api/v1/bnac/fulfillments/jobs` lists the jobs, newest first. Filter them by `kind`, `state`,
`trigger` and `fulfillmentId`, with the same rules and paging as the [fulfillment list](#list-fulfillments).

### How jobs run

- **One at a time per fulfillment.** The jobs of one fulfillment run one after another, so a sync, a delivery
  and a finalization never change the same fulfillment at once. Jobs of different fulfillments run in
  parallel.
- **No duplicates while waiting.** A job that is the same as one still `pending` is refused with
  `409 Conflict`; the waiting job already covers it. Once that job has started, the same job can be queued
  again.
- **Failed jobs are not retried.** Start the operation again to retry it. Running a sync or a delivery again is
  safe: finished work is not repeated, and a delivery updates the same equipment. A finalization that already
  went through is refused instead of being sent a second time.
- **Time limit.** A job that runs longer than one hour is stopped and fails.
- **Restarts.** A job that is interrupted by a twinsphere update returns to `pending` and runs again. Its
  `attempts` counts every start.
