# AI Agents (MCP)

Your tenant offers a [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server. AI agents such as Claude,
GitHub Copilot in Visual Studio Code or Cursor connect to it and look up the digital twins you have access to, so you
can ask questions about your twins in plain language without knowing the AAS API.

The MCP server only reads. Agents see exactly the twins and data you can read through the API, and they cannot
change anything.

## Connection details

| | |
| --- | --- |
| MCP URL | `https://{twinsphereTenantURL}/mcp` |
| Transport | Streamable HTTP |
| Authentication | OAuth 2.0 with twinsphere ID, see [below](#authentication) |

You find the MCP URL and the client ID of your tenant in the [Manage UI](management-ui.md): open your tenant, the
**AI agents** section on the overview shows both with a copy button.

## Tools

The tools speak about **twins** and their **aspects** rather than shells, submodels and elements.

- `twins_find` finds twins by what identifies an asset: the content of an ID link or QR code, a URN, a serial
  number, a part or article number, an order code, or the twin's name. It returns up to 10 candidates.
- `twins_get` gives an overview of one twin: how it is identified, whether it describes a product type or a single
  instance, the twin of its type, which aspects it has, its identity data such as manufacturer and serial number,
  the number of documents, and its thumbnail.

The aspects of a twin are `identity`, `technical-data`, `documents`, `contacts`, `structure` and `carbon-footprint`.
Submodels that belong to none of them are listed with their name and semantic ID.

How `twins_find` searches depends on your role on the tenant:

- With a [role](management-roles.md) that lets you read all data of the tenant, it also finds twins by part of their
  name and by values inside their data, for example a serial number in the nameplate.
- Otherwise it finds twins by their exact ID, name or global asset ID, among those your
  [access policies](cloud-abac.md) let you read.

## Authentication

The MCP server accepts only access tokens issued for it. Tokens for the tenant API do not work on the MCP server,
and MCP tokens do not work on the tenant API. The API key of the tenant is not accepted.

### Users

AI agents that support OAuth sign you in with twinsphere ID when you add the server. They find the sign-in on
their own from the MCP URL. Because twinsphere ID does not register clients on the fly, the agent asks for a client
ID: enter the **client ID** shown in the Manage UI. Leave the client secret empty.

### Service accounts

Your own agents and automations use a [service account](id-service-accounts.md) and the client credentials flow,
with this scope:

```text
https://{twinsphereTenantURL}/mcp/.default
```

The service account response of the [Management API](management-api.md) lists this scope for every tenant as
service type `CloudTenantMcp`. Send the token as `Authorization: Bearer <token>` with every request to the MCP URL.
Tokens expire after about an hour, so request a new one in time, or let your MCP or OAuth library do it.

## Set up your AI agent

Replace `{mcpUrl}` and `{clientId}` with the values from the Manage UI.

### Claude (claude.ai, Claude Desktop)

1. Open **Settings > Connectors** and click **Add custom connector**. In a Team or Enterprise plan, an owner adds
   the connector for the organization.
2. Enter a name, for example `twinsphere`, and the MCP URL `{mcpUrl}`.
3. Open **Advanced settings** and enter `{clientId}` as **OAuth Client ID**. Leave **OAuth Client Secret** empty.
4. Click **Add**, then **Connect**, and sign in with twinsphere ID.

### Claude Code

```bash
claude mcp add --transport http twinsphere {mcpUrl} --client-id {clientId}
```

Start Claude Code, run `/mcp`, select `twinsphere` and sign in with twinsphere ID. Ask in plain language, for example
"Which twins have the serial number SN-4711?", or name a tool to call it directly, for example "Call twins_get for
this twin".

### Visual Studio Code (GitHub Copilot)

Add the server to `.vscode/mcp.json` in your workspace. To use it in every workspace, add it to your user
configuration instead: run **MCP: Open User Configuration** from the command palette. The file looks like this, for
example for the tenant `https://acme.twinsphere.io`:

```json
{
  "servers": {
    "twinsphere": {
      "type": "http",
      "url": "https://acme.twinsphere.io/mcp"
    }
  }
}
```

The client ID does not go into the file, VS Code asks for it when it connects.

Click **Start** above the server. VS Code asks for a client ID: enter `{clientId}`. It then asks for a client
secret: leave it empty and press Enter. VS Code opens the sign-in page in your browser, where you sign in with
twinsphere ID. The tools are available in Copilot Chat in agent mode. Small models sometimes fail to call them; if
the agent does not use the tools, pick a larger model or select only `twinsphere` in the tool picker.

### Cursor

Add the server to `.cursor/mcp.json` in your project, or to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "twinsphere": {
      "url": "{mcpUrl}",
      "auth": {
        "CLIENT_ID": "{clientId}"
      }
    }
  }
}
```

Open **Settings > MCP**, click **Connect** next to `twinsphere` and sign in with twinsphere ID.

### Microsoft Copilot Studio

Copilot Studio is not supported yet.

## Limits

Agents tend to call tools in quick succession. Each user and service account can make up to 60 calls in a burst and
about one call per second after that. Further calls are answered with `429 Too Many Requests` and a `Retry-After`
header that says when to try again.

## IP allowlist

If your tenant has an [IP allowlist](cloud-ip-allowlist.md), it applies to the MCP server as well. Desktop and
command line agents such as Claude Code, VS Code and Cursor call from your own network. Agents that run in their
vendor's cloud call from the vendor's addresses, which you need to add to the allowlist. For claude.ai these are
`160.79.104.0/21` and `153.61.208.0/20`, see
[Anthropic's IP addresses](https://docs.anthropic.com/en/api/ip-addresses).
