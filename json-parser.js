const fs = require('fs');
const path = require('path');
const streamArray = require("stream-json/utils/StreamArray");
const dataPath = path.join(__dirname, 'files', 'm3-customer-data.json');
const addressPath = path.join(__dirname, 'files', 'm3-customer-address-data.json');
const asnyc = require('async');

// read chunks serially
const readJSONChunks = (filepath, chunksize, next) => {
    const stream = streamArray.make();
    let obj = [];
    stream.output.on("data", (object) => {
        obj.push(object.value);
        if ((object.index + 1) % chunksize === 0) {
            next(null, obj, object.index);
            obj = [];
        }
    });
    stream.output.on("end", function () {
        if (obj.length > 0)
            next(null, obj, null);
    });
    fs.createReadStream(filepath).pipe(stream.input);
}

const readJSONParts = (filepath, chunksize, selection, next) => {
    const stream = streamArray.make();
    let obj = [];
    stream.output.on("data", (object) => {
        if ((object.index + 1) % chunksize === selection) {
            obj.push(object.value);
        }
    });
    stream.output.on("end", () => next(null, obj));

    fs.createReadStream(filepath).pipe(stream.input);
}

exports.putTogether = (filepath1, filepath2, chunksize, selection, next) => {
    asnyc.parallel(
        {
            "file1": (callback) => readJSONParts(filepath1, chunksize, selection, callback),
            "file2": (callback) => readJSONParts(filepath2, chunksize, selection, callback)
        }
        , (error, results) => {
            if (error) {
                next(error);
            }
            for (let i = 0; i < results.file1.length; i++) {
                Object.assign(results.file1[i], results.file2[i]);
            }
            // write to file in migrations folder - not required in assingment
            const migrationPath = path.join(__dirname, 'migrations', `data_${selection}.json`);
            writeFile(migrationPath, JSON.stringify(results.file1, null, 2));
            console.log('Creating migration file: \'' + migrationPath + '\'.');
            // results go to callback
            next(null, results.file1);
        }
    );
}

const writeFile = (filepath, data) => {

    fs.writeFile(filepath, data, (err) => {
        if (err) throw err;
    });
}

// putTogether(dataPath, addressPath, 50, 1);