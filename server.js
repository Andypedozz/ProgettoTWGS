const express = require("express");
const path = require("path");
const fs = require("fs");
const mysql = require("mysql");
const cheerio = require("cheerio");
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "/")));

// ENDPOINTS

/**
 * Home page - Root
 */
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "home.html"));
});

/**
 * Home page
 */
app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "home.html"));
});

/**
 * List of reports page
 */
app.get("/segnalazioni", async function(req, res) {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 40;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    var sql = "SELECT * FROM eventi WHERE id BETWEEN 0 AND 40;";
    const records = await runQuery(sql);
    const initialPage = await readHtml('segnalazioni.html');
    const modified = await modifyHtml(initialPage, records);
    console.log(modified);
    res.send(modified);
});

/**
 * Stats Page
 */
app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname, "stats.html"));
});

app.listen(port, () => {
    console.log("Server listening at http://localhost:"+port);
});

/*****************************/
/*          FUNCTIONS        */
/*****************************/

async function runQuery(query) {
    return new Promise((resolve,reject) => {
        var records = [];

        var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "EraserH34d_#",
            database: "terremoti"
        });
    
        con.connect(function(err) {
            if(err)
                throw err;
            con.query(query, (err, results, fields) => {
                if(err) {
                    con.destroy();
                    throw err;
                }
                resolve(results);
            });
            con.end();
        })
    });
}

async function readHtml(filepath) {
    return new Promise((resolve,reject) => {
        fs.readFile(filepath, "utf8", (err,data) =>{
            if(err) {
                reject(err);
            }
            resolve(data);
        });
    });
}

async function modifyHtml(html, records) {
    return new Promise((resolve,reject) => {
        const $ = cheerio.load(html);

        const table = $('tbody');
    
        for(var record of records) {
            table.append("<tr>",
                            "<td><a href='/segnalazione'>"+record.id+"</a></td>",
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
        resolve($.html());
    });
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