"use strict";

const Config = require("./config");
const parseXML = require("./xmlparser")
    .parseXML;
const decodeABMFile = require("./abmdecoder")
    .decodeABMFile;

function parseSimulation(simulation) {
    return {
        id: simulation.getAttribute("id"),
        type: simulation.getAttribute("type"),
        status: simulation.getAttribute("status")
    }
}

function parseSimulations(xml) {
    const simulations = [];
    xml.querySelectorAll("simulation")
        .forEach(simulation => {
            simulations.push(parseSimulation(simulation));
        });
    return simulations;
}

function listall() {
    return fetch(`${Config.serverURL}/sim/sims/listall`, {
            credentials: "include"
        })
        .then(response => {
            if (response.ok) {
                return response.text();
            }
            return Promise.reject(response.statusText);
        })
        .then(text => parseXML(text))
        .then(xml => parseSimulations(xml));
}

function listABMs() {
    return fetch(`${Config.serverURL}/sim/listABMs`, {
            credentials: "include"
        })
        .then(response => {
            if (response.ok) {
                return response.text();
            }
            return Promise.reject(response.statusText);
        });
}

function getinfo(id) {
    return fetch(`${Config.serverURL}/sim/sim/${id}/getinfo`, {
            credentials: "include"
        })
        .then(response => {
            if (response.ok) {
                return response.text();
            }
            return Promise.reject(response.statusText);
        })
        .then(text => parseXML(text))
        .then(xml => parseSimulation(xml.querySelector("simulation")));
}

function getdef(id) {
    return fetch(`${Config.serverURL}/sim/sim/${id}/getdef`, {
            credentials: "include"
        })
        .then(response => {
            if (response.ok) {
                return response.text();
            }
            return Promise.reject(response.statusText);
        });
}

function create(definition) {
    const id = +new Date() + ".ASR";
    return fetch(`${Config.serverURL}/sim/sim/${id}/create`, {
            credentials: "include",
            method: "post",
            body: definition
        })
        .then(response => {
            if (response.ok) {
                return response.text();
            }
            return Promise.reject(response.statusText);
        })
        .then(response => {
            return {
                response,
                id
            }
        });
}

function remove(id) {
    return fetch(`${Config.serverURL}/sim/sim/${id}/remove`, {
            credentials: "include",
            method: "delete"
        })
        .then(response => {
            if (response.ok) {
                return response.text();
            }
            return Promise.reject(response.statusText);
        })
}

function stop(id) {
    return fetch(`${Config.serverURL}/sim/sim/${id}/stop`, {
            credentials: "include",
            method: "delete"
        })
        .then(response => {
            if (response.ok) {
                return response.text();
            }
            return Promise.reject(response.statusText);
        })
}

function getdata(id, day) {
    return fetch(`${Config.serverURL}/sim/sim/${id}/day/${day}/getdata`, {
            credentials: "include"
        })
        .then(response => {
            if (response.ok) {
                return response.arrayBuffer();
            }
            return Promise.reject(response.statusText);
        })
        .then(buffer => {
            return new Promise((resolve, reject) => {
                const worker = new Worker(`${Config.webworkerPath}/srdecoder.js`);
                worker.postMessage(buffer);
                worker.onmessage = data => {
                    worker.terminate();
                    resolve(data);
                };
                worker.onerror = reject;
            });
        })
        .then(event => event.data);
}

function getabmdata(id, day) {
    return fetch(`${Config.serverURL}/sim/sim/${id}/day/${day}/getabmdata`, {
            credentials: "include"
        })
        .then(response => {
            if (response.ok) {
                return response.blob();
            }
            return Promise.reject(response.statusText);
        })
        .then(blob => decodeABMFile(blob));
}

module.exports = {
    listall,
    create,
    remove,
    stop,
    getinfo,
    getdef,
    getdata,
    getabmdata
}
