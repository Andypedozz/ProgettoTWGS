function loadTable() {
    const page = document.getElementById("page-index").innerText;
    const resultsPerPage = 28;

    let startIndex = (page - 1) * resultsPerPage;
    let endIndex = startIndex + resultsPerPage;

    const url = "/earthquakes?startIndex="+startIndex+"&endIndex="+endIndex;
    fetch(url, {
        method: "GET",
        headers: {
            "Content-Type" : "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        clearTable();
        const table = document.getElementById("tabella");
        const tbody = table.getElementsByTagName("tbody")[0];
        let records = data.slice();

        for(var i = 0; i < records.length; i++) {
            let newRow = tbody.insertRow();
            newRow.class = "record-row";
            for(var j = 0; j < records[i].length; j++) {
                let newCell = newRow.insertCell();
                newCell.innerHTML = records[i][j];
            }
        }
    })
    .catch(error => console.error("Errore: "+error));
}

function clearTable() {
    const table = document.getElementById("tabella");
    const tbody = table.getElementsByTagName("tbody")[0];
    while(tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
}

loadTable();

