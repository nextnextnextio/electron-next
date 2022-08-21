import { ElectronOptions } from "./options";
import utils from "./utils";

export const electronNext = {
    async create(argv: any) {
        console.log("Running nextnextnext install maker!");
        utils.info();

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
    
            // get product version from argv or package.json
            const version = argv.productVersion || utils.extractPackageInfo(pjson, "version");
            if (version) {
                nextBuilder.version = version;
            }

            // read the rest of the usefull fields of pjson


            // search for nextnexntnext.config.js
            console.log("Searching for nextnextnex.config.js");
            const configPath = utils.searchNextConfig(argv.root, argv.config);
            if (configPath != undefined) {
                const configData = await utils.readNextConfig(configPath);                
                nextBuilder = {...nextBuilder, ...configData};                
            }
   
            // search for next env varaibles
            // NNNEXT_VERSION, NNNEXT_OUT, NNNEXT_CACHE NNNEXT_??

            // check and download next binaries from github releases
            console.log("Checking next-maker binary");
            const releaseData = utils.getMakerReleaseInfo();
            console.debug(releaseData);

            // if maker doesn't exists then download it
            if (!utils.checkMakerBinary(releaseData)) {
                await utils.downloadMakerBinary(releaseData);
            }

            console.log("Using config:", nextBuilder);

            console.log("Starting to create insaller...");
            if (nextBuilder?.hooks?.pre) {
                await nextBuilder.hooks.pre();
            }

            // run next-maker.exe
            console.log("execute", utils.getMakerBinaryPath(releaseData))

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