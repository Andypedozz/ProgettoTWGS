const fs = require("fs");
const path = require("path");
const parse = require("csv-parse").parse;

let earthquakes = [];

function createJson() {

    fs.createReadStream('earthquakes_test.csv')
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
        earthquakes.push(row);
    })
    .on("end", function () {
        console.log("Parsing effettuato con successo");
        fs.writeFileSync("earthquakes.json", JSON.stringify(earthquakes));
        console.log("File .json creato con successo!");
    })
    .on("error", function (error) {
        console.log("Errore: "+error);
    });
}

createJson();
