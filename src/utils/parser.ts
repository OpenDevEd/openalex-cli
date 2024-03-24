import fs from 'fs';
import Openalex from 'openalex-sdk';
import { SearchParameters } from 'openalex-sdk/dist/src/types/work';

/*
export async function parseTitle(title: string[]) {
  // Transform the array into an object
  const query = title.reduce((acc: any, term: string, index: number) => {
    if (term === 'AND' || term === 'OR') {
      acc[`operator${index}`] = term;
    } else {
      // if term is one word and have dot in the end, add it to keys
      if (term.split('.').length > 1) {
        acc[`key${index}`] = term;
      } else {
        acc[`term${index}`] = term;
      }
    }

    return acc;
  }, {});

  return query;
}


// extract key from json file
export function extractKey(key: string, path: string = '../../searchterms.json') {
  const keys = require(path);
  // remove dot from the end of the key
  if (key.split('.').length > 1) {
    key = key.slice(0, -1);
  }

  return keys[key];
}

// search builder
export function searchBuilder_old(query: any) {
  //let isOr = false;
  //let isLastOr = false;
  const keys = Object.keys(query);
  let searchQuery = '';
  for (let i = 0; i < keys.length; i++) {
    console.log("->"+query[keys[i]]);'search [searchstring...]',
    // check if the next element is an operator 'OR'
    if (keys[i + 1] && query[keys[i + 1]] === 'OR') {
      isOr = true;
      searchQuery += `(`;
    } 
    if (keys[i].includes('key')) {
      searchQuery += extractKey(query[keys[i]]);
    } else if (keys[i].includes('term')) {
      searchQuery += ` ${query[keys[i]]} `;
    } else if (keys[i].includes('operator')) {
      if (query[keys[i]] === 'AND') searchQuery += ' AND ';
      else if (query[keys[i]] === 'OR') {
        // searchQuery = `(${searchQuery})`;
        searchQuery += ` ${query[keys[i]]} `;
        //isLastOr = true;
      }
    }
    if (isOr && query[keys[i]] !== 'OR' && isLastOr) {
      searchQuery += `)`;
      isOr = false;
      isLastOr = false;
    }
  }
  console.log(searchQuery);
  return searchQuery;
}
*/

/*
Documentation:

term...

looks for searchterms/term.txt

By default, the terms.txt file is am openalex search string. 
- The string can be broken down into multiple lines. 
- The string can be commented shell/python-style with #

The following have special meaning: #- or #OR or #AND.
- For all of these, the following lines will be enclosed in "..." if there is a space in the line.
- For #OR and #AND, the following lines will concatenated with " OR " or " AND " respectively.
- If you use #-, then #OR/#AND is reset, but lines will still be enclosed in "..." if there is a space in the line.

For exmples, see searchterms/ssa.txt and searchterms/test.txt.
*/

export function searchBuilder(query: any) {
  //let isOr = false;
  //let isLastOr = false;
  let searchQuery = '';
  // query = query.split(' ');

  for (let i = 0; i < query.length; i++) {
    //console.log("->"+query[i]);
    if (query[i].match(/(\w+)\.\.\./)) {
      //console.log("expand: "+query[i]);
      const key = query[i].match(/(\w+)\.\.\./)[1];
      // open a file
      const file = 'searchterms/' + key + '.txt';
      //console.log("f="+file);
      let result = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : key;
      // split result into an array by new line
      const resultarr = result.split(/\r?\n/);
      result = '';
      let operator = '';
      let useoperator = false;
      // remove comments from results file
      for (let j = 0; j < resultarr.length; j++) {
        //console.log("->"+resultarr[j]);
        if (resultarr[j].match(/\#(OR|AND)\s*$/)) {
          operator = ' ' + resultarr[j].match(/\#(OR|AND)\s*$/)[1] + ' ';
          console.log('operator: ' + operator);
          useoperator = true;
        }
        if (resultarr[j].match(/\#(\-)\s*$/)) {
          useoperator = true;
          operator = ' ';
          console.log('operator empty.');
        }
        const term = sanitise(resultarr[j].replace(/\#.+$/g, ''));
        if (term != '') {
          result += (result.match(/[\w\"\)]\s+$/) && !term.match(/^\s*\)/) ? operator : '') + (useoperator ? quoteIfNeeded(term) : term) + ' ';
        }
      }
      result = query[i].replace(RegExp(key + '\\.\\.\\.'), result);
      //console.log(result);
      searchQuery += ` ${result}`;
    } else {
      // console.log('add: ' + query[i]);
      searchQuery += ` ${quoteIfNeeded(query[i])} `;
    }
  }
  // Allow use of [ and ] instead of ( and ).
  searchQuery = searchQuery.replace(/\[/gs, '(');
  searchQuery = searchQuery.replace(/\]/gs, ')');
  console.log('Final query: ' + searchQuery);
  return searchQuery;
}

function sanitise(str: string) {
  let term = str;
  term = term.replace(/\t+/gs, ' ');
  term = term.replace(/ +/gs, ' ');
  term = term.replace(/^ +/gs, '');
  term = term.replace(/ +$/gs, '');
  return term;
}

function quoteIfNeeded(term: string) {
  if (term.match(/ /) && !term.match(/^\".*\"$/)) {
    term = `"${term}"`;
  }
  return term;
}

export async function searchWork(args: any) {
  let query = args.searchstring;
  const searchField = args.title_and_abstracte ? 'title_and_abstract' : 'title';
  const openalex = new Openalex();
  if (args.searchstringfromfile) {
    if (!fs.existsSync(args.searchstringfromfile)) {
      console.log('File not found: ' + args.searchstringfromfile);
      process.exit(1);
    }
    query = fs.readFileSync(args.searchstringfromfile, 'utf8');
    query = query.split(/\r?\n/);
  }
  if (args.count) {
    const result = await openalex.works({
      searchField: searchField,
      search: searchBuilder(query),
      perPage: 1,
      page: 1,
    });
    console.log('count:', result.meta.count);
    return result.meta.count;
  }
  const openalexOptions: SearchParameters = {
    searchField: searchField,
    search: searchBuilder(query),
  };
  if (args.page) openalexOptions['page'] = args.page;
  if (args.perPage) openalexOptions['perPage'] = args.perPage;
  if (args.allpages) openalexOptions['retriveAllPages'] = args.allpages;
  if (args.startPage) openalexOptions['startPage'] = args.startPage;
  if (args.endPage) openalexOptions['endPage'] = args.endPage;
  if (args.save) openalexOptions['toJson'] = args.save;
  const result = await openalex.works(openalexOptions);
  if (args.save) console.log('Results saved to', args.save);
  if (args.showtitle) {
    console.log(`Results: ${result.meta.count}`);
    if (args.startPage > 1) console.log('...');
    result.results.forEach((work: any) => {
      console.log('- ' + work.title);
    });
    if (result.results.length < result.meta.count) console.log('... and more');
  }
  if (!args.save && !args.showtitle) console.log(JSON.stringify(result, null, 2));

  return result;
}
