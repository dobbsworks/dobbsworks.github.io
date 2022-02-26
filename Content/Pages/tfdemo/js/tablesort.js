var allLevels = [
    { code: "B44-RYC-62G", maker: "Rogervalo TC FBT", title: "In the nightside of Eden", difficulty: 2.5, style: "SMW", tags: ["0 CP", "Short & Sweet"] },
    { code: "6JC-K0N-TLF", maker: "AMMondMilk", title: "Planet No-put-foot", difficulty: 1, style: "SMW", tags: ["0 CP"] },
    { code: "498-KLG-RQF", maker: "defman144", title: "SJL_TV caverns #TF", difficulty: 5, style: "SMW", tags: ["1 CP"] },
    { code: "JW2-5T7-JVG", maker: "Hanzo", title: "-[Shots Fired]- [TF]", difficulty: 2, style: "SMW", tags: ["0 CP"] },
    { code: "1BR-N43-N0H", maker: "Dolph1n", title: "Peppermint Pie #TeamFantastik", difficulty: 3, style: "SMB3", tags: ["Contest", "FS V"] },
    { code: "TGW-V7Q-HSF", maker: "Joshbones", title: "Where's my Z? #TF #TJ", difficulty: 3, style: "SMW", tags: ["Contest", "FS V"] },
    { code: "1GK-NBP-62G", maker: "PhoenixNL", title: "Biohazard #TF#FS", difficulty: 2.5, style: "SMW", tags: ["Contest", "FS V"] },
    { code: "PSK-V3N-HDF", maker: "jevarel_UXB_56X-V1N-6JF", title: "No Shells please. We're British.", difficulty: 1, style: "SMB1", tags: ["Contest", "FS V"] },
];
var filteredData = [];
var levelSorter = "difficulty";
var sortDirection = 1;
var itemsPerPage = 3;
var currentPage = 1;

setTimeout(InitializeTable, 500);

function InitializeTable() {
    var table = document.getElementById("level-table");
    var headers = table.rows[0].cells;
    for (let header of headers) {
        if (header.dataset.sort) {
            header.onclick = OnClickHeader;
        }
    }
    RefreshTable();
}

function OnClickHeader(e) {
    let newSorter = e.target.dataset.sort;
    if (newSorter == levelSorter) {
        sortDirection *= -1;
    } else {
        sortDirection = 1;
    }
    levelSorter = newSorter;

    let ascText = " (ASC)";
    let descText = " (DESC)";
    let headerRow = e.target.parentElement;
    for (let tableHeader of headerRow.children) {
        tableHeader.innerHTML = tableHeader.innerHTML.replace(ascText, "").replace(descText, "");
        if (tableHeader == e.target) {
            tableHeader.innerHTML += (sortDirection == 1 ? ascText : descText);
        }
    }

    RefreshTable();
}

function RefreshTable() {
    let lastPage = Math.ceil(filteredData.length / itemsPerPage);
    if (currentPage > lastPage) currentPage = lastPage;
    if (currentPage < 1) currentPage = 1;

    allLevels.sort((a,b) => a[levelSorter] < b[levelSorter] ? -sortDirection : sortDirection);
    filteredData = allLevels;
    let startingRecordIndex = (currentPage - 1) * itemsPerPage;
    let endingRecordExclusiveIndex = startingRecordIndex + itemsPerPage;
    let thisPage = filteredData.slice(startingRecordIndex, endingRecordExclusiveIndex);
    RenderTableData(thisPage);

    let nextButton = document.getElementById("level-table-next");
    let prevButton = document.getElementById("level-table-prev");
    prevButton.disabled = (currentPage == 1);
    nextButton.disabled = (currentPage == lastPage);

    let text = document.getElementById("level-table-text");
    let startRecordNum = startingRecordIndex + 1;
    let endingRecordNum = Math.min(endingRecordExclusiveIndex, filteredData.length);
    text.innerHTML = `${startRecordNum} - ${endingRecordNum} of ${filteredData.length} levels`

}

function PrevPage(button) {
    currentPage--;
    RefreshTable();
}

function NextPage(button) {
    currentPage++;
    RefreshTable();
}

function ClearTable(table) {
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
}

function RenderTableData(records) {
    var table = document.getElementById("level-table");
    ClearTable(table);
    for (let record of records) {
        var row = table.insertRow(table.rows.length);
        row.insertCell(0).innerHTML = record.code;
        row.insertCell(1).innerHTML = record.maker;
        row.insertCell(2).innerHTML = record.title;
        row.insertCell(3).innerHTML = record.difficulty;
    }
}