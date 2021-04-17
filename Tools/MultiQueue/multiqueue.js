var entries = [];

function Init() {
    var params = new URL(window.location.href).searchParams;
    var streamers = params.get("streamers");
    if (streamers) {
        for (let streamer of streamers.split(",")) {
            GetEntriesFromUrl(`https://api.warp.world/${streamer}/warp_queue`, (res) => {
                let records = res.entries;
                records = records.map(a => ({
                    service: "WarpWorld",
                    streamer: streamer,
                    submitter: a.viewerName.replace("@", ""),
                    queueLink: `https://warp.world/streamqueue?streamer=${streamer}`,
                    timestamp: new Date(a.addedAt ),
                    code: a.notes
                }));
                AddEntries(records, "ww");
            });
            GetEntriesFromUrl(`https://viewerlevels.com/queue/streamer/${streamer}.txt`, (res) => {
                let records = res.queue;
                if (res.current) records = [res.current, ...records];
                records = records.map(a => ({
                    service: "ViewerLevels",
                    streamer: streamer,
                    submitter: a.submitter,
                    queueLink: `https://queue.viewerlevels.com/${streamer}`,
                    timestamp: new Date(a.timestamp * 1000),
                    code: a.code
                }));
                AddEntries(records, "vl");
            });
        }
    }
}

function GetEntriesFromUrl(url, onResponse) {
    let request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.onload = () => {
        onResponse(JSON.parse(request.responseText));
    }
    request.send();
}

function AddEntries(data, src) {
    //console.log(data, src)
    if (!data) return;
    if (!data.length) return;
    let now = new Date();
    let minTimestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let newEntries = data.filter(a => a.timestamp >= minTimestamp);
    entries.push(...newEntries);
    BuildTable();
}

function BuildTable() {
    let container = document.getElementById("tableContainer");

    entries.sort((a, b) => a.timestamp - b.timestamp)

    let table = `<table><thead><tr>
    <th>Stream</th>
    <th>Submitter</th>
    <th>Code</th>
    <th>Service</th>
    <th>Submitted</th>
    </tr></thead><tbody>`;
    for (let entry of entries) {
        table += `<tr>
        <td>
            <a href="twitch.tv/${entry.streamer}">${entry.streamer}</a>
        </td>
        <td>${entry.submitter}</td>
        <td>${entry.code}</td>
        <td>
            <a href="${entry.queueLink}">${entry.service}</a>
        </td>
        <td>${entry.timestamp.toLocaleTimeString()}</td>
        </tr>`;
    }
    table += `</tbody></table>`;
    container.innerHTML = table;
}

function TimeAgo(timestamp) {
    return GetTimeDiff(new Date(), timestamp);
}

function GetTimeDiff(t0, t1) {
    if (!t0 || !t1) return "";
    t0 = new Date(t0);
    t1 = new Date(t1);
    let totalTime = t1 - t0;
    let totalSeconds = Math.ceil(totalTime / 1000);
    let displayMinutes = Math.floor(totalSeconds / 60);
    let displaySeconds = totalSeconds % 60;
    return displayMinutes.toString().padStart(2, "0") + ":" + displaySeconds.toString().padStart(2, "0");
}

Init();
