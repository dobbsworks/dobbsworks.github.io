function RequestTableData() {
    // fetch('')
    //     .then(response => response.json())
    //     .then(data => 
    //         InitializeTable("level-table-container", data, LevelTableRender)
    //     );
    // fetch('')
    //     .then(response => response.json())
    //     .then(data => 
    //         InitializeTable("user-table-container", data, UserTableRender)
    //     );
}


function InitializeTable(containerId, data, rowRenderer) {
    var container = document.getElementById(containerId);
    var paginationPlaceholder = container.querySelector(".pagination-placeholder");
    paginationPlaceholder.innerHTML = `<div class="table-navigation">
    <div class="table-navigation-text"></div>
    <div class="table-navigation-buttons">
        <select class="records-per-page">
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
            <option value="999999">Show all</option>
        </select>
        <button class="prev-button">Previous</button>
        <button class="next-button">Next</button>
    </div>
</div>`;
    var table = container.querySelector(".data-table");
    var prevButton = container.querySelector(".prev-button");
    var nextButton = container.querySelector(".next-button");
    prevButton.onclick = () => { PrevPage(dataTableObj); }
    nextButton.onclick = () => { NextPage(dataTableObj); }

    //TODO style
    let allTags = data.filter(a => a.tags).flatMap(a => a.tags.split(", ")).filter((value, index, self) => {
        return self.indexOf(value) === index;
    });
    let textNav = container.querySelector(".table-navigation-text");

    var dataTableObj = {
        container: container,
        tableEl: table,
        levelSorter: "points",
        sortDirection: 1,
        itemsPerPage: 10,
        currentPage: 1,
        nextButton: nextButton,
        prevButton: prevButton,
        textNav: textNav,
        allRecords: data,
        filteredRecords: data,
        tagFilters: [],
        rowRenderer: rowRenderer
    }
    var headers = table.rows[0].cells;
    for (let header of headers) {
        if (header.dataset.sort) {
            header.onclick = () => { OnClickHeader(header, dataTableObj) };
        }
    }
    var filters = container.querySelectorAll(".filters input");
    for (let filter of filters) {
        filter.onchange = () => { RefreshTable(dataTableObj) };
        filter.onkeyup = () => { RefreshTable(dataTableObj) };
    }

    var pageCountInput = container.querySelector(".records-per-page");
    pageCountInput.onchange = () => { RefreshTable(dataTableObj) };
    RefreshTable(dataTableObj);
    return dataTableObj;
}

function OnClickHeader(header, dataTableObj) {
    let newSorter = header.dataset.sort;
    if (newSorter == dataTableObj.levelSorter) {
        dataTableObj.sortDirection *= -1;
    } else {
        dataTableObj.sortDirection = 1;
    }
    dataTableObj.levelSorter = newSorter;

    let ascText = " (ASC)";
    let descText = " (DESC)";
    let headerRow = header.parentElement;
    for (let tableHeader of headerRow.children) {
        tableHeader.innerHTML = tableHeader.innerHTML.replace(ascText, "").replace(descText, "");
        if (tableHeader == header) {
            tableHeader.innerHTML += (dataTableObj.sortDirection == 1 ? ascText : descText);
        }
    }

    dataTableObj.currentPage = 1;
    RefreshTable(dataTableObj);
}

function OnClickTag(tagEl, dataTableObj, add) {
    let tag = tagEl.textContent;
    if (add) {
        if (dataTableObj.tagFilters.indexOf(tag) == -1) {
            dataTableObj.tagFilters.push(tag);
        }
    } else {
        dataTableObj.tagFilters = dataTableObj.tagFilters.filter(a => a != tag);
    }
    let filterTagContainer = dataTableObj.container.querySelector(".filter-tags");
    if (add) {
        filterTagContainer.innerHTML += tagEl.outerHTML;
    } else {
        filterTagContainer.innerHTML = filterTagContainer.innerHTML.replace(tagEl.outerHTML, "");
    }
    for (let tag of filterTagContainer.querySelectorAll(".level-tag")) {
        tag.onclick = () => { OnClickTag(tag, dataTableObj, false) };
    }
    RefreshTable(dataTableObj);
}

