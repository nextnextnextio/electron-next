#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from 'yargs/helpers'
import { electronNext } from "./index";
import utils from "./utils";

const argv = utils.parseArgs(process.argv);
electronNext.create(argv)
    .then((code) => {
        process.exit(code);
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });