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

            // read the rest of the usefull fields od pjson


            // search for nextnexntnext.config.js
            console.log("Searching for nextnextnex.config.js");
            const configPath = utils.searchNextConfig(argv.root, argv.config);
            if (configPath != undefined) {
                const configData = await utils.readNextConfig(configPath);                
                nextBuilder = {...nextBuilder, ...configData};                
            }
   
            // search for next env varaibles
            // NNNEXT_VERSION, NNNEXT_OUT, NNNEXT_??

            // check and download next binaries from github releases
            const makerVersion = utils.getBinaryVersionString();
            const platform = utils.convertPlatform(process.platform);
            const arch = utils.convertArch(process.arch);

            const name = `next-maker-${platform}-${arch}`;
            const url = `https://github.com/nextnextnextio/next-maker/releases/download/${makerVersion}/${name}`
            utils.downloadMaker(url, name);

            console.log("Using config:", nextBuilder);

            console.log("Starting to create insaller...");
            if (nextBuilder?.hooks?.pre) {
                await nextBuilder.hooks.pre();
            }

            // run next-maker.exe

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