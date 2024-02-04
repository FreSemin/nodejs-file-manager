import * as readline from 'node:readline/promises';
import path from 'node:path';
import { stdin as input, stdout as output } from 'node:process';
import { access } from 'node:fs/promises';
import { getProcessArgument } from '../cli/args.js';
import { getDirItems, logFileContent } from '../fs/fs.js';
import {
  getUpDirPath,
  fixDestinationPathWindows,
  parseLineArgs,
  getRelativeOrAbsoluteDestinationPath
} from '../utils/path.util.js';
import { getUserHomeDir } from '../os/os.js';
import {
  ERROR_OPERATION_FAIL_TEXT,
  USERNAME_ARG
} from '../constants/constants.js';
import { OperationFailedError, InvalidInputError } from '../utils/errors.util.js';

class FileManager {
  #cliCmds = [
    {
      name: 'ls',
      method: this.#lsDir,
    },
    {
      name: 'cd',
      method: this.#changeDir
    },
    {
      name: 'up',
      method: this.#dirUp,
    },
    {
      name: 'cat',
      method: this.#cat,
    },
    {
      name: '.exit',
      method: this.#rlClose,
    }
  ];

  #username = '';
  #currentWorkDirPath = '';

  #rl = null;

  constructor() {
    this.#currentWorkDirPath = getUserHomeDir();
  }

  // TODO: get username from os
  #welcomeUser() {
    if (!this.#username) {
      this.#username = getProcessArgument(USERNAME_ARG);
    }

    console.log(`Welcome to the File Manager, ${this.#username}!`);
  }

  async #lsDir() {
    const dirContent = await getDirItems(this.#currentWorkDirPath);

    console.table(dirContent);
  }

  async #dirUp() {
    const upDirPath = getUpDirPath(this.#currentWorkDirPath);

    await access(upDirPath)
      .catch(() => {
        this.#currentWorkDirPath = getUserHomeDir();

        throw new OperationFailedError();
      });

    this.#currentWorkDirPath = upDirPath;
  }

  async #changeDir([destinationPath]) {
    const normalizedDestinationPath = path.normalize(destinationPath);

    // Fix: Windows going up (..\..\..\) path bug
    // Use next variable if you faced with problems on your platform
    // let fixedDestinationPath = normalizedDestinationPath;
    let fixedDestinationPath = fixDestinationPathWindows(normalizedDestinationPath);

    let relativePath = path.normalize(path.join(this.#currentWorkDirPath, fixedDestinationPath));

    try {
      await access(relativePath);
      this.#currentWorkDirPath = relativePath;
    } catch {
      try {
        const absolutePath = path.normalize(path.join(fixedDestinationPath));

        await access(absolutePath);

        this.#currentWorkDirPath = absolutePath;
      } catch {
        throw new OperationFailedError();
      }
    }
  }

  async #cat([filePath]) {
    const normalizedFilePath = await getRelativeOrAbsoluteDestinationPath(this.#currentWorkDirPath, filePath);

    await logFileContent(normalizedFilePath);
  }

  #logCurrentWorkDirPath() {
    console.log(`You are currently in ${this.#currentWorkDirPath}`);
  };

  async #onRlLine(line) {
    try {
      const lineArgs = parseLineArgs(line);

      const [userCmd, ...userArgs] = lineArgs;

      const cliCmd = this.#cliCmds.find((cmd) => cmd.name === userCmd);

      if (cliCmd) {
        this.#rl.pause();

        await cliCmd.method.call(this, userArgs);

        this.#logCurrentWorkDirPath();

        this.#rl.prompt();
      } else {
        throw new InvalidInputError();
      }
    } catch (error) {
      switch (true) {
        case error instanceof OperationFailedError:
          console.log(error.message);
          break;
        case error instanceof InvalidInputError:
          console.log(error.message);
          break;
        default:
          console.log(ERROR_OPERATION_FAIL_TEXT);
      }

      this.#logCurrentWorkDirPath();

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

    this.#logCurrentWorkDirPath();

    this.#rl.prompt();
  };
}

export default FileManager;