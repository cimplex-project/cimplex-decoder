"use strict";

const zip = window.zip
zip.useWebWorkers = false;
const AGE_BRACKETS = 6;

function decodeABMFile(blob) {
    return unzip(blob)
        .then(result => parseABMFiles(result));
}

function parseABMFiles(unzipped) {
    const result = [];

    unzipped.forEach(file => {
        result.push({
            filename: file.filename,
            data: parseData(file.content.split("\n"))
        });
    });

    return result;
}

function parseData(content) {
    const header = JSON.parse(content[0].substr(1));

    // skip header (start at one)
    const data = [];
    for (let n = 1; n < content.length - 1; ++n) {
        const parsedLine = content[n].split(" ");
        let index = 0;
        const parsedData = {
            geographicalID: parsedLine[index++]
        };

        parsedData.ageBrackets = [];
        for (let bracket = 0; bracket < AGE_BRACKETS; ++bracket) {
            parsedData.ageBrackets[bracket] = {};
            header.fields.forEach(name => {
                parsedData.ageBrackets[bracket][name] = {
                    MedianVal: +parsedLine[index++],
                    UpperVal: +parsedLine[index++],
                    LowerVal: +parsedLine[index++]
                }
            });
        }

        data.push(parsedData);
    }

    return data;
}

function createReader(file) {
    return new Promise((resolve, reject) => {
        zip.createReader(new zip.BlobReader(file), zipReader => resolve(zipReader), error => reject(error));
    });
}

function getEntries(zipReader) {
    return new Promise((resolve, reject) => {
        zipReader.getEntries(entries => resolve({
            zipReader,
            entries
        }));
    });
}

function getText(entry) {
    return new Promise((resolve, reject) => {
        entry.getData(new zip.TextWriter(), content => {
            resolve({
                filename: entry.filename,
                content
            });
        });
    });
}

function unzip(file) {
    return createReader(file)
        .then(zipReader => getEntries(zipReader))
        .then(result => {
            const promises = [];
            result.entries.forEach(entry => promises.push(getText(entry)));
            result.zipReader.close();
            return Promise.all(promises);
        })
}

module.exports = {
    decodeABMFile
};
