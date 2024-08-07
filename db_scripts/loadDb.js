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

async function createJson() {
    const records = await parseCSV()
    fs.writeFileSync("earthquakes.json", JSON.stringify(records));
}

createJson();