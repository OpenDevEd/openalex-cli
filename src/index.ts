const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
import { searchWork } from './utils/parser';

yargs(hideBin(process.argv))
  .command(
    'search [searchstring...]',
    'Perform a search. The search string should be in OpenAlex format, e.g. climate AND change AND Tanzania.',
    (yargs: any) => {
      yargs
        .option('title', {
          describe: 'Search only in title',
          type: 'boolean',
        })
        .option('title_and_abstract', {
          describe: 'Search only in title and abstract',
          type: 'boolean',
        })
        .option('count', {
          describe: 'Count of the search results',
          type: 'boolean',
        })
        .option('showtitle', {
          describe: 'Only show result titles. Can be used in conjunction with --save.',
          type: 'boolean',
        })
        .option('page', {
          describe: 'Page number',
          type: 'number',
        })
        .option('perPage', {
          describe: 'Number of items per page',
          type: 'number',
        })
        .option('startPage', {
          describe: 'Start page number',
          type: 'number',
        })
        .option('endPage', {
          describe: 'End page number',
          type: 'number',
        })
        .option('allpages', {
          describe: 'Retrieve all pages',
          type: 'boolean',
        })
        .option('save', {
          describe: 'Save the search results to a json file. E.g. --save=test will save results to test.json',
          type: 'string',
        })
        .option('searchstringfromfile', {
          describe: 'Search string read from file.',
          type: 'string',
        })
        /*
        .option('searchstring', {
          describe: 'Search string.',
          type: 'string',
        })*/
        ;
    },
  )
  .middleware((argv: any) => {
    if (!argv.title && !argv.title_and_abstracte) {
      console.log('Please provide a search field --title or --title_and_abstracte.');
      process.exit(1);
    }
    if (argv.title && argv.title_and_abstracte) {
      console.log('Please provide only one search field --title or --title_and_abstracte.');
      process.exit(1);
    }
    if (!argv.searchstring && !argv.searchstringfromfile) {
      console.log('Please provide a search string (positional args) or use --searchstringfromfile=file.txt.');
      process.exit(1);
    }
    searchWork(argv);
  })
  .parse();
