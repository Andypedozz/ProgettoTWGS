const express = require("express");
const path = require("path");
const fs = require("fs");
const mysql = require("mysql");
const cheerio = require("cheerio");
const { start } = require("repl");
const app = express();
const port = 3000;

const earthquakes = fs.readFileSync("earthquakes.json");
var currentEarthquakes = JSON.parse(earthquakes);

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
    const startIndex = req.query.startIndex;
    const endIndex = req.query.endIndex;

    if(id != null) {
        let data = Object.values(currentEarthquakes);
        res.json(data[Number.parseInt(id)]);
        console.log("Index");
        return 0;
    }

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

// POST: crea una nuova segnalazione
app.post("/earthquake", (req, res) => {
    const earthquake = req.body;

    let data = Object.values(currentEarthquakes);
    let lastRecord = data[data.length - 1];
    let lastId = lastRecord[0];
    let lastEventId = lastRecord[1];

    earthquake[0] = lastId + 1;;
    earthquake[1] = lastEventId + 1;;
    console.log(earthquake);
    currentEarthquakes.push(earthquake);

    console.log("Terremoto aggiunto!");
    console.log("Terremoti attualmente in lista: "+ currentEarthquakes.length);

    fs.writeFileSync("earthquakes.json", JSON.stringify(currentEarthquakes));
});

// PUT: aggiorna una segnalazione --> aggiorna il magnitudo data la posizione della segnalazione
app.put("/earthquake/:id/:magnitude", (req, res) => {
    if(currentEarthquakes.length == 0) {
        res.type('text/plain').send("Non ci sono terremoti disponibili!");
        return 0;
    }

    const index = Number.parseInt(req.params.id);
    const magnitude = req.params.magnitude;

    if(index > 0 && index <= currentEarthquakes.length) {
        var elem = currentEarthquakes[index - 1];
        elem.Magnitude = magnitude;
        currentEarthquakes[index - 1] = elem;
        fs.writeFileSync("earthquakes.json", JSON.stringify(currentEarthquakes));
        res.type("text/plain").send("Segnalazione aggiornata");
        return;
    }
    // segnalazione cercata assente
    res.sendStatus(404);
});

/********************************/
/*         ENDPOINT GUI         */
/********************************/

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "home.html"));
});

app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "home.html"));
});

app.get("/segnalazioni", (req, res) => {
    let html = fs.readFileSync("segnalazioni.html");
    let data = currentEarthquakes;

    let page = req.query.page;

    if(page == null)
        page = 1;
    let startIndex = (page - 1) * 40;
    let endIndex = startIndex + 40;
    data = data.slice(startIndex,endIndex);

    const $ = cheerio.load(html);

    const table = $('tbody');

    for(var record of data) {
        table.append("<tr>",
                        "<td><a href='/segnalazione?id="+record[0]+"'>"+record[0]+"</a></td>",
                        "<td>"+record[1]+"</td>",
                        "<td>"+record[2]+"</td>",
                        "<td>"+record[3]+"</td>",
                        "<td>"+record[4]+"</td>",
                        "<td>"+record[5]+"</td>",
                        "<td>"+record[6]+"</td>",
                        "<td>"+record[7]+"</td>",
                        "<td>"+record[8]+"</td>",
                        "<td>"+record[9]+"</td>",
                    "</tr>"
        );
    }

    html = $.html();
    res.send(html);
});

app.get("/segnalazione", async function(req, res) {
    // let html = await readHtml("segnalazione.html");
    // let data = Object.values(currentEarthquakes);
    
    // if(id == null) {
    //     res.sendStatus(403);
    //     return;
    // }

    // let id = req.query.id;
    // data = data[id];
    res.sendFile(path.join(__dirname, "segnalazione.html"));
});

app.get("/create", (req, res) => {
    res.sendFile(path.join(__dirname, "create.html"));
});

app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname, "stats.html"));
});

app.listen(port, () => {
    console.log("Server in ascolto sulla porta "+port);
});