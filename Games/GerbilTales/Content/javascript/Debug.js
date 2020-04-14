var timeLog = {};
var currentLogType = null;
var currentLogTime = null;

function StartLog(logType, specifiedCategory) {
    var category = "NONE";
    if (specifiedCategory) category = specifiedCategory;
    else if (arguments.callee && arguments.callee.caller) category = arguments.callee.caller.name;

    if (!timeLog[category]) timeLog[category] = {
        currentLogType: null,
        currentLogTime: null,
        logs: {}
    };
    
    var currentLogType = timeLog[category].currentLogType;
    var currentLogTime = timeLog[category].currentLogTime;

    if (currentLogType != null) {
        if (!timeLog[category].logs[currentLogType]) timeLog[category].logs[currentLogType] = 0;
        timeLog[category].logs[currentLogType] += (new Date() - currentLogTime);
    }
    timeLog[category].currentLogTime = new Date();
    timeLog[category].currentLogType = logType;
}

function EndLog() {
    var category = "NONE";
    if (arguments.callee && arguments.callee.caller) category = arguments.callee.caller.name;
    StartLog(null, category);
    timeLog[category].currentLogType = null;
}

function PrintLog() {
    for (var category in timeLog) {
        console.log(" ");
        console.log(category);
        var total = 0;
        for (var logType in timeLog[category].logs) total += timeLog[category].logs[logType];
        for (var logType in timeLog[category].logs) console.log((100 * timeLog[category].logs[logType] / total).toFixed(2) + "\t" + logType);
    }
}