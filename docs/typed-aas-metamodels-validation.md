# Validation in twinsphere.TypedAasMetamodels

## Overview

The DevKit validation subsystem identifies and reports defects in AAS data, from critical errors and structural
issues to anti-patterns. Its goal is to give you the means to correct and lint your data.

Each defect is represented by a rule with a unique identifier and description.

!!! note
    A comprehensive rule catalog with examples and resolution hints for each rule will be released in a future
    update.

Validation covers two main areas:

**AASX Package**:

- Missing files
- Deprecated packaging features
- Invalid structure

**Meta Model Data**:

- Syntax errors
- Deprecated data
- Anti-patterns
- Type-specific problems for submodel templates and instances
- Conformity of submodel instances to their respective submodel templates

!!! important
    This validation supersedes the previous validation interfaces. The old interfaces remain available for now but
    have been officially marked as obsolete.

## Validators

The DevKit provides two validators. Both are configured via a builder and report issues as `Diagnostic` instances.

<!-- markdownlint-disable line-length -->

| Validator | Access via | Use when |
|---|---|---|
| `Validator` | `twinsphere.TypedAasMetamodels.Validator` | Validating packages, environments, or identifiables in general |
| `SubmodelConformityValidator` | `twinsphere.TypedAasMetamodels.SubmodelConformityValidator` | Explicitly checking whether an instance conforms to a specific template |

<!-- markdownlint-enable line-length -->

### Validator

`Validator` is the general-purpose validator. It performs every applicable validation for the provided input and,
if a template resolver strategy is configured, additionally runs conformity validation for any submodel instance
for which a template can be resolved.

!!! note
    `Validator` attempts to resolve templates *on its own* — you have no control over which template it validates
    against. If you need to specify the template explicitly, use `SubmodelConformityValidator` instead.

### Submodel Conformity Validator

`SubmodelConformityValidator` validates against the same error categories as `Validator`. However, it gives you
explicit control over which submodel template to validate against. Use this when you want to assert that a given
submodel instance is a valid instance of a particular template.

## Diagnostics

Issues are reported as instances of `Diagnostic`. Among other information, each diagnostic carries:

- A short description
- An error code and name
- The path to the offending element
- A severity level

