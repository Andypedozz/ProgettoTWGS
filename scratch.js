
const fs = require("fs");
const parse = require("csv-parse");

function fetchData() {
    const filepath = "earthquakes/earthquakes.csv"
    const filecontent = fs.readFile(filepath);

    const options = {
        columns: true,
        trim: true
    };

    parse(filecontent, options, (err, records) => {
        if(err) {
            print("Errore durante il parsing del file CSV: ", err)
        }else{
            print("Records parsed: ", records)
        }
    });
}

fetchData();