const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const port = 3000;
const cheerio = require("cheerio");
const mysql = require("mysql");
const { start } = require("repl");

app.use(express.static(path.join(__dirname, "/")));

// First page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Home page
app.get("/index", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Reports list Page
app.get("/segnalazioni", function(req, res) {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 40;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    var sql = "SELECT * FROM eventi WHERE id BETWEEN "+parseInt(startIndex)+" AND "+parseInt(endIndex)+";";
    const records = runQuery(sql);
    const initialPage = readHtml('segnalazioni.html');
    const modified = modifyHtml(initialPage, records);
    res.send(modified);
});

// Single report page
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

// Stats Page
app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname, "stats.html"));
});


app.listen(port, () => {
    console.log("Server listening at http://localhost:"+port);
});

// FUNCTIONS

function readHtml(filepath) {
    fs.readFile(filepath, "utf8", (err,data) =>{
        if(err) {
            throw err;
        }
        return data;
    });
}

function modifyHtml(html, records) {
    const $ = cheerio.load(html.html);

    const table = $('tabella');

    for(var record of records) {
        table.append("<tr>",
                        "<td>"+record.id+"</td>",
                        "<td>"+record.EventID+"</td>",
                        "<td>"+record.Time+"</td>",
                        "<td>"+record.Latitude+"</td>",
                        "<td>"+record.Longitude+"</td>",
                        "<td>"+record.Depth+"</td>",
                        "<td>"+record.Author+"</td>",
                        "<td>"+record.MagType+"</td>",
                        "<td>"+record.Magnitude+"</td>",
                        "<td>"+record.Zone+"</td>",
                    "</tr>"
        );
    }
    return $;
}

function runQuery(query) {
    var paginatedRecords = [];

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "EraserH34d_#",
        database: "terremoti"
    });

    con.connect(function(err) {
        if(err) {
            throw err;
        }
        var sql = query;
        con.query(sql, (results) => {
            paginatedRecords = results;
        });
        var records = Object.values(paginatedRecords)
        return records;
    })
}

function fetchData2() {
    const records = [{"id":1,"EventID":1,"Time":"2020-04-27 11:53:20.151820","Latitude":1.1,"Longitude":1.1,"Depth":1,"Author":"Andy","MagType":"Md","Magnitude":1.1,"Zone":"Marche"},
                     {"id":2,"EventID":2,"Time":"2020-04-27 11:53:20.151820","Latitude":2.2,"Longitude":2.2,"Depth":2,"Author":"Andy","MagType":"Md","Magnitude":2.2,"Zone":"Campania"},
                     {"id":3,"EventID":3,"Time":"2020-04-27 11:53:20.151820","Latitude":3.3,"Longitude":3.3,"Depth":3,"Author":"Andy","MagType":"Md","Magnitude":3.3,"Zone":"Emilia Romagna"},
                     {"id":4,"EventID":4,"Time":"2020-04-27 11:53:20.151820","Latitude":4.4,"Longitude":4.4,"Depth":4,"Author":"Andy","MagType":"Md","Magnitude":4.4,"Zone":"Lombardia"},
                     {"id":5,"EventID":5,"Time":"2020-04-27 11:53:20.151820","Latitude":5.5,"Longitude":5.5,"Depth":5,"Author":"Andy","MagType":"Md","Magnitude":3.2,"Zone":"Abruzzo"},
                     {"id":6,"EventID":6,"Time":"2020-04-27 11:53:20.151820","Latitude":6.6,"Longitude":6.6,"Depth":6,"Author":"Andy","MagType":"Md","Magnitude":3.6,"Zone":"Molise"},
                     {"id":7,"EventID":7,"Time":"2020-04-27 11:53:20.151820","Latitude":7.7,"Longitude":7.7,"Depth":7,"Author":"Andy","MagType":"Md","Magnitude":2.4,"Zone":"Basilicata"},
                     {"id":8,"EventID":8,"Time":"2020-04-27 11:53:20.151820","Latitude":8.8,"Longitude":8.8,"Depth":8,"Author":"Andy","MagType":"Md","Magnitude":1.8,"Zone":"Lazio"}];
    return records;
}



