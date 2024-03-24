The `jq` filter `openalex-to-zotero.jq` implements very basic translation of openalex json to zotero json.

Get results from openalex
```
npm run start -- search --title climate... AND africa... AND education... --allpages --save=openalex-output
```
Then transform:
```
jq -f openalex-to-zotero.jq openalex-output.json > zotero.json
```
Then, if you install https://github.com/OpenDevEd/zotero-lib,
```
zotero-lib --group-id <your_zotero_group> create --files zotero.json
```
In case you need to process items further (e.g., attach the original json from openalex), you'll need to be able to associate the newly created Zotero items with the openalex item; in other words, associated the item keys of the newly created Zotero items with the openalex ids. You could use the `--out` switch to `zotero-lib` and analyse that fie, but especially for larger uploads, that's not super straight forward. Instead, place the uploaded items into a collection in Zotero and fetch the items in the collection:
```
zotero-lib --out collection.json items --collection zotero://select/groups/<group>/collections/<key>
```
The openalex key is stored in callNumber. Therefore, use `jq` like this to give the association between zotero item key and openalex id:
```
jq  '[.[] | {key: .data.key, callNumber: .data.callNumber}]' collection.json 
```
Or, for key-value pairs, you can use `correspondence.jq` as follows:
```
jq  -f correspondence.jq collection.json > correspondence.json
```
Now that you have the correspondence between Zotero item keys and openalex ids, you can, e.g., attach the original openalex json to the Zotero item.

Another example is to transfer the openalex citation tree to Zotero.
```
jq -f extract_references_from_openalex.jq openalex-output.json > references.json
```
Some perl code is available that attaches the references to the zotero items. The code reads correspondence.json and references.json. It then attached a note to each newly created Zotero item,that lists the references in kerko style. *Obviously, this code only operates within the data set retrieved - i.e., reference links are only set up between items that were retrieved in the same query.)
