import { Directory, File} from "./classes.js";
import { promises as fs } from "fs";

const rawData = await fs.readFile("./data.txt", "utf-8");
const lines = rawData.split("\n");

const rootDirectory = new Directory("", null, true);


let currentDirectory = rootDirectory;

for (const line of lines) {
  const tokens = line.split(/\s+/g);
  const type = tokens[0];

  switch (type) {
    case "$":
      const command = tokens[1];
      //ls command can be ignored
      switch (command) {
        case "cd":
          const directoryName = tokens[2];
          if (directoryName === "..") {
            currentDirectory = currentDirectory.parent;
          } else if (directoryName === "/") {
            currentDirectory = rootDirectory;
          } else {
            const directory = currentDirectory.getChild(directoryName, "directory");
            if (directory) {
              currentDirectory = directory;
            } else {
              console.error("No such directory");
            }
          }
      }
      break;

    case "dir":
      const dirname = tokens[1];
      if (!currentDirectory.hasChild(dirname, "directory"))  {
        currentDirectory.addDirectory(dirname);
      }
      break;

    default:
      const filename = tokens[1];
      const size = Number(tokens[0]);
      if (!currentDirectory.hasChild(filename, File)) {
        currentDirectory.addFile(filename, size);
      }
      break;
  }
}

const allSubDirs = Array.from(rootDirectory.getAllSubDirs());

const smallSubDirs = allSubDirs.filter(dir => dir.size <= 100000);

const smallSubDirsTotalSize = smallSubDirs.reduce((sum, dir) => sum + dir.size, 0);

console.log(`Task 1: ${smallSubDirsTotalSize}`);


const requiredSize = 30000000 - (70000000 - rootDirectory.size);
const subdirs2 = allSubDirs.filter(dir => dir.size >= requiredSize).sort((a, b) => a.size - b.size);

console.log(`Task 2: ${subdirs2[0].size}`);

