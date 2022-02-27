
// rawData.split("\n---").filter(a => a.length > 5).map(a => a.replace("\n","")).map(a => ({
//     code: a.substring(0,11).replace("\n",""),
//     title: a.substring(13).split("' by ")[0],
//     maker: a.split("' by ")[1].split(" ")[0].split("\n")[0],
//     difficulty: a.split("Difficulty: ")[1].split(" ")[0],
//     style: a.split(" | Style: ")[1].split(" | ")[0],
//     tags: a.split(" | Tags: ")[1].split(", "),
//    // raw: a 
// })).map(a => `{code: "${a.code}", maker: "${a.maker}", title: "${a.title}", difficulty: ${a.difficulty}, style: "${a.style}", tags: ["${a.tags.join('","')}"] },`)

var levelTable;
setTimeout(() => {
    levelTable = InitializeTable("level-table-container", allLevelsTestData);
}, 100);

function InitializeTable(containerId, data) {

    var container = document.getElementById(containerId);
    var table = container.querySelector(".data-table");
    var prevButton = container.querySelector(".prev-button");
    var nextButton = container.querySelector(".next-button");
    prevButton.onclick = () => { PrevPage(dataTableObj); }
    nextButton.onclick = () => { NextPage(dataTableObj); }
    
    let allTags = data.flatMap(a => a.tags).filter( (value, index, self) => {
        return self.indexOf(value) === index;
    });
    let textNav = container.querySelector(".table-navigation-text");

    var dataTableObj = {
        container: container,
        tableEl: table,
        levelSorter: "difficulty",
        sortDirection: 1,
        itemsPerPage: 10,
        currentPage: 1,
        nextButton: nextButton,
        prevButton: prevButton,
        textNav: textNav,
        allRecords: data,
        filteredRecords: data,
        tagFilters: []
    }
    var headers = table.rows[0].cells;
    for (let header of headers) {
        if (header.dataset.sort) {
            header.onclick = () => { OnClickHeader(header, dataTableObj) };
        }
    }
    var filters = container.querySelectorAll(".filters input");
    for (let filter of filters) {
        filter.onchange = () => {RefreshTable(dataTableObj)};
        filter.onkeyup = () => {RefreshTable(dataTableObj)};
    }

    var pageCountInput = container.querySelector(".records-per-page");
    pageCountInput.onchange = () => {RefreshTable(dataTableObj)};
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
    dataTableObj.allRecords.sort((a,b) => a[dataTableObj.levelSorter] < b[dataTableObj.levelSorter] ? -dataTableObj.sortDirection : dataTableObj.sortDirection);
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
                return a[c].toLowerCase().indexOf(filterValue.toLowerCase()) > -1
            }));
        }
    }
    dataTableObj.filteredRecords = dataTableObj.filteredRecords.filter(a => dataTableObj.tagFilters.every(t => {
        return a.tags.indexOf(t) > -1 || a.style == t
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
    dataTableObj.textNav.innerHTML = `${startRecordNum} - ${endingRecordNum} of ${dataTableObj.filteredRecords.length} levels`

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
        row.insertCell(0).innerHTML = record.code;
        row.insertCell(1).innerHTML = record.maker;
        row.insertCell(2).innerHTML = 
            `${record.title} <span class="level-tag style-${record.style.toLowerCase()}">${record.style}</span>` +
            record.tags.map(a => `<span class="level-tag">${a}</span>`).reduce((a,b)=>a+b,"");
        row.insertCell(3).innerHTML = record.difficulty;
    }
    for(let tag of table.querySelectorAll(".level-tag")) {
        tag.onclick = () => { OnClickTag(tag, dataTableObj, true)};
    }
}