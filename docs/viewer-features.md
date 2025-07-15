# twinsphere Viewer Features

## Dedicated Views

The viewer is able to display any asset administration shell and any submodels. In addition to a generic representation
of submodels there are dedicated views for the following submodels/use cases available:

- Digital Nameplate
- Handover Documentation
- Contact Information
- Technical Data
- Product Carbon Footprint
- Digital Product Passport *(shown if digital twin provides both SM DigitalNameplate and SM PCF)*
- Digital Battery Passport *(special fair showcase)*

If available the dedicated view is shown as default. You may switch between dedicated and generic view with a button on
top of the submodel popup.

## Query Parameters

It is possible to use direct links in the viewer to open a specific asset or even a submodel of a specific asset. With
these direct links and the feature to hide the viewer's navigation elements u may integrate the viewer in your web
application for AAS display.

### Param: id

The id parameter contains the shell id of an asset administration shell as base64url encoded string.

Example: ```https://viewer.{your_tenant}.cloud.twinsphere.io/explore?id=aHR0cDovL215LmRvbWFpbi5jb20vYWFzaWQvMTIzNDU2Nzg```

### Param: submodel

The submodel parameter contains the submodel id of the submodel to be opened as base64url encoded string.

The submodel parameter must be combined with the id parameter (see above) and it has to refer to an existing submodel
which is referenced by the chosen (aas) id.

There are some special use case views containing data from multiple submodels. To directly open these special views via
URL the following table states the respective values for the submodel parameter:

Use Case View | Parameter Value
--------------|-----------------
Digital Product Passport | ZHBw
Digital Battery Passport | YnBw

Example 1: ```https://viewer.{your_tenant}.cloud.twinsphere.io/explore?id=aHR0cDovL215LmRvbWFpbi5jb20vYWFzaWQvMTIzNDU2Nzg&submodel=aHR0cDovL215LmRvbWFpbi5jb20vc21pZC85ODc2NTQ```

Example 2: ```https://viewer.{your_tenant}}.cloud.twinsphere.io/explore?id=aHR0cDovL215LmRvbWFpbi5jb20vYWFzaWQvMTIzNDU2Nzg&submodel=YnBw```

### Param: embedded

If set to ```true``` this parameter enables you to hide the AAS Viewer's header and navigation bar.

The embedded parameter has to be combined with the id parameter (see above) and optionally may be combined with the
submodel parameter as well.

Example: ```https://viewer.{your_tenant}.cloud.twinsphere.io/explore?id=aHR0cDovL215LmRvbWFpbi5jb20vYWFzaWQvMTIzNDU2Nzg&embedded=true```

## Data Requirements

Some AAS Viewer features rely on your data quality in order to work.

### Property Units

To display units of measurement in the AAS Viewer, your repository needs to include concept descriptions that define the
semantics of properties within the submodels. These concept descriptions must embedded data specifications of the
IEC61360 type (version 3). Within this specification, the unit of measurement must be specified in the “Unit” property
in order to be displayed in square brackets behind the attribute name on all dedicated and generic views.
