# Validation Rules in twinsphere.TypedAasMetamodels

## Overview

The following will lay out the validations that are implemented in twinsphere.TypedAasMetamodels. It consists of two
parts: in the first part general structural rules are discussed. The second part describes validations that are specific
for individual submodel types.

### Example

Validations are described in this document in the form of rules. Each rule entry consists of the same parts:

- a unique rule name
- a description of the respective rule

## General Rules

### Name not set for property. Can't convert object models without valid id short

The id short of a submodel element is not set, although it is not an element of a submodel element list. Each submodel
element in the submodel (except for submodel element list elements) is expected to have an id short to facilitate
correct interpretation.

### Submodel element has elements with duplicate id shorts

There are multiple submodel elements in the same namespace that have the same id short. As per
[AASd-022](https://industrialdigitaltwin.org/wp-content/uploads/2025/03/IDTA-01001-3-0-2_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=105),
id shorts of non-identifiables must be unique within their respective namespace.

### Submodel element has wrong type, expected XYZ

The type of submodel element differs from that, that the submodel template describes.

### Submodel element has unset value

Submodel elements in submodel instances are expected to carry a non-empty value. Optional unset submodel elements should
be signified by elision from the submodel.

> **Note**: For a submodel element to be optional, it must have a SMT/Cardinality qualifier like `ZeroToOne` or
> `ZeroToMany`.

### File has unset ContentType

File elements in submodel instances are expected to carry a non-empty ContentType. Optional unset file elements should
be signified by elision from the submodel.

> **Note**: For a submodel element to be optional, it must have a SMT/Cardinality qualifier like `ZeroToOne` or
> `ZeroToMany`.

### MimeType of a File must be correct

The content type specified in a file element does not match to the content type derived by referenced file's extension.

### File specified ContentType does not match that of file reference

The content type specified in a file element does not match to the content type derived by referenced file's extension.

### Property has wrong value type, expected XYZ

The value type of a property element does not match the value type described in the submodel template. If the submodel
template demands a specific value type, instances of the property must adhere to said value type.

### Property Value is invalid. Cannot be interpreted as XYZ

The value of a property element cannot correctly be interpreted as a value of the value type specified in the property.

### Property value is not supported by constraints

The value of a property element does not adhere to constraints as given by qualifiers or the submodel template
specification. This, for example, is the case if the property acts as a sort of enumeration with a limited set of valid
values.

### Unknown property for instance of XYZ

The submodel template does not specify a property with the id short of this submodel element.

### Missing mandatory property for instance of XYZ

The submodel instance lacks a submodel element that the submodel template specifies with the qualifier SMT/Cardinality
of `One`.

### Missing list elements for XYZ for instance of XYZ

The number of elements in submodel element list in the submodel instance does not match the minimum number of elements
as specified in the SMT/Cardinality qualifier for the list in the submodel template.

### Id must be set and non-empty

The id of a submodel is unset.

## Submodel Specific Rules

Submodel specific rules are rules and restrictions that are specific to individual submodel templates.

### IDTA 02023 Carbon Footprint 0.9

#### Value is not a valid PCFCalculationMethod

The value of the property PCFCalculationMethod is not one of the valid PCF calculation methods. The value must be one of
the following:

- EN 15804
- GHG Protocol
- IEC TS 63058
- ISO 14040
- ISO 14044
- ISO 14067
- IEC 63366
- PEP Ecopassport

#### TcfReferenceValueForCalculation must be valid

The value of the property TCFReferenceValueForCalculation is not one of the valid PCF calculation methods. The value
must be one of the following:

- g
- kg
- t
- ml
- l
- cbm
- qm
- piece

#### ProcessesForGreenhouseGasEmissionInATransportServices must be valid

The value of the property TCFReferenceValueForCalculation is not one of the valid PCF calculation methods. The value
must be one of the following:

- WTT - Well-to-Tank
- TTW - Tank-to-Wheel
- WTW - Well-to-Wheel

### IDTA 02002-1-0 Submodel for Contact Information 1.0

There are no submodel specific rules for contact information 1.0.

### IDTA 02006-2-0 Digital Nameplate for industrial equipment 2.0

#### CountryOfOrigin needs to be a valid country code

The value of CountryOfOrigin is not a valid DIN EN ISO 3166-1 alpha-2 code. The value must be a country code according
to DIN EN ISO 3166-1 alpha-2 codes.

#### SpecificConditionsForUse must be X if set

The value of SpecificConditionsForUse is not "X". If SpecificConditionsForUse is set, its value must be "X".

#### IncompleteDevice must be U if set

The value of IncompleteDevice is not "U". If IncompleteDevice is set, its value must be "U".

### IDTA 02004-1-2 Handover Documentation 1.2

#### Preview File must match the correct MIME-Type. Allowed file types are JPG, PNG, BMP

The MIME-type of the preview file is not that of a JPG, PNG, or BMP file. The preview file only allows JPG, PNG, or BMP
MIME-types.

#### Digital files must contain at least one PDF

Digital files does not contain at least one file that is a PDF/A file. At least one PDF/A file type shall be provided.

#### Constraint: for each language-dependent Title, Summary and at least one KeyWord shall exist for the given language

There is a title or summary for which there is no keyword in the same language. For each language-dependent keyword, a
title and summary shall exist for the given language.

#### Invalid classification ID type

The ClassId type is not one of the valid classification id types.

#### Invalid DocumentClassification: unsupported classification

The Classification System type is not one of the valid classification system types.

#### Only one primary DocumentId is allowed

There is more than one document id that set as primary. Only one document id may be the primary document id.

### IDTA 02011-1-1 Hierarchical Structures enabling Bills of Material 1.1

There are no submodel specific rules for Hierarchical Structures enabling Bills of Material 1.1.

### IDTA 02003-1-2 Generic Frame for Technical Data for Industrial Equipment in Manufacturing 1.2

#### Semantic Id not set for property. Properties are expected to carry a valid semantic id

There is no semantic id set for a property of TechnicalData, MainSection, or SubSection. Each entry in TechnicalData,
MainSection, and SubSection needs a semantic id.
