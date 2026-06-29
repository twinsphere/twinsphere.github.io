<!-- markdown-link-check-disable -->
# twinsphere Management API

Every operation available in the [Manage UI](management-overview.md) is also available
programmatically through the Management API. The API is documented with **Scalar**, an interactive
in-browser API reference where you can browse all endpoints, schemas and try out requests.

## Endpoints

- API base URL: [https://manage.twinsphere.io/api](https://manage.twinsphere.io/api)
- Interactive API documentation (Scalar): [https://manage.twinsphere.io/scalar](https://manage.twinsphere.io/scalar)
- OpenAPI specification: [https://manage.twinsphere.io/openapi/v1.json](https://manage.twinsphere.io/openapi/v1.json)

For each request you need an authenticated principal (user or service account) and your organization
ID. The full, up-to-date list of endpoints with their request and response schemas is available in
the Scalar API documentation.

## Authentication

In the Scalar API documentation use the Authorize button and choose one of the available methods:

- **OAuth2** — authenticate using your twinsphere ID account
- **Bearer** — paste an existing bearer token (useful when testing service accounts)

You can also call the API with any HTTP client (e.g., `curl`); using Scalar is optional.

### Self check via /me endpoint

To check your currently assigned organizations, tenants and roles, simply use the `/me` endpoint.
