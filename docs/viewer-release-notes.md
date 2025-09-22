# Release Notes of twinsphere Viewer

The twinsphere Viewer follows the semantic versioning format in the form major.minor.patch:
[https://semver.org/](https://semver.org/).

## Viewer 2.2

*02-Jun-2025*:

- Added display of unit behind attribute names in dedicated and generic views (see [documentation](viewer-overview.md)
  on data requirements)
- [Bugfix] Embedded mode stays activated when navigating

## Viewer 2.1

*10-Mar-2025*:

- Introduced new asset view
    - Displays general asset and AAS information
    - Lists all referenced submodels as clickable tiles to open their view as pop-up
    - Display order of SM tiles now secures important info to be displayed first (like DPP, Nameplate or Technical Data)
- Reworked submodel views
    - Removed generic view by introducing the asset view (which display all available submodels as tiles)
    - If there is a dedicated view available for a submodel it is used as default
    - Slider allows to switch to the generic representation instead of the dedicated view in this case
    - Generic view is used to display a submodel if no dedicated view is available for it
- Completely reworked main navigation
- Added option to open AAS by entering its id (aas ID or global asset ID)
- Added option to browse a list of available digital twins and select one to be opened
- Revised bookmarking of digital twins: icon in header now adds and removes a bookmark on displayed AAS
- Introduced the "Embedded Mode" to hide header and navigation bars (URL parameter *embedded=true*)
- [Bugfix] Direct links to an AAS or one of its submodels are working again
- [Bugfix] Removed requirement of a nameplate submodel for a shell to be displayed (any shell is now possible to be
  opened)
- [Bugfix] Adjusted height of expandable records element in generic view of time series submodels
- [Bugfix] Fixed rarely occurring caching problem which displayed submodels of last opened asset when navigating to a
  new one

## Viewer 2.0

*Sep-2024 to Feb-2025*:

- Developed as integrated part of the twinsphere Server project
- see [Cloud Release Notes](cloud-release-notes.md) tagged ***\[Viewer\]*** for details

## Viewer 1.0

*Aug-2023 to Sep-2024*:

- developed in the context of the fair showcase "follow the twin challenge" in separate project
- no release notes available
