const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
// const port = process.env.PORT;
const port = 3002;

// Database
const earthquakes = fs.readFileSync("src/db/earthquakes.json");
let currentEarthquakes = Object.values(JSON.parse(earthquakes));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/")));
app.use(express.json());

// Function to find a report by index
function findReportByIndex(index) {
    return currentEarthquakes.find(record => record["ID"] == index);
}

// Function to easily send a response with message and status
function respondWithMessage(res, status, error) {
    let resMessage = { message : error };
    res.status(status);
    res.type("application/json");
    console.log("Response: "+error);
    res.json(resMessage);
}

/*****************************/
/*         ENDPOINTS         */
/*****************************/

// GET all earthquakes
app.get("/earthquakes", (req, res) => {
    if(currentEarthquakes.length == 0) return respondWithMessage(res, 404, "Non ci sono report!");

    res.status(200);
    res.json(currentEarthquakes);
});

// GET earthquake report by id
app.get("/earthquakes/:id", (req, res) => {
    if(currentEarthquakes.length == 0) return respondWithMessage(res, 404, "Non ci sono report!");

    // Check if id param is present
    const id = req.params.id;

    // Check if report exists
    const toReturn = findReportByIndex(id);
    if(!toReturn) return respondWithMessage(res, 404, "Report non trovato!");

    // return report
    res.status(200);
    res.json(toReturn);
});

// GET earthquakes between id range
app.get("/earthquakes/:startIndex/:endIndex", (req, res) => {
    if(currentEarthquakes.length == 0) return respondWithMessage(res, 404, "Non ci sono report!");

    const startIndex = parseInt(req.params.startIndex);
    const endIndex = parseInt(req.params.endIndex);
    let data;
    
    if((startIndex > endIndex)) {
        console.log("Start index: "+startIndex);
        console.log("End index: "+endIndex);
        return respondWithMessage(res, 400, "Range non valido!");
    }
    data = currentEarthquakes.filter(report => report["ID"] >= startIndex && report["ID"] <= endIndex);
    if(!data) return respondWithMessage(res, 404, "Non ci sono report nel range richiesto!");

    res.status(200);
    res.json(data);
});

// GET search earthquake with certain key-value
app.get("/earthquakes/query/:key/:value", (req, res) => {
    if(currentEarthquakes.length == 0) return respondWithMessage(res, 404, "Non ci sono report!");

    const key = req.params.key;
    const value = req.params.value;

    const numericKeys = ["ID","EventID","Latitudine","Longitudine","Profondita","Magnitudo"];

    let result = [];
    if(key != "Data") {
        result = (numericKeys.includes(key)) ?
            currentEarthquakes.filter((record) => record[key] == value):
            currentEarthquakes.filter((record) => record[key].includes(value));
    }else{
        result = currentEarthquakes.filter((record) => JSON.stringify(record["Data e Ora"]).includes(value));
    }

    res.json(result);
});

// POST add a new earthquake report
app.post("/earthquakes/add", (req, res) => {
    let data = req.body;
    let earthquake = {};

    let highestRecord = currentEarthquakes[currentEarthquakes.length - 1];
    let lastId = parseInt(highestRecord["ID"]);
    let lastEventId = parseInt(highestRecord["EventID"]);

    data["Data e Ora"] = data["Data e Ora"].replace("T", " ");
    data["Data e Ora"] = data["Data e Ora"] + "." + data["Millisecondi"];

    earthquake["ID"] = (lastId + 1).toString();
    earthquake["EventID"] = (lastEventId + 1).toString();

    let keys = Object.keys(data);

    for(let i = 0; i < keys.length; i++) {
        if(keys[i] !== "Millisecondi") {
            earthquake[keys[i]] = data[keys[i]];
        }
    }
    
    console.log(earthquake);
    currentEarthquakes.push(earthquake);

    fs.writeFileSync("src/db/earthquakes.json", JSON.stringify(currentEarthquakes));
    return respondWithMessage(res, 200, "Report aggiunto con successo!");
});

// PUT modify an existing report
app.put("/earthquakes/modify", (req, res) => {
    if(currentEarthquakes.length == 0) return respondWithMessage(res, 404, "Non ci sono report!");

    let data = req.body;
    let id = data["ID"];

    data["Data e Ora"] = data["Data e Ora"].replace("T", " ");
    data["Data e Ora"] = data["Data e Ora"] + "." + data["Millisecondi"];
    
    let record = findReportByIndex(id);

    if(!record) return respondWithMessage(res, 404, "Report non trovato!");

    let keys = Object.keys(data);

    for(let i = 0; i < keys.length; i++) {
        if(keys[i] !== "Millisecondi") {
            if(data[keys[i]] !== null || data[keys[i]] !== undefined) {
                record[keys[i]] = data[keys[i]];
            }
        }
    }

    fs.writeFileSync("src/db/earthquakes.json", JSON.stringify(currentEarthquakes));
    return respondWithMessage(res, 200, "Report modificato con successo!");
});

// DELETE delete an earthquake report
app.delete("/earthquakes/delete/:id", (req, res) => {
    if(currentEarthquakes.length == 0) return respondWithMessage(res, 404, "Non ci sono report!");

    const id = req.params.id;
    const index = currentEarthquakes.findIndex(record => record["ID"] == id);
    if(index == -1) return respondWithMessage(res, 404, "Report non trovato!");

    currentEarthquakes.splice(index, 1);
    fs.writeFileSync("src/db/earthquakes.json", JSON.stringify(currentEarthquakes));
    return respondWithMessage(res, 200, "Report eliminato con successo!");
});

// Start server
app.listen(port, ()=>console.log("Server in ascolto sulla porta " + port));

/*********************************/
/*         ENDPOINTS GUI         */
/*********************************/

app.get("/", (req, res) => res.redirect("/home"));

const pages = ["home", "segnalazioni", "ricerca", "segnalazione", "manage", "test"];
pages.forEach((page) => {
    app.get("/"+page, (req, res) => res.sendFile(path.join(__dirname, "src/pages/"+page+"/"+page+".html")));
});