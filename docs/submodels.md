# Supported Submodels

The following lists the submodels supported by twinsphere.TypedAasMetamodels.

## Contact Information (Version 1.0)

| ---             | Supported Submodel Template                                                                        |
|-----------------|----------------------------------------------------------------------------------------------------|
| **Name**        | Submodel for Contact Information                                                                   |
| **IDTA Number** | 02002                                                                                              |
| **Version**     | 1.0                                                                                                |
| **Github**      | <https://github.com/admin-shell-io/submodel-templates/tree/main/published/Contact%20Information/1> |

> **Note**: Please pay attention to singular and plural versions - ContactInformation vs. ContactInformations.

## Digital Nameplate for industrial equipment (Version 2.0)

| ---             | Supported Submodel Template                                                                        |
|-----------------|----------------------------------------------------------------------------------------------------|
| **Name**        | Digital Nameplate for Industrial Equipment                                                         |
| **IDTA Number** | 02006                                                                                              |
| **Version**     | 2.0                                                                                                |
| **Github**      | <https://github.com/admin-shell-io/submodel-templates/tree/main/published/Digital%20nameplate/2/0> |

**Supported submodel specific constraints**

- Nameplate::CountryOfOrigin
    - Country codes defined accord. to DIN EN ISO 3166-1 alpha-2 codes
- ExplosionSafety::SpecificConditionsForUse
    - X if any, otherwise no entry
- ExplosionSafety::IncompleteDevice
    - U if any, otherwise no entry
- ExplosionSafety::IncompleteDevice
    - U if any, otherwise no entry

## Handover Documentation (Version 1.2)

| ---             | Supported Submodel Template                                                                             |
|-----------------|---------------------------------------------------------------------------------------------------------|
| **Name**        | Handover Documentation                                                                                  |
| **IDTA Number** | 02004                                                                                                   |
| **Version**     | 1.2                                                                                                     |
| **Github**      | <https://github.com/admin-shell-io/submodel-templates/tree/main/published/Handover%20Documentation/1/2> |

**Supported submodel specific constraints**

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

**Not yet supported submodel specific constraints**

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

## Generic Frame for Technical Data for Industrial Equipment in Manufacturing (Version 1.2)

| ---             | Supported Submodel Template                                                                   |
|-----------------|-----------------------------------------------------------------------------------------------|
| **Name**        | Generic Frame for Technical Data for Industrial Equipment in Manufacturing                    |
| **IDTA Number** | 02003                                                                                         |
| **Version**     | 1.2                                                                                           |
| **Github**      | <https://github.com/admin-shell-io/submodel-templates/tree/main/published/Technical_Data/1/2> |

**Supported submodel specific constraints**

- TechnicalProperties::MainSection
    - Each Main Section SMC may contain arbitrary sets of SubmodelElements, SemanticIdNotAvailable, SubSection.
- TechnicalProperties::SubSection
    - Each Sub Section SMC may contain arbitrary sets of SubmodelElements, SemanticIdNotAvailable, SubSection.
- TechnicalProperties::SubSection
    - In the hierarchy of SubmodelElements, a MainSection shall be super-ordinate to the SubSection.

## Carbon Footprint

| ---             | Supported Submodel Template                                                                       |
|-----------------|---------------------------------------------------------------------------------------------------|
| **Name**        | Carbon Footprint                                                                                  |
| **IDTA Number** | 02023                                                                                             |
| **Version**     | 0.9                                                                                               |
| **Github**      | <https://github.com/admin-shell-io/submodel-templates/tree/main/published/Carbon%20Footprint/0/9> |
