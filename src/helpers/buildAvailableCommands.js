module.exports = (cliName, availableCommands) => (availableCommands.length
  ? [
    '## Available commands',
    availableCommands.map(command => `* [${command.name}](#${command.name})`).join('\n'),
    ...availableCommands.map(command => [
      `### ${command.name}`,
      `\`\`\`sh\n$ ${cliName} ${command.name} --help\n\`\`\``,
      'Help output:',
      `\`\`\`\n${command.helpOutput}\`\`\``,
    ]).reduce((commands, command) => [...commands, ...command]),
  ]
  : []);
