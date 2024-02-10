const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
import { searchWork } from './utils/parser';

yargs(hideBin(process.argv))
  .command('search', 'perform a search', (yargs: any) => {
    yargs
      .option('title', {
        describe: 'Title of the paper',
        type: 'array',
      })
      .option('count', {
        describe: 'Count of the search results',
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
      .option('save', {
        describe: 'Save the search results to a json file EG: --save=test will save it to test.json',
        type: 'string',
      })
      .demandOption(['title'], 'Please provide a title');
  })
  .middleware((argv: any) => {
    if (!argv.title) {
      console.log('Please provide a title');
      process.exit(1);
    }
    searchWork(argv);
  })
  .parse();
