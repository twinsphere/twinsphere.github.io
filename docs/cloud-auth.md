# Authentication

twinsphere cloud supports two authentication strategies:

- using [twinsphere ID](id-overview.md), which is the default built-in authentication provider. Both user and service
account authentication modes are supported, consult the [twinsphere ID documentation](id-overview.md) for more information.
- using [identity federation](#identity-provider-federation) as an additional authentication provider

## Identity provider federation

For tighter integration in your authentication and authorization systems, twinsphere cloud supports adding external identity
provider configuration onto the platform.

!!! note
    Your identity provider configuration will be added as an *additional* configuration, it will not completely replace the
    usage of twinsphere ID which is still required for internal purposes!

Supported authentication providers for twinsphere cloud are:

- [Microsoft Entra ID OAuth2](#microsoft-entra-id-oauth2-federation)

### Microsoft Entra ID OAuth2 federation

The Entra ID (former known as Azure AD) integration allows you to use a Microsoft Entra ID tenant as an identity
provider for twinsphere. Besides allowing your own users to log in, you can also use Entra ID application roles to
assign users and groups to twinsphere roles from your own Microsoft Entra ID portal. You can also connect your Entra ID
applications and fully integrate twinsphere into your ecosystem.

In general, you need to create two Azure app registrations. One for the API service and one for the viewer, which acts
as client for the API. If you don't use the twinsphere viewer, you can skip the viewer configuration section.

<!-- markdownlint-disable code-block-style -->
!!! note "Prerequisites"
    The following steps require you to sign in as a user that is authorized to consent on behalf of the organization. For
    this, a user with the following roles is needed:

    - Privileged Role Administrator
    - Cloud Application Administrator or Application Administrator
<!-- markdownlint-enable code-block-style -->

1. Log in to your [Microsoft Entra admin center](https://entra.microsoft.com/)
2. If you have access to more than one tenant, select your account in the upper right. Set your session to the Entra ID
   tenant you wish to use.

#### App registration for the twinsphere API

1. Under **Identity > Applications** in the side menu, click **App registrations > New Registration**. Enter a
   descriptive name e.g. **twinsphere-api-app**
2. As **Supported account types** let the default setting **Accounts in this organizational directory only**.
3. Click **Register**.
4. Note the **Application ID**.
5. Click on **Manifest** and in the Tab **Microsoft Graph App Manifest** change the property
   **requestedAccessTokenVersion** in the json (under `api`) editor to **2** and hit the **Save** button.
6. Navigate to **Overview** in the created app registration and click on **Endpoints** in top of the menu.
    - Note the **Authority URL (Accounts in this organizational directory only)** URI
7. Define the required application roles (under **App roles**).

    | Display name | Value       | Description       | Allowed member types                 |
    | ------------ | ----------- | ----------------- | ------------------------------------ |
    | Reader       | reader      | Read data         | Both (Users / Groups + Applications) |
    | Contributor  | contributor | Write data        | Both (Users / Groups + Applications) |

    !!! important
        Make sure the values are typed exactly as above (lowercase!).

8. Click **Expose and API** under **Manage** section.
9. Click **Add a scope**.
10. Leave the **Application ID URI** as it is, should be a value like "api://`<application id>`" and click **Save and
    continue**.
11. In the next windows set the following values:
    - Set **Scope name** to "api_access"
    - Set **Who can consent?** to "Admin and users"
    - Set **Admin consent display name** to "twinsphere API access"
    - Set **Admin consent description** to "Allow the application to access the twinsphere API on behalf of the
    - signed-in user."
    - Set **User consent display name** to "twinsphere API access"
    - Set **User consent description** to "Allow the application to access the twinsphere API on your behalf."
    - Click **Add scope**
12. Under **Entra ID > Identity > Applications** in the side menu, click **Enterprise applications**
13. Search for your application (e.g. **twinsphere-api-app**) and open it.
14. Click **Users and groups**.
15. Click **Add user/group** to add users or groups to the twinsphere roles.

Please provide the noted information to the twinsphere [support team](contact.md) to change and update your tenant
configuration:

- **Application ID**
- **Authority URL (Accounts in this organizational directory only)**

#### Create and configure app registration for viewer client

1. Under **Identity > Applications** in the side menu, click **App registrations > New Registration**. Enter a
   descriptive name e.g. **twinsphere-viewer-client-app**
2. As **Supported account types** let the default setting **Accounts in this organizational directory only**.
3. Under **Redirect URI**, select the platform **Web**.
4. Add the following redirect URL:
    - `https://viewer.<friendly-tenant-name|tenant-tag>.<cloud|dedicated>.twinsphere.io/signin-oidc-entra-id`
    - Replace `<friendly-tenant-name|tenant-tag>` with your friendly tenant name, if you use one or use your tenant-tag.
    - Replace `<cloud|dedicated>` with your corresponding type. It's basically the base URL of the viewer app you use
      with a route postfix `/signin-oidc-entra-id`.
    - If you don't know which URL to add here, please ask our [support team](contact.md)
5. Then click Register. The app's Overview page opens.
6. Note the **Application ID**.
7. Click on **Manifest** and in the Tab **Microsoft Graph App Manifest** change the property
   **requestedAccessTokenVersion** in the json (under `api`) editor to **2** and hit the **Save** button.
8. Click on **Certificates & secrets** in the side menu, then add a new entry under Client secrets with the following
   configuration.

    - Description: twinsphere viewer client OAuth
    - Expires: Select an expiration period of **365 days**

9. Click **Add** then copy and note the secret value. This is the OAuth client secret.

    !!! important
        The secret is needed, because the viewer acts as confidential OAuth client (web app which authenticates) unlike a
        public client (e.g. mobile client) which could not store a secret securely.

10. Click on **API permissions** in the side menu, then click **Add a permission**.
11. In the opened window click **APIs my organization uses** and select the API application you previously created for
    the twinsphere API.
12. Click on **Delegated permissions** and select the **api_access** permission.
13. Click on top on **Application permissions** and select all listed permissions.
14. Click **Add permissions**
15. In the top of the API permissions list click **Grant admin consent for `<your tenant>`**
16. Under **Identity > Applications** in the side menu, click **App registrations**
17. Search and select the twinsphere API application.
18. Click **Expose and API** under **Manage** section.
19. Click **Add a client application**
20. Set **Client ID** to the ID of the viewer app registration and select the **Authorized scopes** checkbox.
21. Click **Add application**.

Please provide the noted information to the twinsphere [support team](contact.md) to change and update your tenant
configuration:

- **Application ID**
- **Client Secret** and it's expiration date, in order to plan an update in a timely manner
