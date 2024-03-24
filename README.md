
Search openalex and display json:
```
npm run start -- search climate AND africa AND education
```

Search for matches only in the title:
```
npm run start -- search --title  climate AND africa AND education
```

Search openalex and display number of results:
```
npm run start -- search --title  climate AND africa AND education --count
```

Search openalex and save output:
```
npm run start -- search --title  climate AND africa AND education --save output
```


Search openalex, show titles, and save output:
```
npm run start -- search --title  climate AND africa AND education --showtitle --save output
```

Expand search terms according to searches stored in text files in `searchterms/`:
```
npm run start -- search --title  climate... AND africa... AND education... --showtitle
```
