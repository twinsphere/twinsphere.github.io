# API Client Generation

<!-- markdownlint-disable code-block-style -- the indented content of a tab reads as an indented code block -->

If you need to integrate the twinsphere API into your application landscape, you can generate a client from our OpenAPI
documents with the programming language of your choice.

## The documents for client generators

The OpenAPI documents of the Swagger documentation describe all AAS objects (shells, submodels, submodel elements, ...)
with the official schemas of the IDTA. Common code generators cannot turn these schemas into working model classes, and
the same happens with the official IDTA OpenAPI files. Every tenant therefore serves a second document for each API,
made for code generators. It describes the same API and the same JSON, at these paths of your tenant URL:

| API | Document for client generators |
| --- | --- |
| Twin API (AAS repository, registry, discovery, query) | `/swagger/v3-codegen/swagger.json` |
| Sphere API | `/sphere/swagger/v1-codegen/swagger.json` |

Generate your client from one of these documents. Download it first, for example:

=== "Linux / macOS"

    ```bash
    curl -o openapi.json https://{twinsphereTenantURL}/swagger/v3-codegen/swagger.json
    ```

=== "Windows (PowerShell)"

    ```powershell
    curl.exe -o openapi.json https://{twinsphereTenantURL}/swagger/v3-codegen/swagger.json
    ```

## Generating a client

