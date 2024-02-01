import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { getProcessArgument } from '../cli/args.js';

class FileManager {
  #cliAllowedCmds = [
    {
      name: '.exit',
      args: [],
      method: this.#rlClose.bind(this)
    }
  ];

  #username = '';

  #rl = null;

  constructor() { }

  // TODO: get username from os
  #welcomeUser() {
    if (!this.#username) {
      this.#username = getProcessArgument('username');
    }

    console.log(`Welcome to the File Manager, ${this.#username}!`);
  }

  #onRlLine(line) {
    const parsedLineArgs = line.split(' ');
    const userCmd = parsedLineArgs[0].trim().toLowerCase();

    const cliCmd = this.#cliAllowedCmds.find((cmd) => cmd.name === userCmd);

    if (cliCmd) {
      cliCmd.method();
    } else {
      console.log(`Unknown command: ${userCmd}`);
      this.#rl.prompt();
    }
  }

  #rlClose() {
    this.#rl.close();
  }

  #onRlClose() {
    console.log(`Thank you for using File Manager, ${this.#username}, goodbye!`);
  }

  start() {
    this.#welcomeUser();

    this.#rl = readline.createInterface({ input, output });

    this.#rl.on('line', (line) => this.#onRlLine(line));

    this.#rl.on('close', () => this.#onRlClose());

    this.#rl.prompt();
  };
}

export default FileManager;