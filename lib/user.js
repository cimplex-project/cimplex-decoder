"use strict";

const Config = require("./config");
const parseXML = require("./xmlparser")
    .parseXML;

function parseUser(response) {
    return {
        username: response.querySelector("username").innerHTML,
        email: response.querySelector("email").innerHTML
    }
}

function login(username, password) {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    return fetch(`${Config.serverURL}/usr/logon`, {
            method: "post",
            credentials: "include",
            body: formData
        })
        .then(response => {
            if (response.ok) {
                return response.text();
            }
            return Promise.reject(response.statusText);
        })
        .then(text => parseXML(text))
        .then(xml => parseUser(xml));
}

function logout() {
    return fetch(`${Config.serverURL}/usr/logoff`, {
            method: "post",
            credentials: "include"
        })
        .then(response => {
            if (response.ok) {
                return response.text();
            }
            return Promise.reject(response.statusText);
        })
}
    
module.exports = {
    login,
    logout
}
