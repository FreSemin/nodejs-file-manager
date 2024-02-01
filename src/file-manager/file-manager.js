import { getProcessArgument } from '../cli/args.js';

class FileManager {

  #username = '';

  constructor() {

  }

  // TODO: get username from os
  #welcomeUser() {
    if (!this.#username) {
      this.#username = getProcessArgument('username');
    }

    console.log(`Welcome to the File Manager, ${this.#username}!`);
  }

  start() {
    this.#welcomeUser();
  };
}

export default FileManager;