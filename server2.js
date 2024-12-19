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

function findReportByIndex(index) {
    return currentEarthquakes.find(record => record["ID"] == index);
}

function respondWithError(res, status, error) {
    let resMessage = { message : error };
    res.status(status);
    console.log("Response: "+error);
    res.json(resMessage);
}

/*****************************/
/*         ENDPOINTS         */
/*****************************/

app.get("/earthquakes", (req, res) => {
    if(currentEarthquakes.length == 0) {
        return respondWithError(res, 404, "There are no reports");
    }

    res.status(200);
    res.json(currentEarthquakes);
});

app.get("/earthquakes/:id", (req, res) => {
    if(currentEarthquakes.length == 0) return respondWithError(res, 404, "There are no reports");

    // Check if id param is present
    const id = req.params.id;
    if(!id) return respondWithError(res, 400, "Invalid id");

    // Check if report exists
    const toReturn = findReportByIndex(id);
    if(!toReturn) return respondWithError(res, 404, "Report not found");

    // return report
    res.status(200);
    res.json(toReturn);
});

app.get("/earthquakes/:startIndex/:endIndex", (req, res) => {
    if(currentEarthquakes.length == 0) {
        return respondWithError(res, 404, "There are no reports");
    }

    const { startIndex, endIndex } = req.params;
    if((!startIndex || !endIndex) || (startIndex > endIndex)) {
        return respondWithError(res, 400, "Invalid range!");
    }

    const data = currentEarthquakes.slice(startIndex,endIndex);
    if(!data) return respondWithError(res, 404, "Resources not found!");

    res.status(200);
    res.json(data);
});

app.get("/earthquakes/query/:key/:value", (req, res) => {
    if(currentEarthquakes.length == 0) {
        return respondWithError(res, 404, "There are no reports");
    }

    const key = req.params.key;
    const value = req.params.value;
    
});

app.get("/earthquakes/add", (req, res) => {

});

app.get("/earthquakes/modify", (req, res) => {

});

app.get("/earthquakes/delete/:id", (req, res) => {
    if(currentEarthquakes.length == 0) {
        return respondWithError(res, 404, "There are no reports");
    }
});

app.listen(port, () => {
    console.log("Server in ascolto sulla porta "+port);
});

/*********************************/
/*         ENDPOINTS GUI         */
/*********************************/

// const pages = ["home", "segnalazioni", "ricerca", "segnalazione", "manage", "test"];
// pages.forEach((page) =>
//     app.get(`/${page}`, (req, res) => res.sendFile(path.join(__dirname, `src/pages/${page}/${page}.html`)))
// );

app.get("/", (req, res) => res.redirect("/home"));

const pages = [];
pages.forEach((page) => {
    app.get("/"+page, (req, res) => res.sendFile(path.join(__dirname, "src/pages/"+page+"/"+page+".html")));
});