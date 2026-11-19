# Release Notes of twinsphere.TypedAasMetamodels.Experimental

## Versioning

The twinsphere.TypedAasMetamodels.Experimental library follows [semantic versioning](https://semver.org/) in the
form major.minor.patch.
See [Versioning and SMT Conformity](typed-aas-metamodels-versioning.md) for how updates to SMTs are reflected in
releases.

---

<!--markdownlint-disable no-emphasis-as-heading -->

## twinsphere.TypedAasMetamodels.Experimental 1.5.1

*Released on 13-November-2026*.

- **[Fix] [Digital Quality Documents]** Resolve several issues in the domain model of the Digital Quality Documents
  submodel that stemmed from issues in the SMT. The generated types and builders changed accordingly, which may require
  adaptations in existing code.

## twinsphere.TypedAasMetamodels.Experimental 1.5.0

*Released on 09-November-2026*.

- **[Feat] [Digital Quality Documents]** Update the submodel to SMT release 1.0.3. Until now, Experimental featured the
  pre-1.0.0 version of the SMT, which has changed structurally. This is a breaking change for existing code using the
  submodel.

## twinsphere.TypedAasMetamodels.Experimental 1.4.1

*Released on 05-August-2026*.

- **[Fix] [Sensor 4.0 - Measurement Value]**
    - Fix an issue with the validation of allowed attributes of the "Quality" property. The SMT had an erroneous
      `SMT/AllowedIdShort` qualifier which limited the permissible values. Fixed the validation to allow the intended
      "good", "bad", "uncertain", and "others" options.
    - Adapt the MeasuredValuePreDefined property to allow users to set arbitrary floating point properties (arbitrary
      wrt. to IdShort and Semantic ID). This issue stems from some modeling issue in the SMT/Specification. Users are
      expected to choose MeasuredValuePreDefined freely, however, the model contains an example "Distance" property,
      that is not flagged correctly as an example only.

## twinsphere.TypedAasMetamodels.Experimental 1.4.0

*Released on 14-July-2026*.

- **[Feat]** Add support for the Sensor 4.0 - Measurement Value submodel.
- **[Fix]** Resolve an issue in validation of DigitalQualityDocuments. The DigitalQualityDocuments submodel
  template reuses semantic ids of HandoverDocumentation. This way, special validation cases trigger and fail for the
  submodel, causing its validation and creation to fail. Add a workaround for these issues.

<!--markdownlint-enable no-emphasis-as-heading -->
