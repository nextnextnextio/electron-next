import path from "path";
import fs from "fs-extra";
import logger from "./log";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export default {
    async getPackageJson(dir?: string) {
        const d = path.join(dir || __dirname, "package.json");
        try {
            const result = await fs.readJSON(d);
            if (Object.entries(result).length > 0) {
                return result;
            } else {
                throw new Error("Empty package.json: " + d + "!");
            }
        } catch (error: any) {
            console.error(error.message);
            throw error;
        }
    },

    extractPackageInfo(pjson: any, key: string) {
        if (Object.prototype.hasOwnProperty.call(pjson, key)) {
            return pjson[key]
        }
    },

    parseArgs(args: string[]) {
        return yargs(args)
            .option("dist", {
                describe: "Folder that contains the packaged electron application"
            })
            .option("product-version", {
                describe: "Version of your application"
            })
            .help()
            .parse()
    }
}

// path.resolve(process.cwd(), opts.dir) || process.cwd()

/*  normalizePath: function normalizePath (pathToNormalize) {
    return pathToNormalize.replace(/\\/g, '/')
  }, */

/* hostInfo: function hostInfo () {
    return `Electron Packager ${metadata.version}\n` +
      `Node ${process.version}\n` +
      `Host Operating system: ${process.platform} ${os.release()} (${process.arch})`
  }, */