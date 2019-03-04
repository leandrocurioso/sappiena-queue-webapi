const Path = require("path");
const FileSystem = require("fs");

class Utility {

    static getFilesRecursively(dir) {
       return FileSystem.readdirSync(dir)
        .reduce((files, file) =>
          FileSystem.statSync(Path.join(dir, file)).isDirectory() ?
            files.concat(Utility.getFilesRecursively(Path.join(dir, file))) :
            files.concat(Path.join(dir, file)),
        []);
    }

}

module.exports  = Utility;
