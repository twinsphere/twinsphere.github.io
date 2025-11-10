# twinstudio Twin Builder

!!! note
    **Work in Progress**
    This section is still under construction.
    Our keyboards are clacking, our coffee is strong, and the content is on its way.
    Thanks for your patience!

## Twin Creation Wizard

## Edit Shell Properties

![Edit Shell Properties](img/twinstudio_shellproperties.png){: width='600' }

If you want to edit properties (*asset kind, global asset id and specif asset ids*) of your shell the editing has to be unlocked.

![Add Specific Asset Ids](img/twinstudio_shellproperties_addremove.png){: width='200' }

Via the dropdown you can add specific asset ids, if the editing has been enabled.

The asset type of the shell is shown in the row below these properties.
If the url points to an existing twin in your current tenant, a link to it will be displayed.

## Add/Remove Submodels

The Submodels of your currently opened twin can be edited via the *edit submodel* button in the top right corner.

![Edit Submodels dialog](img/twinstudio_addremove_submodels.png){: width='600' }

The current submodels of your twin are at the top of the list.
The rest of the list contains all available submodel templates from your current tenant.
To select the same template multiple times you have to add them one at a time.

If a new submodel template is added it will be converted to a submodel of type instance
 and its elements are modified to reflect this change.

## Add/Remove Submodel Elements

In the navigation list a symbol is displayed in every submodel entry.
 This states if the template for your submodel has been found in your tenant.

If this is the case you can find the *add element* button on some of the submodel elements.
 There are an *add to navigation* and *add to page* section.

![Add SME Dialog](img/twinstudio_addremove_sme.png){: width='200' }

Adding a navigation element will insert a child in the navigation tree. To delete this element you have to visit the node.

Adding an element to the page will cluster similar elements. Next to them there will be a trash can to delete each entry.

Some templates specify a cardinality of *one* or *onetomany* then the last element cannot be removed.

## Arbitrary Properties

Some templates specify arbitrary properties. At the moment twinstudio only supports editing the first.
 Twinstudio cannot assume in good faith the correct idShort for additional elements.

![Arbitray Properties Add Dialog](img/twinstudio_arbitrary.png){: width='500' }

In the add dialog these entries are grayed out and display the info.

## Fill-In Submodel Element Values

## Validation Issue List

![Validation Issue List](img/twinstudio_issuelist_withpath.png){: width='300' }

After each value change your twin gets validated. The count of issues will be displayed atop of the list.

The errors are grouped by their path which can be displayed with the show issue path toggle.

Clicking on an issue will navigat you to the element and the edit mode will be opened.

## Save Draft

## Publish to Repo
