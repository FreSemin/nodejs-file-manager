import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { getProcessArgument } from '../cli/args.js';

class FileManager {
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
  #rlClose() {
    this.#rl.close();
  }

  #onRlClose() {
    console.log(`Thank you for using File Manager, ${this.#username}, goodbye!`);
  }

  start() {
    this.#welcomeUser();

    this.#rl = readline.createInterface({ input, output });

    this.#rl.on('close', () => this.#onRlClose());
  };
}

export default FileManager;