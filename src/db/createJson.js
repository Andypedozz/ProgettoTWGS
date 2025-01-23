const fs = require("fs");
const path = require("path");
const parse = require("csv-parse").parse;

function createJson() {
    // Leggi il file CSV
    const csvFilePath = path.join(__dirname, 'earthquakes.csv');
    const csvContent = fs.readFileSync(csvFilePath, 'utf-8');

    // Splitta il contenuto del file in righe
    const lines = csvContent.split('\r');
    
    // Ottieni i nomi delle colonne dalla prima riga
    const headers = lines[0].split(',');
    // lines.reverse();

    // Crea un array per contenere i dati JSON
    const jsonData = [];

    // Itera sulle righe successive (dalla seconda riga in poi)
    for (let i = 1; i < lines.length; i++) {
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

function createJsonReplaceIds() {
    // Leggi il file CSV
    const csvFilePath = path.join(__dirname, 'earthquakes.csv');
    const csvContent = fs.readFileSync(csvFilePath, 'utf-8');

    // Splitta il contenuto del file in righe
    const lines = csvContent.split('\r');
    
    // Ottieni i nomi delle colonne dalla prima riga
    const headers = lines[0].split(',');
    // lines.reverse();

    // Crea un array per contenere i dati JSON
    const jsonData = [];

    // Itera sulle righe successive (dalla seconda riga in poi)
    for (let i = 1; i < lines.length; i++) {
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

    // Riassegna id da 0
    for(let i = 0; i < jsonData.length; i++) {
        jsonData[i]["ID"] = i.toString();
    }

    // Converti l'array in una stringa JSON
    const jsonResult = JSON.stringify(jsonData, null, 4);

    // Salva il risultato in un file JSON (opzionale)
    fs.writeFileSync('earthquakes.json', jsonResult);
}

createJson();