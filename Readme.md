# FileSystem Documentation

## Constructor

### `constructor()`

Initializes the file system with a root directory.

## Directory Operations

### `mkdir(name: string): void`

Creates a new directory.

- **Parameters:**
  - `name` (string): The name of the new directory.

- **Time Complexity:** O(1)

### `cd(path: string): void`

Changes the current working directory.

- **Parameters:**
  - `path` (string): The path to navigate to.

- **Time Complexity:** O(d), where d is the depth of the target directory.

### `ls(path?: string): void`

Lists the contents of a directory.

- **Parameters:**
  - `path` (string, optional): The path of the directory (defaults to the current directory).

- **Time Complexity:** O(1)

## File Operations

### `grep(pattern: string, filePath: string): void`

Searches for a specified pattern in a file.

- **Parameters:**
  - `pattern` (string): The pattern to search for.
  - `filePath` (string): The path of the file.

- **Time Complexity:** O(n), where n is the length of the file content.

### `cat(filePath: string): void`

Displays the contents of a file.

- **Parameters:**
  - `filePath` (string): The path of the file.

- **Time Complexity:** O(1)

### `touch(fileName: string): void`

Creates a new empty file.

- **Parameters:**
  - `fileName` (string): The name of the new file.

- **Time Complexity:** O(1)

### `echo(command: string): void`

Writes text to a file.

- **Parameters:**
  - `command` (string): The full command containing text and file path.

- **Time Complexity:** O(1)

### `mv(sourcePath: string, destinationPath: string): void`

Moves a file or directory to another location.

- **Parameters:**
  - `sourcePath` (string): The path of the source file or directory.
  - `destinationPath` (string): The path of the destination directory.

- **Time Complexity:** O(1)

### `cp(sourcePath: string, destinationPath: string): void`

Copies a file or directory to another location.

- **Parameters:**
  - `sourcePath` (string): The path of the source file or directory.
  - `destinationPath` (string): The path of the destination directory.

- **Time Complexity:** O(1)

### `rm(path: string): void`

Removes a file or directory.

- **Parameters:**
  - `path` (string): The path of the file or directory to remove.

- **Time Complexity:** O(1)

## File System State Operations

### `saveToFile(filePath?: string): void`

Saves the current file system state to a file.

- **Parameters:**
  - `filePath` (string, optional): The path to save the file system state (defaults to 'filesystem.json').

- **Time Complexity:** O(n), where n is the size of the file system.

### `loadFromFile(filePath?: string): void`

Loads the file system state from a file.

- **Parameters:**
  - `filePath` (string, optional): The path to load the file system state (defaults to 'filesystem.json').

- **Time Complexity:** O(n), where n is the size of the loaded file system.

### `restoreParentReferences(node: Object, parent: Object): Object`

Restores parent references in the loaded file system data.

- **Parameters:**
  - `node` (Object): The current node in the loaded file system data.
  - `parent` (Object): The parent node.

- **Returns:**
  - `restoredNode` (Object): The restored node.

- **Time Complexity:** O(n), where n is the size of the node.

## User Interface

### `prompt(): void`

Prompts the user for commands in the current working directory.

- **Time Complexity:** O(1)

### `executeCommand(command: string): void`

Executes a command provided by the user.

- **Parameters:**
  - `command` (string): The command to execute.

- **Time Complexity:** Depends on the specific command.


## How to run application via Docker
  - Step 1: Install docker if you don't have it: [Docker](https://www.docker.com/get-started)

  - Step 2: Clone the git repo using the git clone command : 
            git clone <repo-https> url

  - Step 3: Build the docker image for the project using command : 
            docker build -t container-name
  
  - Step 4: Run the docker container: 
            docker run -it container-name

## How to run application via Node.js script
  - Step 1: Install Node.js if you don't have it: [Node.js](https://nodejs.org/en)

  - Step 2: Clone the git repo using the git clone command : 
            git clone <repo-https> url

  - Step 3: Install all needed dependencies for the project using command : 
            npm install

  - Step 4: Run the application using command : 
            npm start

