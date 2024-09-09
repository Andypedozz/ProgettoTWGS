const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const port = 3000;

const earthquakes = fs.readFileSync("src/db/earthquakes.json");
var currentEarthquakes = JSON.parse(earthquakes);
currentEarthquakes = Object.values(currentEarthquakes);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/")));
app.use(express.json({ type: '*/*' })); 

/****************************/
/*         ENDPOINT         */
/****************************/

/**
 *  GET all earthquakes
 */
app.get('/earthquakes', (req, res) => {
    if(currentEarthquakes.length == 0) {
        res.type("text/plain").send("There are no reports");
        return 0;
    }

    res.json(currentEarthquakes);
});

/**
 *  GET an earthquake report by ID
 */
app.get('/earthquakes/:id', (req, res) => {
    if(currentEarthquakes.length == 0) {
        res.type("text/plain").send("There are no reports");
        return 0;
    }

    const id = req.params.id;
    if(id == null) {
        res.status(400);
        res.type("text/plain").send("Missing parameters: id is null");
    }

    let toReturn = currentEarthquakes.find(record => record["ID"] === id);
    if(toReturn == null || toReturn == undefined) {
        res.status(404);
        res.type("text/plain").send("Error: resource not found!");
    }

    res.status(200);
    res.json(toReturn);
});

/**
 *  GET a range of earthquakes reports
 */
app.get('/earthquakes/:startIndex/:endIndex', (req, res) => {
    if(currentEarthquakes.length == 0) {
        res.type("text/plain").send("There are no reports");
        return 0;
    }

    const startIndex = req.params.startIndex;
    const endIndex = req.params.endIndex;

    if(startIndex == null || endIndex == null) {
        res.status(400);
        res.type("text/plain").send("Missing parameters: either startIndex or endIndex is null");
        return 0;
    }
    
    let data = currentEarthquakes.slice(startIndex,endIndex);
    if(data == null || data == undefined) {
        res.status(404);
        res.type("text/plain").send("Error: invalid range or resources not found");
    }

    res.status(200);
    res.json(data);
});

/**
 *  GET all earthquakes reports with a certain key/value pair
 */
app.get("/earthquakes/query/:key/:value", (req, res) => {
    const key = req.params.key;
    const value = req.params.value;

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

// POST a new earthquake report
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
    res.type("text/plain").send("Message: Successfully added record!");
});

// PUT: update an earthquake report
app.put("/earthquakes/modify/:id", (req, res) => {
    if(currentEarthquakes.length == 0) {
        res.type("text/plain").send("There are no reports");
        return 0;
    }

    let id = req.params.id;
    let data = req.body;
    let record = currentEarthquakes.find(row => row["ID"] === id);

    if(record == null || record == undefined) {
        res.status(404);
        res.type("text/plain").send("Record to modify doesn't exist");
    }

    let keys = Object.keys(data);

    for(let i = 0; i < keys.length; i++) {
        if(data[keys[i]] !== null || data[keys[i]] !== undefined) {
            record[keys[i]] = data[keys[i]];
        }
    }

    fs.writeFileSync("src/db/earthquakes.json", JSON.stringify(currentEarthquakes));
    res.type("text/plain").send("Successfully updated record!");
});

/**
 *  DELETE an earthquake report
 */
app.delete("/earthquakes/delete/:id", (req, res) => {
    if(currentEarthquakes.length == 0) {
        res.type("text/plain").send("There are no reports");
        return 0;
    }

    let id = req.params.id;
    let index = currentEarthquakes.findIndex(record => record["ID"] === id);
    
    if (index === -1) {
        res.status(404);
        res.type("text/plain").send("Report not found!");
        return 0;
    }
    
    currentEarthquakes.splice(index, 1);
    fs.writeFileSync("src/db/earthquakes.json", JSON.stringify(currentEarthquakes));
    res.type("text/plain").send("Message: Successfully deleted record!");
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