"use strict"

interface ElectronOptions {
    /** Folder that contains the packaged electron application */
    dist: String
    /** Defaults to  the `name` from `package.json` */
    name?: String
    /** Defaults to the `author` from `package.json` */
    author?: String
    /** Defaults to the `version` field in `package.json` */
    version?: String

    copyright: String
    description: String
    icon: String
    artifact_name: String
    install_dir: String
    cert_file: String
    cert_pass: String
    dest: String
}

interface Component {
    name: String
    enabled: boolean
    required: boolean
    files: String[]
}

function main() {
    // check prereqs

    // get nextnextnext.json
    // - or -
    // get nextnextnext.config.js

    // check and download next binaries from github releaes

    // run next-maker.exe
}