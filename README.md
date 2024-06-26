# Installation

```
git clone git@github.com:OpenDevEd/openalex-cli.git
cd openalex-cli
npm install
npm run build
npm link
openalex-cli --help
```

Alternatively, you can use:

```
git clone git@github.com:OpenDevEd/openalex-cli.git
cd openalex-cli
npm run setup
```

If you do not use `npm link`, you need to use `npm run start --` instead of `openalex-cli` below.

# Usage

Search openalex and display json:

```
openalex-cli search climate AND africa AND education
```

Search for matches only in the title:

```
openalex-cli search --title  climate AND africa AND education
```

Search openalex and display number of results:

```
openalex-cli search --title  climate AND africa AND education --count
```

Search openalex and save output:

```
openalex-cli search --title  climate AND africa AND education --save output
```

Search openalex and automatically save output,
the output is saved in a file named `<Datetime>-<Search Query>`:

```
openalex-cli search --title  climate AND africa AND education --autosave
```

Search openalex, show titles, and save output:

```
openalex-cli search --title  climate AND africa AND education --showtitle --save output
```

Expand search terms according to searches stored in text files in `searchterms/`:

```
openalex-cli search --title  climate... AND africa... AND education... --showtitle
```
