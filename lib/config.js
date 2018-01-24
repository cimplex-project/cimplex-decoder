"use strict";

class Config {
    constructor() {
        this._webworkerPath = ".";
        this._serverURL = "https://brunate.isi.it";
    }

    get webworkerPath() {
        return this._webworkerPath;
    }

    set webworkerPath(path) {
        this._webworkerPath = path;
    }

    get serverURL() {
        return this._serverURL;
    }

    set serverURL(url) {
        this._serverURL = url;
    }
}

module.exports = new Config;
