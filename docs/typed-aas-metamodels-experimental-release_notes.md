# Release Notes of twinsphere.TypedAasMetamodels.Experimental

## Versioning

The twinsphere.TypedAasMetamodels.Experimental library follows [semantic versioning](https://semver.org/) in the
form major.minor.patch.

---

<!--markdownlint-disable no-emphasis-as-heading -->

## twinsphere.TypedAasMetamodels.Experimental 1.4.0

*Released on 14-July-2026*.

- **[Feat]** Add support for the Sensor 4.0 - Measurement Value submodel.
- **[Fix]** Resolve an issue in validation of DigitalQualityDocuments. The DigitalQualityDocuments submodel
  template reuses semantic ids of HandoverDocumentation. This way, special validation cases trigger and fail for the
  submodel, causing its validation and creation to fail. Add a workaround for these issues.

<!--markdownlint-enable no-emphasis-as-heading -->
