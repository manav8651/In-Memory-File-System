#!/usr/bin/env node

const { program } = require('commander');

const FileSystem=require('./filesystem');



const fileSystem = new FileSystem();


program
    .version('1.0.0')
    .description('In-memory file system CLI tool');

program.command('start')
program.command('mkdir <name>').action((name) => fileSystem.mkdir(name));
program.command('cd <path>').action((path) => fileSystem.cd(path));
program.command('ls [path]').action((path) => fileSystem.ls(path));
program.command('grep <pattern> <filePath>').action((pattern, filePath) => fileSystem.grep(pattern, filePath));
program.command('cat <filePath>').action((filePath) => fileSystem.cat(filePath));
program.command('touch <fileName>').action((fileName) => fileSystem.touch(fileName));
program.command('echo <text> > <filePath>').action((text, filePath) => fileSystem.echo(text, filePath));
program.command('mv <sourcePath> <destinationPath>').action((sourcePath, destinationPath) => fileSystem.mv(sourcePath, destinationPath));
program.command('cp <sourcePath> <destinationPath>').action((sourcePath, destinationPath) => fileSystem.cp(sourcePath, destinationPath));
program.command('save [filePath]').action((filePath) => fileSystem.saveToFile(filePath));
program.command('load [filePath]').action((filePath) => fileSystem.loadFromFile(filePath));
program.command('rm <path>').action((path) => fileSystem.rm(path));
program.command('exit').action(() => {
    rl.close();
    process.exit();
});

program.parse(process.argv);

console.log('Welcome to the in-memory file system. Type "exit" to quit.');
fileSystem.prompt();
