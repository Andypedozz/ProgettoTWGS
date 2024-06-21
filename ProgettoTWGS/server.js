const express = require("express");
const path = require("path");
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
    res.sendFile(path.join(__dirname, "segnalazioni.html"));
});

app.get("/segnalazione.html", (req, res) => {
    const id = req.query.id;
    if(!id)
        return res.status(400).send("ID is required");
    res.sendFile(path.join(__dirname, "public", "segnalazione.html"));
});

app.get("/stats.html", (req, res) => {
    res.sendFile(path.join(__dirname, "stats.html"));
});


app.listen(port, () => {
    console.log("Server listening at http://localhost:"+port);
});