We test the documents with [OpenAPI Generator](https://github.com/OpenAPITools/openapi-generator) for C#, Java and Go,
and with [oapi-codegen](https://github.com/oapi-codegen/oapi-codegen) for Go. The commands below run OpenAPI Generator
in Docker, so you don't have to install it; adjust the package names to your project.

### C\#

=== "Linux / macOS"

    ```bash
    docker run --rm -v "$PWD:/local" openapitools/openapi-generator-cli generate \
      -i /local/openapi.json -g csharp -o /local/twinsphere-client \
      --additional-properties=packageName=Twinsphere.Client,library=httpclient
    ```

=== "Windows (PowerShell)"

    ```powershell
    docker run --rm -v "${PWD}:/local" openapitools/openapi-generator-cli generate `
      -i /local/openapi.json -g csharp -o /local/twinsphere-client `
      --additional-properties=packageName=Twinsphere.Client,library=httpclient
    ```

### Java

=== "Linux / macOS"

    ```bash
    docker run --rm -v "$PWD:/local" openapitools/openapi-generator-cli generate \
      -i /local/openapi.json -g java -o /local/twinsphere-client \
      --additional-properties=invokerPackage=io.twinsphere.client,apiPackage=io.twinsphere.client.api \
      --additional-properties=modelPackage=io.twinsphere.client.model,containerDefaultToNull=true
    ```

=== "Windows (PowerShell)"

    ```powershell
    docker run --rm -v "${PWD}:/local" openapitools/openapi-generator-cli generate `
      -i /local/openapi.json -g java -o /local/twinsphere-client `
      --additional-properties=invokerPackage=io.twinsphere.client,apiPackage=io.twinsphere.client.api `
      --additional-properties=modelPackage=io.twinsphere.client.model,containerDefaultToNull=true
    ```

### Go

With oapi-codegen, create a configuration `oapi-codegen.yaml`:

```yaml
package: twinsphere
generate:
  models: true
  client: true
output-options:
  resolve-type-name-collisions: true
output: twinsphere.gen.go
```

and generate the client in your module:

```bash
go run github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen@latest -config oapi-codegen.yaml openapi.json
```

OpenAPI Generator works for Go as well. For the Twin API, add the missing `"time"` import to the generated
`model_value.go` afterwards:

=== "Linux / macOS"

    ```bash
    docker run --rm -v "$PWD:/local" openapitools/openapi-generator-cli generate \
      -i /local/openapi.json -g go -o /local/twinsphere-client \
      --additional-properties=packageName=twinsphere,enumClassPrefix=true,useOneOfDiscriminatorLookup=true
    ```

=== "Windows (PowerShell)"

    ```powershell
    docker run --rm -v "${PWD}:/local" openapitools/openapi-generator-cli generate `
      -i /local/openapi.json -g go -o /local/twinsphere-client `
      --additional-properties=packageName=twinsphere,enumClassPrefix=true,useOneOfDiscriminatorLookup=true
    ```

## Using the client

The following examples read a submodel and print its properties. Identifiers in paths are base64url-encoded without
padding, as the AAS specification defines. A submodel element is a choice over the concrete element types, so each
client wraps it in a type that holds the concrete element.

### C\#

```csharp
var http = new HttpClient();
http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
var submodels = new SubmodelRepositoryAPIApi(http, "https://{twinsphereTenantURL}");

Submodel submodel = await submodels.GetSubmodelByIdAsync(Base64Url("urn:example:submodel"));
foreach (var element in submodel.SubmodelElements)
{
    if (element.ActualInstance is Property property)
    {
        Console.WriteLine($"{property.IdShort} = {property.Value}");
    }
}

static string Base64Url(string id) =>
    Convert.ToBase64String(Encoding.UTF8.GetBytes(id)).TrimEnd('=').Replace('+', '-').Replace('/', '_');
```

The AAS metamodel has a type `File`, which collides with `System.IO.File` when you import the model namespace; refer to
one of them with its full name.

### Java

```java
ApiClient client = new ApiClient();
client.setBasePath("https://{twinsphereTenantURL}");
client.addDefaultHeader("Authorization", "Bearer " + token);
SubmodelRepositoryApiApi submodels = new SubmodelRepositoryApiApi(client);

byte[] identifier = "urn:example:submodel".getBytes(StandardCharsets.UTF_8);
String id = Base64.getUrlEncoder().withoutPadding().encodeToString(identifier);
Submodel submodel = submodels.getSubmodelById(id, null, null);
for (SubmodelElementChoice element : submodel.getSubmodelElements()) {
    if (element.getActualInstance() instanceof Property property) {
        System.out.println(property.getIdShort() + " = " + property.getValue());
    }
}
```

### Go

```go
client, err := twinsphere.NewClientWithResponses("https://{twinsphereTenantURL}",
    twinsphere.WithRequestEditorFn(func(ctx context.Context, req *http.Request) error {
        req.Header.Set("Authorization", "Bearer "+token)
        return nil
    }))
if err != nil {
    return err
}

id := base64.RawURLEncoding.EncodeToString([]byte("urn:example:submodel"))
response, err := client.GetSubmodelByIdWithResponse(ctx, id, nil)
if err != nil {
    return err
}
for _, element := range *response.JSON200.SubmodelElements {
    if value, err := element.ValueByDiscriminator(); err == nil {
        if property, ok := value.(twinsphere.Property); ok {
            fmt.Printf("%s = %s\n", *property.IdShort, *property.Value)
        }
    }
}
```

See the [Authentication section](cloud-auth.md) for how to get a token.

## Working with an AAS model library

The generated model classes cover the JSON of the API, nothing more. If you build or process AAS objects in your
application, an AAS model library implements the JSON format of the AAS specification as well, so you can read and
write the AAS objects of the API with it, with or without a generated client:

- **C#**: [twinsphere.TypedAasMetamodels](typed-aas-metamodels-overview.md) adds typed submodel templates such as the
  Digital Nameplate on top of the [aas-core](https://github.com/eclipse-aascw) types and converts from and to them.
- **Java**: [Eclipse AAS4J](https://github.com/eclipse-aas4j/aas4j)
- **Go**: [aas-core](https://github.com/eclipse-aascw)

## Limitations

- [NSwag](https://github.com/RicoSuter/NSwag) is not supported. It represents polymorphic types only as inheritance,
  while the documents describe them as a choice (`oneOf`), which Go generators need.
