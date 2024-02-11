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
