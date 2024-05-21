#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
import setApiKey from './utils/config';
import { searchWork } from './utils/parser';

yargs(hideBin(process.argv))
  .command(
    'search [searchstring...]',
    'Perform a search. The search string should be in OpenAlex format, e.g. climate AND change AND Tanzania. You can use [ and ] instead of ( and ).',
    (yargs: any) => {
      yargs
        .option('title', {
          describe: 'Search only in title',
          type: 'boolean',
        })
        .option('title-abs', {
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
        // TODO: @bjohas need to review description of this option
        .option('chunkSize', {
          describe:
            'this option only works with --allpages. It will retrieve the results in chunks of the specified size. E.g. --chunkSize=100 will retrieve 100 results at a time. and save them to files in a folder with same name in --save option,',
          type: 'number',
        })
        .option('save', {
          describe: 'Save the search results to a json file. E.g. --save=test will save results to test.json',
          type: 'string',
        })
        .option('time', {
          describe: 'Prepend the filename with the current date and time',
          type: 'boolean',
          default: true,
        })
        .option('autosave', {
          describe: 'Save the search results to a json file with the search string as the filename',
          type: 'boolean',
        })
        .option('searchstringfromfile', {
          describe: 'Search string read from file.',
          type: 'string',
        });
      /*
        .option('searchstring', {
          describe: 'Search string.',
          type: 'string',
        })*/
    },
  )
  .command('config set api-key', 'Set the API key to be used for the search')
  .middleware(async (argv: any) => {
    if (argv._[0] === 'config') {
      console.log('Config command');
      await setApiKey();
      process.exit(0);
    }
    if (!argv.title && !argv.titleAbs) {
      console.log('Please provide a search field --title or --title-abs.');
      process.exit(1);
    }
    if (argv.title && argv.titleAbs) {
      console.log('Please provide only one search field --title or --title-abs.');
      process.exit(1);
    }
    if (!argv.searchstring && !argv.searchstringfromfile) {
      console.log('Please provide a search string (positional args) or use --searchstringfromfile=file.txt.');
      process.exit(1);
    }
    if (argv.save && argv.time) {
      argv.time = false;
    }
    if (argv.save && argv.autosave) {
      console.log('Please provide only one of --save or --autosave.');
      process.exit(1);
    }
    await searchWork(argv);
  })
  .parse();
