export class Directory {
  children = [];
  type = "directory";
  name = ''
  _allSubDirs = new Set();

  constructor(name, parent, isRoot = false) {
    if (parent instanceof Directory) {
      //we utilize the prototype chain functionality to add the directory to the parent
      Object.setPrototypeOf(this, parent);
      //now we can use super keyword to address the parent
    } else if (parent !== null) {
      //we assume parent is null, when we create the root directory
      throw new Error('Parent must be a Directory or null');
    }
    this.name = name;
    this.isRoot = isRoot;
  }

  hasChild(name, type) {
    return this.children.some(child => child.name === name && child.type === type);
  }

  getChild(name, type) {
    return this.children.find(child => child.name === name && child.type === type);
  }

  getChildren(type) {
    return this.children.filter(child => child.type=== type);
  }

  getAllSubDirs() {
    if (this._allSubDirs.size === 0) {
      this._allSubDirs.add(this);
      for (const child of this.getChildren("directory")) {
        if (child.name.includes(".")) {
          console.log(child.name, child.constructor);
        }
        this._allSubDirs.add(child);
        for (const subDir of child.getAllSubDirs()) {
          if (subDir instanceof File) console.log("WTF")
          this._allSubDirs.add(subDir);
        }
      }
    }
    return this._allSubDirs;
  }

  addDirectory(name) {
    const directory = new Directory(name, this);
    this.children.push(directory);
    return directory;
  }

  addFile(name, size) {
    const file = new File(name, size, this);
    this.children.push(file);
    return file;
  }


  get path() {
    const parentPath = this.parent.path;
    return !parentPath ? "/" : `${parentPath.replace(/\/$/, "")}/${this.name}`;
  }

  get size() {
    return this.children.reduce((sum, child) => sum + child.size, 0);
  }

  get parent() {
    return Object.getPrototypeOf(this);
  }
}

export class File {
  name = ''
  type = "file";
  size = 0
  constructor(name, size, parent) {
    if (parent instanceof Directory) {
      Object.setPrototypeOf(this, parent);
    } else {
      throw new Error('Parent must be a Directory');
    }
    this.size = size;
    this.name = name;
  }

  get path() {
    const parentPath = this.parent.path || '';
    //console.log(parentPath)
    return `${parentPath}/${this.name}`;
  }

  get parent() {
    return Object.getPrototypeOf(this);
  }
}