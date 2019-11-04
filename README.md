# cli-docs-generator

This package allows you to generate markdown docs for [yargs](https://github.com/yargs/yargs) CLI. This docs was generated by using [cli-docs-generator](https://github.com/EliseevNP/cli-docs-generator). More examples: [githelp](https://github.com/EliseevNP/githelp).

## Install

```sh
$ npm i cli-docs-generator -g
```

## Usage

```sh
$ cli-docs-generator --help
```

Help output:

```
Options:
  --version          Show version number  [boolean]
  -v, --verbose      Show details about the result of running command  [boolean] [default: true]
  -o, --output       Output file  [string] [default: "./README.md"]
  --cli              Path to executable file of the CLI for which documentation is generated (if --cli started with './', '../' or '/', you can specify --pretty_cli_name otherwise --cli will be interpreted as the executable from the $PATH environment variable, and --pretty_cli_name will be ignored)  [string] [required]
  --pretty_cli_name  A string that replaces the program name specified in --cli (this parameter will be ignored if the --cli value does not start with './', '../' or '/')  [string]
  -d, --description  CLI description  [string]
  -l, --license      License type  [string] [default: "MIT"]
  -h, --help         Show help  [boolean]

Examples:
  '$ cli-docs-generator --cli=githelp'                                    Generate markdown docs for 'githelp' CLI to the 'README.md' file
  '$ cli-docs-generator --cli=/path/to/cli.js --pretty_cli_name=my-cli'   Generate markdown docs for 'my-cli' CLI to the 'README.md' file
  '$ cli-docs-generator --cli=./path/to/cli.js --pretty_cli_name=my-cli'  Generate markdown docs for 'my-cli' CLI to the 'README.md' file
```

## License

MIT.