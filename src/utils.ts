import path from "path";
import fs, { createWriteStream } from "fs-extra";
import yargs from "yargs";
import axios from "axios";
import { version } from "../package.json";
import { major, minor } from "semver";

export default {
  async readPackageJson(dir: string) {
    try {
      const result = await fs.readJSON(dir);
      if (Object.entries(result).length > 0) {
        return result;
      } else {
        throw new Error("Empty package.json: " + dir + "!");
      }
    } catch (error: any) {
      throw error;
    }
  },

  searchPackageJson(
    root: string | undefined,
    config: string | undefined,
  ): string {
    const defaultDir = path.join(process.cwd(), "package.json");
    if (fs.existsSync(path.join(process.cwd(), "package.json"))) {
      console.debug("Found:", defaultDir);
      return defaultDir;
    }

    if (root != undefined) {
      const rootDir = path.join(root, "package.json");
      if (fs.existsSync(rootDir)) {
        console.debug("Found:", rootDir);
        return rootDir;
      }
    }

    if (config != undefined) {
      const configDir = path.join(path.dirname(config), "package.json");
      if (fs.existsSync(configDir)) {
        console.debug("Found:", configDir);
        return configDir;
      }
    }

    throw new Error("Could not find package.json!");
  },

  async readNextConfig(file: string): Promise<any> {
    const config = await import(file);
    return config.default;
  },

  searchNextConfig(
    root: string | undefined,
    config: string | undefined,
  ): string | undefined {
    const defaultDir = path.join(process.cwd(), "nextnextnext.config.js");
    if (fs.existsSync(path.join(process.cwd(), "nextnextnext.config.js"))) {
      console.debug("Found:", defaultDir);
      return defaultDir;
    }

    if (root != undefined) {
      const rootDir = path.join(root, "nextnextnext.config.js");
      if (fs.existsSync(rootDir)) {
        console.debug("Found:", rootDir);
        return rootDir;
      }
    }

    if (config != undefined) {
      const configDir = path.join(
        path.dirname(config),
        "nextnextnext.config.js",
      );
      if (fs.existsSync(configDir)) {
        console.debug("Found:", configDir);
        return configDir;
      }
    }
  },

  extractPackageInfo(pjson: any, key: string) {
    if (Object.prototype.hasOwnProperty.call(pjson, key)) {
      return pjson[key];
    }
  },

  parseArgs(args: string[]) {
    return yargs(args)
      .option("root", {
        describe:
          "Path to the project root where the package.json file is placed",
      })
      .option("config", {
        describe: "Path to the nextnextnext configuration file",
      })
      .option("dist", {
        describe: "Folder that contains the packaged application",
      })
      .option("name", {
        describe: "Name of the application",
      })
      .option("author", {
        describe: "Author of the application",
      })
      .option("product-version", {
        describe: "Version of your application",
      })
      .option("copyright", {
        describe: "Copyright information",
      })
      .option("description", {
        describe: "Brief description of the application",
      })
      .option("icon", {
        describe: "Path to the application icon file",
      })
      .option("artifact-name", {
        describe: "Final name of the installer executable",
      })
      .option("install-dir", {
        describe: "Installation directory where your app will be placed",
      })
      .option("cert-file", {
        describe: "Path to .pfx or .p12 certification file",
      })
      .option("cert-pass", {
        describe: "Password for the certification file",
      })
      .option("out", {
        describe:
          "Path to the folder where the final installer should be placed",
      })
      .help()
      .parse();
  },

  getBinaryVersionString(): string {
    return `v${major(version)}.${minor(version)}`;
  },

  convertPlatform(platform: string) {
    if (platform === "lin") return "linux";
    if (platform === "darwin") return "macos";
    if (platform === "mac") return "macos";
    if (platform === "osx") return "macos";
    if (platform === "win32") return "win";
    if (platform === "windows") return "win";
    return platform;
  },

  convertArch(arch: string) {
    //if (arch === 'arm') return 'armv7';
    if (arch === "ia32") return "x86";
    if (arch === "x86_64") return "x64";
    return arch;
  },

  getMakerReleaseInfo(): any {
    const version = this.getBinaryVersionString();
    const platform = this.convertPlatform(process.platform);
    const arch = this.convertArch(process.arch);

    const name = `next-maker-${platform}-${arch}`;
    return {
      name: name,
      version: version,
      url: `https://github.com/nextnextnextio/next-maker/releases/download/${version}/${name}`
    } 
  },

  getTempPath(maker: any) {
    return path.join(__dirname, "../", ".next-cache", maker.version);
  },

  async createTempFile(file: string, data: object) {
    await fs.writeJSON(file, data);
  },

  checkMakerBinary(maker: any) {
    const temp = this.getTempPath(maker);
    // todo! check if the downloaded data is valid? checksum?
    return fs.existsSync(path.join(temp, maker.name));
  },

  async downloadMakerBinary(maker: any): Promise<string> {
    console.log(`Downloading ${maker.name} from: ${maker.url}`);

    // prepare temp and dest paths
    const temp = this.getTempPath(maker);
    const dest = path.join(temp, maker.name);
    
    // create temp dir for the binary
    try {
      await fs.ensureDir(temp);
    } catch (error) {
      throw new Error("Error while creating download directory: " + temp);
    }

    // create write stream for the destination
    const writer = createWriteStream(dest);

    // download file
    return await axios({
      url: maker.url,
      method: "GET",
      responseType: "stream",
    }).then((result) => {
      return new Promise((resolve, reject) => {
        const totalSize = Number(result.headers["content-length"]);
        let currentSize = 0;

        result.data.on("data", (chunk: Buffer) => {
          if (totalSize != null && totalSize !== 0) {
            currentSize += chunk.length;
            // console.log((currentSize / totalSize) * 100);
          }
        });

        result.data.pipe(writer);

        writer.on("error", (error: any) => {
          writer.close();
          // cleanup temp folder
          fs.removeSync(temp);
          reject(error);
        });

        writer.on("close", () => {
          console.log("Download finished:", dest);
          resolve(dest);
        });
      });
    });
  }
};