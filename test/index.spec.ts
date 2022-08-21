import path from "path";
import mocha from "mocha";
import { expect } from "chai";

import { electronNext } from "../src/index";
import utils from "../src/utils";

describe("Create an installer for a basic electron app", () => {
    describe("Check package.json", () => {
        it("should throw an error if no package.json is found", async () => {
            const result = utils.readPackageJson(path.join(__dirname, "fixtures", "not_found", "package.json"));
            expect(result).to.throw;
        });

        it("should throw an error if package.json is empty", async () => {
            const result = utils.readPackageJson(path.join(__dirname, "fixtures", "empty", "package.json"));
            expect(result).to.throw;
        });

        it("should successfully read the content of package.json", async () => {
            const result = await utils.readPackageJson(path.join(__dirname, "fixtures", "basic", "package.json"));
            expect(result).to.be.an("object")
        });
    });

    describe("Download next-maker binary", () => {
        return;
        it("should download the binary from the given url", async () => {
            const version = utils.getBinaryVersionString();
            const platform = utils.convertPlatform(process.platform);
            const arch = utils.convertArch(process.arch);

            const name = "node-v18.1.0-win-x64"; // `next-maker-${platform}-${arch}`;
            const url = "https://github.com/vercel/pkg-fetch/releases/download/v3.4/node-v18.1.0-win-x64"; // `https://github.com/nextnextnextio/next-maker/releases/download/${version}/${name}`;

            const result = await utils.downloadMaker(url, name);
            expect(result).to.be.a("string");
        }).timeout(10000);
    });

    describe("Run create", () => {
        it("should get the dist and the version from the cli", async () => {
            const args = utils.parseArgs([
                "--dist", path.join(__dirname, "fixtures", "basic", "dist"), 
                "--product-version", "1.0.0",
                "--root", path.join(__dirname, "fixtures", "basic")
            ]); 
            
            const result = await electronNext.create(args);
            expect(result).to.be.equal(0);
        });

        it("should get and use the nextnextnext.config.js", async () => {
            const args = utils.parseArgs([
                "--config", path.join(__dirname, "fixtures", "config", "nextnextnext.config.js")
            ]);

            const result = await electronNext.create(args);
            expect(result).to.be.equal(0);
        });
    });
});