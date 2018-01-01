const mongodb = require('mongodb');
const migration = require('./migration');

const url = 'mongodb://localhost:27017/edx-migrate-db';
const overwrite = process.argv[3] === 'y' || process.argv[3] === 'Y' || false;
const stepsize = (isNaN(+process.argv[2])) ? 50 : +process.argv[2];
console.log('overwrite migration if exists: ' + overwrite);
// process migrations
migration.Process(overwrite);
// reading migration file
readMigration((error, results) => {
    if (error) {
        console.log('Error reading migration file.');
        process.exit(1);
    }
    const migration = results;
});

mongodb.MongoClient.connect(url, (dbError, db) => {
    if (dbError) {
        console.error(dbError);
        process.exit(1);
    }

    console.log('connected..');
    console.log('writing to db in steps of ' + stepsize + 'records.');

    for (let i = 0; i <)

        db.db('edx-migrate-db').collection('customers').insertMany(data, (error, results) => {
            results.
    })
});