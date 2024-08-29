
function DataTable(columns, data) {
    const table = document.getElementById("table");
    const values = Object.values(data);

    // add header
    const thead = document.createElement("thead");
    thead.appendChild("tr");
    for(var column in columns) {
        let th = document.createElement("th");
        th.innerHTML = column;
        thead.appendChild(th);
    }
    table.appendChild(thead);

    // add rows
    const tbody = document.createElement("tbody");
    for(var row in values) {
        let tr = document.createElement("tr");
        tr.innerHTML = row;
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
}
