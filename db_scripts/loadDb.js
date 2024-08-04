const mysql = require("mysql");
const fs = require("fs");
const { parse } = require("csv-parse");

function printRecord(record) {
    console.log("Id: "+record.id+"\n"+
                "EventID: "+record.EventID+"\n"+
                "Time: "+record.Time+"\n"+
                "Latitude: "+record.Latitude+"\n"+
                "Longitude: "+record.Longitude+"\n"+
                "Depth: "+record.Depth+"\n"+
                "Author: "+record.Author+"\n"+
                "MagType: "+record.MagType+"\n"+
                "Magnitude: "+record.Magnitude+"\n"+
                "EventLocationName: "+record.EventLocationName+"\n");
}

async function parseCSV() {
    return new Promise((resolve, reject) =>{
        let records = [];
        const filepath = "../earthquakes/earthquakes_test.csv";
        fs.createReadStream(filepath)
        .pipe(parse({ columns: true}))
        .on('data', (data) => {
            printRecord(data);
            records.push(Object.values(data));
        })
        .on('end', () => resolve(records))
        .on('error', (error) => reject(error));    
    })
}

function loadDbTest(records) {

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "EraserH34d_#",
        database: "terremoti"
    });

    con.connect(function(err) {
        if(err)
            throw err;
        var sql = "INSERT INTO eventi (id, EventID, Time, Latitude, Longitude, Depth, Author, MagType, Magnitude, Zone) VALUES ?";
        con.query(sql,[records], function(err, results) {
            if(err)
                throw err;
            console.log("Records inseriti: "+results.affectedRows);
        })
    });
    con.commit();
}

async function main() {
    try{
        const data = await parseCSV();
        loadDbTest(data);
    }catch(error) {
        console.error("Error reading the CSV file: "+error);
    }
}

main();