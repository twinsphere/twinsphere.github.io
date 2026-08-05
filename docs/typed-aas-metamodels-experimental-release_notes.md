# Release Notes of twinsphere.TypedAasMetamodels.Experimental

## Versioning

The twinsphere.TypedAasMetamodels.Experimental library follows [semantic versioning](https://semver.org/) in the
form major.minor.patch.

---

<!--markdownlint-disable no-emphasis-as-heading -->

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
