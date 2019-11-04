#!/usr/bin/env node

const yargs = require('yargs');
const { TEMP_DIR } = require('./constants');
const {
  exec,
  fs,
  getCommands,
  buildHeader,
  buildUsage,
  buildAvailableCommands,
  buildLicense,
} = require('./helpers');

const { argv } = yargs
  .locale('en')
  .wrap(null)
  .alias('h', 'help')
  .option('v', {
    type: 'boolean',
    default: true,
    alias: 'verbose',
    description: 'Show details about the result of running command',
  })
  .option('o', {
    type: 'string',
    default: './README.md',
    alias: 'output',
    description: 'Output file',
  })
  .option('cli', {
    type: 'string',
    demandOption: 'Please specify path to the CLI (--cli)',
    description: 'Path to executable file of the CLI for which documentation is generated (if --cli started with \'./\', \'../\' or \'/\', you can specify --pretty_cli_name otherwise --cli will be interpreted as the executable from the $PATH environment variable, and --pretty_cli_name will be ignored)',
    coerce: arg => ({ exe: arg, name: arg }),
  })
  .option('pretty_cli_name', {
    type: 'string',
    description: 'A string that replaces the program name specified in --cli (this parameter will be ignored if the --cli value does not start with \'./\', \'../\' or \'/\')',
  })
  .option('d', {
    type: 'string',
    alias: 'description',
    description: 'CLI description',
  })
  .option('l', {
    type: 'string',
    default: 'MIT',
    alias: 'license',
    description: 'License type',
  })
  .example('\'$ $0 --cli=githelp\'', 'Generate markdown docs for \'githelp\' CLI to the \'README.md\' file')
  .example('\'$ $0 --cli=/path/to/cli.js --pretty_cli_name=my-cli\'', 'Generate markdown docs for \'my-cli\' CLI to the \'README.md\' file')
  .example('\'$ $0 --cli=./path/to/cli.js --pretty_cli_name=my-cli\'', 'Generate markdown docs for \'my-cli\' CLI to the \'README.md\' file');

async function main() {
  const {
    verbose,
    output,
    cli,
    pretty_cli_name,
    description,
    license,
  } = argv;

  const isRelativePath = cli.name.slice(0, 2) === './' || cli.name.slice(0, 3) === '../';
  const isPath = isRelativePath || cli.name[0] === '/';

  try {
    if (pretty_cli_name && isPath) {
      if (isRelativePath) {
        const { stdout } = await exec('pwd');

        cli.exe = `${stdout.slice(0, -1)}/${cli.exe}`;
      }

      const prettyExePath = `${TEMP_DIR}/${pretty_cli_name}`;

      await exec(`mkdir -p ${TEMP_DIR}`);
      await exec(`rm -rf ${TEMP_DIR}/*`);
      await exec(`ln -s '${cli.exe}' ${prettyExePath}`);

      cli.name = pretty_cli_name;
      cli.exe = prettyExePath;
    }

    const { stdout: helpOutput, stderr } = await exec(`${cli.exe} --help`);

    if (stderr) {
      throw new Error(stderr);
    }

    const availableCommands = await getCommands(cli.name, cli.exe, helpOutput);

    const content = [
      ...buildHeader(cli.name, description),
      ...buildUsage(cli.name, helpOutput),
      ...buildAvailableCommands(cli.name, availableCommands),
      ...buildLicense(license),
    ];

    fs.writeFile(output, content.join('\n\n'));
  } catch (err) {
    yargs.showHelp();
    console.log(`\n${verbose ? err : err.message}`);
  } finally {
    await exec(`rm -rf ${TEMP_DIR}`);
  }
}

main();