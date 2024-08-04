const path = require("path");
const fs = require("fs");
const mysql = require("mysql");
const cheerio = require("cheerio");

async function loadPage() {
    var sql = "SELECT * FROM eventi WHERE id = 74875;";
    const records = await runQuery(sql);
    console.log(records);
    const initialPage = await readHtml('segnalazioni.html');
    const modified = await modifyHtml(initialPage, records);
    console.log(modified);
}

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
            table.append("<tr>"+
                            "<td>"+record.id+"</td>"+
                            "<td>"+record.EventID+"</td>"+
                            "<td>"+record.Time+"</td>"+
                            "<td>"+record.Latitude+"</td>"+
                            "<td>"+record.Longitude+"</td>"+
                            "<td>"+record.Depth+"</td>"+
                            "<td>"+record.Author+"</td>"+
                            "<td>"+record.MagType+"</td>"+
                            "<td>"+record.Magnitude+"</td>"+
                            "<td>"+record.Zone+"</td>"+
                        "</tr>"
            );
        }
        resolve($.html());
    });
}

loadPage();