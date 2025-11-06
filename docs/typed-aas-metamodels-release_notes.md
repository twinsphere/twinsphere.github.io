# Release Notes of twinsphere.TypedAasMetamodels

## Versioning

The twinsphere.TypedAasMetamodels library follows [semantic versioning](https://semver.org/) in the form major.minor.patch.

---

<!--markdownlint-disable no-emphasis-as-heading -->

## twinsphere.TypedAasMetamodels 1.1.3

*Released on 06-Nov-2025*.

- **[Bugfix]** Fix broken semantic ids in HandoverDocumentation 1.2
- **[Bugfix]** ToMetamodel conversion of HandoverDocumentation 1.2 now sets descriptions of PreviewFile correctly
- **[Bugfix]** ToMetamodel conversion of Technical Data 2.0 now sets section description correctly

## twinsphere.TypedAasMetamodels 1.1.2

*Released on 30-Oct-2025*.

- **[Bugfix]** Fix semantic ids for HandoverDocumentation 1.2 and HandoverDocumentation 2.0
- **[Bugfix]** Fix constructor and setter constraint for TechnicalProperties, MainSection, and SubSection of
  TechnicalData 1.2
- **[TAM]** Update to most recent specification versions for several submodels
- **[TAM]** Introduce consistent error messages in validation
- **[TAM]** Improve documentation.
- **[Semantics]** Update to most recent specification versions for several submodels

## twinsphere.TypedAasMetamodels 1.1.1

*Released on 30-Sep-2025*.

- **[Bugfix]** Fix several invalid language string entries in concept descriptions

## twinsphere.TypedAasMetamodels 1.1.0

*Released on 09-Sep-2025*.

- **[Bugfix]** Fix property names in reported errors
- **[Bugfix]** Arbitrary property operations now check for the id short to be non-empty
- **[Bugfix]** Semantics now also supports file paths that don't start with "file://"
- **[Bugfix]** Semantics now also support custom classifications for HandoverDocumentation 1.2
- **[Bugfix]** Fix property names in semantic schema for HandoverDocumentation 1.2
- **[Bugfix]** Semantics now support more than a single arbitrary property element
- **[Bugfix]** Semantics now correctly support MultiLanguageProperties
- **[Bugfix]** Add support for missing DocumentClassifications in HandoverDocumentation 1.2
- **[Bugfix]** Add missing DocumentClassifications translations for HandoverDocumentation 1.2
- **[TAM]** Rename SpherePackageBuilder to AasxPackageBuilder
- **[TAM]** Introduce Core reference types at interfaces instead of string references.
- **[TAM]** Extend arbitrary property interfaces to support user-defined descriptions and display names.
- **[TAM]** Add support for non-list elements with cardinality elements without pattern syntax in validation
- **[TAM]** Add support for multiple submodels
    - TechnicalData 2.0
    - HandoverDocumentation 2.0
    - DigitalNameplate 3.0

## twinsphere.TypedAasMetamodels 1.0.1

*Released on 04-Aug-2025*.

- **[Bugfix]** Packaging now collects all files referenced in a submodel
- **[Bugfix]** Packaging now allows packages without submodels or concept descriptions

## twinsphere.TypedAasMetamodels 1.0.0

- **[Bugfix]** Packaging now ensures that files and thumbnails are only packaged once
- **[Bugfix]** HandoverDocumentation now won't throw if the model is erroneous
- **[Bugfix]** File types now support file paths without "file://" prefix
- **[TAM]** Add support for more than one shell in packaging
- **[TAM]** Introduce validations for shell types
- **[TAM]** Add full support for arbitrary properties
- **[TAM]** Rename file types and referable types to decrease ambiguity with Core Works
- **[HandoverDocumentation 1.2]** add support for user defined ClassIds
- **[TechnicalData 1.2]** upgrade to match latest specification release
- **[Semantic]** Add human-readable description to semantic schema

*Released on 21-Jul-2025*.

## twinsphere.TypedAasMetamodels 1.0.0-RC-20250423

*Released on 23-Apr-2025*.

- **[TAM]** Introduce library abstractions over core data types (Blob, File, ...) to simplify user experience

## twinsphere.TypedAasMetamodels 1.0.0-RC-20250416

*Released on 16-Apr-2025*.

- **[Bugfix]** Resolve submodels in semantics by semantic ID, not template ID

## twinsphere.TypedAasMetamodels 1.0.0-RC-20250415

*Released on 15-Apr-2025*.

- **[TAM]** Representation, conversion, verification methods and classes for shells
- **[TAM]** Representation, conversion, verification methods and classes for several submodels
    - Carbon Footprint 0.9
    - Contact Informations 1.0
    - Digital Nameplate 2.0
    - Handover Documentation 1.2
    - Hierarchical Structures enabling Bill of Materials 1.1
    - Technical Data 1.2
- **[TAM]** Conversion methods for ValueOnly representation
- **[TAM]** Utilities for package creation
- **[Semantic]** Semantic schema support for several submodels
    - Carbon Footprint 0.9
    - Contact Informations 1.0
    - Digital Nameplate 2.0
    - Handover Documentation 1.2
    - Hierarchical Structures enabling Bill of Materials 1.1
    - Technical Data 1.2
- **[Semantic]** Conversion from and to meta model from semantic schema XML

<!--markdownlint-enable no-emphasis-as-heading -->
