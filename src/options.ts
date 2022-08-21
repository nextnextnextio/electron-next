export interface ElectronOptions {
    /** Folder that contains the packaged electron application. */
    dist?: string
    /** Defaults to the `name` from `package.json`. */
    name?: string
    /** Defaults to the `author` from `package.json`. */
    author?: string
    /** Defaults to the `version` field in `package.json`. */
    version?: string
    /** Defaults to: Copyright (c) `author`. All rights reserved. */
    copyright?: string
    /** Defaults to the `description` from `package.json`. */
    description?: string
    /** 
     * Window and taskbar icon used for the installer and uninstaller.
     * By default `./icon.ico` or `./assets/icon.ico` will be automatically searched and used,
     * if no icon is found the nextnextnext icon will be used.
     */
    icon?: string
    /** Final name of the installer. Defaults to `name` field in `package.json`. */
    artifact_name?: string
    /** Installation directory where your app will be placed. Defaults to %PROGRAMFILES% on windows. */
    install_dir?: string
    /** Path to .pfx or .p12 certification file. */
    cert_file?: string
    /** Password for the certification file described in `cert_file`. */
    cert_pass?: string
    /** Path to the folder where the final installer should be placed. */
    out?: string,
    /** Functions that will run before and after the make procedure */
    hooks?: {
        pre: Function,
        post: Function
    }
}