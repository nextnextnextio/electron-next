import { ElectronOptions } from "./options";
import utils from "./utils";

export const electronNext = {
    async create(argv: any) {
        console.log("Running nextnextnext create!");
        
        try {
            let nextBuilder = {} as ElectronOptions;
            // check package.json
            console.log("Reading package.json");
            const pjson = await utils.getPackageJson(__dirname);

            // get distribution folder
            if (argv.dist) {
                nextBuilder.dist = argv.dist;
            }

            // get product version from argv or package.json
            const version = argv.productVersion || utils.extractPackageInfo(pjson, "version");
            if (version) {
                nextBuilder.version = version;
            }



            console.log(nextBuilder);

            // check and download next binaries from github releaes
            // run next-maker.exe
    
            return 0;
        } catch(error) {
            return 1;
        }
    }
}