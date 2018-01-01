const mongodb = require('mongodb');
const path = require('path');
const migrationHelper = require('./migration-helper');

const dataPath = path.join(__dirname, 'files', 'm3-customer-data.json');
const migrationDirPath = path.join(__dirname, 'migrations');
const addressPath = path.join(__dirname, 'files', 'm3-customer-address-data.json');
const url = 'mongodb://localhost:27017/edx-migrate-db';
const chunkCount = (isNaN(+process.argv[2])) ? 50 : +process.argv[2];

// clearing migrations directory
migrationHelper.prepareMigrations(migrationDirPath, (err) => {
    if (err) {
        console.error(`Error clearing migrations directory: ${migrationDirPath}. ${err}`);
        process(1);
    }
});

mongodb.MongoClient.connect(url, (dbError, db) => {
    if (dbError) {
        console.error(dbError);
        process.exit(1);
    }
    console.log('connected to database...');
    console.log('Migration to database will be divided in ' + chunkCount + ' chunks.');
    let chunksWritten = 0;
    let recordsWritten = 0;
    for (let i = 0; i < chunkCount; i++)
        migrationHelper.putTogether(dataPath, addressPath, migrationDirPath, chunkCount, i, (error, data) => {
            db.db('edx-migrate-db').collection('customers').insertMany(data, (error, results) => {
                if (error) {
                    console.error(`error writing chunk ${i} to database. ${error.message}`);
                    process.exit(1);
                }
                chunksWritten++;
                recordsWritten += results.result.n;
                console.log(`Chunk ${i}: writing ${results.result.n} records to database. ${recordsWritten} records from ${chunksWritten} chunks now in database.`);
                if (chunkCount === chunksWritten) {
                    console.log('Migration files successfully saved and records written to database. Exiting...')
                    process.exit(0);
                }
            });
        })
});