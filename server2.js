const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const port = 3002;

const earthquakes = fs.readFileSync("src/db/earthquakes.json");
var currentEarthquakes = JSON.parse(earthquakes);
currentEarthquakes = Object.values(currentEarthquakes);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/")));
app.use(express.json({ type: '*/*' })); 

/*****************************/
/*         ENDPOINTS         */
/*****************************/

// GET all earthquakes
app.get('/earthquakes', (req, res) => {
    if(currentEarthquakes.length == 0) {
        let resMessage = "There are no reports";
        console.log("Response: "+resMessage);
        res.json({ message : resMessage});
        return 0;
    }

    res.json(currentEarthquakes);
});

// GET an earthquake report by ID
app.get('/earthquakes/:id', (req, res) => {
    if(currentEarthquakes.length == 0) {
        let resMessage = "There are no reports";
        console.log("Response: "+resMessage);
        res.json({ message : resMessage});
        return 0;
    }

    const id = req.params.id;
    if(id == null) {
        res.status(400);
        let resMessage = "Id is null";
        console.log("Response: "+resMessage);
        res.json({ message : resMessage});
    }

    let toReturn = currentEarthquakes.find(record => record["ID"] === id);
    if(toReturn == null || toReturn == undefined) {
        res.status(404);
        let resMessage = "Report not found!";
        console.log("Response: "+resMessage);
        res.json({ message : resMessage});
    }

    res.status(200);
    res.json(toReturn);
});

// GET a range of earthquakes reports
app.get('/earthquakes/:startIndex/:endIndex', (req, res) => {
    if(currentEarthquakes.length == 0) {
        let resMessage = "There are no reports";
        console.log("Response: "+resMessage);
        res.json({ message : resMessage});
        return 0;
    }

    const startIndex = req.params.startIndex;
    const endIndex = req.params.endIndex;

    if(startIndex == null || endIndex == null) {
        res.status(400);
        let resMessage = "Either startIndex or endIndex is null";
        console.log("Response: "+resMessage);
        res.json({ message : resMessage});
        return 0;
    }
    
    let data = currentEarthquakes.slice(startIndex,endIndex);
    if(data == null || data == undefined) {
        res.status(404);
        let resMessage = "Invalid range or resources not found";
        console.log("Response: "+resMessage);
        res.json({ message : resMessage});
    }

    res.status(200);
    res.json(data);
});

// GET all earthquakes reports with a certain key/value pair
app.get("/earthquakes/query/:key/:value", (req, res) => {
    const key = req.params.key;
    const value = req.params.value;

    let result = [];

    if(key === "ID" || key === "EventID")  {
        result = currentEarthquakes.filter((record) => parseInt(record[key]) === parseInt(value));
    }else if(key === "Latitudine" || key === "Longitudine" || key === "Profondita" || key === "Magnitudo") {
        result = currentEarthquakes.filter((record) => parseFloat(record[key]) === parseFloat(value));
    }else if(key === "Data"){
        result = currentEarthquakes.filter((record) => JSON.stringify(record["Data e Ora"]).includes(value));
    }else{
        result = currentEarthquakes.filter((record) => JSON.stringify(record[key]).includes(value));
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
    let resMessage = "Successfully added record";
    console.log("Response: "+resMessage);
    res.json({ message : resMessage});
});

// PUT: update an earthquake report
app.put("/earthquakes/modify", (req, res) => {
    if(currentEarthquakes.length == 0) {
        let resMessage = "There are no reports";
        console.log("Response: "+resMessage);
        res.json({ message : resMessage});
        return 0;
    }

    let data = req.body;
    let id = data["ID"];

    data["Data e Ora"] = data["Data e Ora"].replace("T", " ");
    data["Data e Ora"] = data["Data e Ora"] + "." + data["Millisecondi"];
    
    console.log(data);
    let record = currentEarthquakes.find(row => row["ID"] === id);

    if(record == null || record == undefined) {
        res.status(404);
        let resMessage = "Record to modify doesn't exist";
        console.log("Response: "+resMessage);
        res.json({ message : resMessage});
    }

    let keys = Object.keys(data);

    for(let i = 0; i < keys.length; i++) {
        if(keys[i] !== "Millisecondi") {
            if(data[keys[i]] !== null || data[keys[i]] !== undefined) {
                record[keys[i]] = data[keys[i]];
            }
        }
    }

    fs.writeFileSync("src/db/earthquakes.json", JSON.stringify(currentEarthquakes));
    let resMessage = "Succesfully modified record";
    console.log("Response: "+resMessage);
    res.json({ message : resMessage});
});

// DELETE an earthquake report
app.delete("/earthquakes/delete/:id", (req, res) => {
    if(currentEarthquakes.length == 0) {
        let resMessage = "There are no reports";
        console.log("Response: "+resMessage);
        res.json({ message : resMessage});
        return 0;
    }

    let id = req.params.id;
    let index = currentEarthquakes.findIndex(record => record["ID"] === id);
    
    if (index === -1) {
        res.status(404);
        let resMessage = "Report not found!";
        console.log("Response: "+resMessage);
        res.json({ message : resMessage});
        return 0;
    }
    
    currentEarthquakes.splice(index, 1);
    fs.writeFileSync("src/db/earthquakes.json", JSON.stringify(currentEarthquakes));
    let resMessage = "Succesfully deleted record";
    console.log("Response: "+resMessage);
    res.json({ message : resMessage});
});

app.listen(port, () => {
    console.log("Server in ascolto sulla porta "+port);
});

/*********************************/
/*         ENDPOINTS GUI         */
/*********************************/

const pages = ["home", "segnalazioni", "ricerca", "segnalazione", "manage", "test"];
pages.forEach((page) =>
    app.get(`/${page}`, (req, res) => res.sendFile(path.join(__dirname, `src/pages/${page}/${page}.html`)))
);

app.get("/", (req, res) => res.redirect("/home"));
