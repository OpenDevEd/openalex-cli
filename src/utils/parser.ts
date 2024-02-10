import Openalex from 'openalex-sdk';
import { SearchParameters } from 'openalex-sdk/dist/src/types/work';

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
export function searchBuilder(query: any) {
  const keys = Object.keys(query);
  let searchQuery = '';
  for (let i = 0; i < keys.length; i++) {
    if (keys[i].includes('key')) {
      searchQuery += extractKey(query[keys[i]]);
    } else if (keys[i].includes('term')) {
      searchQuery += ` ${query[keys[i]]} `;
    } else if (keys[i].includes('operator')) {
      searchQuery += ` ${query[keys[i]]} `;
    }
  }
  // console.log(searchQuery);
  return searchQuery;
}

export async function searchWork(args: any) {
  const query = await parseTitle(args.title);
  const openalex = new Openalex();
  if (args.count) {
    const result = await openalex.works({
      searchField: 'title',
      search: searchBuilder(query),
      perPage: 1,
      page: 1,
    });
    console.log('count:', result.meta.count);
    return result.meta.count;
  }
  const openalexOptions: SearchParameters = {
    searchField: 'title',
    search: searchBuilder(query),
  };
  if (args.page) openalexOptions['page'] = args.page;
  if (args.perPage) openalexOptions['perPage'] = args.perPage;
  if (args.allpages) openalexOptions['retriveAllPages'] = args.allpages;
  if (args.startPage) openalexOptions['startPage'] = args.startPage;
  if (args.endPage) openalexOptions['endPage'] = args.endPage;
  if (args.save) openalexOptions['fileName'] = args.save;
  const result = await openalex.works(openalexOptions);
  if (args.save) console.log('Results saved to', args.save);
  else console.log(result);

  return result;
}