!!! note
    The section about [validating a package](#validating-a-package) shows how to render a diagnostic path to
    human-readable form.

### Severity Profiles

The severity of each rule can be adjusted via the `Profile` property on the validator instance. Four levels are
available: `None`, `Error`, `Warning`, and `Info`.

`Profile` provides two factory methods for creating presets:

- `Profile.ForInstance()` — appropriate defaults for validating submodel instances
- `Profile.ForTemplate()` — appropriate defaults for validating submodel templates

!!! note
    Not every rule is meaningful in every context. For example, incomplete submodel elements are acceptable in a
    template but not in an instance. The profile presets account for this distinction.

To override individual rule severities after creating a validator, see
[Adjusting Severity Profiles](#adjusting-severity-profiles).

## Resolving Submodel Templates

Conformity validation requires the validator to look up the template for a given submodel instance. Implement
`ITemplateResolverStrategy` to provide this lookup:

```csharp
public interface ITemplateResolverStrategy
{
    /// <summary>
    /// Resolves a semantic id to the corresponding submodel template.
    /// </summary>
    /// <param name="semanticId">The semanticId of the submodel template to resolve.</param>
    /// <returns>The resolved template, or null if not found.</returns>
    Task<Core.ISubmodel?> ResolveTemplate(Core.IReference semanticId);
}
```

Pass the implementation to the builder via `WithTemplateResolverStrategy(...)`. Where templates use drop-ins[^1],
the validator resolves them recursively (for example, Digital Nameplate 3.0 uses drop-ins).

## Conformity Validation Features

The conformity validator checks the structural correspondence between a submodel instance and its template,
including:

- Correct element naming and cardinalities (mandatory, optional, and multi-cardinality properties)
- Arbitrary elements
- Enumeration patterns
- `SMT/AllowedValue` qualifier
- `SMT/AllowedRange` qualifier
- `SMT/IdShort` qualifier
- `SMT/RequiredLangs` qualifier
- `SMT/EitherOr` qualifier
- Consistency of submodel element types, id shorts, and semantic ids

For the [submodels supported by the DevKit](typed-aas-metamodels-submodels.md), the validator additionally applies
template-specific constraints that are only described in textual form in the respective specifications.

## Examples

### Validating a Package

`Reporting.ToNamePath` converts a diagnostic path to a human-readable string; equivalent helpers exist for JSON
and XML paths.

```csharp
using twinsphere.TypedAasMetamodels.Validation;
using twinsphere.TypedAasMetamodels.Common.Reporting;

var validator = await Validator.Builder().Build().Value;

foreach (var diag in validator.Validate("path/to/my/package.aasx"))
{
    var path = Reporting.ToNamePath(diag.Path);
    Console.WriteLine($"{diag.Rule}: {diag.Name} at {path}");
}
```

To include conformity validation, provide a template resolver strategy on the builder:

```csharp
public class MyTemplateResolverStrategy : ITemplateResolverStrategy
{
    public async Task<Core.ISubmodel?> ResolveTemplate(Core.IReference semanticId)
    {
        return await Directory.LookUpTemplate(semanticId);
    }
}

var validator = await Validator.Builder()
    .WithTemplateResolverStrategy(new MyTemplateResolverStrategy())
    .Build()
    .Value;
```

### Submodel Conformity Validation

```csharp
using twinsphere.TypedAasMetamodels.Validation;
using twinsphere.TypedAasMetamodels.Common.Reporting;

var instance = ...;
var template = ...;

var validator = await SubmodelConformityValidator(template)
    .WithTemplateResolverStrategy(new MyTemplateResolverStrategy()) // only needed for templates with drop-ins
    .Build()
    .Value;

foreach (var diag in validator.Validate(instance))
{
    var path = Reporting.ToNamePath(diag.Path);
    Console.WriteLine($"{diag.Rule}: {diag.Name} at {path}");
}
```

### Adjusting Severity Profiles

Both validators expose the active profile via the `Profile` property. The following example disables all rules
except package-related ones:

```csharp
var validator = await Validator.Builder().Build().Value;

foreach (var rule in CoreRules.All)
{
    if (rule.IsPackageError())
    {
        validator.Profile.SetError(rule);
    }
    else
    {
        validator.Profile.SetDisabled(rule);
    }
}
```

## Extending the Validator

### Extending with Custom Rules and Validators

The validator operates as an ordered pipeline of five steps. You can inject your own validators into any of them:

<!-- markdownlint-disable line-length -->

| Step | Interface | Covers |
|---|---|---|
| Package validation | `IPackageValidator` | Issues with the `.aasx` file itself |
| Meta model validation | `IMetaModelValidator` | Syntactic errors, invalid references |
| Template validation | `ITemplateValidator` | Errors specific to submodels of kind template (e.g., missing semantic ids) |
| Instance validation | `IInstanceValidator` | Errors specific to submodels of kind instance (e.g., incomplete elements) |
| Template-specific validation | `ITemplateSpecificValidations` | Constraints specific to individual submodel templates |

<!-- markdownlint-enable line-length -->

Use the corresponding `With...` builder method to register your validator. To raise diagnostics from it, define
your `Rule` instances and register them via `WithRulesFrom<T>()`.

!!! important
    Validators return `Finding` instances, not `Diagnostic` instances. A `Finding` is mapped to a `Diagnostic`
    according to the active validation profile.

The following example enforces that id shorts in templates must be camelCase:

```csharp
// CamelCaseIdShortValidator.cs
using twinsphere.TypedAasMetamodels.Validation.Types;
using twinsphere.TypedAasMetamodels.Validation.Template.Validation;

public sealed class CamelCaseIdShortValidator : ITemplateValidator
{
    public IEnumerable<Finding> Validate(Core.ISubmodel submodel)
    {
        foreach (var element in submodel.Descend().OfType<AasCore.Aas3_1.IReferable>())
        {
            if (string.IsNullOrEmpty(element.IdShort))
            {
                continue;
            }

            if (!Regex.IsMatch(element.IdShort, @"^[a-z]+(?:[A-Z][a-z0-9]*)*$"))
            {
                yield return new Finding(CustomRules.NonCamelCaseIdShort, cause: element.IdShort);
            }
        }
    }
}

// CustomRules.cs
[RuleDefinition]
public sealed class CustomRules
{
    public static readonly Rule NonCamelCaseIdShort = new(
        "CUSTOM000",
        "NonCamelCaseIdShort",
        "IdShorts must be in camelCase",
        "Design guidelines mandate that id shorts are camelCase only.",
        RuleCategory.Template,
        AutoFixability.Never);
}

// Registration
var validator = await Validator.Builder()
    .WithRulesFrom<CustomRules>()
    .WithTemplateValidator<CamelCaseIdShortValidator>()
    .Build()
    .Value;
```

## Limitations

- **Template data quality**: Conformity validation depends on the quality of template data. Many published submodel
    templates contain syntactic or structural defects that complicate validation. For example, Digital Nameplate
    3.0 still uses an incorrect reference to Contact Information (as of 2026-04-07).

- **Textual constraints**: Many submodel template specifications describe additional constraints in natural language
    only. These cannot be enforced automatically. The DevKit ships explicit implementations for the
    [submodels it supports](typed-aas-metamodels-submodels.md), but for others you can add your own via the
    [extension mechanism above](#extending-with-custom-rules-and-validators).

[^1]: Drop-ins are a Submodel Template modeling concept that allows a template to reference and reuse definitions
    from other submodel templates. In the context of validation, this means the validator may need to resolve and
    process multiple submodel templates before it can fully evaluate the structure of a submodel instance.
