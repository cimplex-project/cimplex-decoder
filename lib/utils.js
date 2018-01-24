"use strict";

const simulation = require("./simulation");
const parseXML = require("./xmlparser")
    .parseXML;

class PromisePool {
    constructor(work) {
        this._work = work;
        this._result = [];
        this._concurrency = 4;
    }

    _update(resolve, progress) {
        const promises = [];
        for (let n = 0; n < this._concurrency; ++n) {
            const p = this._work();
            if (p) {
                promises.push(p);
            }
        }

        if (promises.length === 0) {
            resolve(this._result);
        } else {
            const self = this;
            Promise.all(promises)
                .then(values => {
                    self._result = self._result.concat(values);
                    if(progress) {
                      progress(self._result.length);
                    }
                    self._update(resolve, progress);
                });
        }
    }

    update(progress) {
        return new Promise((resolve, reject) => {
            this._update(resolve, progress);
        });
    }
};


// todo: check if more date is needed
function getparameters(id) {
    return simulation.getdef(id)
        .then(definition => {
            const xmlDefinition = parseXML(definition);
            const parameters = xmlDefinition.querySelector("parameters");
            const def = xmlDefinition.querySelector("definition");
            const duration = +parameters.getAttribute("duration");
            const startDate = new Date(parameters.getAttribute("startDate"));
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + duration);

            return {
                startDate,
                endDate,
                duration,
                simType: def.getAttribute("sim_type"),
                abmId: def.getAttribute("abm_id"),
                type: def.getAttribute("type")
            }
        });
}

function getsimulationdata(id, progress, min = 1, max = 365) {
    return getparameters(id)
        .then(parameters => {
            const getdata = parameters.simType === "ABM" ? simulation.getabmdata : simulation.getdata;
            let day = min;
            const pool = new PromisePool(() => {
                if (day > max) {
                    return undefined;
                }
                return getdata(id, day++);
            })

            return pool.update(progress);
        });
}

module.exports = {
    getparameters,
    getsimulationdata
}
