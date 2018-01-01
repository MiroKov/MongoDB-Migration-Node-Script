const fs = require('fs');

exports.readFile = (filepath, callback) => {

    fs.readFile(filepath,'utf8', (err, data) => {
        if (err) throw err;
        callback(null, data);
    });
}

exports.writeFile = (filepath,data) => {

    fs.writeFile(filepath,data,(err)=>{
        if (err) throw err;
    });
}