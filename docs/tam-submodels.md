# Supported Submodels

The following lists the submodels supported by twinsphere.TypedAasMetamodels.

## Carbon Footprint

### Version 0.9

| ---             | Supported Submodel Template                                                                       |
|-----------------|---------------------------------------------------------------------------------------------------|
| **Name**        | Carbon Footprint                                                                                  |
| **IDTA Number** | 02023                                                                                             |
| **Version**     | 0.9                                                                                               |
| **Github**      | <https://github.com/admin-shell-io/submodel-templates/tree/main/published/Carbon%20Footprint/0/9> |

#### Deviations from SMTs

- Add AdministrativeInformation with version and revision.

## Contact Information

### Version 1.0

| ---             | Supported Submodel Template                                                                        |
|-----------------|----------------------------------------------------------------------------------------------------|
| **Name**        | Submodel for Contact Information                                                                   |
| **IDTA Number** | 02002                                                                                              |
| **Version**     | 1.0                                                                                                |
| **Github**      | <https://github.com/admin-shell-io/submodel-templates/tree/main/published/Contact%20Information/1> |

> **Note**: Please pay attention to singular and plural versions - ContactInformation vs. ContactInformations.

#### Deviations from SMTs

- Add AdministrativeInformation with version and revision.

## Digital Nameplate for industrial equipment

### Version 2.0

| ---             | Supported Submodel Template                                                                        |
|-----------------|----------------------------------------------------------------------------------------------------|
| **Name**        | Digital Nameplate for Industrial Equipment                                                         |
| **IDTA Number** | 02006                                                                                              |
| **Version**     | 2.0                                                                                                |
| **Github**      | <https://github.com/admin-shell-io/submodel-templates/tree/main/published/Digital%20nameplate/2/0> |

**Supported submodel specific constraints**:

- Nameplate::CountryOfOrigin
    - Country codes defined accord. to DIN EN ISO 3166-1 alpha-2 codes
- ExplosionSafety::SpecificConditionsForUse
    - X if any, otherwise no entry
- ExplosionSafety::IncompleteDevice
    - U if any, otherwise no entry
- ExplosionSafety::IncompleteDevice
    - U if any, otherwise no entry

#### Deviations from SMTs

- Add AdministrativeInformation with version and revision.
- Removed invalid whitespaces in IDs and semantic IDs.
- Fix language type in language strings.

### Version 3.0

| ---             | Supported Submodel Template                                                                        |
|-----------------|----------------------------------------------------------------------------------------------------|
| **Name**        | Digital Nameplate for Industrial Equipment                                                         |
| **IDTA Number** | 02006                                                                                              |
| **Version**     | 3.0                                                                                                |
| **Github**      | <https://github.com/admin-shell-io/submodel-templates/tree/main/published/Digital%20nameplate/3/0> |

**Note**:

Contrary to [Digital Nameplate
2.0](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Digital%20nameplate/2/0), this submodels
id short officially is `Nameplate`. We follow this naming strategy and it is reflected in the DevKit, i.e., the Digital
Nameplate 3.0 can be found in the namespace `twinsphere.TypedAasMetamodels.Types.Submodels.Nameplate.V3_0`.

**Supported submodel specific constraints**:

- Nameplate::CountryOfOrigin
    - Country codes defined accord. to DIN EN ISO 3166-1 alpha-2 codes

## Generic Frame for Technical Data for Industrial Equipment in Manufacturing

### Version 1.2

<!-- markdownlint-disable line-length -->

| ---             | Supported Submodel Template                                                                   |
|-----------------|-----------------------------------------------------------------------------------------------|
| **Name**        | Generic Frame for Technical Data for Industrial Equipment in Manufacturing                    |
| **IDTA Number** | 02003                                                                                         |
| **Version**     | 1.2                                                                                           |
| **Github**      | <https://github.com/admin-shell-io/submodel-templates/tree/main/published/Technical_Data/1/2> |

<!-- markdownlint-enable line-length -->

**Supported submodel specific constraints**:

- TechnicalProperties::MainSection
    - Each Main Section SMC may contain arbitrary sets of SubmodelElements, SemanticIdNotAvailable, SubSection.
- TechnicalProperties::SubSection
    - Each Sub Section SMC may contain arbitrary sets of SubmodelElements, SemanticIdNotAvailable, SubSection.
- TechnicalProperties::SubSection
    - In the hierarchy of SubmodelElements, a MainSection shall be super-ordinate to the SubSection.

### Version 2.0

<!-- markdownlint-disable line-length -->

| ---             | Supported Submodel Template                                                                   |
|-----------------|-----------------------------------------------------------------------------------------------|
| **Name**        | Generic Frame for Technical Data for Industrial Equipment in Manufacturing                    |
| **IDTA Number** | 02003                                                                                         |
| **Version**     | 2.0                                                                                           |
| **Github**      | <https://github.com/admin-shell-io/submodel-templates/tree/main/published/Technical_Data/2/0> |

<!-- markdownlint-enable line-length -->

**Note**:

This SMT makes heavy use of arbitrary elements for modeling the `TechnicalDataAreas` and `SpecificDescriptions`. In
both cases, users may use SubmodelElementCollections (SMCs) as structuring elements, e.g., to provide additional nesting
in UIs. To this end, this SMT defines two different types of SMCs: `Section` and `ArbitrarySMC`, both are considered to
act as arbitrary properties, i.e., properties for which the user may choose an id short, as well as, semantic ids. At
the moment, however, there is no way to tell a `Section` element from any other SMC element in their respective context.
In the DevKit we therefore do have a `Section` element for the creation of the submodel. However, it is currently
impossible to load an instance of this submodel from metamodel and to retrieve `Section` elements.

