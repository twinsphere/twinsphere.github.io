# Release Notes of twinstudio

The twinsphere Viewer follows the semantic versioning format in the form major.minor.patch:
[https://semver.org/](https://semver.org/).

## Studio 0.3
*30-Oct-2025*

- **[General]** Submitting feedback is now possible for everyone (no need for Jira login)
- **[TwinBuilder]** Editing of further shell properties (globalAssetId, assetKind, specificAssetId(s))
- **[TwinBuilder]** Display of assetType property and possibility to open referenced type twin in AAS Viewer
- **[TwinBuilder]** Selection of assetKind in Creation Wizard
- **[Catalog]** Added buttons for creation of new twin directly in Twin and Draft Catalog
- **[Catalog]** New Catalog of Concept Descriptions, including display of IEC61360 properties
- **[Bugfix]** Upload of files >1MB is possible now

## Studio 0.2 (MVP)
*02-Oct-2025*

- General Features
    - Login with twinsphere ID Account (same as for Cloud)
    - Language Settings
        - EN and DE as UI Language for app labels
        - Any Data Language for value display of multi language properties
    - ID Generator Basic: configurable patterns for GlobalAssetID, AAS-ID & SM-ID
    - Tenant Switch: Users may connect to any tenant of their assigned organizations
    - Studio Storage for non-twinsphere data (e.g., drafts, app settings)
    - Feedback Button to collect valuable customer feedback
- Rudimentary dashboard, purely for navigation purposes
- Twin Catalog
    - List twins (AAS+SM) from repo
    - List referenced SMs of an AAS
    - List submodel instances from repo
    - Quick filter for AAS by type/instance
    - First simple filters for AAS (mainly nameplate properties)
    - "View": Open twin or its SM in viewer
    - "Edit": Edit twin in Twin Builder
    - Instance-AAS > “Duplicate Twin” > Twin Builder (Clone AAS including SMs)
- Submodel Template Catalog
    - List SMTs from Repo
- Draft Catalog
    - List all Twin Drafts
    - "Edit": Continue editing a Twin Draft
    - "Publish": Transfer Draft Twins to Repo
    - "Delete": Delete Twin Draft
- Twin Builder
    - Creation Wizard for new twins
        - ...from scratch
        - ...based on an existing twin (duplication)
    - Maintenance of selected shell properties, including thumbnails
    - Add/remove submodels (SMTs from repo)
    - Filling in/editing values of SME of type Property, MultiLanguageProperty, File, and Range (other types to follow)
    - Comfort display and maintenance of MLPs, including transparency on applied display logic
    - Support for external links and upload of twinsphere files on SME of type "File"
    - Indication if SMT of submodels are resolvable and accessible
    - Marking mandatory fields with (*)
    - Issue list with validation errors based on Metamodel
    - Template qualifiers from SMT  (cardinalities)
    - MLP and Range value checks
    - Inserting and removing ToMany SMEs (cardinality ..ToMany)
    - Editing DisplayNames of all tree nodes (AAS, SM, SMC, SML)
    - Saving drafts
    - Publishing edited twins to the twinsphere repos
