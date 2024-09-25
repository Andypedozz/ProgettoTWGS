const resultsPerPage = 25;

var containerName;
var fixedTable;
var pagination;
var pages;
var currentData;
var tableColumns;

function DataTable(containerId, columns, data) {
    containerName = containerId;
    tableColumns = columns;
    currentData = data;
    pages = data.length / resultsPerPage;
    let page = 1;

    fillParts();
    fillHeader(columns);
    addPagination();
    if(data != null || data.length > 0) {
        updateTable(page);
    }
}

// Fill Header
function fillHeader(columns) {
    const thead = fixedTable.getElementsByTagName("thead")[0];
    
    let newRow = thead.insertRow();
    newRow.id = "header-row";
    for(let i = 0; i < columns.length; i++) {
        let newCell = newRow.insertCell();
        newCell.innerHTML = columns[i];
    }
    
    fixedTable.appendChild(thead);
}

function fillParts() {
    const container = document.getElementById(containerName);
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
    
    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);
    fixedTable = table;
}

// Fill rows
function fillRows(data) {
    let tbody = fixedTable.getElementsByTagName("tbody")[0];

    for(let i = 0; i < data.length; i++) {
        let newRow = tbody.insertRow();
        let record = data[i];

        for(let j = 0; j < tableColumns.length; j++) {
            let newCell = newRow.insertCell();
            if(Array.isArray(record)) {
                // load as array
                if(tableColumns[j] === "ID") {
                    let link = document.createElement("a");
                    link.href = "/segnalazione?ID="+record[j];
                    link.innerHTML = record[j];
                    newCell.appendChild(link);
                }else{
                    newCell.innerHTML = record[j];
                }
            }else{
                // load as json object
                if(tableColumns[j] === "ID") {
                    let link = document.createElement("a");
                    link.href = "/segnalazione?ID="+record[tableColumns[j]];
                    link.innerHTML = record[tableColumns[j]];
                    newCell.appendChild(link);
                }else{
                    newCell.innerHTML = record[tableColumns[j]];
                }
            }
        }
    }

    fixedTable.appendChild(tbody);
}

function addPagination() {
    const container = document.getElementById(containerName);

    let div = document.createElement("div");
    div.id = "page-buttons";

    let prevPageBtn = document.createElement("button");
    prevPageBtn.id = "prev-page-btn";
    prevPageBtn.innerHTML = "Indietro";
    let pageIndexLbl = document.createElement("a");
    pageIndexLbl.id = "page-index-lbl";
    pageIndexLbl.innerHTML = "1";
    let nextPageBtn = document.createElement("button");
    nextPageBtn.id = "next-page-btn";
    nextPageBtn.innerHTML = "Avanti";

    prevPageBtn.addEventListener("click", function (e) {
        previousPage();
    });
    nextPageBtn.addEventListener("click", function (e) {
        nextPage();
    });

    div.appendChild(prevPageBtn);
    div.appendChild(pageIndexLbl);
    div.appendChild(nextPageBtn);
    container.appendChild(div);
}

function clearRows() {
    const tbody = fixedTable.getElementsByTagName("tbody")[0];
    
    while(tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
}

function previousPage() {
    const pageIndex = document.getElementById("page-index-lbl");
    let page = parseInt(pageIndex.innerHTML);

    if(page > 1) {
        page = page - 1;
        updateTable(page);
        pageIndex.innerHTML = page;
    }
}

function nextPage() {
    const pageIndex = document.getElementById("page-index-lbl");
    let page = parseInt(pageIndex.innerHTML);

    if(page < pages) {
        page = page + 1;
        updateTable(page);
        pageIndex.innerHTML = page;
    }
}

function updateTable(page) {
    const tbody = fixedTable.getElementsByTagName("tbody")[0];

    if(tbody.hasChildNodes) {
        clearRows();
    }

    let startIndex = (page - 1) * resultsPerPage;
    let endIndex = startIndex + resultsPerPage;
    let data = currentData.slice(startIndex,endIndex);
    fillRows(data);
}

function fetchMapData() {
    let mapData = [
        {
            "ID" : "0",
            "EventID" : "0",
            "Data e Ora" : "2024-12-04",
            "Latitudine" : "13.3",
            "Longitudine" : "12.5",
            "Profondita" : "10",
            "Localita" : "Fano"
        },
        {
            "ID" : "1",
            "EventID" : "1",
            "Data e Ora" : "2024-12-04",
            "Latitudine" : "13.3",
            "Longitudine" : "12.5",
            "Profondita" : "10",
            "Localita" : "Fano"
        },
        {
            "ID" : "2",
            "EventID" : "2",
            "Data e Ora" : "2024-12-04",
            "Latitudine" : "13.3",
            "Longitudine" : "12.5",
            "Profondita" : "10",
            "Localita" : "Fano"
        },
        {
            "ID" : "3",
            "EventID" : "3",
            "Data e Ora" : "2024-12-04",
            "Latitudine" : "13.3",
            "Longitudine" : "12.5",
            "Profondita" : "10",
            "Localita" : "Fano"
        },
        {
            "ID" : "4",
            "EventID" : "4",
            "Data e Ora" : "2024-12-04",
            "Latitudine" : "13.3",
            "Longitudine" : "12.5",
            "Profondita" : "10",
            "Localita" : "Fano"
        },
    ];

    return mapData;
}

function fetchArrayData() {
    let dataArray = [
        [
            "0",
            "0",
            "2024-12-04",
            "13.3",
            "12.5",
            "10"
        ],
        [
            "0",
            "0",
            "2024-12-04",
            "13.3",
            "12.5",
            "10"
        ],
        [
            "0",
            "0",
            "2024-12-04",
            "13.3",
            "12.5",
            "10"
        ],
        [
            "0",
            "0",
            "2024-12-04",
            "13.3",
            "12.5",
            "10"
        ],
        [
            "0",
            "0",
            "2024-12-04",
            "13.3",
            "12.5",
            "10"
        ],
    ];

    return dataArray;
}
