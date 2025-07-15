# API Client Generation

If you need to integrate the twinsphere API into your application landscape, consider automatically generating a
twinsphere API client from our OpenAPI definition. This approach allows you to use all endpoints of the twinsphere API
with the programming language of your choice.

> Make sure you read and understand the **Limitations of client generation** section below.

## General Code Generation

There are multiple ways and tools to generate a client from the OpenAPI definition. We don't recommend any tool in
particular, but here are a few options:

- [https://github.com/swagger-api/swagger-codegen](https://github.com/swagger-api/swagger-codegen)
- [https://github.com/OpenAPITools/openapi-generator](https://github.com/OpenAPITools/openapi-generator)
- [https://github.com/microsoft/kiota](https://github.com/microsoft/kiota)

### Authentication

Most generated clients support setting authentication headers directly in code. For example, here is the documentation
on how to do it with [Microsoft Kiota](https://learn.microsoft.com/en-us/openapi/kiota/authentication?tabs=csharp).

Make sure to check the [Authentication section](api-auth.md) for further info.

## Limitations of client generation

Our own twinsphere OpenAPI definition is 99% compliant with the official OpenAPI definitions (written by the IDTA and
hosted in the SwaggerHub), but there are some things missing which are not possible for us to implement at this moment.
We are working on a better long-term solution, and we can recommend two different approaches at this time:

- if you want to use our OpenAPI definition, it might be necessary to manually adjust some return types in the generated
  client code.
- if you only need the official IDTA endpoints, you can generate your client(s) from the official IDTA OpenAPI
  definition (hosted in the SwaggerHub)
