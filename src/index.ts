const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
import { parseTitle } from './utils/parser';

yargs(hideBin(process.argv))
  .command('search', 'perform a search', (yargs: any) => {
    yargs.option('title', {
      describe: 'Title of the paper',
      type: 'array',
      coerce: parseTitle,
    });
  })
  .parse();
