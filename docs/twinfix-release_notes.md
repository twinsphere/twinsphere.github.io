# Release Notes of twinfix

## Versioning

twinfix library follows [semantic versioning](https://semver.org/) in the form major.minor.patch.

---

<!--markdownlint-disable no-emphasis-as-heading -->

## twinfix 2.0.0

*Released on 07-July-2026*.

- **[Feat]** Complete rewrite with new UI.
- **[Feat]** Reimplement the validation on the basis of twinsphere.TypedAasMetamodels validation module.
    - The new validation engine now supports parts 1 and 5 of the AAS specification
    - Submodel template and instance specific validations
    - Subomdel instance conformicy validations

## twinfix 1.1.0

*Released on 07-March-2025*.

- **[Feat]** Add validation for wrong/missing thumbnails.

## twinfix 1.0.1

*Released on 24-January-2025*.

- **[Fix]** Resolve endless-loop in performing idShort fixes.

## twinfix 1.0.0

*Released on 28-October-2024*.

- **[Feat]** Rewrite and relaunch as twinfix.
- **[Feat]** Rewrite the UI.
- **[Feat]** twinfix now integrates the ability to automatically fix and resolve some common issues.

## aas-checker 1.0.0

*Released on 03-March-2024*.

- **[Feat]** Initial release. Web service that leverages the `AasCore` validations plus a handful additional validations
  to validate against parts 1 and 5 of the AAS specification.

<!--markdownlint-enable no-emphasis-as-heading -->
