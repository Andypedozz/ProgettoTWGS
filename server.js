const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const port = 3000;

const earthquakes = fs.readFileSync("src/db/earthquakes.json");
var currentEarthquakes = JSON.parse(earthquakes);

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
        let toReturn = currentEarthquakes.find(record => record["ID"] === id);
        res.json(toReturn);
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

    res.json(currentEarthquakes);
});

// MIGHT IMPROVE
app.get("/earthquakes/query", (req, res) => {
    const key = req.query.key;
    const value = req.query.value;

    let result = [];

    if(key === "ID" || key === "EventID")  {
        result = currentEarthquakes.filter((record) => parseInt(record[key]) === parseInt(value));
    }else if(key === "Latitudine" || key === "Longitudine" || key === "Profondita" || key === "Magnitudo") {
        result = currentEarthquakes.filter((record) => parseFloat(record[key]) === parseFloat(value));
    }else{
        result = currentEarthquakes.filter((record) => record[key] === value);
    }

    res.json(result);
});

// FIXME
// POST: crea una nuova segnalazione
app.post("/earthquakes/add", (req, res) => {
    let data = req.body;
    let earthquake = {};

    let highestRecord = currentEarthquakes[0];
    let lastId = parseInt(highestRecord["ID"]);
    let lastEventId = parseInt(highestRecord["EventID"]);

    earthquake["ID"] = (lastId + 1).toString();
    earthquake["EventID"] = (lastEventId + 1).toString();

    let keys = Object.keys(data);

    for(let i = 0; i < keys.length; i++) {
        earthquake[keys[i]] = data[keys[i]];
    }
    
    console.log(earthquake);
    currentEarthquakes.unshift(earthquake);

    fs.writeFileSync("src/db/earthquakes.json", JSON.stringify(currentEarthquakes));
    res.send("Message: Successfully added record!");
});

// PUT: aggiorna una segnalazione
app.put("/earthquakes/modify", (req, res) => {
    if(currentEarthquakes.length == 0) {
        res.type("text/plain").send("Non ci sono segnalazioni!");
        return 0;
    }

    let data = req.body;
    let record = currentEarthquakes.find(row => row["ID"] === data["ID"]);

    let keys = Object.keys(data);

    for(let i = 0; i < keys.length; i++) {
        if(data[keys[i]] !== null || data[keys[i]] !== undefined) {
            record[keys[i]] = data[keys[i]];
        }
    }

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

app.get("/manage", (req, res) => {
    res.sendFile(path.join(__dirname, "src/pages/manage/manage.html"));
});

app.listen(port, () => {
    console.log("Server in ascolto sulla porta "+port);
});