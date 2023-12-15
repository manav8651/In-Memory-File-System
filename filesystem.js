const fs = require('fs')
const readLine = require('readline');

const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout,
});

class FileSystem {
    constructor() {
        this.root = { name: '/', type: 'directory', content: {}, parent: null };
        this.currentDir = this.root;
    }

    mkdir(name) {
        const newDir = { name, type: 'directory', content: {}, parent: this.currentDir };
        this.currentDir.content[name] = newDir;
    }

    cd(path) {
        if (path === '/') {
            this.currentDir = this.root;
        } else if (path === '..') {
            this.currentDir = this.currentDir.parent || this.root;
        } else if (path.startsWith('/')) {
            this.navigateToAbsolutePath(path);
        } else {
            const newPath = path.split('/');
            this.navigateToRelativePath(newPath);
        }
    }

    ls(path) {
        const targetDir = this.resolvePath(path || '');
        if (targetDir && targetDir.type === 'directory') {
            console.log(Object.keys(targetDir.content).join(' '));
        } else {
            console.log('Invalid path or not a directory.');
        }
    }

    grep(pattern, filePath) {
        const fileContent = this.readFile(filePath);
        if (fileContent) {
            const regex = new RegExp(pattern, 'g');
            const matches = fileContent.match(regex);
            console.log(matches ? matches.join('\n') : 'Pattern not found.');
        } else {
            console.log('Invalid file path or file does not exist.');
        }
    }

    cat(filePath) {
        const fileContent = this.readFile(filePath);
        if (fileContent) {
            console.log(fileContent);
        } else {
            console.log('Invalid file path or file does not exist.');
        }
    }

    touch(fileName) {
        this.currentDir.content[fileName] = { name: fileName, type: 'file', content: '' };
    }

    echo(command) {
        const [text, filePath] = command.split(/\s*>\s*/);

        const file = this.resolvePath(filePath);
        const newtext = text.slice(5, text.length)

        if (file && file.type === 'file') {
            file.content = newtext;
        } else {
            console.log('Invalid file path or file does not exist.');
        }
    }

    mv(sourcePath, destinationPath) {
        const sourceFile = this.resolvePath(sourcePath);
        const destinationDir = this.resolvePath(destinationPath);

        // console.log(sourcePath, destinationPath)
    
        if (sourceFile && destinationDir && destinationDir.type === 'directory') {
            const fileName = sourceFile.name;
            delete sourceFile.parent.content[fileName];
            destinationDir.content[fileName] = sourceFile;
            sourceFile.parent = destinationDir;
        } else {
            console.log('Invalid source or destination path.');
        }
    }    

    cp(sourcePath, destinationPath) {
        const sourceFile = this.resolvePath(sourcePath);
        const destinationDir = this.resolvePath(destinationPath);

        if (sourceFile && destinationDir && destinationDir.type === 'directory') {
            const fileName = sourceFile.name;
            const copy = JSON.parse(JSON.stringify(sourceFile));
            copy.parent = destinationDir;
            destinationDir.content[fileName] = copy;
        } else {
            console.log('Invalid source or destination path.');
        }
    }

    rm(path) {
        const target = this.resolvePath(path);

        if (target) {
            if (target.type === 'directory') {
                this.deleteDirectory(target);
            } else {
                delete target.parent.content[target.name];
            }
        } else {
            console.log('Invalid path or file/directory does not exist.');
        }
    }

    deleteDirectory(directory) {
        Object.values(directory.content).forEach((item) => {
            if (item.type === 'directory') {
                this.deleteDirectory(item);
            } else {
                delete directory.content[item.name];
            }
        });

        delete directory.parent.content[directory.name];
    }

    resolvePath(path) {
        const pathSegments = path.split('/').filter((segment) => segment !== '');
        let currentDir = this.currentDir;

        for (const segment of pathSegments) {
            if (currentDir.content.hasOwnProperty(segment)) {
                currentDir = currentDir.content[segment];
            } else {
                return null;
            }
        }

        return currentDir;
    }

    navigateToAbsolutePath(path) {
        const absolutePath = path.split('/');
        const stack = [];

        for (const segment of absolutePath) {
            if (segment === '..') {
                stack.pop();
            } else {
                stack.push(segment);
            }
        }

        this.currentDir = this.root;
        while (stack.length > 0) {
            const segment = stack.shift();
            if (this.currentDir.content.hasOwnProperty(segment)) {
                this.currentDir = this.currentDir.content[segment];
            } else {
                console.log('Invalid absolute path.');
                return;
            }
        }
    }

    navigateToRelativePath(pathSegments) {
        for (const segment of pathSegments) {
            if (segment === '..') {
                this.currentDir = this.currentDir.parent || this.root;
            } else {
                if (this.currentDir.content.hasOwnProperty(segment)) {
                    this.currentDir = this.currentDir.content[segment];
                } else {
                    console.log('Invalid relative path.');
                    return;
                }
            }
        }
    }

    readFile(filePath) {
        const file = this.resolvePath(filePath);
        return file && file.type === 'file' ? file.content : null;
    }

    prompt() {
        rl.question(`\n[${this.currentDir.name}] $ `, (command) => {
            this.executeCommand(command);
            this.prompt();
        });
    }

    saveToFile(filePath) {
        const data = JSON.stringify(this.root, (key, value) => {
            // Handle circular references by replacing them with null
            if (key === 'parent') {
                return null;
            }
            return value;
        }, 2);
        fs.writeFileSync(filePath, data);
        console.log(`File system state saved to ${filePath}.`);
    }
    
    loadFromFile(filePath) {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            const jsonData = JSON.parse(data);
            this.root = this.restoreParentReferences(jsonData, null);
            this.currentDir = this.root;
            console.log('File system loaded successfully.');
        } catch (error) {
            console.error('Error loading file system:', error.message);
        }
    }

    restoreParentReferences(node, parent) {
        if (!node) {
            return null;
        }

        if (node.type === 'directory') {
            const restoredDir = {
                ...node,
                parent: parent,
                content: {},
            };

            for (const [name, child] of Object.entries(node.content)) {
                restoredDir.content[name] = this.restoreParentReferences(child, restoredDir);
            }

            return restoredDir;
        } else {

            return {
                ...node,
                parent: parent,
            };
        }
    }
    

    executeCommand(command) {
        const [action, ...args] = command.split(' ');

        switch (action) {
            case 'mkdir':
                this.mkdir(...args);
                break;
            case 'cd':
                this.cd(...args);
                break;
            case 'ls':
                this.ls(...args);
                break;
            case 'grep':
                this.grep(...args);
                break;
            case 'cat':
                this.cat(...args);
                break;
            case 'touch':
                this.touch(...args);
                break;
            case 'echo':
                this.echo(command);
                break;
            case 'mv':
                this.mv(...args);
                break;
            case 'cp':
                this.cp(...args);
                break;
            case 'rm':
                this.rm(...args);
                break;
            case 'save':
                this.saveToFile(args[0] || 'filesystem.json');
                break;
        
            case 'load':
                this.loadFromFile(args[0] || 'filesystem.json');
                break;
            case 'exit':
                rl.close();
                process.exit();
                break;
            default:
                console.log('Invalid command.');
        }
    }
}

module.exports=FileSystem;