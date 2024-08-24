function loadTable() {
    const table = document.getElementById("tabella");
    const tbody = table.getElementsByTagName("tbody")[0];

    const key = document.getElementById("key-select").value;
    const value = document.getElementById("input-field").value;

    const url = "/earthquakes/query?key="+key+"&value="+value;

    fetch(url, {
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        clearData();
        
        for(var i = 0; i < data.length; i++) {
            let newRow = tbody.insertRow();
            newRow.class = "record-row";
            for(var j = 0; j < data[i].length; j++) {
                let newCell = newRow.insertCell();
                newCell.innerHTML = data[i][j];
            }
        }
    })
    .catch((error) => console.error("Errore: "+error));
}

function clearData() {
    const table = document.getElementById("tabella");
    const tbody = table.getElementsByTagName("tbody")[0];
    
    while(tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
}

loadTable();