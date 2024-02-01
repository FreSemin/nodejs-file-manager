import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { getProcessArgument } from '../cli/args.js';
import { getUserHomeDir } from '../os/os.js';

class FileManager {
  #cliAllowedCmds = [
    {
      name: '.exit',
      args: [],
      method: this.#rlClose.bind(this)
    }
  ];

  #username = '';
  #currentWorkDir = '';

  #rl = null;

  constructor() {
    this.#currentWorkDir = getUserHomeDir();
  }

  // TODO: get username from os
  #welcomeUser() {
    if (!this.#username) {
      this.#username = getProcessArgument('username');
    }

    console.log(`Welcome to the File Manager, ${this.#username}!`);
  }

  #logCurrentWorkDir() {
    console.log(`You are currently in ${this.#currentWorkDir}`);
  };

  async #onRlLine(line) {
    try {

    const parsedLineArgs = line.split(' ');
    const userCmd = parsedLineArgs[0].trim().toLowerCase();

    const cliCmd = this.#cliAllowedCmds.find((cmd) => cmd.name === userCmd);

    if (cliCmd) {
        this.#rl.pause();

        await cliCmd.method.call(this);

      this.#logCurrentWorkDir();

        this.#rl.prompt();
    } else {
      console.log(`Unknown command: ${userCmd}`);

        this.#logCurrentWorkDir();

        this.#rl.prompt();
      }
    } catch {
      console.log('Operation Failed');

      this.#logCurrentWorkDir();

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

    this.#logCurrentWorkDir();

    this.#rl.prompt();
  };
}

export default FileManager;