const resultsPerPage = 28;
var pages;

function ReportsTable(name, columns) {

    const container = document.getElementById("table-container");
    const table = document.createElement("table");
    table.id = "table";
    const thead = document.createElement("thead");
    thead.id = "thead";
    const tbody = document.createElement("tbody");
    tbody.id = "tbody";
    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);
    fillHeader(columns);
    const pageButtons = document.createElement("div");
    pageButtons.id = "page-buttons";
    const pageIndex = document.createElement("label");
    pageIndex.id = "page-index";
    pageIndex.innerHTML = 1;
    const prevPageBtn = document.createElement("button");
    prevPageBtn.id = "previous-page"
    prevPageBtn.innerHTML = "Indietro";
    const nextPageBtn = document.createElement("button");
    nextPageBtn.id = "next-page";
    nextPageBtn.innerHTML = "Avanti"
    pageButtons.appendChild(prevPageBtn);
    pageButtons.appendChild(pageIndex);
    pageButtons.appendChild(nextPageBtn);
    container.appendChild(pageButtons);
    prevPageBtn.addEventListener("click", function (e) {
        previousPage();
    });
    nextPageBtn.addEventListener("click", function (e) {
        nextPage();
    });
    updateTable(parseInt(pageIndex.innerHTML));
}

function fillHeader(columns) {
    const thead = document.getElementById("thead");

    let newRow = thead.insertRow();
    newRow.id = "header-row";
    for(var i = 0; i < columns.length; i++) {
        let newCell = newRow.insertCell();
        newCell.innerHTML = columns[i];
    }
}

function fillRows(url) {
    
    fetch(url, {
        method: "GET",
        headers: {
            "Content-Type" : "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        const tbody = document.getElementById("tbody");

        if(pages == null)
            pages = Math.ceil(parseInt(data[0]) / resultsPerPage);

        if(tbody.hasChildNodes)
            clearRows();

        // add rows
        for(var i = 0; i < data.length; i++) {
            let record = Object.values(data[i]);
            let newRow = tbody.insertRow();
            newRow.class = "record-row";
            for(var j = 0; j < record.length; j++) {
                let newCell = newRow.insertCell();
                newCell.innerHTML = record[j];
            }
        }
    });
}

function previousPage() {
    let pageIndex = document.getElementById("page-index");
    let page = parseInt(pageIndex.innerHTML);

    if(page > 1) {
        page = page - 1;
        updateTable(page);
        pageIndex.innerHTML = page;
    }
}

function nextPage() {
    let pageIndex = document.getElementById("page-index");
    let page = parseInt(pageIndex.innerHTML);

    if(parseInt(pageIndex.innerHTML) < pages) {
        page = page + 1;
        updateTable(page);
        pageIndex.innerHTML = page;
    }
}

function updateTable(page) {
    let startIndex = (page - 1) * resultsPerPage;
    let endIndex = startIndex + resultsPerPage;
    const url = "/earthquakes?startIndex="+startIndex+"&endIndex="+endIndex;
    fillRows(url);
}

function clearRows() {
    const tbody = document.getElementById("tbody");
    while(tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
}

