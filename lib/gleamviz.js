"use strict";

const config = require("./config");
const user = require("./user");
const simulation = require("./simulation");
const utils = require("./utils");
const regions = require("./regions");

module.exports = {
    login: user.login,
    logout: user.logout,
    listall: simulation.listall,
    create: simulation.create,
    remove: simulation.remove,
    stop: simulation.stop,
    getinfo: simulation.getinfo,
    getdef: simulation.getdef,
    getabmdata: simulation.getabmdata,
    getdata: simulation.getdata,
    getparameters: utils.getparameters,
    getsimulationdata: utils.getsimulationdata,
    config,
    regions
}
