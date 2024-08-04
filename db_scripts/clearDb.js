const mysql = require("mysql");

function clearDb() {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "EraserH34d_#",
        database: "terremoti"
    });

    con.connect(function(err) {
        var entries = 0;
        if(err)
            throw err;
        var sql = "DELETE FROM eventi;";
        con.query(sql, (err) => {
            if(err)
                throw err;
        });
        con.commit();
        con.end();
    })
}

clearDb();