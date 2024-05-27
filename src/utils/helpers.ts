// create UUID
import { v4 as uuidv4 } from 'uuid';

// function to create metadata for a search
export function createMeta(args: any) {
  return {
    searchID: uuidv4(),
    version: 'OpenDevEd_jsonUploaderV01',
    query: args.search,
    searchTerm: args.searchTerm || 'title',
    totalResults: args.count,
    source: 'OenAlex',
    sourceFormat: args.chunkSize ? 'chunk' : 'original',
    date: new Date().toISOString(),
    searchField: args.searchField || 'title',
    page: args.startPage || 1,
    resultsPerPage: args.perPage || args.chunkSize || 25,
    firstItem: 1,
    startingPage: args.startPage || 1,
    endingPage: args.endPage,
    filters: args.filter || {},
    groupBy: '',
    sortBy: {
      field: 'relevance',
      order: 'desc',
    },
  };
}
