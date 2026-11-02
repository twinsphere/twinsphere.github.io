# IP Allowlist

By default, the APIs and the twinsphere Viewer of your tenant can be reached from anywhere on the internet; every
request still has to be authenticated and authorized. If your organization has strict network security requirements,
you can additionally restrict your tenant to the IP ranges you provide. Requests from any other IP address are then
rejected with `403 Forbidden` before they reach your data, even if they carry valid credentials.

## What is restricted

The allowlist applies to everything served under your tenant's addresses:

- the tenant API, `https://{twinsphereTenantURL}/...`, including all discovery, registry and repository instances
- the twinsphere Viewer of your tenant, `https://viewer.{twinsphereTenantURL}/`

Access through twinstudio is **not** restricted by the allowlist. twinstudio connects to your tenant from within the
twinsphere platform, so your users can keep using it from any network. Access to twinstudio itself is controlled by
twinsphere ID and your roles.

The allowlist restricts access from the internet only. Requests from within the twinsphere platform and from
twinsphere operations are always permitted, so that your tenant can be operated and monitored.

## How to request it

Open a ticket with the twinsphere [support team](contact.md) and provide:

- the tenant the allowlist should apply to
- the public IPv4 addresses or CIDR ranges your requests come from, for example `203.0.113.10` or `198.51.100.0/24`

Include every system that calls your tenant directly: your office networks and VPN gateways, your own backends and
integrations, and any third-party portal that reads your tenant's data on your behalf. To change or remove the
allowlist later, open another ticket.

<!-- markdownlint-disable code-block-style -->
!!! note
    Only the source IP address of the network connection is checked. Headers such as `X-Forwarded-For` are ignored,
    so requests passing through a proxy are matched against the proxy's public IP address.
<!-- markdownlint-enable code-block-style -->

## Troubleshooting

If a client suddenly receives `403 Forbidden` without any error details, its public IP address is most likely not on
the allowlist, for example after a change of internet provider, proxy or VPN. Determine the client's current public
IP address and contact the [support team](contact.md) to have it added.
