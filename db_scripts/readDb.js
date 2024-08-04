const mysql = require("mysql");

function readDb() {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "EraserH34d_#",
        database: "terremoti"
    });

    con.connect(function(err) {
        if(err)
            throw err;
        var sql = "SELECT * FROM eventi;";
        con.query(sql, (err, results, fields) => {
            if(err) {
                con.destroy();
                throw err;
            }
            console.log(results);
        });
        con.commit();
        con.end();
    })
}

readDb();