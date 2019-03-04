const Express = require("express");
const Utility = require("../../infrastructure/utility");
const FileSystem = require("fs");
const Chalk = require("chalk");

class ControllerRegister {

    constructor(configuration, router = Express.Router()) {
        this.configuration = configuration;
        this.router = router;
    }

    autoload(basePath) {
        let totalRoutes = 0;
        let totalControllers = 0;
        const filepaths = Utility.getFilesRecursively(basePath);
        const filteredFilepaths = filepaths.filter(file => file.substring(file.length - 13) === "controller.js")
        const toBeLoadedBundles = [];
        let preBundles = [];
        filteredFilepaths.forEach(filepath => {
            preBundles = [];
            const contentLines = FileSystem.readFileSync(filepath, "utf8").split("\n");
            contentLines.forEach((line, index) => {
                const trimedline = line.trim();
                if (trimedline.substring(0, 3) === "//>") {
                    const trimedMethod = contentLines[index + 1].replace("async", String.empty).trim();
                    const replacedTrimedLine = trimedline.replace("//>", String.empty).trim();
                    const firstOccur = replacedTrimedLine.indexOf("(");
                    preBundles.push({
                        httpVerb: replacedTrimedLine.substring(0, firstOccur).trim(),
                        baseUri: replacedTrimedLine.substring((firstOccur + 1), (replacedTrimedLine.length - 1)).trim(),
                        method: trimedMethod.substring(0, trimedMethod.indexOf("(")).trim()
                    });
                }
            });
            toBeLoadedBundles.push({ filepath, preBundles });
        });

        toBeLoadedBundles.forEach(bundle => {
            const _class = require(bundle.filepath);
            const instance = new _class(this.configuration);
            if (!bundle.preBundles.length) return;
            totalControllers += 1;
            console.log(Chalk.greenBright(`\nAuto registering routes for: ${instance.constructor.name}`));
            bundle.preBundles.forEach(preBundle => {
                console.log(Chalk.blueBright(`=> Route: ${preBundle.httpVerb} ${_class.baseUri}${((preBundle.baseUri !== "/") ? preBundle.baseUri : String.empty)}`));
                totalRoutes += 1;
                return this.router.use(_class.baseUri, instance.registerRoute(preBundle));
            });
        });
        console.log(Chalk.yellowBright(`\nTotal of loaded controllers: ${totalControllers}\nTotal of loaded routes: ${totalRoutes}\n`));
        return this.router;
    }

}

module.exports = ControllerRegister;
