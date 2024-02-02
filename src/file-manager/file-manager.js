import * as readline from 'node:readline/promises';
import path from 'node:path';
import { stdin as input, stdout as output } from 'node:process';
import { access } from 'node:fs/promises';
import { getProcessArgument } from '../cli/args.js';
import { getUpDirPath, fixDestinationPathWindows } from '../utils/path.util.js';
import { getUserHomeDir } from '../os/os.js';
import { ROOT_DIR, PATH_UP, ERROR_OPERATION_FAIL_TEXT } from '../constants/constants.js';
import OperationFailed from '../utils/operation-fail.error.js';

class FileManager {
  #cliAllowedCmds = [
    {
      name: 'cd',
      method: this.#changeDir
    },
    {
      name: 'up',
      method: this.#dirUp,
    },
    {
      name: '.exit',
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
    const upDirPath = getUpDirPath(this.#currentWorkDir);

    await access(upDirPath)
      .catch(() => {
        this.#currentWorkDir = getUserHomeDir();

        throw new Error('Operation Failed');
      });

    this.#currentWorkDir = upDirPath;
  }

  // TODO: add check for quotes '' in path start and in the end
  async #changeDir([destinationPath]) {
    const normalizedDestinationPath = path.normalize(destinationPath);

    // Fix: Windows going up (..\..\..\) path bug
    // Use next var if you faced with problems on your platform
    // let fixedDestinationPath = normalizedDestinationPath;

    let fixedDestinationPath = fixDestinationPathWindows(normalizedDestinationPath);

    let relativePath = path.join(this.#currentWorkDir, fixedDestinationPath);

    const parsedPath = path.parse(relativePath);

    // Fix path to go root ('/') on windows
    if (this.#currentWorkDir === relativePath && destinationPath === PATH_UP) {
      relativePath = path.normalize(ROOT_DIR);
    }

    // Fix path when going upper from root
    if (parsedPath.root === parsedPath.dir && parsedPath.base === PATH_UP) {
      relativePath = path.normalize(ROOT_DIR);
    }

    try {
      await access(relativePath);
      this.#currentWorkDir = relativePath;
    } catch {
      try {
        const absolutePath = path.join(fixedDestinationPath);

        await access(absolutePath);

        this.#currentWorkDir = absolutePath;
      } catch {
        throw new OperationFailed();
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
      console.log(ERROR_OPERATION_FAIL_TEXT);

      this.#logCurrentWorkDir();

      this.#rl.prompt();
    }
  }

  #rlClose() {
    this.#rl.close();
  }

  #onRlClose() {
    console.log(`Thank you for using File Manager, ${this.#username}, goodbye!`);

    process.exit(1);
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