function RefreshTable(dataTableObj) {
    dataTableObj.allRecords.sort((a, b) => a[dataTableObj.levelSorter] < b[dataTableObj.levelSorter] ? -dataTableObj.sortDirection : dataTableObj.sortDirection);
    dataTableObj.itemsPerPage = +(dataTableObj.container.querySelector(".records-per-page").value);
    dataTableObj.filteredRecords = dataTableObj.allRecords;
    var filters = dataTableObj.container.querySelectorAll(".filters input");
    for (let filter of filters) {
        let filterCol = filter.dataset.filterCol;
        let filterType = filter.dataset.filterType;
        let filterValue = filter.value;
        if (!filterCol || !filterType || !filterValue) continue;
        if (filterType == "min") {
            filterValue = +(filterValue);
            dataTableObj.filteredRecords = dataTableObj.filteredRecords.filter(a => a[filterCol] >= filterValue);
        }
        if (filterType == "max") {
            filterValue = +(filterValue);
            dataTableObj.filteredRecords = dataTableObj.filteredRecords.filter(a => a[filterCol] <= filterValue);
        }
        if (filterType == "like") {
            let columns = filterCol.split(",");
            dataTableObj.filteredRecords = dataTableObj.filteredRecords.filter(a => columns.some(c => {
                return a[c] && a[c].toLowerCase().indexOf(filterValue.toLowerCase()) > -1
            }));
        }
    }
    dataTableObj.filteredRecords = dataTableObj.filteredRecords.filter(a => dataTableObj.tagFilters.every(t => {
        return a.tags.indexOf(t) > -1 || a.levelStyle == t
    }));


    let lastPage = Math.ceil(dataTableObj.filteredRecords.length / dataTableObj.itemsPerPage);
    if (dataTableObj.currentPage > lastPage) dataTableObj.currentPage = lastPage;
    if (dataTableObj.currentPage < 1) dataTableObj.currentPage = 1;
    let startingRecordIndex = (dataTableObj.currentPage - 1) * dataTableObj.itemsPerPage;
    let endingRecordExclusiveIndex = startingRecordIndex + dataTableObj.itemsPerPage;
    let thisPage = dataTableObj.filteredRecords.slice(startingRecordIndex, endingRecordExclusiveIndex);
    RenderTableData(dataTableObj, thisPage);

    dataTableObj.prevButton.disabled = (dataTableObj.currentPage == 1);
    dataTableObj.nextButton.disabled = (dataTableObj.currentPage == lastPage);

    let startRecordNum = startingRecordIndex + 1;
    let endingRecordNum = Math.min(endingRecordExclusiveIndex, dataTableObj.filteredRecords.length);
    dataTableObj.textNav.innerHTML = `${startRecordNum} - ${endingRecordNum} of ${dataTableObj.filteredRecords.length} rows`

}

function PrevPage(dataTableObj) {
    dataTableObj.currentPage--;
    RefreshTable(dataTableObj);
}

function NextPage(dataTableObj) {
    dataTableObj.currentPage++;
    RefreshTable(dataTableObj);
}

function ClearTable(table) {
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
}

function RenderTableData(dataTableObj, records) {
    var table = dataTableObj.tableEl;
    ClearTable(table);
    for (let record of records) {
        var row = table.insertRow(table.rows.length);
        dataTableObj.rowRenderer(record, row);
    }
    for (let tag of table.querySelectorAll(".level-tag")) {
        tag.onclick = () => { OnClickTag(tag, dataTableObj, true) };
    }
}

function LevelTableRender(record, row) {
    row.insertCell(0).innerHTML = record.code;
    row.insertCell(1).innerHTML = record.author;
    row.insertCell(2).innerHTML =
        `${record.title} <span class="level-tag style-${record.levelStyle.toLowerCase()}">${record.levelStyle}</span>` +
        record.tags.split(", ").map(a => `<span class="level-tag">${a}</span>`).reduce((a, b) => a + b, "");
    row.insertCell(3).innerHTML = record.points;
}

function UserTableRender(record, row) {
    row.insertCell(0).innerHTML = record.rank;
    row.insertCell(1).innerHTML = record.userName;
    row.insertCell(2).innerHTML = record.makerID;
    row.insertCell(3).innerHTML = record.clearCount;
    row.insertCell(4).innerHTML = record.levelCount;
    row.insertCell(5).innerHTML = record.points;
}