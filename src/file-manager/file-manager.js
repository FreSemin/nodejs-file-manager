import * as readline from 'node:readline/promises';
import path from 'node:path';
import { stdin as input, stdout as output } from 'node:process';
import { access } from 'node:fs/promises';
import { getProcessArgument } from '../cli/args.js';
import { getPathDirName } from '../utils/path.util.js';
import { getUserHomeDir } from '../os/os.js';


class FileManager {
  #cliAllowedCmds = [
    {
      name: 'cd',
      args: [],
      method: this.#changeDir
    },
    {
      name: 'up',
      args: [],
      method: this.#dirUp,
    },
    {
      name: '.exit',
      args: [],
      method: this.#rlClose,
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

  async #dirUp() {
    const upperDir = getPathDirName(this.#currentWorkDir);

    await access(upperDir)
      .catch(() => {
        this.#currentWorkDir = getUserHomeDir();

        throw new Error('Operation Failed');
      });

    this.#currentWorkDir = upperDir;
  }

  // TODO: add check for quotes '' in path start and in the end
  async #changeDir([destinationPath, ...args]) {
    const normalizedDestinationPath = path.normalize(destinationPath);

    const relativePath = path.join(this.#currentWorkDir, normalizedDestinationPath);

    try {
      await access(relativePath);
      this.#currentWorkDir = relativePath;
    } catch {
      try {
        const absolutePath = path.join(normalizedDestinationPath);

        await access(absolutePath);

        this.#currentWorkDir = absolutePath;
      } catch {
        throw new Error('Operation Failed');
      }
    }
  }

  #logCurrentWorkDir() {
    console.log(`You are currently in ${this.#currentWorkDir}`);
  };

  async #onRlLine(line) {
    try {
      const [cmd, ...parsedLineArgs] = line.split(' ');
      const userCmd = cmd.trim().toLowerCase();

      const cliCmd = this.#cliAllowedCmds.find((cmd) => cmd.name === userCmd);

      if (cliCmd) {
        this.#rl.pause();

        await cliCmd.method.call(this, parsedLineArgs);

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