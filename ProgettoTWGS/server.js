const express = require("express");
const path = require("path");
const parse = require("csv-parse");
const fs = require("fs");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/index.html", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/segnalazioni.html", (req, res) => {
    const records = fetchData();
    const filepath = "segnalazioni.html";
    fs.readFile(filepath, "utf8", (err, data) =>{
        if(err) {
            console.error(err);
            return;
        }

        var tabella = data.getElementById("tabella_segnalazioni");
        for(i = 0; i < records.length; i++) {
            var nuovaRiga = tabella.insertRow();
            var cella1 = nuovaRiga.insertCell(0);
            var cella2 = nuovaRiga.insertCell(1);
            var cella3 = nuovaRiga.insertCell(2);
            var cella4 = nuovaRiga.insertCell(3);
            var cella5 = nuovaRiga.insertCell(4);
            cella1.innerHTML = records[i].id;
            cella2.innerHTML = records[i].date;
            cella3.innerHTML = records[i].magnitude;
            cella4.innerHTML = records[i].zone;
            cella5.innerHTML = records[i].depth;
            res.sendFile(path.join(__dirname, filepath));
        }

    });

});

function fetchData() {
    records = [{"id":"0","date":"09-10-2022","magnitude":"4.6","zone":"Campania","depth":"50"},
        {"id":"1","date":"08-10-2022","magnitude":"3.1","zone":"Umbria","depth":"30"},
        {"id":"2","date":"07-10-2022","magnitude":"4.2","zone":"Emilia Romagna","depth":"40"},
        {"id":"3","date":"06-10-2022","magnitude":"2.3","zone":"Lombardia","depth":"35"},
        {"id":"4","date":"05-10-2022","magnitude":"2.4","zone":"Molise","depth":"38"},
        {"id":"5","date":"04-10-2022","magnitude":"1.2","zone":"Calabria","depth":"54"},
        {"id":"6","date":"09-10-2022","magnitude":"4.6","zone":"Campania","depth":"50"},
        {"id":"7","date":"08-10-2022","magnitude":"3.1","zone":"Umbria","depth":"30"},
        {"id":"8","date":"07-10-2022","magnitude":"4.2","zone":"Emilia Romagna","depth":"40"},
        {"id":"9","date":"06-10-2022","magnitude":"2.3","zone":"Lombardia","depth":"35"},
        {"id":"10","date":"05-10-2022","magnitude":"2.4","zone":"Molise","depth":"38"},
        {"id":"11","date":"04-10-2022","magnitude":"1.2","zone":"Calabria","depth":"54"},
        {"id":"12","date":"09-10-2022","magnitude":"4.6","zone":"Campania","depth":"50"},
        {"id":"13","date":"08-10-2022","magnitude":"3.1","zone":"Umbria","depth":"30"},
        {"id":"14","date":"07-10-2022","magnitude":"4.2","zone":"Emilia Romagna","depth":"40"},
        {"id":"15","date":"06-10-2022","magnitude":"2.3","zone":"Lombardia","depth":"35"},
        {"id":"16","date":"05-10-2022","magnitude":"2.4","zone":"Molise","depth":"38"},
        {"id":"17","date":"04-10-2022","magnitude":"1.2","zone":"Calabria","depth":"54"},
        {"id":"18","date":"09-10-2022","magnitude":"4.6","zone":"Campania","depth":"50"},
        {"id":"19","date":"08-10-2022","magnitude":"3.1","zone":"Umbria","depth":"30"},
        {"id":"20","date":"07-10-2022","magnitude":"4.2","zone":"Emilia Romagna","depth":"40"},
        {"id":"21","date":"06-10-2022","magnitude":"2.3","zone":"Lombardia","depth":"35"},
        {"id":"22","date":"05-10-2022","magnitude":"2.4","zone":"Molise","depth":"38"},
        {"id":"23","date":"04-10-2022","magnitude":"1.2","zone":"Calabria","depth":"54"},
        {"id":"24","date":"09-10-2022","magnitude":"4.6","zone":"Campania","depth":"50"},
        {"id":"25","date":"08-10-2022","magnitude":"3.1","zone":"Umbria","depth":"30"},
        {"id":"26","date":"07-10-2022","magnitude":"4.2","zone":"Emilia Romagna","depth":"40"},
        {"id":"27","date":"06-10-2022","magnitude":"2.3","zone":"Lombardia","depth":"35"},
        {"id":"28","date":"05-10-2022","magnitude":"2.4","zone":"Molise","depth":"38"},
        {"id":"29","date":"04-10-2022","magnitude":"1.2","zone":"Calabria","depth":"54"},
        {"id":"30","date":"09-10-2022","magnitude":"4.6","zone":"Campania","depth":"50"},
        {"id":"31","date":"08-10-2022","magnitude":"3.1","zone":"Umbria","depth":"30"},
        {"id":"32","date":"07-10-2022","magnitude":"4.2","zone":"Emilia Romagna","depth":"40"},
        {"id":"33","date":"06-10-2022","magnitude":"2.3","zone":"Lombardia","depth":"35"},
        {"id":"34","date":"05-10-2022","magnitude":"2.4","zone":"Molise","depth":"38"},
        {"id":"35","date":"04-10-2022","magnitude":"1.2","zone":"Calabria","depth":"54"},
        {"id":"36","date":"09-10-2022","magnitude":"4.6","zone":"Campania","depth":"50"},
        {"id":"37","date":"08-10-2022","magnitude":"3.1","zone":"Umbria","depth":"30"},
        {"id":"38","date":"07-10-2022","magnitude":"4.2","zone":"Emilia Romagna","depth":"40"},
        {"id":"39","date":"06-10-2022","magnitude":"2.3","zone":"Lombardia","depth":"35"},
        {"id":"40","date":"05-10-2022","magnitude":"2.4","zone":"Molise","depth":"38"}];

    return records;
}

app.get("/segnalazione.html", (req, res) => {

    const filepath = path.join(__dirname, "segnalazione.html");
    fs.readFile(filepath, "utf8", (err, data) => {
        if(err) {
            res.status(500).send("Errore nella lettura del file HTML");
            return;
        }

        // Modifico il contenuto del file
        const modifiedHtml = data.replace(
            '<td id="date">Data Esempio</td>',
            '<td id="magnitude">Magnitudo Esempio<td>',
            '<td id="zone">Zona Esempio</td>',
            '<td id="depth">Profondità esempio</td>'
        );

        res.sendFile(modifiedHtml);
    });
});

app.get("/stats.html", (req, res) => {
    res.sendFile(path.join(__dirname, "stats.html"));
});


app.listen(port, () => {
    console.log("Server listening at http://localhost:"+port);
});


