const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const port = 3000;

const earthquakes = fs.readFileSync("src/db/earthquakes.json");
var currentEarthquakes = JSON.parse(earthquakes);
currentEarthquakes = Object.values(currentEarthquakes);
currentEarthquakes.unshift(currentEarthquakes.length);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/")));
app.use(express.json({ type: '*/*' })); 

/****************************/
/*         ENDPOINT         */
/****************************/

// GET: ottieni la lista di tutti i terremoti
app.get('/earthquakes', (req, res) => {
    if(currentEarthquakes.length == 0) {
        res.type('text/plain').send("Non ci sono terremoti disponibili!");
        return 0;
    }

    // QUERY BY ID
    const id = req.query.id;
    if(id != null) {
        res.json(currentEarthquakes[Number.parseInt(id)]);
        return 0;
    }

    // QUERY BY INDEXES
    const startIndex = req.query.startIndex;
    const endIndex = req.query.endIndex;

    if(startIndex != null && endIndex != null) {
        let data = currentEarthquakes.slice(startIndex,endIndex);
        res.json(data);
        return 0;
    }

    res.json(earthquakes);
});

// MIGHT IMPROVE
app.get("/earthquakes/query", (req, res) => {
    const key = req.query.key;
    const value = req.query.value;

    let result = [];

    switch(key) {
        case "ID":
            result = currentEarthquakes.filter((record) => parseInt(record[0]) === parseInt(value));
            break;
        case "EventID":
            result = currentEarthquakes.filter((record) => parseInt(record[1]) === parseInt(value));
            break;
        case "Data e Ora":
            result = currentEarthquakes.filter((record) => record[2] === value);
            break;
        case "Latitudine":
            result = currentEarthquakes.filter((record) => parseFloat(record[3]) === parseFloat(value));
            break;
        case "Longitudine":
            result = currentEarthquakes.filter((record) => parseFloat(record[4]) === parseFloat(value));
            break;
        case "Profondità":
            result = currentEarthquakes.filter((record) => parseFloat(record[5]) === parseFloat(value));
            break;
        case "Autore":
            result = currentEarthquakes.filter((record) => record[6] === value);
            break;
        case "MagType":
            result = currentEarthquakes.filter((record) => record[7] === value);
            break;
        case "Magnitudo":
            result = currentEarthquakes.filter((record) => parseFloat(record[8]) === parseFloat(value));
            break;
        case "Zona":
            result = currentEarthquakes.filter((record) => record[9] === value);
            break;
    }

    res.json(result);
});

// FIXME
// POST: crea una nuova segnalazione
app.post("/earthquakes/add", (req, res) => {
    let data = Object.values(req.body);
    let earthquake = [];

    let lastRecord = currentEarthquakes[currentEarthquakes.length - 1];
    let lastId = parseInt(lastRecord[0]);
    let lastEventId = parseInt(lastRecord[1]);

    earthquake.push(lastId + 1);
    earthquake.push(lastEventId + 1);

    for(var i = 0; i < data.length; i++) {
        earthquake.push(data[i]);
    }

    currentEarthquakes.push(earthquake);

    fs.writeFileSync("src/db/earthquakes.json", JSON.stringify(currentEarthquakes));
    res.send("Message: Successfully added record!");
});

// PUT: aggiorna una segnalazione --> aggiorna il magnitudo data la posizione della segnalazione
app.put("/earthquakes/modify", (req, res) => {
    if(currentEarthquakes.length == 0) {
        res.type("text/plain").send("Non ci sono segnalazioni!");
        return 0;
    }

    let data = req.body;
    let updatedData = [];

    for(var i = 0; i < data.length; i++) {
        updatedData.push(data[i]);
    }

    currentEarthquakes[data[0]] = updatedData;
    fs.writeFileSync("src/db/earthquakes.json", JSON.stringify(currentEarthquakes));
    res.send("Message: Successfully updated record!");
});

/********************************/
/*         ENDPOINT GUI         */
/********************************/

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "src/pages/home/home.html"));
});

app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "src/pages/home/home.html"));
});

app.get("/segnalazioni", (req, res) => {
    res.sendFile(path.join(__dirname, "src/pages/segnalazioni/segnalazioni.html"));
});

app.get("/ricerca", (req, res) => {
    res.sendFile(path.join(__dirname, "src/pages/ricerca/ricerca.html"));
});

app.get("/segnalazione", async function(req, res) {
    res.sendFile(path.join(__dirname, "src/pages/segnalazione/segnalazione.html"));
});

app.get("/create", (req, res) => {
    res.sendFile(path.join(__dirname, "src/pages/create/create.html"));
});

app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname, "src/pages/stats/stats.html"));
});

app.listen(port, () => {
    console.log("Server in ascolto sulla porta "+port);
});