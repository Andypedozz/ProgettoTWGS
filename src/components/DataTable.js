const resultsPerPage = 28;
var currentData;
var pages;

function DataTable(name, columns, data) {
    currentData = data;
    pages = currentData.length / resultsPerPage;
    const container = document.getElementById(name);
    const table = document.createElement("table");
    table.id = "table";
    
    // thead
    const thead = document.createElement("thead")
    thead.id = "thead";
    
    // add header
    let newRow = thead.insertRow();
    newRow.id = "header-row";
    for(var i = 0; i < columns.length; i++) {
        let newCell = newRow.insertCell();
        newCell.innerHTML = columns[i];
    }

    // tbody
    const tbody = document.createElement("tbody");
    tbody.id = "tbody";
    
    // buttons div
    const pageButtons = document.createElement("div");
    pageButtons.id = "page-buttons";
    
    // index
    const pageIndex = document.createElement("label");
    pageIndex.id = "page-index";
    pageIndex.innerHTML = 1;
    
    // prev page
    const prevPageBtn = document.createElement("button");
    prevPageBtn.id = "previous-page"
    prevPageBtn.innerHTML = "Indietro"
    
    // next page
    const nextPageBtn = document.createElement("button");
    nextPageBtn.id = "next-page"
    nextPageBtn.innerHTML = "Avanti"
    
    table.appendChild(thead);
    table.appendChild(tbody);
    pageButtons.appendChild(prevPageBtn);
    pageButtons.appendChild(pageIndex);
    pageButtons.appendChild(nextPageBtn);
    container.appendChild(table);
    container.appendChild(pageButtons);
    updateTable();
    prevPageBtn.addEventListener("click", function (e) {
        previousPage();
    });
    nextPageBtn.addEventListener("click", function (e) {
        nextPage();
    });
}

function fillTable(data) {
    if(document.getElementById("tbody").childNodes.length > 0)
        clearTable();
    const tbody = document.getElementById("tbody");

    // add rows
    for(var i = 0; i < data.length; i++) {
        let newRow = tbody.insertRow();
        newRow.class = "record-row";
        for(var j = 0; j < data[i].length; j++) {
            let newCell = newRow.insertCell();
            newCell.innerHTML = data[i][j];
        }
    }
}

function previousPage() {
    const pageIndex = document.getElementById("page-index");
    let page = pageIndex.innerHTML;
    if(parseInt(page) > 1) {
        pageIndex.innerHTML = parseInt(page) - 1;
        updateTable();
    }
    console.log("prev page");
}

function nextPage() {
    const pageIndex = document.getElementById("page-index");
    let page = pageIndex.innerHTML;
    if(parseInt(page) < pages) {
        pageIndex.innerHTML = parseInt(page) + 1;
        updateTable()
    }
    console.log("next page");
}

function updateTable() {
    const pageIndex = document.getElementById("page-index");
    let page = pageIndex.innerHTML;
    
    let startIndex = (page - 1) * resultsPerPage;
    let endIndex = startIndex + resultsPerPage;
    let data = currentData.slice(startIndex,endIndex);
    clearTable();
    fillTable(data);
}

function clearTable() {
    const tbody = document.getElementById("tbody");
    while(tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
}

