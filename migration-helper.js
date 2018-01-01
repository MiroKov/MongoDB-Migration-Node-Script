const fs = require('fs');
const path = require('path');
const streamArray = require("stream-json/utils/StreamArray");
const asnyc = require('async');

// read chunks serially  -- not used
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

exports.putTogether = (filepath1, filepath2, migrationDirPath, chunksize, selection, next) => {
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
            let migrationFilePath = path.join(migrationDirPath, `data_${selection}.json`);
            writeFile(migrationFilePath, JSON.stringify(results.file1, null, 2));
            console.log('Creating migration file: \'' + migrationFilePath + '\'.');
            // results go to callback
            next(null, results.file1);
        }
    );
}
const migrationDirExists = (dirpath, next) => {
    fs.access(dirpath, fs.constants.R_OK | fs.constants.W_OK, (err) => {
        err ? next(false) : next(true);
    });
}

//clear migrations directory
exports.prepareMigrations = (dirpath, next) => {

    migrationDirExists(dirpath, (exists) => {
        if (!exists) {
            console.log('creating migrations directory.')
            fs.mkdirSync(dirpath);
        }
        else {
            fs.readdir(dirpath, (err, files) => {
                if (err) {
                    next(err);
                };
                for (const file of files) {
                    fs.unlink(path.join(dirpath, file), err => {
                        if (err) throw err;
                    });
                }
            });
            console.log('Migration directory cleared.');
        }
    });

}

const writeFile = (filepath, data) => {

    fs.writeFile(filepath, data, (err) => {
        if (err) throw err;
    });
}