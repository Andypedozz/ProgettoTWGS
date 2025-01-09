const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
// const port = process.env.PORT;
const port = 3002;

// Database
const earthquakes = fs.readFileSync("src/db/earthquakes.json");
var currentEarthquakes = JSON.parse(earthquakes);
currentEarthquakes = Object.values(currentEarthquakes);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/")));
app.use(express.json({ type: '*/*' }));

// Function to find a report by index
function findReportByIndex(index) {
    return currentEarthquakes.find(record => record["ID"] == index);
}

// Function to easily send a response with message and status
function respondWithMessage(res, status, error) {
    let resMessage = { message : error };
    res.status(status);
    console.log("Response: "+error);
    res.json(resMessage);
}

/*****************************/
/*         ENDPOINTS         */
/*****************************/

// GET all earthquakes
app.get("/earthquakes", (req, res) => {
    if(currentEarthquakes.length == 0) return respondWithMessage(res, 404, "There are no reports");

    res.status(200);
    res.json(currentEarthquakes);
});

// GET earthquake report by id
app.get("/earthquakes/:id", (req, res) => {
    if(currentEarthquakes.length == 0) return respondWithMessage(res, 404, "There are no reports");

    // Check if id param is present
    const id = req.params.id;
    if(!id) return respondWithMessage(res, 400, "Invalid id");

    // Check if report exists
    const toReturn = findReportByIndex(id);
    if(!toReturn) return respondWithMessage(res, 404, "Report not found");

    // return report
    res.status(200);
    res.json(toReturn);
});

// GET earthquakes between id range
app.get("/earthquakes/:startIndex/:endIndex", (req, res) => {
    if(currentEarthquakes.length == 0) return respondWithMessage(res, 404, "There are no reports");

    const { startIndex, endIndex } = req.params;
    if((!startIndex || !endIndex) || (parseInt(startIndex) > parseInt(endIndex))) {
        console.log(startIndex);
        console.log(endIndex);
        return respondWithMessage(res, 400, "Invalid range!");
    }

    const data = currentEarthquakes.slice(startIndex,endIndex);
    if(!data) return respondWithMessage(res, 404, "Resources not found!");

    res.status(200);
    res.json(data);
});

// GET search earthquake with certain key-value
app.get("/earthquakes/query/:key/:value", (req, res) => {
    if(currentEarthquakes.length == 0) return respondWithMessage(res, 404, "There are no reports");

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

    let highestRecord = currentEarthquakes[0];
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
    currentEarthquakes.unshift(earthquake);

    fs.writeFileSync("src/db/earthquakes.json", JSON.stringify(currentEarthquakes));
    return respondWithMessage(res, 200, "Succesfully added report!");
});

// PUT modify an existing report
app.put("/earthquakes/modify", (req, res) => {
    if(currentEarthquakes.length == 0) return respondWithMessage(res, 404, "There are no reports");

    let data = req.body;
    let id = data["ID"];

    data["Data e Ora"] = data["Data e Ora"].replace("T", " ");
    data["Data e Ora"] = data["Data e Ora"] + "." + data["Millisecondi"];
    
    let record = findReportByIndex(id);

    if(!record) return respondWithMessage(res, 404, "Report to modify doesn't exist");

    let keys = Object.keys(data);

    for(let i = 0; i < keys.length; i++) {
        if(keys[i] !== "Millisecondi") {
            if(data[keys[i]] !== null || data[keys[i]] !== undefined) {
                record[keys[i]] = data[keys[i]];
            }
        }
    }

    fs.writeFileSync("src/db/earthquakes.json", JSON.stringify(currentEarthquakes));
    return respondWithMessage(res, 200, "Succesfully modified report!");
});

// DELETE delete an earthquake report
app.delete("/earthquakes/delete/:id", (req, res) => {
    if(currentEarthquakes.length == 0) return respondWithMessage(res, 404, "There are no reports");

    const id = req.params.id;
    const index = currentEarthquakes.findIndex(record => record["ID"] == id);
    if(index == -1) return respondWithMessage(res, 404, "Report not found!");

    currentEarthquakes.splice(index, 1);
    fs.writeFileSync("src/db/earthquakes.json", JSON.stringify(currentEarthquakes));
    return respondWithMessage(res, 200, "Successfully deleted report!");
});

// Start server
app.listen(port, () => {
    console.log("Server in ascolto sulla porta "+port);
});

/*********************************/
/*         ENDPOINTS GUI         */
/*********************************/

app.get("/", (req, res) => res.redirect("/home"));

const pages = ["home", "segnalazioni", "ricerca", "segnalazione", "manage", "test"];
pages.forEach((page) => {
    app.get("/"+page, (req, res) => res.sendFile(path.join(__dirname, "src/pages/"+page+"/"+page+".html")));
});