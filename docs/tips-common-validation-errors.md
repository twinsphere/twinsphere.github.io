<!-- markdownlint-disable-file first-line-heading -->
<!-- markdownlint-disable-file no-duplicate-heading -->

<!--- In order to enable readers having an easy introduction to the document its chapter structure is based on the one
of part 1 and on structure of AAS itself.

The chapters (heading1 to heading3) structure error classes (heading4).

Each error class is preceded by a horizontal line --- in order to visually separate them from each other.

An error class is represented by a speaking headline and is broken down in the following sub-chapters (heading5):
* Error Message OR Problem Description
* Specification Reference
* Remarks
* Recommended Solution

The Error Message should be prioritized over Problem Description, if a corresponding error message exists. Only if there
is no error message the problem should be described instead (mainly needed for semantic problems where no validation is
implemented or possible and thus no error message exists).

The error message has to be formatted as > blockquote.

The problem description has to be formatted as an * unordered list of description aspects.

The Specification Reference has to be a link to a suitable part to the specification documents which demonstrates the
legitimacy of the error. The name of the link has to be human-readable and enable a person to identify and find the
exact reference without following the link directly.

Remarks are optional and have to be formatted as an * unordered list (even if there is only one remark).

Having a Recommended Solution is mandatory. It has to be formatted as an * unordered list of tips/steps for solving the
error (even if there is only one point).

Table of Content was created with "Auto Markdown TOC" Plugin for Visual Studio Code by Hunter Tran
(huntertran.auto-markdown-toc). --->

