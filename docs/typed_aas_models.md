# twinsphere.TypedAasMetamodels

twinsphere.TypedAasMetamodels is a C# library provides a simplified work-flow for handling Shells and Submodels
following the IDTA Asset Administration Shell standard.

> Relevant specification: [Specification of the Asset Administration Shell - Part 1: Metamodel - v3.0](https://industrialdigitaltwin.org/wp-content/uploads/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf)

## Table of Contents

- [twinsphere.TypedAasMetamodels](#twinspheretypedaasmetamodels)
  - [Introduction](#introduction)
  - [Download](#download)
  - [Example](#example)
  - [Design Principles and Concepts](#design-principles-and-concepts)
  - [Working with Shells and Packages](#working-with-shells-and-packages)
    - [Shell Abstractions](#shell-abstractions)
    - [Packaging](#packaging)
  - [Working with Submodels](#working-with-submodels)
    - [Supported Submodels](#supported-submodels)
    - [Types of the Meta Model](#types-of-the-meta-model)
      - [Submodels and Submodel Element Collections](#submodels-and-submodel-element-collections)
      - [Submodel Elements](#submodel-elements)
      - [Properties and Lists](#properties-and-lists)
    - [Builders](#builders)
    - [Validation](#validation)
    - [Conversion](#conversion)
  - [Additional Features](#additional-features)
    - [Value-only Semantics](#value-only-semantics)

## Introduction

twinsphere.TypedAasMetamodels is an easy-to-use library, that provides tools for modification and stream-lined creation
of `.aasx` packages, shells, and submodels.

## Download

The SDK is available as a [NuGet package](https://www.nuget.org/packages/twinsphere.TypedAasMetamodels). You can add the
feed to your project with ``dotnet add package``:

```sh
dotnet add package twinsphere.TypedAasMetamodels
```

## Example

The following shows a brief, but full example of how a shell with submodels can be created and stored as `.aasx` package
with twinsphere.TypedAasMetamodels.

```csharp
using twinsphere.TypedAasMetamodels.Types.Submodels.DigitalNameplate.V2_0;
using twinsphere.TypedAasMetamodels.Types.Submodels.DigitalNameplate.V2_0.Builder;
using twinsphere.TypedAasMetamodels.Types.Shell;
using twinsphere.TypedAasMetamodels.Types.Shell.Builder;
using twinsphere.TypedAasMetamodels.Common.Helpers;
using twinsphere.TypedAasMetamodels.Packaging;
// ...

// 1. we build a digital nameplate for our product
var digitalNameplateBuilder = new DigitalNameplateBuilder(
    "nameplate-C4022",
    "https://conplement.de/test",
    "conplement AG".ToMultiLanguageString(),
    "internal-product".ToMultiLanguageString(),
    new ContactInformation(
        "DE".ToMultiLanguageString(),
        "Nürnberg".ToMultiLanguageString(),
        "Südwestpark 92G".ToMultiLanguageString(),
        "90449".ToMultiLanguageString()
    ),
    "2025");

// 1.1 digital nameplate makes little sense without markings
// Note: PackageFile wraps a reference to a file on disk. The file will then later be picked up for packaging.
var mainMarking = new MarkingBuilder("main-image", new PackageFile("/some/local/path/main-marking.png", "image/png"))
    .WithExplosionSafeties(new ExplosionSafeties([
        new ExplosionSafety(
            AmbientConditions: new AmbientConditions("external",
                "maximum".ToMultiLanguageString("en"),
                "ACME",
                "maximum",
                "highly-flammable",
                "0",
                "75",
                "55",
                "normal"
            ),
            ProcessConditions: new ProcessConditions("external",
                "maximum".ToMultiLanguageString("en"),
                "ACME",
                "maximum",
                "highly-flammable",
                "0",
                "75",
                "55",
                "normal"
            )
        )
    ]).build();

var secondMarking = new Marking("second-image", new PackageFile("/some/local/path/second-marking.png", "image/png"));

var digitalNameplate = digitalNameplateBuilder
    .WithCompanyLogo(new PackageFile("/some/other/local/path/conplement-logo.png", "image/png"))
    .WithFirmwareVersion("en", "1.0.0")
    .WithSerialNumber("09383-sf8843j4-4")
    .WithCountryOfOrigin("Germany")
    .WithDateOfManufacture(new DateOnly(2025, 5, 13))
    .WithMarkings([mainMarking, secondMarking])
    .Build();

// 2. we need a shell for our product, too
var shell = new AssetAdministrationShell("9A8F8B66-5AA7-4528-AA17-1CC128AF64C2",
    new AssetInformation(
        Core.AssetKind.Instance,
        globalAssetId: "urn:conplement:aas:type:7689239_f0b4f6ff-6951-4614-b733-6da43db7af9a",
        defaultThumbnail: new PackageFile("/some/local/path/conplement-product-thumbnail.png", "image/png")
    ),
    description: new MultiLanguageString([{"en-EN", "description"}, {"de-DE", "Beschreibung"}]));

// 3. we can now create an.aasx package out of all of this
// Note: packagingInfo will wrap all information necessary for packaging, i.e., submodels,
// referenced concept descriptions, and files to include into the paths, if available.
var packagingInfo = PackagePreprocessor.ProcessShell(shell, [digitalNameplate]);
var spherePackage = new SpherePackageBuilder(packagingInfo).Build();

// 4. you can save the package to disk for analysis with the https://github.com/admin-shell-io/aasx-package-explorer
packageFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "my-package.aasx");
await spherePackage.SaveToFile(packageFilePath);
```

## Design Principles and Concepts

twinsphere.TypedAasMetamodels is with the following goals:

- Compatibility with the latest Asset Administration Shell (AAS) specification, as specified by the [Industrial Digital
  Twin Association](https://industrialdigitaltwin.org), currently in version 3.0.
- Convenience for developers to reduce the necessary study of the AAS meta model specifications. For example, XML code
  documentation is heavily used to describe AAS semantics in the library.
- Definition of meta models for selected submodels, such as Digital Nameplate.
- Offering packaging functionality based on the.aasx format.

In its design, the library is designed to make the creation of shells and submodels as easy, as possible, while reducing
sources of potential errors where possible. To this end, it employs some basic design rules:

- Use distinct types where possible:
  - Submodels are class citizens: where possible (i.e., where submodel templates are not ambiguous), submodels and their
    submodel elements are modelled, individual types.
  - Enums to encode restricted properties.
- Prevent illegal states where possible, both, with respect to the meta model specification, as well as, to the submodel
  template specification:
  - At compile time via signatures: creation methods enforce mandatory arguments, preventing incomplete submodel
    elements.
  - At runtime time via fail-fast principle: constraints enforce correct types and qualifiers, e.g., the number of
    elements in lists.
  - At runtime in conversion: meta models are validated in conversion. Validation errors cause the conversion to fail
    early.
- Hide metadata from the user: any SMT metadata, such as SemanticIds, IdShorts, ValueTypes, ... is handled internally.
  Users don't have to worry about them.

## Working with Shells and Packages

### Shell Abstractions

The twinsphere.TypedAasMetamodels library provides all means for the creation, processing, and modification of AAS
shells. Depending on your use case, you can either create a new shell, either by constructor call, or using the provided
builder pattern:

```csharp
using twinsphere.TypedAasMetamodels.Types.Shell;
using twinsphere.TypedAasMetamodels.Types.Shell.Builder;

// via constructor
var shell = new AssetAdministrationShell("9A8F8B66-5AA7-4528-AA17-1CC128AF64C2",
    new AssetInformation(
        Core.AssetKind.Instance,
        globalAssetId: "urn:conplement:aas:type:7689239_f0b4f6ff-6951-4614-b733-6da43db7af9a",
        defaultThumbnail: new PackageFile("/some/local/path/conplement-product-thumbnail.png", "image/png")
    ),
    description: new MultiLanguageString([{"en-EN", "description"}, {"de-DE", "Beschreibung"}]));

// equivalent, via builder
var shell = new AssetAdministrationShellBuilder("9A8F8B66-5AA7-4528-AA17-1CC128AF64C2",
    new AssetInformation(
        Core.AssetKind.Instance,
        globalAssetId: "urn:conplement:aas:type:7689239_f0b4f6ff-6951-4614-b733-6da43db7af9a",
        defaultThumbnail: new PackageFile("/some/local/path/conplement-product-thumbnail.png", "image/png")
    ))
    .WithDescription(new MultiLanguageString([{"en-EN", "description"}, {"de-DE", "Beschreibung"}]))
    .Build();
```

Additionally, there is also the ability to load from and convert to shells of the AasCore types:

```csharp
using AasCore.Aas3_0;
using twinsphere.TypedAasMetamodels.Types.Shell;

Aas3_0.IShell metamodelShell;
// load, e.g. from a repository

// convert to the TypedAasMetamodels representation
AssetAdministrationShell shell;
try
{
    shell = AssetAdministrationShell.FromMetamodel(metamodelShell);
}
catch (ValidationException exception)
{
    Console.Error($"Could not load erroneous shell: {exception}");
}

// modify the shell

// convert it back
try
{
    metamodelShell = shell.ToMetamodel();
}
catch (ValidationException exception)
{
    Console.Error($"Could not convert to metamodel: {exception}");
}
```

> **Note**: In general the shell abstractions act as a thin layer around the types of the types of AasCore. They
> primarily extend them with convenience methods and stricter correctness checks to prevent user errors as early as
> possible.

### Packaging

Creating `.aasx` packages from scratch typically is complex and involves a number of tedious steps:

- Create submodels
- Create shells
- Reference the submodels in the shell
- Collect any used concept descriptions and reference them in the shell
- Collect files for packaging
- Collect the thumbnail file of the shell

While you can do these steps manually, for most cases it should suffice to use the `SpherePackageBuilder`, that
automatically takes care of the above steps:

```csharp
using twinsphere.TypedAasMetamodels.Types.Submodels.DigitalNameplate.V2_0;
using twinsphere.TypedAasMetamodels.Types.Shell;
using twinsphere.TypedAasMetamodels.Types.Shell.Builder;
using twinsphere.TypedAasMetamodels.Packaging;

// 1. create the shell
AssetAdministrationShell shell;

// 2. create some submodels
DigitalNameplate nameplate;

// 3. we can now create an.aasx package out of all of this
// Note: packagingInfo will wrap all information necessary for packaging, i.e., submodels,
// referenced concept descriptions, and files to include into the paths, if available.
var packagingInfo = PackagePreprocessor.ProcessShell(shell, [digitalNameplate]);
var spherePackage = new SpherePackageBuilder(packagingInfo).Build();
```

## Working with Submodels

### Supported Submodels

We are constantly working on the support of additional submodels. At the time of writing, twinsphere.TypedAasMetamodels
provides support for the following submodels:

- IDTA 02023 Carbon Footprint 0.9
- IDTA 02002-1-0 Submodel for Contact Information 1.0
- IDTA 02006-2-0 Digital Nameplate for industrial equipment 2.0
- IDTA 02004-1-2 Handover Documentation 1.2
- IDTA 02011-1-1 Hierarchical Structures enabling Bills of Material 1.1
- IDTA 02003-1-2 Generic Frame for Technical Data for Industrial Equipment in Manufacturing 1.2

### Types of the Meta Model

In twinsphere.TypedAasMetamodels we aim to provide an easy to use API for the work with submodels. To this end we use
the primitives of the C# language to represent the parts of submodels.

#### Submodels and Submodel Element Collections

Submodels and Submodel Element Collections represent structure types in the language specification. In general, these
types are realized as classes and records.

#### Submodel Elements

At the moment, we provide support for the following set of submodel elements. For each of these types we provide type
that performs additional correctness checks at creation, and, potentially, provides additional helper methods.

- **ReferenceElement**: representation of a ReferenceElement.
- **File**: generic representation of a File reference, may point anywhere.
- **PackageFile**: special file representation. Use this, if you want to create a package for which a file should be included.
- **MultiLanguageString**: Multi Language Property.

#### Properties and Lists

For both, properties, and lists, are realized using the suitable C# primitives.

### Builders

twinsphere.TypedAasMetamodels employs the [builder pattern](https://en.wikipedia.org/wiki/Builder_pattern) for most of
the composed types. These builders allow the step-wise collection of properties necessary for the creation of an object.
To create an object with a builder, the workflow thereby is as follows:

1. construction of the builder with mandatory arguments
1. set or add attributes via `Add*` (for list elements) or `With*` for single attributes.
1. finally, construct the actual type via a call to `Build()`.

The builders follow the approach described in [design principles](#design-principles-and-concepts): they apply
constraints in their constructors, setters, and in the build method, to ensure validity and consistency of input data.

As shown with the `DigitalNameplateBuilder` you can use method chaining to fill in properties:

```csharp
// 1. construction of the Builder with its necessary attributes
var digitalNameplateBuilder = new DigitalNameplateBuilder(
    "nameplate-C4022",
    "https://conplement.de/test",
    "conplement AG".ToMultiLanguageString(),
    "internal-product".ToMultiLanguageString(),
    new ContactInformation(
        "DE".ToMultiLanguageString(),
        "Nürnberg".ToMultiLanguageString(),
        "Südwestpark 92G".ToMultiLanguageString(),
        "90449".ToMultiLanguageString()
    ),
    "2025");

// 2. providing some additional attributes
digitalNameplateBuilder
    .WithHardwareVersion("en", "1.0.0")
    .WithFirmwareVersion("en", "0.1.0")
    .WithSoftwareVersion("en", "0.2.3");

// 3. finally construct the digital nameplate
var digitalNameplate = digitalNameplateBuilder.Build();
```

> **important**: As complex objects are passed into the builder by reference, it is not safe to reuse a builder for the
> creation of multiple objects.

### Validation

There are extensive validation mechanisms in twinsphere.TypedAasMetamodels to check whether submodel instances are valid
with respect to their submodel templates. Besides model specific checks, twinsphere.TypedAasMetamodels provides
validations for:

- missing mandatory submodel elements
- unknown submodel elements
- unset (mandatory) attributes in submodel elements
- correct cardinality of submodel elements
- valid type representation of properties

> **Note**: The page on [validations](validation.md) contains an exhaustive list of the respective validations with
> descriptions.

Each submodel type exposes a validator class that can be used to validate instances of the submodel. These validators
return enumerators with the found validation errors:

```csharp
using AasCore.Aas3_0;
using twinsphere.TypedAasMetamodels.Types.Submodels.DigitalNameplate.V2_0;
using twinsphere.TypedAasMetamodels.Types.Submodels.DigitalNameplate.V2_0.Validation;

Aas3_0.ISubmodel digitalNameplateMetamodel;
// ... load a Digital Nameplate from some source, e.g., from a repository.

var errors = DigitalNameplateValidator.Validate(digitalNameplateMetamodel);

if (errors.Count() == 0)
{
    Console.WriteLine("✨ Correct Digital Nameplate.")
}
else
{
    Console.WriteError("🐛 Broken Digital Nameplate:")
    foreach (var error in errors)
    {
        Console.WriteError(error.Reason);
    }
}
```

> **Note**: These validations are to be understood as an extension of the terrific validations provided by the
> aas\_core\_works team. Whereas the validations in the AasCore SDK addresses the correctness of shells and submodels on
    > a syntactical level, the validations in twinsphere.TypedMetaModels are instead concerned with the correctness of
> submodels in respect to their respective submodel templates, i.e., whether submodels fulfill the requirements given by
> their submodel templates. Thus, the validation is limited to submodel instances.

### Conversion

The twinsphere.TypedAasMetamodels library provides the means to convert between ([valid](validation.md)) models in the
generic meta model representation and the typed submodel, and vice versa.

To this end, submodels implement `FromMetamodel()` and `ToMetamodel()`:

```csharp
using AasCore.Aas3_0;
using twinsphere.TypedAasMetamodels.Types.Submodels.DigitalNameplate.V2_0;

Aas3_0.ISubmodel digitalNameplateMetamodel;
// ... load a Digital Nameplate from some source, e.g., from a repository.

// 1. convert to its typed representation
DigitalNameplate digitalNameplate;
try
{
    digitalNameplate = DigitalNameplate.FromMetamodel(digitalNameplateMetamodel);
}
catch (SubmodelConversionException conversionException)
{
    Console.Error($"Failed to convert from erroneous submodel: {conversionException}");
}

// 2. perform operations on the Digital Nameplate
digitalNameplate.SoftwareVersion = "1.0.0".ToMultiLanguageString("en");
// ...

// 3. convert the DigitalNameplate back
digitalNameplateMetamodel = digitalNameplate.ToMetamodel();
try
{
    digitalNameplateMetamodel = digitalNameplate.ToMetamodel();
}
catch (SubmodelConversionException conversionException)
{
    Console.Error($"Failed to convert to metamodel: {conversionException}");
}
```

> **Note**: `FromMetamodel()` will use the validation mechanism to check whether the submodel is a valid instance of its
> SMT. If it is not, it will throw a `SubmodelConversionException` with the encountered errors.

## Additional Features

Besides the dedicated submodel support mechanisms, twinsphere.TypedAasMetamodels provides some further general-purpose
utilities to simplify the work with submodels.

### Value-only Semantics

Besides the heavy meta model specification, the IDTA, furthermore, provides a specification for the so-called
"Value-only Semantics". The Value-only Semantics describes a stripped down representation for meta models.

The twinsphere.TypedAasMetamodels library allows to convert arbitrary submodels, i.e., also for submodels not listed in
the [supported submodels](submodels.md) to the value-only representation.

```csharp
using AasCore.Aas3_0;
using twinsphere.TypedAasMetamodels.Conversion.ValueOnly;

Aas3_0.ISubmodel digitalNameplateMetamodel;
// ... load a Digital Nameplate from some source, e.g., from a repository.

var jsonString = ValueOnlySerializer.ToValueOnly(digitalNameplateMetamodel);
```

### Caveats and Notes on Usage

twinsphere.TypedAasMetamodels internally uses features of `System.Globalization`, please ensure that your execution
environment provides support for this library, otherwise, twinsphere.TypedAasMetamodels may not function correctly!
The `dotnet` apline images, for example, are known to cause issues with default settings and require additional care.
See the
[dotnet notes on globalization support](https://github.com/dotnet/dotnet-docker/blob/main/samples/enable-globalization.md
"Notes for running dotnet applications in alpine containers.") for detailed information.
