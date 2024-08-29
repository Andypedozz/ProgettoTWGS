function loadTable(query) {
    const resultsPerPage = 28;
    let pageIndex, page, startIndex, endIndex, key, value, url, nextPage;
    
    const table = document.getElementById("tabella");
    const tbody = table.getElementsByTagName("tbody")[0];
    
    if(query) {
        key = document.getElementById("key-select").value;
        value = document.getElementById("input-field").value;
        url = "/earthquakes/query?key="+key+"&value="+value;
    }else{
        pageIndex = document.getElementById("page-index");
        nextPage = document.getElementById("next-page");
        page = pageIndex.innerText;
        startIndex = (page - 1) * resultsPerPage;
        endIndex = startIndex + resultsPerPage;
        url = "/earthquakes?startIndex="+startIndex+"&endIndex="+endIndex;
    }

    fetch(url, {
        method: "GET",
        headers: {
            "Content-Type" : "application/json"
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
    .catch(error => console.error("Errore: "+error));
}

function clearData() {
    const table = document.getElementById("tabella");
    const tbody = table.getElementsByTagName("tbody")[0];
    while(tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
}

function nextPage(query) {
    let nextPage = document.getElementById("next-page");
    let pageIndex = document.getElementById("page-index");
    let value = pageIndex.innerText;
    pageIndex.innerHTML = parseInt(value) + 1;
    loadTable(query);
}

function previousPage(query) {
    let pageIndex = document.getElementById("page-index");
    let value = pageIndex.innerText;
    if(parseInt(value) !== 1) {
        pageIndex.innerHTML = parseInt(value) - 1;
        loadTable(query);
    }
}
