# Release Notes of twinsphere.TypedAasMetamodels

## Versioning

The twinsphere.TypedAasMetamodels library follows [semantic versioning](https://semver.org/) in the form major.minor.patch.

---

<!--markdownlint-disable no-emphasis-as-heading -->

## twinsphere.TypedAasMetamodels 1.3.2-rc.1

*Released on 19-May-2026*.

- **[TAM] [Exp]** Resolve an issue in validation of DigitalQualityDocuments. The DigitalQualityDocuments submodel
  template reuses semantic ids of HandoverDocumentation. This way, special validation cases trigger and fail for the
  submodel, causing its validation and creation to fail. Add a workaround for these issues.
- **[TAM]** Resolve crashes due to unsupported types in validation.

## twinsphere.TypedAasMetamodels 1.3.1

*Released on 11-May-2026*.

- **[TAM]** Allow construction and validation of TechnicalData 1.2 `TechnicalProperties`, `MainSection`, and
  `SubSection` with any element type. With the new validation, the creation and validation of these types with
  SubmodelElement types other than `MultiLanguageProperties` would fail due to the way that these properties are
  modelled in the submodel.
- **[TAM]** Add graceful error handling for errors during the validation of submodel data. This fixes crashes on broken
  submodel templates in the conformity validation.
- **[TAM]** Add validation of matching semantic ids for all submodel element types. Until now, the correctness of
  semantic ids would only be checked for submodel element collections and submodel element list.
- **[TAM]** Resolve crashes due to unsupported types in validation.
- **[TAM]** Ensure that any semantic id is covered in packaging. To this end, we now invoke the concept description:
  resolver in packaging also for supplemental semantic ids.
- **[TAM]** Fix a crash when creating packages with an empty shell list.

## twinsphere.TypedAasMetamodels 1.3.0

*Released on 05-May-2026*.

- **[TAM]** Improved `AasxPackagingInformation` API as a replacement of the `PackagePreprocessor`.
    - Provides a fluent API for package creation
    - Allows the creation of packages without shells
- **[TAM]** Arbitrary elements now allow users to specify supplemental semantic ids.
- **[TAM] [Bugfix]** Conversion of arbitrary elements to the typed representation no longer silently drops supplemental
  semantic ids.
- **[TAM] [Bugfix]** Resolving DropIns now removes the `https://admin-shell.io/smt-dropin/smt-dropin-use/1/0`
  supplemental semantic id.
- **[TAM] [Bugfix]** Conversion of empty submodel element collections (i.e. submodel element collections for which all
  elements are optional) to their typed model representation no longer fails.
- **[TAM] [Bugfix]** Creation of typed models and validation no longer fails due to the submodel templates not being
  accessible.
- **[TAM] [Bugfix]** Multiple escaping issues in DisplayNames and Descriptions.
- **[TAM] [Bugfix]** Resolve multiple inconsistencies in conformity validation due to incorrect submodel templates.
- **[TAM] [Bugfix]** Packaging now properly encodes file paths containing special characters.
- **[TAM] [Bugfix]** Packaging on Windows no longer uses incorrect path separators.
- **[TAM] [Bugfix]** Setters on list properties no longer throw.
- **[TAM] [Bugfix]** Fix conversion problems for Property values to C# representation and vice versa.
- **[TAM] [Bugfix]** Numeric boundaries are now properly checked for ValueOnly conversion.
- **[TAM] [Bugfix] [DigitalNameplate 3.0]** `AssetSpecificProperties` and `GuidelineSpecificProperties` now allow users
  to specify no arbitrary element, as well.
- **[TAM] [Bugfix] [HandoverDocumentation 2.0]** `KeyWords` now is an optional property.
- **[Semantics] [Bugfix]** Add missing attributes for arbitrary property type in schema.
- **[Semantics] [Bugfix]** Conversion of base64 Blob values no longer corrupts data.
- **[Semantics] [Bugfix]** Serialization no longer fails with exhausted `XmlWriter`.
- **[Semantics] [Bugfix]** Exceptions no longer hide the full stack trace.
- **[Semantics] [Bugfix]** Serialization of empty lists of arbitrary elements no longer fails.
- **[Semantics] [Bugfix]** Serialization to semantics representation no longer modifies the submodel.

## twinsphere.TypedAasMetamodels 1.2.0

*Released on 14-Apr-2026*.

- **[TAM]** Added migrations to convert between Handover Documentation v1.2 and v2.0 (and vice versa)
- **[TAM]** AASX Packaging interface now allows users to specify file and concept description resolving strategies
- **[TAM]** Added an extensible validation interface
    - Package validation
    - Meta model constraint validation
    - Submodel specific (template/instance) validations
    - Dynamic Submodel  conformity validations that check  whether submodel instances conform to  constraints specified in
      their templates
- **[TAM]** Switch to AAS v3.1: TAM now consumes, produces, and validates to v3.1 of the AAS specification
- **[TAM]** Added a AAS 3.0 compatibility layer that allows the consumption and on-the-fly conversion of of v3.0 data
- **[TAM]** HandoverDoucmentation v1.2 and v2.0: make DocumentClassifications extensible for further translations
- **[Bugfix]** Make `numberOfDocuments` of Handover Documentation v1.2 optional
- **[Bugfix]** In HandoverDocumentation v1.2 and v2.0 use `VDI 2770 Blatt 1:2020` instead of `VDI2770 Blatt 1:2020`
- **[Bugfix]** Unrecognized languages in language code checks
- **[Bugfix]** DigitalNameplate v2.0 and 3.0: unrecognized country codes in countries of origins check
- **[Bugfix]** Failure to validate valid MIME types for extensions with multiple possible MIME types
- **[Bugfix] [Exp]** Rename namespace of `DigitalQualityDocument` to
  `twinsphere.TypedAasMetamodels.Experimental.Types.Submodels.DigitalQualityDocument.V1_0`
  (was `twinsphere.TypedAasMetamodels.Types.Submodels.DigitalQualityDocument.V1_0`)

## twinsphere.TypedAasMetamodels 1.1.5

*Released on 02-Mar-2026*.

- **[TAM]** TAM now has support for older `.aasx` packages still using the deprecated `_rels` format.
- **[Exp]** Add experimental package for testing to-be-released SMTs:
    - Digital Quality Document 1.0
    - Digital Battery Passport
    - Digital Nameplate 1.0
    - Product Carbon Footprint 1.0
    - Handover Documentation 1.0
    - Technical Data 1.0
    - Product Condition 1.0
    - Material Composition 1.0
    - Circularity 1.0
- **[Bugfix]** Fix representation of semantic Ids in meta model conversion for multiple SMTs
- **[Bugfix]** Fix too strict validations in CarbonFootprint 0.9
- **[Bugfix]** Add missing constraint on Path types
- **[Bugfix]** Fix null dereference in validation of Handover Documentation 1.2

## twinsphere.TypedAasMetamodels 1.1.4

*Released on 20-Nov-2025*.

- **[TAM]** Update to most recent specification versions for several submodels
    - Contact Informations 1.0
    - Technical Data 2.0
    - Handover Documentation 2.0
    - Hierarchical Structures enabling Bill of Materials 1.1
- **[Bugfix]** Packaging and conversion now ensures that file paths/values are properly percent encoded in conformity
  with RFC2396.

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
