
class DataTable {

    constructor(config) {
        this.initAttributes(config);
        this.loadParts();
    }

    initAttributes(config) {
        this.container = document.getElementById(config["containerId"]);
        this.columns = config["columns"];
        this.dataColumns = config["dataColumns"];
        this.data = config["data"];
        this.resultsPerPage = config["pageResults"];
        this.pages = this.data.length / this.resultsPerPage;
        this.page = 1;
    }

    loadParts() {
        this.loadTable();
        this.loadHeader();
        this.updateRows();
        this.addPagination();
    }

    loadTable() {
        const table = document.createElement("table");
        this.container.appendChild(table);
    }

    // generate header
    loadHeader() {
        const table = this.container.getElementsByTagName("table")[0];
        const thead = document.createElement("thead");

        const row = document.createElement("tr");
        const cols = Object.values(this.columns);
        cols.forEach(element => {
            const th = document.createElement("th");
            th.innerText = element;
            row.appendChild(th);
        });
        thead.appendChild(row);
        table.appendChild(thead);
    }
    
    // generate rows
    updateRows() {
        this.clearRows();
        const table = this.container.getElementsByTagName("table")[0];
        const tbody = document.createElement("tbody");
        
        const [startIndex, endIndex] = this.getIndexes();
        const data = this.data.slice(startIndex, endIndex);
        data.forEach(record => {
            const row = document.createElement("tr");
            for(const key of this.dataColumns) {
                const field = record[key]; 
                const td = document.createElement("td");
                if(key == "ID") {
                    const a = document.createElement("a");
                    a.innerText = field;
                    a.href = "/segnalazione?ID="+field;
                    td.appendChild(a);
                }else{
                    td.innerText = field;
                }
                row.appendChild(td);
            }
            tbody.appendChild(row);
        });
            
        table.appendChild(tbody);
    }

    addPagination() {
        const div = document.createElement("div");
        div.id = "page-buttons";
        const prevBtn = document.createElement("button");
        prevBtn.innerText = "Indietro";
        const pageLbl = document.createElement("label");
        pageLbl.innerText = this.page;
        const nextBtn = document.createElement("button");
        nextBtn.innerText = "Avanti";

        prevBtn.addEventListener("click", () => {
            if(this.page > 1) {
                this.page--;
                this.updateRows();
                pageLbl.innerText = this.page;
            }
        });
            
        nextBtn.addEventListener("click", () => {
            if(this.page < this.pages) {
                this.page++;
                this.updateRows();
                pageLbl.innerText = this.page;
            }
        });

        div.appendChild(prevBtn);
        div.appendChild(pageLbl);
        div.appendChild(nextBtn);
        this.container.appendChild(div);
    }

    getIndexes() {
        const startIndex = (this.page - 1) * this.resultsPerPage;
        const endIndex = startIndex + this.resultsPerPage;
        const indexes = [startIndex, endIndex];
        return indexes;
    }

    clearRows() {
        const table = this.container.getElementsByTagName("table")[0];
        const tbody = table.getElementsByTagName("tbody")[0];
        if(tbody) {
            table.removeChild(tbody);
        }
    }

}