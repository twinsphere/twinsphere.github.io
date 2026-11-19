# Versioning and SMT Conformity

This page describes how twinsphere.TypedAasMetamodels (TAM) and twinsphere.TypedAasMetamodels.Experimental
(TAM Experimental) are versioned, and how new releases of Submodel Templates (SMTs) are reflected in our releases.

## Semantic Versioning

TAM and TAM Experimental follow [semantic versioning](https://semver.org/) in the form major.minor.patch. The two
packages are versioned independently of each other. The `twinsphere.TypedAasMetamodels.Semantics` package is released
together with TAM and always carries the same version. The Rulebook is released independently, see its
[release notes](typed-aas-metamodels-rulebook-release_notes.md).

## Two Independent Versioning Schemes

Two distinct versioning schemes are involved:

- **TAM / TAM Experimental versions** reflect features, bug fixes, and changes of the libraries themselves.
- **SMT versions** follow the versioning scheme of the IDTA. This scheme is independent of ours and is the
  authoritative source for the content of a submodel. The version of a TAM release says nothing about the version of
  the SMTs it supports, and vice versa. Which SMT versions are supported is listed in
  [Supported Submodels](typed-aas-metamodels-submodels.md) and in the release notes.

## Conformity to SMTs

We target conformity with the SMTs, and we regard the most recent published patch release of an SMT as the correct
specification. Conformity here means that the submodel types, builders, validation, and conversion of TAM reflect the
structure and rules of that SMT release.

- **Multiple versions:** We support multiple major.minor versions of an SMT side by side. A new major or minor version
  of an SMT is added as an additional version and does not replace existing ones.
- **Latest patch only:** For each supported major.minor version, we target only the latest patch release of the SMT.
  We do not provide separate variants for older patch releases, and we adopt a new patch release regardless of whether
  it affects existing code.
- **Patch releases are non-breaking by intent:** Patch releases of SMTs are generally non-breaking. However, if an SMT
  patch release does introduce a change that breaks the code of the respective submodel, we still adopt it in a
  **patch** release of TAM or TAM Experimental. In this case, conformity with the SMT takes precedence over source
  compatibility.
- **Deviations:** In some cases, we deviate from the SMT, for example to fix editorial issues. These deviations are
  listed in [Supported Submodels](typed-aas-metamodels-submodels.md).

| Change                                              | Release of TAM / TAM Experimental |
|-----------------------------------------------------|-----------------------------------|
| Support for a new major or minor version of an SMT  | Minor                             |
| Update to the next patch release of an SMT          | Patch (even if breaking)          |
| Bug fix or non-breaking change in TAM               | Patch                             |
| New feature in TAM                                  | Minor                             |
| Breaking change of the library API                  | Major                             |

<!-- markdownlint-disable code-block-style -->
!!! tip

    If you depend on a stable submodel API, pin the exact version of TAM or TAM Experimental.
<!-- markdownlint-enable code-block-style -->

## TAM Experimental

TAM Experimental contains SMTs that we do not fully support yet. Reasons are, for example, issues in the SMT itself,
or an SMT that has not been officially released and is still in a review or preview phase.

Submodels may move from TAM Experimental to TAM. This can happen in a minor release.
