# Release Notes of twinstudio

Our twinstudio follows the semantic versioning format in the form major.minor.patch:
[https://semver.org/](https://semver.org/).

---

## Studio 0.5

*Released on 14-Jan-2026*.

**New Features:**

- **[General]:**

    - Introduced user settings menu in top right corner.
        - Shows info of currently logged-in user account.
        - Moved language settings and tenant switch from sidebar to the settings menu.
    - Displayed value of MLP form elements can now be selected by clicking on the respective language tag

- **[TwinBuilder]:**

    - Added status bar representing the save state of the current twin ("published" / "draft saved" / "unsaved changes")
    - Export Twin as AASX Package directly from within editor (available for twins in "published" state only)
    - Added view button to open twin in AAS-Viewer (available for twins in "published" state only)
    - Replaced very technical fill-in pattern of date and time values by comfortable and localized selection via UI
      component (valueType of property in SMT has to be XS:date, xs:time or xs:datetime)
    - Introduction of deep links to directly open a certain twin in TwinBuilder by adding URL query parameter twinid,
      orgid and tenantid

- **[Catalog]:**

    - Export of twins as AASX Package available in "more" menu
    - Deletion of Twins in Twin Catalog with and without its SMs
        - Deletion of SMs also referenced by other twins is prohibited

**Fixes:**

- **[General]** Menu headings haven been harmonized in their formatting
- **[Catalog]** Fixed display of SM details on twins with zero submodels in twin catalog
- **[TwinBuilder]** Cancel on edit twin modal doesn't lead to endless spinner anymore
- **[TwinBuilder]** Fixed display of long twin names in AAS button

---

## Studio 0.4

*Released on 21-Nov-2025*.

**New Features:**

- **[General]:**

    - Established consistent behavior of popup dialogs

- **[TwinBuilder]:**

    - Added initial form support for submodel elements of type ReferenceElement.
        - For now only setting and display of references to elements of the currently opened twin are supported.
    - Export Twin as XML or JSON to File or Clipboard from within Twin Builder
    - New option to open a twin from file for editing (AASX, JSON, XML) available in Dashboard
    - Build with twinstudio signature added to AAS and submodels (via extensions)

- **[Catalog]:**

    - Added export (JSON/XML) to file or clipboard in more menu of
        - Twin Catalog
        - Submodel Catalog
        - Submodel Template Catalog
        - Concept Description Catalog
        - Draft Catalog

**Fixes:**

- **[TwinBuilder]:**

    - Proper handling of all optional submodel elements (deletion and adding)
    - It is possible to open empty twins (shell without any SM references)
    - Text in File submodel-element is capped to max editor width
    - Fixed broken layout by enabling multiline form elements for MLPs and Properties
    - It is possible to add/remove elements to submodels which structurally do not adhere to their referenced
      template

---

## Studio 0.3

*Released on 30-Oct-2025*.

**New Features:**

- **[General]:**

    - Submitting feedback is now possible for everyone (no need for Jira login)

- **[TwinBuilder]:**

    - Editing of further shell properties (globalAssetId, assetKind, specificAssetId(s))
    - Display of assetType property and possibility to open referenced type twin in AAS Viewer
    - Selection of assetKind in Creation Wizard

- **[Catalog]:**

    - Added buttons for creation of new twin directly in Twin and Draft Catalog
    - New Catalog of Concept Descriptions, including display of IEC61360 properties

**Fixes:**

- **[General]:**

    - Upload of files >1MB is possible now

---

## Studio 0.2 (MVP)

*Released on 02-Oct-2025*.

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
