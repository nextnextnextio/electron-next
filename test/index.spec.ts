import path from "path";
import mocha from "mocha";
import { expect } from "chai";

import { electronNext } from "../src/index";
import utils from "../src/utils";

describe("Create an installer for a basic electron app", () => {
    describe("Check package.json", () => {
        it("should throw an error if no package.json is found", async () => {
            const result = utils.getPackageJson(path.join(__dirname, "fixtures", "not_found"));
            expect(result).to.throw;
        });

        it("should throw an error if package.json is empty", async () => {
            const result = utils.getPackageJson(path.join(__dirname, "fixtures", "empty"));
            expect(result).to.throw;
        });

        it("should successfully read the content of package.json", async () => {
            const result = await utils.getPackageJson(path.join(__dirname, "fixtures", "basic"));
            expect(result).to.be.an("object")
        });
    });

    describe("Run create", () => {
        it("should get the dist and the version from the cli", async () => {
            const args = utils.parseArgs(["--dist", path.join(__dirname, "fixtures", "basic", "dist"), "--product-version", "1.0.0"]); 
            console.log(args);
            
            const result = await electronNext.create(args);
            expect(result).to.be.equal(0);
        });
    });
});