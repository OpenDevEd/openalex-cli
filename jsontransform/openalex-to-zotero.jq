# Map types from openalex to zotero
def typeMap: if . == "article" then "journalArticle" else "report" end;
# Determine whether the doi should be put into the Zotero extra field
def showDOIInExtra: if (.type != "article" and .doi != "") then ("DOI: " + .doi + "\n") else "" end;
# Turn abstract_inverted_index into abstract:
def absInvert: [[ . | to_entries | .[] | { key: .key, value: .value | .[] } ] | sort_by(.value) | .[] | .key] | join(" ");

.results | [ .[] | (
# handle common fields:
{
  "itemType": (.type | typeMap),
  "title": .title,
  "creators": [ .authorships[] | 
    {
      "creatorType": "author",
      "firstName": (.author.display_name | split(" ")[0:-1]) | join(" "),
      "lastName": (.author.display_name | split(" ")[-1])
    }
  ]
  ,
  "abstractNote": (if ((. | has("abstract_inverted_index")) and .abstract_inverted_index != null) then .abstract_inverted_index | absInvert else "" end),
  "date": .publication_date,
  "language": "",
  "shortTitle": "",
  "url": (.primary_location.landing_page_url // ""),
  "accessDate": "",
  "archive": "",
  "archiveLocation": "",
  "libraryCatalog": "",
  # "callNumber": (. | tostring),
  "callNumber": ("openalex:"+(.ids.openalex | split("/")[-1])),
  "rights": "",
  "extra": (({doi: .doi, type: .type} | showDOIInExtra)+"openalex:"+(.ids.openalex//"")+"\nmag:"+(.ids.mag//"")+"\n"),
  "tags": [],
  "collections": [],
  "relations": {}
} 
# handle type-specific fields:
+ (if .type == "article" then {
  "publicationTitle": (.primary_location.source.display_name // ""),
  "seriesText": "",
  "volume": (.biblio.volume // ""),
  "issue": (.biblio.issue // ""),
  "pages": (.biblio | (if (.first_page != "") then (if (.last_page != "") then (.first_page+"-"+.last_page) else .first_page end) else "" end)),
  "series": "",
  "seriesTitle": "",
  "journalAbbreviation": "",
  "DOI": (.doi // ""),
  "ISSN": (.primary_location.source.issn_l // "")
} else 
{
  "reportNumber": "",
  "reportType": "",
  "place": "",
  "institution": "",
  "seriesTitle": ""
}
end)
)]

