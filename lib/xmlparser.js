"use strict";

const domparser = new DOMParser();

function parseXML(text) {
  return domparser.parseFromString(text, "application/xml");
}

module.exports = {
    parseXML
}
