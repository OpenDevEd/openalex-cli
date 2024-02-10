import Openalex from 'openalex-sdk';

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

  const openalex = new Openalex();
  const result = await openalex.works({
    searchField: 'title',
    search: searchBuilder(query),
  });
  console.log(result.meta);

  return result;
}

// extract key from json file
export function extractKey(key: string, path: string = '../../config.json') {
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
  console.log(searchQuery);
  return searchQuery;
}