Furthermore, there currently are some additional modeling issues with this SMT: the SMT describes the
`ProductClassifications`, `TechnicalPropertyAreas`, and `SpecialDescriptions` by qualifiers as lists of lists. This
likely is a modeling error. As of now we interpret this as an error and interpret these individual elements as singular
elements.

#### Deviations from SMTs

- Removed invalid whitespaces in IDs and semantic IDs.
- Fix language type in language strings.

## Handover Documentation

### Version 1.2

<!-- markdownlint-disable line-length -->

| --- | Supported Submodel Template |
|-----------------|---------------------------------------------------------------------------------------------------------|
| **Name**        | Handover Documentation                                                                                  |
| **IDTA Number** | 02004                                                                                                   |
| **Version**     | 1.2                                                                                                     |
| **Github**      | <https://github.com/admin-shell-io/submodel-templates/tree/main/published/Handover%20Documentation/1/2> |

<!-- markdownlint-enable line-length -->

**Supported submodel specific constraints**:

- Document::DocumentClassification
    - At least one classification according to VDI 2770 shall be provided.
- DocumentId::IsPrimary
    - Only one DocumentId in a collection may be marked as primary.
- DocumentClassification::ClassId
    - If ClassificationSystem is set to “VDI2770 Blatt 1:2020”, the given IDs of VDI2770 Blatt 1:2020 shall be used
- DocumentClassification::ClassName
    - If ClassificationSystem is set to “VDI2770 Blatt 1:2020”, the given IDs of VDI2770 Blatt 1:2020 shall be used
- DocumentVersion::Title
    - For each language-dependent Title, a Summary and at least one KeyWord shall exist for the given language.
- DocumentVersion::Summary
    - For each language-dependent Title, a Summary and at least one KeyWord shall exist for the given language.
- DocumentVersion::KeyWords
    - For each language-dependent Title, a Summary and at least one KeyWord shall exist for the given language.
- DocumentVersion::DigitalFile
    - The MIME-Type needs to match the file type.
    - At least one PDF/A file type shall be provided.
- DocumentVersion::PreviewFile
    - The MIME-Type needs to match the file type.
        - Allowed file types are JPG, PNG, BMP.

**Not yet supported submodel specific constraints**:

- Document::DocumentedEntity
    - Reference targets an Entity within the Submodel “ManufacturerDocumentation”.
        - This constraint is not ensured currently due to uncertainty in "ManufacturerDocumentation"
- DocumentClassification::ClassName
    - Languages shall match at least the language specifications of the included DocumentVersions.
        - This is currently not supported as only english is used
- DocumentVersion::RefersTo
    - Reference targets a SMC “Document” or a “DocumentVersion”.
        - This is currently not ensured as the SDK accepts all references
- DocumentVersion::BasedOn
    - Reference targets a SMC “Document” or a “DocumentVersion”.
        - This is currently not ensured as the SDK accepts all references
- DocumentVersion::TranslationOf
    - Reference targets a SMC “Document” or a “DocumentVersion”.
        - This is currently not ensured as the SDK accepts all references
    - The [language-independent] content must be identical in both Documents or DocumentVersions.
        - This cannot be checked as there is no way to check the language of the document content from the library.

### Version 2.0

<!-- markdownlint-disable line-length -->

| --- | Supported Submodel Template |
|-----------------|---------------------------------------------------------------------------------------------------------|
| **Name**        | Handover Documentation                                                                                  |
| **IDTA Number** | 02004                                                                                                   |
| **Version**     | 2.0                                                                                                     |
| **Github**      | <https://github.com/admin-shell-io/submodel-templates/tree/main/published/Handover%20Documentation/2/0> |

<!-- markdownlint-enable line-length -->

**Note**:

The current state of the Handover Documentation 2.0 specification implicitly lifts many of the constraints defined for
version 1.2. This omission from the spec is likely due to an error, rather than intentionally. However, until the spec
is fixed or an official statement has been made, we chose to follow the spec by also omitting these checks from the SDK.

**Supported submodel specific constraints**:

- Document::DocumentClassification
    - The classification according to VDI 2770 Blatt 1:2020 is mandatory in the Submodel Handover Documentation.
- DocumentId::DocumentIsPrimary
    - One ID in this collection should be used as a preferred ID.

#### Deviations from SMTs

- Fix language type in language strings.

## Hierarchical Structures enabling Bills of Material

### Version 1.1

<!-- markdownlint-disable line-length -->

| ---             | Supported Submodel Template                                                                   |
|-----------------|-----------------------------------------------------------------------------------------------|
| **Name**        | Hierarchical Structures enabling Bills of Material                    |
| **IDTA Number** | 02011                                                                                         |
| **Version**     | 1.2                                                                                           |
| **Github**      | <https://github.com/admin-shell-io/submodel-templates/tree/main/published/Hierarchical%20Structures%20enabling%20Bills%20of%20Material/1/1> |

#### Deviations from SMTs

- Add AdministrativeInformation with version and revision.

<!-- markdownlint-enable line-length -->
