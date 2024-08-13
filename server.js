const express = require("express");
const path = require("path");
const fs = require("fs");
const cheerio = require("cheerio");
const app = express();
const port = 3000;

const earthquakes = fs.readFileSync("src/db/earthquakes.json");
var currentEarthquakes = JSON.parse(earthquakes);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/")));

/****************************/
/*         ENDPOINT         */
/****************************/

// GET: ottieni la lista di tutti i terremoti
app.get('/earthquakes', (req, res) => {
    if(currentEarthquakes.length == 0) {
        res.type('text/plain').send("Non ci sono terremoti disponibili!");
        return 0;
    }

    const id = req.query.id;
    if(id != null) {
        let data = Object.values(currentEarthquakes);
        res.json(data[Number.parseInt(id)]);
        console.log("Index");
        return 0;
    }

    const startIndex = req.query.startIndex;
    const endIndex = req.query.endIndex;

    if(startIndex != null && endIndex != null) {
        let data = Object.values(currentEarthquakes);
        data = data.slice(startIndex,endIndex);
        console.log("Range");
        res.json(data);
        return 0;
    }

    console.log("Normal");
    res.json(currentEarthquakes);
});

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

// POST: crea una nuova segnalazione
app.post("/earthquakes/add", (req, res) => {
    let data = req.body;
    let earthquake = [];

    let lastRecord = currentEarthquakes[currentEarthquakes.length - 1];
    let lastId = parseInt(lastRecord[0]);
    let lastEventId = parseInt(lastRecord[1]);

    earthquake.push(lastId + 1);
    earthquake.push(lastEventId + 1);
    earthquake.push(data.datetime);
    earthquake.push(data.latitude);
    earthquake.push(data.longitude);
    earthquake.push(data.depth);
    earthquake.push(data.author);
    earthquake.push(data.magType);
    earthquake.push(data.magnitude);
    earthquake.push(data.zone);

    // console.log(earthquake);
    currentEarthquakes.push(earthquake);

    // fs.writeFileSync("src/db/earthquakes.json", JSON.stringify(currentEarthquakes));
    res.send("Message: Successfully added record!");
});

// PUT: aggiorna una segnalazione --> aggiorna il magnitudo data la posizione della segnalazione
app.put("/earthquakes/modify", (req, res) => {

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
    const resultsPerPage = 28;
    let html = fs.readFileSync("src/pages/segnalazioni/segnalazioni.html");
    let page = req.query.page;
    let data = currentEarthquakes.slice();
    data = data.reverse();
    
    if(page == null)
        page = 1;
    let startIndex = (page - 1) * resultsPerPage;
    let endIndex = startIndex + resultsPerPage;
    data = data.slice(startIndex,endIndex);

    const $ = cheerio.load(html);

    // carico la tabella
    const table = $('tbody');
    for(var record of data) {
        table.append("<tr>",
                        "<td class='td_id'><a href='/segnalazione?id="+record[0]+"'>"+record[0]+"</a></td>",
                        "<td class='td_event_id'>"+record[1]+"</td>",
                        "<td class='td_datetime'>"+record[2]+"</td>",
                        "<td class='td_lat'>"+record[3]+"</td>",
                        "<td class='td_long'>"+record[4]+"</td>",
                        "<td class='td_depth'>"+record[5]+"</td>",
                        "<td class='td_author'>"+record[6]+"</td>",
                        "<td class='td_mag_type'>"+record[7]+"</td>",
                        "<td class='td_magnitude'>"+record[8]+"</td>",
                        "<td class='td_zone'>"+record[9]+"</td>",
                    "</tr>"
        );
    }

    // Setto l'indice di pagina
    const pageIndex = $('#page-index');
    pageIndex.text(page);

    // Setto i tasti avanti e indietro pagina
    const nextPageBtn = $("#next-page");
    const nextPage = parseInt(page) + 1;
    const previousPage = parseInt(page) - 1;
    const previousPageBtn = $('#previous-page');
    if(page != 1) {
        previousPageBtn.attr('href', '/segnalazioni?page='+previousPage);
    }

    if(data[data.length - 1][0] !== currentEarthquakes[currentEarthquakes.length - 1][0]) {
        nextPageBtn.attr('href', '/segnalazioni?page='+nextPage);
    }
    
    html = $.html();
    res.send(html);
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