[![twinsphere logo](img/twinsphere-logo.png){: width='300' }](https://www.conplement.de/twinsphere){: target='_blank' }
[![conplement AG logo](img/CP_BildWortmarke.svg){: width='300' }](https://www.conplement.de){: target='_blank' }

# Common Validation Errors of AAS

A guide to understand, avoid and handle AAS validation errors.

<!-- markdownlint-disable no-emphasis-as-heading -->

*by Fabian Gumbrecht and Christian Körber*

<!-- markdownlint-enable no-emphasis-as-heading -->

Version 1.1 (06-Aug-2024)

<!-- TOC ignore:true -->

## Introduction

Asset Administration Shell (AAS) is a fairly complex data standard that is still evolving and maturing. The tools that
support it are also still in development and, in some cases, do not yet have support for the latest specification. The
creators of AAS are under immense pressure in this situation. They must adapt their data using incomplete tools to a
standard that is both difficult to access and constantly changing. Not surprisingly, data quality problems emerge.

At conplement AG, we are proud to provide twinsphere, a software suite for the creation, hosting, and distribution of
asset administration shells. As its provider, we often encounter data quality issues when customers try to upload their
AAS to our platform.

The purpose of this guide is to explain the meaning and reason behind validation errors in terms of the AAS
specification and to provide support for handling them. It focuses on the most commonly encountered validation errors on
our end, but it is not exhaustive. Additional errors may be added in the future.

We hope this guide will assist you on your Asset Administration Shell journey!

<!-- TOC ignore:true -->

## Table of Content

<!-- TOC -->

- [Errors with the Metamodel](#errors-with-the-metamodel)
    - [General Metamodel Errors](#general-metamodel-errors)
        - [Supported Version](#supported-version)
    - [Common Attributes](#common-attributes)
        - [idShort](#idshort)
    - [Asset Information](#asset-information)
        - [Asset Identifier](#asset-identifier)
    - [Submodel](#submodel)
        - [SubmodelIdss](#submodelidss)
    - [Submodel Elements](#submodel-elements)
        - [Data Element](#data-element)
        - [File](#file)
        - [Property](#property)
        - [MultiLanguageProperty](#multilanguageproperty)
        - [References](#references)
        - [Submodels References](#submodels-references)
- [Errors with Specific Submodels](#errors-with-specific-submodels)
    - [Handover Documentation](#handover-documentation)
        - [General Errors](#general-errors)
        - [Errors with SubmodelElements of Document](#errors-with-submodelelements-of-document)
        - [Errors with SubmodelElements of DocumentID](#errors-with-submodelelements-of-documentid)
        - [Errors with SubmodelElements of DocumentVersion](#errors-with-submodelelements-of-documentversion)
- [Errors related to Exchange Data Formats](#errors-related-to-exchange-data-formats)
    - [XML Serialization](#xml-serialization)
        - [Empty XML Nodes](#empty-xml-nodes)
    - [Package File Format AASX](#package-file-format-aasx)
        - [Relationships](#relationships)
        - [Supplemental Files aas-suppl](#supplemental-files-aas-suppl)
- [Document Change History](#document-change-history)

<!-- /TOC -->

## Errors with the Metamodel

### General Metamodel Errors

#### Supported Version

---

##### twinsphere only supports AAS in the recent version 3

###### Problem Description

- twinsphere is a platform for asset administration shells conform to the metamodel specification version 3.
- If you try to upload an asset administration shell of an earlier version the platform will deny it.

###### Specification Reference

- [Product Description twinsphere](https://www.conplement.de/de-de/produktbeschreibung-twinsphere)
- [Part 1 v3.0](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf)

###### Recommended Solution

- The Eclipse AASX Package Explorer is able to convert v2 packages into the v3 format.
- Try to upgrade your package with the current [Eclipse AASX Package Explorer](https://github.com/eclipse-aaspe/aaspe)
    - Open the Asset Administration Shell with the AasxPackageExplorer
    - Save the Asset Administration Shell as a new Asset Administration Shell
- Re-Upload the converted AASX package to twinsphere

### Common Attributes

#### idShort

---

##### idShort has to be unique within the same namespace

###### Error Message
>
> Constraint AASd-022: ID-short of non-identifiable referables within the same name space shall be unique (case-sensitive).
>
###### Specification Reference

- [Part 1 v3.0, 5.3.2.10 Referable Attributes, P. 56](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=57)
- [Part 1 v3.0, 5.3.12.2 Constraints for Referables and Identifiables, Constraint AASd-022, P. 105](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=106)

###### Remarks

- *idShort* is case-sensitive.
- A name space is defined as the parent element(s), which an element is part of and that
is either referable or identifiable.
- Constraint is necessary in order to address an element via API by an unique *idShortPath*.

###### Recommended Solution

- Change *idShort* to a unique value or number identical values from 01 to n (i.e. DigitalFile -> DigitalFile01).

---

##### idShort of Referables shall only feature letters, digits, underscore

###### Error Message
>
> ID-Short of Referables shall only feature letters, digits, underscore ( \_ ); starting mandatory with a letter, i.e. \[a-zA-Z\]\[a-zA-Z0-9\_\]\*.
>
###### Specification Reference

- [Part 1 v3.0, 5.3.2.10 Referable Attributes, Constraint AASd-002,
  P.57](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=58)

###### Remarks

- Hyphen is NOT allowed as of v3.0.1 of the specification.
- Hyphen will be allowed with upcoming version v3.1 of the specification, see [Issue #295 of aas-specs-metamodel in
  Github](https://github.com/admin-shell-io/aas-specs-metamodel/issues/295) for details.

###### Recommended Solution

- Replace separators like hyphens, dots or commas in the *idShort* with an underscore.

### Asset Information

#### Asset Identifier

---

##### At least one Asset Identifier has to be defined

###### Error Message
>
> Constraint AASd-131: Either the global asset ID shall be defined or at least one specific asset ID.
>
###### Specification Reference

- [Part 1 v3.0, 5.3.4 Asset Information Attributes, Constraint AASd-131, P.
  60](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=61))

###### Remarks

- Since *globalAssetId* and (the value of) *specificAssetId* are both identifiers they have to be GLOBALLY unique.

###### Recommended Solution

- Define one *globalAssetId* or add at least a *specificAssetId* to the asset information.

### Submodel

#### SubmodelIdss

---

##### Do not use SemanticId as SubmodelId of Submodel

###### Problem Description

- Submodels require to have globally unique ids to be identifiable in any given scenario.
- Sometimes we encounter the *semanticId* of the submodel template being used as *SubmodelId* for a concrete submodel
  instance.
- This is not valid since the *semanticId* does not identify a single submodel instance and therefore is not a valid
  identifier.

###### Specification Reference

[Part 1 v3.0, 5.3.5 Submodel Attributes, P.
62](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=63)

###### Remarks

- *Submodels* are *Identifiables* and therefore must have globally unique ids.

###### Recommended Solution

- You should use URNs (e.g. urn:GMA:7.20:contractnegotiation:1:1#001) or URIs (e.g. <http://www.vdi.de/gma720/>
  contractnegotiation/1/1#001) to create such a (submodel) identifier.
- See [Part 1, Annex A, *How Are New Identifiers Created?* and *Best Practice for Creating URI Identifiers*, P.
  124](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=125)
  for more information.

### Submodel Elements

#### Data Element

---

##### Valid values for Data Element Category

###### Error Message
>
> Constraint AASd-090: For data elements category shall be one of the following values: CONSTANT, PARAMETER or
> VARIABLE.: {position}
>
###### Specification Reference

- [Part 1 v3.0, 5.3.7.6 Data Element and Overview of Data Element Types, Constraint AASd-090, P.
  69](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=70)

###### Remarks

- Default value is VARIABLE.
- Categories are deprecated and should no longer be used.

###### Recommended Solution

- Remove the category attribute from the data element.

#### File

---

##### Wrong URI Scheme for referenced files

###### Error Message
>
> The value must represent a valid file URI scheme according to RFC 8089.
>
###### Specification Reference

- [Part 1 v3.0, 5.3.11.2 Primitive Data Types, Primitive "PathType", P.
  97](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=98)
- [RFC 8089 - The "file" URI Scheme](https://datatracker.ietf.org/doc/html/rfc8089)

###### Remarks

- All submodel elements "file" have to use the *PathType* which demand a URI according to RFC 8089.
- This also applies to the path of *defaultThumbnail* within *AssetInformation*.
- RFC 8089 or "The 'file' URI Scheme" demands a leading file-scheme for an URI, so it has to start with "file:".
- AASX Package Explorer (v2023-11-17 and earlier) is not able to handle *PathTypes* with correctly referenced files
  (file:/...) and will not be shown them.
- The specification currently is not consistent since the examples for *PathType* given in Part 1 v3.0 are not all valid
  (./Specification.pdf).
- The upcoming specification Part 1 v3.1 will address this issue by allowing more generic URIs. See [Issue #299 of
  aas-specs-metamodel on Github](https://github.com/admin-shell-io/aas-specs-metamodel/issues/299) for details.

###### Recommended Solution

- For now: Change the file path from /aasx/files/example.pdf to file:/aasx/files/example.pdf.

---

##### Empty File Path

###### Error Message
>
> Filepath can not be null
>
###### Specification Reference

- [Part 1 v3.0, 5.3.11.2 Primitive Data Types, Primitive "PathType", P. 97](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=98)

###### Remarks

- Since the *PathType* of a *file* value is an identifier, it must contain a valid reference identifying something.
- Same applies to the *path* attribute on a *defaultThumbnail* in *AssetInformation*.

###### Recommended Solution

- Add a valid and existing file path to the file property or remove the property.

---

##### Valid Content Type of File

###### Error Message
>
> The value must represent a valid content MIME type according to RFC 2046.
>
###### Specification Reference

- [Part 1 v3.0, 5.3.7.9 File Attributes, P.
  71](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=72)
- [Part 1 v3.0, 5.3.11.2 Primitive Data Types, Primitive "ContentType", P.
  96](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=97)

###### Remarks

- Valid MIME types for the contentType attribute are defined in [RFC 2046](https://www.rfc-editor.org/info/rfc2046).

###### Recommended Solution

- Assign a MIME type to the file that is RFC 2046 compliant.

#### Property

---

##### Value must be consistent with the value type of the property

###### Error Message
>
> Value must be consistent with the value type.
>
###### Specification Reference

- [Part 1 v3.0, 5.3.11 Primitive and Simple Data Types, P.
  95](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=96)

###### Remarks

- Part 1's chapter on primitive and simple data types helps to determine the data type of the respective property.

###### Recommended Solution

- Apply values with the right data type to the property.

#### MultiLanguageProperty

---

##### Value specifies duplicate languages

###### Error Message
>
> Value specifies no duplicate languages.
>
###### Specification Reference

- [Part 1 v3.0, 5.3.7.10 Multi Language Property Attributes, P.
  72](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=73)
- [Part 1 v3.0, 5.3.11.2 Primitive Data Types, Primitive "MultiLanguageTextType", P.
  97](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=98)
- [Part 1 v3.0, 5.3.11.2 Primitive Data Types, Primitive "LangStringSet", P.
  96](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=97)

###### Remarks

- The value of the MultiLanguageProperty depends on the serialization and has a similar structure like a dictionary.
- So the indices in the multi language value have to be unique.
- The error message is currently somewhat misleading. A corresponding [aas-core-works
  issue](https://github.com/aas-core-works/aas-core-meta/issues/299) has already been created.

###### Recommended Solution

- Check that the langStrings do not have overlapping languages.
- Remove entries with duplicate keys so each language has exactly one entry.

---

##### Valid language tags

###### Error Message
>
> The value must represent a value language tag conformant to BCP 47.
>
###### Specification Reference

- [Part 1 v3.0, 5.3.11.3 Enumeration for Submodel Element Value Types, Enumeration "DataTypeDefRdf", P. 103f](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=104)

###### Remarks

- RDF requires [IETF BCP 4729 language tags](https://www.rfc-editor.org/rfc/bcp/bcp47.txt).
- Simple two-letter language tags for locales like "de" conformant to ISO 639-1 are allowed, as well as language tags
  plus extension like "de-DE" for country code, dialect, etc. like in "en-US" for English (United States) or "en-GB" for
  English (United Kingdom).

###### Recommended Solution

- Make sure that all uses language tags in the *MultiLanguageProperty* value are valid as described above.

#### References

---

##### Empty Keys

###### Error Message
>
> Keys must contain at least one item.
>
###### Specification Reference

- [Part 1 v3.0, 5.3.10.2 Reference Attributes, P.
  81](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=82)

###### Remarks

- Cardinality of attribute 'key' is 1..*.

###### Recommended Solution

- Add at least one key to the reference or remove the whole reference.

#### Submodels References

---

##### All submodel references must be model references to a submodel

###### Error Message
>
> All submodels must be model references to a submodel.
>
###### Specification Reference

- [Part 1 v3.0, 5.3.3 Asset Administration Shell Attributes, P.
  59](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=60)

###### Recommended Solution

- Make sure that the *type* of every submodel reference is set to *ModelReference*.
- Make sure that the *type* of every key of the submodel reference is set to *Submodel*.

---

##### Valid types of first reference key

###### Error Message
>
> Constraint AASd-121: For References the value of type of the first key of keys shall be one of Globally Identifiables
>
###### Specification Reference

- [Part 1, 5.3.10.4 Constraints, Constraint AASd-121, P.
  93](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=94)
- [Part 1, 5.3.10.3 Key Attributes, Enumeration "GloballyIdentifiables", P.
  88](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=89)

###### Remarks

- For *References*, the value of *Key/type* of the first key of *Reference/keys* shall be one of
  *GloballyIdentifiables*.
- Part 1 v3.0.1 specifies the following literals in the enumeration *GloballyIdentifiables*: "AssetAdministrationShell",
  "ConceptDescription", "GlobalReference", "Identifiable" and "Submodel".
- Be aware that more restrictive constraints exist for other, more specific reference types , i.e. external or model
  references.

###### Recommended Solution

- Make sure the type value of the first key of your reference is one of the afore mentioned literals.

---

##### Type of first external reference key has to be 'GlobalReference'

###### Error Message
>
> Constraint AASd-122: For external references the value of type of the first key of keys shall be one of Generic
> Globally Identifiables.
>
##### Specification Reference

- [Part 1, 5.3.10.4 Constraints, Constraint AASd-122, P.
  93](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=94)
- [Part 1, 5.3.10.3 Key Attributes, Enumeration "GenericGloballyIdentifiables", P.
  93](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=94)

###### Remarks

- For external references, i.e. References with *Reference/type* = *ExternalReference*, the value of *Key/type* of the
  first key of *Reference/keys* shall be one of *GenericGloballyIdentifiables*.
- Part 1 v3.0.1 defines exactly one literal in the enumeration *GenericGloballyIdentifiables* which is
  "GlobalReference".

###### Recommended Solution

- Make sure the first key of your external reference is of type *GlobalReference*.

---

##### Valid types of first model reference key

###### Error Message
>
> Constraint AASd-123: For model references the value of type of the first key of keys shall be one of AAS
> identifiables.
>
###### Specification Reference

- [Part 1, 5.3.10.4 Constraints, Constraint AASd-123, P.
  93](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=94)
- [Part 1, 5.3.10.3 Key Attributes, Enumeration "AasIdentifiables", P.
  92](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=93)

###### Remarks

- For model references, i.e. *References* with *Reference/type* = *ModelReference*, the value of *Key/type* of the first
  key of *Reference/keys* shall be one of *AasIdentifiables*.
- Part 1 v3.0.1 specifies the following literals in the enumeration *AasIdentifiables*: "AssetAdministrationShell",
  "ConceptDescription", "Identifiable" and "Submodel".

###### Recommended Solution

- Make sure the type value of the first key of your model reference is one of the afore mentioned literals.

---

##### Valid types of last external reference key

###### Error Message
>
> Constraint AASd-124: For external references the last key of keys shall be either one of Generic Globally
> Identifiables or one of Generic Fragment Keys.
>
###### Specification Reference

- [Part 1, 5.3.10.4 Constraints, Constraint AASd-124, P.
  93](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=94)
- [Part 1, 5.3.10.3 Key Attributes, Enumeration "GenericFragmentKeys", P.
  92](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=93)

###### Remarks

- For external references, i.e. References with *Reference/type* = *ExternalReference*, the last key of *Reference/keys*
  shall be either one of *GenericGloballyIdentifiables* or one of *GenericFragmentKeys*.
- Part 1 v3.0.1 defines exactly one literal in the enumeration *GenericGloballyIdentifiables* which is
  "GlobalReference".
- Part 1 v3.0.1 defines exactly one literal in the enumeration *GenericFragmentKeys* which is "FragmentReference".

###### Recommended Solution

- Make sure the type value of the last key of your external reference is one of the mentioned two literals.

## Errors with Specific Submodels

### Handover Documentation

#### General Errors

---

##### No Cardinality Counters in ECLASS IRDI Path of SemanticIds

###### Problem Description

- The *semanticId* of a Submodel Elements like *DocumentId*, *DocumentClassification* or *DocumentVersion* has a defined
  ECLASS IRDI path.
- This is a fixed exact value in each case, e.g. "0173-1#02-ABI501#001/0173-1#01- AHF580#001", "
0173-1#02-ABI502#001/0173-1#01-AHF581#001" or "0173-1#02-ABI503#001/0173-1#01-AHF582#001".
- Sometimes we encounter a *semanticId* for those elements with an additional attached string like
  "0173-1#02-ABI501#001/0173-1#01-AHF580#001\*01", "0173-1#02-ABI502#001/0173-1#01-AHF581#001\*01" or
  "0173-1#02-ABI503#001/0173-1#01-AHF582#001\*01".
- These are no valid semanticId as specified in the Handover Documentation submodel template.

###### Specification Reference

- [Handover Documentation v1.2, 2.6 SubmodelElements of DocumentID, P.
  16](https://industrialdigitaltwin.org/wp-content/uploads/2023/03/IDTA-02004-1-2_Submodel_Handover-Documentation.pdf#page=14)
- [Handover Documentation v1.2, 2.7 SubmodelElements of DocumentClassification, P.
  17](https://industrialdigitaltwin.org/wp-content/uploads/2023/03/IDTA-02004-1-2_Submodel_Handover-Documentation.pdf#page=17)
- [Handover Documentation v1.2, 2.8 SubmodelElements of DocumentVersion, P.
  19](https://industrialdigitaltwin.org/wp-content/uploads/2023/03/IDTA-02004-1-2_Submodel_Handover-Documentation.pdf#page=19)

###### Remarks

- According to [ECLASS's IRDI Path definition](https://eclass.eu/support/technical-specification/data-model/irdi-path)
  the star character (\*) is a separator between reference property and cardinality counter.

###### Recommended Solution

- Do not use cardinality counters in *semanticIds*.
- Make sure the *semanticId* of each Submodel Element has the exact value as defined in the submodel template
  specification.

#### Errors with SubmodelElements of Document

---

##### SemanticId of SubmodelElement Document

###### Problem Description

- The *semanticId* of a *Document* should be 0173-1#02-ABI500#001/0173-1#01-AHF579#001.
- Sometimes it is mistaken with the ECLASS IRDI for number of DocumentIds 0173-1#02-ABH990#001.

###### Specification Reference

- [Handover Documentation v1.2, 2.4 Attributes of the Submodel instance, idShort "Document{00}", P.
  13](https://industrialdigitaltwin.org/wp-content/uploads/2023/03/IDTA-02004-1-2_Submodel_Handover-Documentation.pdf#page=13)

###### Remarks

- 0173-1#02-ABI500#001 (property) is defined as "This SubmodelElementCollection holds the information for a document
  entity"
- 0173-1#01-AHF579#001 (class) is defined as "Each SubmodelElementCollection describes a document by standard, which is
  associated to the particular Asset Administration Shell"
- 0173-1#02-ABH990#001 (property) is defined as "Number of documents (handover documentation)"

###### Recommended Solution

- Make sure the *semanticId* of the *Document* Submodel Element Collection has the value
  "0173-1#02-ABI500#001/0173-1#01-AHF579#001".

#### Errors with SubmodelElements of DocumentID

---

##### Mandatory property ValueId in Submodel Element DocumentId

###### Problem Description

- *ValueId* is a required value in the *DocumentId*.
- Sometimes we encounter handover documentation submodel instances where *ValueId* is missing in some or all
  *DocumentIds*.

###### Specification Reference

- [Handover Documentation v1.2, 2.6 SubmodelElements of DocumentID, shortId "ValueId", P.
  16](https://industrialdigitaltwin.org/wp-content/uploads/2023/03/IDTA-02004-1-2_Submodel_Handover-Documentation.pdf#page=16)

###### Remarks

- *ValueId* is an identification number of the Document within a given domain, e.g. the providing organization
- Example values for *ValueId*: 1213455566, XF90-884

###### Recommended Solution

- Make sure there is a value set for each *ValueId* of each *DocumentId* representing an identifier which clearly
  identifies the document within your organization.

#### Errors with SubmodelElements of DocumentVersion

---

##### SemanticId of SubmodelElement DigitalFile

###### Problem Description

- The semanticId of a digital file should be 0173-1#02-ABI504#001/0173-1#01-AHF583#001.
- Sometimes it is mistaken with the ECLASS IRDI for the document path 0173-1#02-ABI005#001, which doesn't describe the
  whole file.

###### Specification Reference

- [Handover Documentation v1.2, 2.8 SubmodelElements of DocumentVersion, idShort "DigitalFile{00}", P.
  21](https://industrialdigitaltwin.org/wp-content/uploads/2023/03/IDTA-02004-1-2_Submodel_Handover-Documentation.pdf#page=21)

###### Remarks

- 0173-1#02-ABI504#001 (property) is defined as "MIME-Type, file name and file contents given by the file
SubmodelElement". 0173-1#01-AHF583#001 (class) is defined as "MIME-Type, file name and file contents given by the file
SubmodelElement".
- 0173-1#02-ABI005#001 (property) is defined as "Path of the document".

###### Recommended Solution

- Replace the *semanticId* of the *DigitalFile* element with the IRDI path "0173-1#02-ABI504#001/0173-1#01-AHF583#001".

---

##### IdShort of SubmodelElement DigitalFile

###### Problem Description

- IdShorts for digital files have to be unique within the DocumentVersion.
- It is recommended to name them "DigitalFile" with a following two-digit number.

###### Specification Reference

- [Handover Documentation v1.2, 2.8 SubmodelElements of DocumentVersion, idShort "DigitalFile{00}", P.
  21](https://industrialdigitaltwin.org/wp-content/uploads/2023/03/IDTA-02004-1-2_Submodel_Handover-Documentation.pdf#page=21)
- [Handover Documentation v1.2, Annex A. Explanations of table formats used, 2. Tables on Submodels and
  SubmodelElements, P.
  23](https://industrialdigitaltwin.org/wp-content/uploads/2023/03/IDTA-02004-1-2_Submodel_Handover-Documentation.pdf#page=23)

###### Remarks

- IdShorts for digital files have to be unique within the DocumentVersion.
- It is recommended to name them "DigitalFile" with a following two-digit number: DigitalFile{00}.
- If an idShort ends with ‘{00}’, this indicates a suffix of the respective length (here: 2) of decimal digits to make
the idShort unique.
- A different idShort might be chosen, as long as it is unique in the parent’s context.

###### Recommended Solution

- Name the idShort of digital files of one document version "DigitalFile" and add a number from 01 to XX.
- Example: DigitalFile01, DigitalFile02, ...

## Errors related to Exchange Data Formats

### XML Serialization

Relevant if you use XML in the aas-spec file of your AASX package, e.g. by using the AASX Package Explorer to generate
packages.

#### Empty XML Nodes

Main error source here is that the official XML schema is demanding that most XML nodes need to contain something
(item/value) or be non-existent. So, in many cases empty XML nodes are not allowed by the schema.

---

##### Empty EmbeddedDataSpecification

###### Error Message
>
> Embedded data specifications must be either not set or have at least one item.: {position}
>
###### Specification Reference

- [Issue #296 of admin-shell-io/aas-specs on Github](https://github.com/admin-shell-io/aas-specs-metamodel/issues/296)
- [Part 1 v3.0, 7.2.5 Embedded Data Specifications, Figure 58 Realization of Embedded Data Specifications, P.
  115](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=116)
- [Part 1 v3.0, Annex D. Templates for UML Tables, Template for Classes, Note 3, P.
  135](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=136)
- [XML-Schema v3.0.7, <xs:group name="embeddedDataSpecification">, line 278
  ff.](https://github.com/admin-shell-io/aas-specs-metamodel/blob/master/schemas/xml/AAS.xsd#L278)

###### Remarks

- *EmbeddedDataSpecifications* must contain both, a *DataSpecification* and a *DataSpecificationContent* node.
- Cardinality is wrongly documented in Part 1 v3.0, see linked issue.

###### Recommended Solution

- Remove the empty node from the XML file or add *DataSpecificationContent* to it.

---

##### Empty SubmodelElementCollection/Value

###### Error Message
>
> Value must be either not set or have at least one item.
>
###### Specification Reference

- [Part 1 v3.0, 5.3.7.16 Submodel Element Collection Attributes, P.
  76](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=77)
- [Part 1 v3.0, Annex D. Templates for UML Tables, Template for Classes, Note 3, P.
  135](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=136)
- [XML-Schema v3.0.7, <xs:group name="embeddedDataSpecification">, line 869
  ff.](https://github.com/admin-shell-io/aas-specs-metamodel/blob/master/schemas/xml/AAS.xsd#L869)

###### Remarks

- The attribute *value* of a *SubmodelElementCollection* is optional.
- But if there is a *value* it must contain at least one *SubmodelElement* item to it.

###### Recommended Solution

- Remove the empty *SubmodelElementCollection* node from the XML file or add at least one *SubmodelElement* to it.

---

##### Empty SubmodelElement/Description

###### Error Message
>
> Description must be either not set or have at least one item.
>
###### Specification Reference

- [Part 1 v3.0, 5.3.2.10 Referable Attributes, P.
  56](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=57)
- [Part 1 v3.0, Annex D. Templates for UML Tables, Template for Classes, Note 3, P.
  135](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=136)
- [XML-Schema v3.0.7, <xs:element name="description"...>, line 739
  ff.](https://github.com/admin-shell-io/aas-specs-metamodel/blob/master/schemas/xml/AAS.xsd#L739)

###### Remarks

- The attribute *description* of any *Referable* is optional.
- Among others all *SubmodelElements* (like Properties) are *Referables*.
- If the description attribute is set it must contain at least one item.

###### Recommended Solution

- Remove the empty *description* node from the XML file or add at least one item to it.

---

##### Empty Entity/Statements

###### Error Message
>
> Statements must be either not set or have at least one item.
>
###### Specification Reference

- [Part 1 v3.0, 5.3.7.7 Entity Attributes, P.
  70](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=71)
- [Part 1 v3.0, Annex D. Templates for UML Tables, Template for Classes, Note 3, P.
  135](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=136)
- [XML-Schema v3.0.7, <xs:element name="description"...>, line 293
  ff.](https://github.com/admin-shell-io/aas-specs-metamodel/blob/master/schemas/xml/AAS.xsd#L293)

###### Remarks

- The attribute *statements* of an *entity* is optional.
- If the statements attribute is set it must contain at least one statement.

###### Recommended Solution

- Remove the empty *statements* node from submodel in the XML file or add at least one statement item to it.

---

##### Empty Qualifiers

###### Error Message
>
> Qualifiers must be either not set or have at least one item.
>
###### Specification Reference

- [Part 1 v3.0, 5.3.2.8 Qualifiable Attributes, P.
  53](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=54)
- [XML-Schema v3.0.7, <xs:element name="description"...>, line 659
  ff.](https://github.com/admin-shell-io/aas-specs-metamodel/blob/master/schemas/xml/AAS.xsd#L659)

###### Remarks

- "A qualifiable element may be further qualified by one or more qualifiers. "
- The XML element *qualifiers* of a *submodel element* is optional.
- If the *qualifiers* element is present it must contain at least one *qualifier* element.

###### Recommended Solution

- Remove the empty *qualifiers* node from the submodel in the XML file or add at least one *qualifier* element to it.

---

##### Empty (Language) Strings

###### Error Message
>
> The value must not be empty.
>
###### Specification Reference

- [Part 1 v3.0, Annex D. Templates for UML Tables, Template for Classes, Note 2, P.
  135](https://industrialdigitaltwin.org/en/wp-content/uploads/sites/2/2023/06/IDTA-01001-3-0_SpecificationAssetAdministrationShell_Part1_Metamodel.pdf#page=136)
- [XML-Schema v3.0.7, <xs:element name="description"...>, line 659
  ff.](https://github.com/admin-shell-io/aas-specs-metamodel/blob/master/schemas/xml/AAS.xsd#L15)

###### Remarks

- Please note that the above schema reference is just one example among many.
- ALL occurrences of "xs:string" in the XML schema are provided with a restriction of minLength=1.

###### Recommended Solution

- Add a content of at least 1 character length to the attribute or remove it completely from the XML file.

### Package File Format (AASX)

The AASX package file format is based on the Open Packaging Conventions and specified in [Specification of the Asset
Administration Shell, Part 5: Package File Format
(AASX)](https://industrialdigitaltwin.org/wp-content/uploads/2024/06/IDTA-01005-3-0-1_SpecificationAssetAdministrationShell_Part5_AASXPackageFileFormat.pdf).

#### Relationships

Relationships are used within an AASX package to connect the package to files, and to connect various files in the
package. They form the logical model of the package.

---

##### No origin part found for aasx-origin

###### Error Message
>
> No origin part found
>
###### Specification Reference

- [Part 5 v3.0.1, 5.2 Conventions for the Asset Administration Shell Package File Format (AASX), P.
  16](https://industrialdigitaltwin.org/wp-content/uploads/2024/06/IDTA-01005-3-0-1_SpecificationAssetAdministrationShell_Part5_AASXPackageFileFormat.pdf#page=17)

###### Remarks

- 'aasx-origin' is the entry point when processing an AASX package.
- It is defined in the relationship file /_rels/.rels within the package and has to be of relationship type
  '<http://admin-shell.io/aasx/relationships/aasx-origin>'.
- It has been '<http://www.admin-shell.io/aasx/relationships>' in advance to v3, but this type with 'www.' is now
  deprecated and will lead to the stated error for v3 packages.
- See also [Fix URIs for V3 by mristin · Pull Request #40 ·
  aas-core-works/aas-package3-csharp](https://github.com/aas-core-works/aas-package3-csharp/pull/40).
- Be aware that the AASX Package Explorer didn't handle the relationship type for v3 packages correctly for some time.
  This issue should fixed by now, see [v2024-03-05.alpha release reintroduces bug that was fixed in v2024-02-27.alpha ·
  Issue #184 · eclipse-aaspe/package-explorer
  (github.com)](https://github.com/eclipse-aaspe/package-explorer/issues/184).

###### Recommended Solution

- Make sure that the relationship type for the aasx-origin in the /_rels/.rels file is
  '<http://admin-shell.io/aasx/relationships/aasx-origin>' (without 'www.').
- Make sure that the target property is filled with the correct relative path.

#### Supplemental Files (aas-suppl)

---

##### Incorrect File Path

###### Error Message
>
> Document with value {filepath} could not be found in the aasx package
>
###### Specification Reference

- [Part 5 v3.0, 5.3 ECMA-376 Relationships, Relationship Type "aas-suppl", P.
  20](https://industrialdigitaltwin.org/wp-content/uploads/2023/04/IDTA-01005-3-0_SpecificationAssetAdministrationShell_Part5_AASXPackageFileFormat.pdf#page=21)

###### Remarks

- When a relative URI is used to reference a file from within the data of an AAS this file has to be part of the AASX
  package (must exists).

###### Recommended Solution

- Make sure all referenced files exist in the package and the folder and file names are correct.
- Make sure that all relatively referenced files are listed as aas-suppl targets in the relationship part file (e.g.
  /aasx/_rels/data.json.rels) of the aasx package.
- Check if unused references exist in the relationship file.

## Document Change History

<!-- TOC ignore:true -->

### Version 1.1 (06-Aug-2024)

- Added 'No origin part found for aasx-origin' error and its containing 'Relationships' chapter.

<!-- TOC ignore:true -->

### Version 1.0 (15-Jan-2024)

- Initial Version by Fabian Gumbrecht and Christian Körber.
