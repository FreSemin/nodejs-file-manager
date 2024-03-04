# NodeJS CLI File Manager

## Description

Task was implemented according to RS School Node.js Course (2024).

Link to Original [task assigment](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/file-manager/assignment.md).

### Start App

Requirements:

- Node.js version: 20 or higher

Start of application, run the following command:

```
npm run start -- --username=your_username
```

### Details

- If path/name marked with `*` (in "Usage section") it means it's can be relative or absolute.
- Next symbols allowed to use to specify your path `-\.`;
- Path that contains spaces in names can be accessed using `"your path here"`;
- Allowed Paths Examples:

```
C:\users\admin
D:\file-manager\cli-args\file.txt
"D:\path with spaces\file.txt"
\src\text.txt
.\
```

### Usage

After application started your are available to proceed next commands:

- `.exit` or `ctrl + C` Use to exit from the application;

  ```
  .exit
  ```

- `up` Use to go upper from current directory;

  ```
  up
  ```

- `cd` Go to dedicated folder from current;

  ```
  cd path_to_directory*
  ```

- `ls` Print in console list of all files and folders in current directory;

  ```
  ls
  ```

Files

- `cat` Read file and print it's content in console;

  ```
  cat path_to_file*
  ```

- `add` Create empty file in current working directory;

  ```
  add new_file_name (file name or relative path)
  ```

- `rn` Rename file;

  ```
  rn path_to_file* new_filename
  ```

- `cp` Copy file;

  ```
  cp path_to_file* path_to_new_directory*
  ```

- `mv` Move file;

  ```
  mv path_to_file* path_to_new_directory*
  ```

- `rm` Delete file;

  ```
  rm path_to_file*
  ```

OS

- `os` Get EOL (default system End-Of-Line) and print it to console;

  ```
  os --EOL
  ```

- `os` Get host machine CPUs info (overall amount of CPUS plus model and clock rate (in GHz) for each of them);

  ```
  os --cpus
  ```

- `os` Get home directory and print it to console;

  ```
  os --homedir
  ```

- `os` Get current system user name;

  ```
  os --username
  ```

- `os` Get CPU architecture for which Node.js binary has compiled;

  ```
  os --architecture
  ```

Hash

- Calculate hash for file and print it into console

  ```
  hash path_to_file*
  ```

Compress and decompress operations

- `compress` Compress file using Brotli algorithm;

  ```
  compress path_to_file* path_to_destination*
  ```

- `decompress` Decompress file using Brotli algorithm;

  ```
  decompress path_to_file* path_to_destination*
  ```
