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
        earthquakes.reverse();
        console.log("Parsing effettuato con successo");
        fs.writeFileSync("earthquakes.json", JSON.stringify(earthquakes));
        console.log("File .json creato con successo!");
    })
    .on("error", function (error) {
        console.log("Errore: "+error);
    });
}

function createJsonWithKeys() {
    // Leggi il file CSV
    const csvFilePath = path.join(__dirname, 'earthquakes_test.csv');
    const csvContent = fs.readFileSync(csvFilePath, 'utf-8');

    // Splitta il contenuto del file in righe
    const lines = csvContent.split('\r');
    
    // Ottieni i nomi delle colonne dalla prima riga
    const headers = lines[0].split(',');
    lines.reverse();

    // Crea un array per contenere i dati JSON
    const jsonData = [];

    // Itera sulle righe successive (dalla seconda riga in poi)
    for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i].trim();
        if (line) {
            const values = line.split(',');
            const jsonEntry = {};

            // Popola il dizionario per ogni riga
            headers.forEach((header, index) => {
                jsonEntry[header] = values[index];
            });

            // Aggiungi l'oggetto JSON all'array
            jsonData.push(jsonEntry);
        }
    }

    // Converti l'array in una stringa JSON
    const jsonResult = JSON.stringify(jsonData, null, 4);

    // Salva il risultato in un file JSON (opzionale)
    fs.writeFileSync('earthquakes.json', jsonResult);
}


createJsonWithKeys();