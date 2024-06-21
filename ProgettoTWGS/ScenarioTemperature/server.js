/* 

Intro a NodeJS e ExpressJS: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Introduction
Documentazione Express : https://expressjs.com/en/4x/api.html 

*/
// Iniziallizzo

// Creates an Express application. The express() function is a top-level function exported by the express module.
const express = require("express");
// The app object conventionally denotes the Express application. Create it by calling the top-level express() function exported by the Express module
const app = express();
const fs = require('fs');
const parse = require('csv-parse').parse

// ---------- Uso dell'interfaccia grafica in Glitch ----------
// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('src', __dirname);

// Esempio temperature
app.get('/temperature', (req, res) => {
  res.render(__dirname + '/src/temperature.html');
});

app.get('/datamilanocsv', (req, res) => {
  console.log("Carico Temperature Milano, 2018")
  res.type('text/csv').sendFile(__dirname + '/src/testdaymilan.csv');
});

// ----- Temperature: elaborazione lato server -----
app.get('/temperature2018', (req, res) => {
  res.render(__dirname + '/src/temperature2018Milano.html');
});

app.get('/milano2018csv', (req, res) => {
  console.log("Carico Temperature Milano, 2018")
  const lambratedatetime = [];
  const lambratetemps = [];

  fs.createReadStream(__dirname + '/src/subsetmilano2018.csv')
    .pipe(parse({ delimiter: ";", from_line: 2 }))
    .on("data", function (row) {
      console.log("Riga corrente " + row);
      console.log("Città " + row[0]);
       if(String(row[0]).localeCompare("Lambrate") == 0 && !isNaN(row[3])){
         console.log("Zona: " + row[0] + " Data-ora: " + row[2] + " Temperatura: " + row[3]);
         lambratedatetime.push(row[2]);
         lambratetemps.push(parseFloat(row[3]));
       }
    })
    .on("end", function () {
      console.log("finished");
      return res.json({datetime: lambratedatetime, temperature: lambratetemps})
    })
    .on("error", function (error) {
      console.log(error.message);
    });
});

app.get('/media', (req, res) => {
  console.log("Calcolo Media Lambrate, giorno 01/01/2018")
  var somma = 0;
  var media = 0;
  var ncampionamenti = 0;

  fs.createReadStream(__dirname + '/src/subsetmilano2018.csv')
    .pipe(parse({ delimiter: ";", from_line: 2 }))
    .on("data", function (row) {
      console.log("Riga corrente " + row);
      console.log("Città " + row[0]);
      // Zone;Id Sensore;Data-Ora;Media
       if(String(row[0]).localeCompare("Lambrate") == 0 && !isNaN(row[3])){
         ncampionamenti++;
         somma += parseFloat(row[3]);
         console.log("somma corrente " + somma)
       }
    })
    .on("end", function () {
      media = somma / ncampionamenti;
      console.log("Media Lambrate: " + media);
      console.log("finished");
      return res.json({media: media})
    })
    .on("error", function (error) {
      console.log(error.message);
    });
});

// Makes the server listen for connections on port 
const server = app.listen(process.env.PORT, function () {
  console.log("Listening for connections on port " + process.env.PORT);
});
