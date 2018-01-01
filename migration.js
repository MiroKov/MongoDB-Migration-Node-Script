const file = require('./read-file');
const fs = require('fs');
const path = require('path');
const migrationPath = path.join(__dirname, 'migrations', 'data.json');
const asnyc = require('async');

exports.createMigration = () => {
    asnyc.parallel(
        {
            "data": (callback) => file.readFile(path.join(__dirname, 'files', 'm3-customer-data.json'), callback),
            "address": (callback) => file.readFile(path.join(__dirname, 'files', 'm3-customer-address-data.json'), callback)
        }
        , (error, results) => {
            if (error) {
                console.error(error);
                process.exit(1);
            }
            const data = JSON.parse(results.data);
            const address = JSON.parse(results.address);
            for (let i = 0; i < data.length; i++) {
                Object.assign(data[i], address[i]);
            }
            // write to file in migrations folder - not required in assingment
            file.writeFile(migrationPath, JSON.stringify(data, null, 2));
            console.log('Creating migration file: \'' + migrationPath + '\'.');
        }
    );
}

exports.HasMigration = (overwrite, next) => {
    if (overwrite === true) {
        next(false);
        return;
    }
    fs.exists(migrationPath, (exists) => {
        next(exists);
    });
}

exports.Process = (overwrite) => {
    this.HasMigration(overwrite, (migrationExists) => {
        if (migrationExists) {
            console.log('Migration exist already...skipping migration creation.');
            return;
        }
        this.createMigration();
    });
}
exports.readMigration = (next) => {
    fs.readFile(migrationPath, 'utf-8', (error, data) => {
        if (error) next(error, null);
        next(null, JSON.parse(data));
    })
}