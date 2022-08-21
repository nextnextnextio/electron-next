import { ElectronOptions } from "./options";
import utils from "./utils";
import path from "path";
import { exec } from "child_process";

export const electronNext = {
    async create(argv: any) {
        console.log("Running nextnextnext install maker!");

        try {
            let nextBuilder = {} as ElectronOptions;

            // search for package.json
            console.log("Searching for package.json");
            const packagePath = utils.searchPackageJson(argv.root, argv.config);
    
            // read package.json
            console.log("Reading info from package.json");
            const pjson = await utils.readPackageJson(packagePath);
    
            // get distribution folder
            if (argv.dist) {
                nextBuilder.dist = argv.dist;
            }
    
            // 1. ARGV & PACKAGE.JSON
            // get all the info from argv or package.json

            const name = argv.name || utils.extractPackageInfo(pjson, "name");
            if (name) {
                nextBuilder.name = name;
            }

            const author = argv.author || utils.extractPackageInfo(pjson, "author");
            if (author) {
                nextBuilder.author = author;
            }

            const version = argv.productVersion || utils.extractPackageInfo(pjson, "version");
            if (version) {
                nextBuilder.version = version;
            }

            const description = argv.description || utils.extractPackageInfo(pjson, "description");
            if (description) {
                nextBuilder.description = description;
            }

            // 2. NEXTNEXTNEXT.CONFIG.JS
            // search for nextnexntnext.config.js

            console.log("Searching for nextnextnex.config.js");
            const configPath = utils.searchNextConfig(argv.root, argv.config);
            if (configPath != undefined) {
                const configData = await utils.readNextConfig(configPath);                
                nextBuilder = {...nextBuilder, ...configData};                
            }
   
            // 3. ENVIRONMENT VARIABLES
            // search for next env varaibles

            // NEXXXT_CONFIG,
            // NEXXXT_VERSION,
            // NEXXXT_CERT_PASS,
            // NEXXXT_CERT_FILE,
            // NEXXXT_OUT,
            // NEXXXT_CACHE,

            console.log("Using config:", nextBuilder);

            ///////////////////

            // check and download next binaries from github releases
            console.log("Checking next-maker binary");
            const maker = utils.getMakerReleaseInfo();
            console.debug(maker);

            // if maker doesn't exists then download it
            if (!utils.checkMakerBinary(maker)) {
                await utils.downloadMakerBinary(maker);
            }

            // create temp config file inside cache dir
            const TEMP = utils.getTempPath(maker);
            await utils.createTempFile(path.join(TEMP, "config.json"), nextBuilder);

            console.log("Starting to create installer...");
            if (nextBuilder?.hooks?.pre) {
                await nextBuilder.hooks.pre();
            }

            // run next-maker.exe
            console.log("execute", path.join(TEMP, maker.name));
            // exec([path.join(TEMP, maker.name), "--config", path.join(TEMP, "config.json")].join(" "));

            if (nextBuilder?.hooks?.post) {
                await nextBuilder.hooks.post();
            }
    
            return 0;
        } catch(error: any) {            
            console.error(error?.message || error);
            return 1;
        }
    }
}