"use strict";
var DataService = /** @class */ (function () {
    function DataService() {
    }
    DataService.DefaultErrorHandler = function (error) {
    };
    DataService.BaseCall = function (urlAction, method, body, onSuccess, onError) {
        if (onError === void 0) { onError = DataService.DefaultErrorHandler; }
        var baseUrl = "https://dabbleworlds1.azurewebsites.net/api/";
        if (window.location.href.indexOf("localhost") > -1) {
            baseUrl = "https://localhost:7121/api/";
        }
        if (window.location.href.startsWith("http://127.0.0.1/") || window.location.href.startsWith("http://127.0.0.1:5500/")) {
            return;
        }
        var endpoint = baseUrl + urlAction;
        var init = { method: method };
        if (method == "POST") {
            init.body = JSON.stringify(body);
            //init.mode = 'no-cors',
            init.headers = {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            };
        }
        fetch(endpoint, init).then(function (response) {
            if (response.status && !response.ok) {
                try {
                    response.text().then(function (res) {
                        try {
                            var message = JSON.parse(res).message;
                            if (message)
                                UIDialog.Alert(message, "OK");
                        }
                        catch (e) { }
                    });
                }
                catch (e) { }
                throw new Error("Status " + response.status);
            }
            var raw = response.text();
            return raw;
        }).then(function (response) {
            if (response.startsWith("[") || response.startsWith("{")) {
                response = JSON.parse(response);
            }
            onSuccess(response);
        }).catch(function (error) {
            console.error(error);
            document.getElementById("errorLog").innerText += error + " \n" + endpoint + " \n" + error.stack;
            onError(error);
        });
    };
    DataService.BaseGet = function (urlAction, onSuccess, onError) {
        if (onError === void 0) { onError = DataService.DefaultErrorHandler; }
        DataService.BaseCall(urlAction, "GET", null, onSuccess, onError);
    };
    DataService.BasePost = function (urlAction, body, onSuccess, onError) {
        if (onError === void 0) { onError = DataService.DefaultErrorHandler; }
        DataService.BaseCall(urlAction, "POST", body, onSuccess, onError);
    };
    DataService.BaseDelete = function (urlAction, onSuccess, onError) {
        if (onError === void 0) { onError = DataService.DefaultErrorHandler; }
        DataService.BaseCall(urlAction, "DELETE", null, onSuccess, onError);
    };
    DataService.SampleSimpleCall = function () {
        DataService.BaseGet("SampleApi/SampleSimpleCall", function (data) {
            console.log(data);
        });
    };
    DataService.SampleSimpleCall2 = function () {
        DataService.BaseGet("SampleApi/SampleSimpleCall2/myText", function (data) {
            console.log(data);
        });
    };
    DataService.SamplePOST = function () {
        DataService.BasePost("SampleApi/SamplePost", { Id: 1, DiscordId: "test", Username: "test test" }, function (data) {
            console.log(data);
        });
    };
    DataService.GetMyLevels = function () {
        return new Promise(function (resolve, reject) {
            DataService.BaseGet("Levels/MyLevels", resolve, reject);
        });
    };
    DataService.GetRecentLevels = function (pageIndex) {
        return new Promise(function (resolve, reject) {
            DataService.BaseGet("LevelSearch/RecentLevels?pageIndex=" + pageIndex, resolve, reject);
        });
    };
    DataService.GetOldestLevels = function (pageIndex) {
        return new Promise(function (resolve, reject) {
            DataService.BaseGet("LevelSearch/OldestLevels?pageIndex=" + pageIndex, resolve, reject);
        });
    };
    DataService.GetMostLikedLevels = function (pageIndex) {
        return new Promise(function (resolve, reject) {
            DataService.BaseGet("LevelSearch/MostLikedLevels?pageIndex=" + pageIndex, resolve, reject);
        });
    };
    DataService.GetBestRatedLevels = function (pageIndex) {
        return new Promise(function (resolve, reject) {
            DataService.BaseGet("LevelSearch/BestRatedLevels?pageIndex=" + pageIndex, resolve, reject);
        });
    };
    DataService.GetUndiscoveredLevels = function (pageIndex) {
        return new Promise(function (resolve, reject) {
            DataService.BaseGet("LevelSearch/UndiscoveredLevels?pageIndex=" + pageIndex, resolve, reject);
        });
    };
    DataService.GetMostPlayedLevels = function (pageIndex) {
        return new Promise(function (resolve, reject) {
            DataService.BaseGet("LevelSearch/MostPlayedLevels?pageIndex=" + pageIndex, resolve, reject);
        });
    };
    DataService.GetEasiestLevels = function (pageIndex) {
        return new Promise(function (resolve, reject) {
            DataService.BaseGet("LevelSearch/EasiestLevels?pageIndex=" + pageIndex, resolve, reject);
        });
    };
    DataService.GetHardestLevels = function (pageIndex) {
        return new Promise(function (resolve, reject) {
            DataService.BaseGet("LevelSearch/HardestLevels?pageIndex=" + pageIndex, resolve, reject);
        });
    };
    DataService.UploadLevel = function (levelUpload) {
        return new Promise(function (resolve, reject) {
            DataService.BasePost("Levels/UploadLevel", levelUpload, resolve, reject);
        });
    };
    DataService.UploadLevelAuditLog = function (levelData) {
        return new Promise(function (resolve, reject) {
            var level = new LevelUploadDT("x", levelData, "x");
            DataService.BasePost("Levels/UploadLevelAuditLog", level, resolve, reject);
        });
    };
    DataService.PublishLevel = function (levelCode) {
        return new Promise(function (resolve, reject) {
            DataService.BasePost("Levels/PublishLevel?levelCode=" + levelCode, {}, resolve, reject);
        });
    };
    DataService.LikeLevel = function (levelCode) {
        return new Promise(function (resolve, reject) {
            DataService.BasePost("Levels/LikeLevel?levelCode=" + levelCode, {}, resolve, reject);
        });
    };
    DataService.DislikeLevel = function (levelCode) {
        return new Promise(function (resolve, reject) {
            DataService.BasePost("Levels/DislikeLevel?levelCode=" + levelCode, {}, resolve, reject);
        });
    };
    DataService.RemoveLevel = function (levelCode) {
        return new Promise(function (resolve, reject) {
            DataService.BaseDelete("Levels/RemoveLevel?levelCode=" + levelCode, resolve, reject);
        });
    };
    DataService.LogLevelPlayStarted = function (levelCode) {
        return new Promise(function (resolve, reject) {
            DataService.BasePost("Levels/LogLevelPlayStarted", { levelCode: levelCode }, resolve, reject);
        });
    };
    DataService.LogLevelPlayDone = function (progress) {
        return new Promise(function (resolve, reject) {
            DataService.BasePost("Levels/LogLevelPlayDone", progress, resolve, reject);
        });
    };
    DataService.UpdateNameAndAvatar = function (avatarCode, newName) {
        return new Promise(function (resolve, reject) {
            DataService.BasePost("Users/UpdateNameAndAvatar?avatarCode=" + avatarCode + "&name=" + newName, {}, resolve, reject);
        });
    };
    DataService.GetUserData = function () {
        return new Promise(function (resolve, reject) {
            DataService.BaseGet("Users/GetUserData", resolve, reject);
        });
    };
    DataService.LogMarathonRun = function (difficulty, levelsCleared, finalFrameCount, winnings) {
        return new Promise(function (resolve, reject) {
            DataService.BasePost("Marathon/LogRun?difficulty=" + difficulty +
                "&levelsCleared=" + levelsCleared + "&finalFrameCount=" + finalFrameCount +
                "&winnings=" + winnings, {}, resolve, reject);
        });
    };
    DataService.CheckFor3RingUnlock = function (difficulty) {
        return new Promise(function (resolve, reject) {
            DataService.BasePost("Marathon/Log3RingRun?difficulty=" + difficulty, {}, resolve, reject);
        });
    };
    DataService.GetUserCurrency = function () {
        return new Promise(function (resolve, reject) {
            DataService.BaseGet("Currency/GetCurrency", resolve, reject);
        });
    };
    DataService.RollForUnlock = function (cost) {
        return new Promise(function (resolve, reject) {
            DataService.BasePost("Carnival/RollForUnlock?cost=" + cost, {}, resolve, reject);
        });
    };
    DataService.GetUserStatsByUserId = function (userId) {
        return new Promise(function (resolve, reject) {
            DataService.BaseGet("Users/GetUserStatsByUserId?userId=" + userId, resolve, reject);
        });
    };
    DataService.GetCurrentContest = function () {
        return new Promise(function (resolve, reject) {
            DataService.BaseGet("Contest/GetCurrentContest", resolve, reject);
        });
    };
    DataService.SubmitContestLevel = function (levelCode) {
        return new Promise(function (resolve, reject) {
            DataService.BasePost("Contest/SubmitContestLevel?levelCode=" + levelCode, {}, resolve, reject);
        });
    };
    DataService.GetContestLevels = function (pageIndex) {
        return new Promise(function (resolve, reject) {
            DataService.BaseGet("LevelSearch/ContestLevels?pageIndex=" + pageIndex, resolve, reject);
        });
    };
    DataService.SubmitContestVote = function (levelCode, vote) {
        return new Promise(function (resolve, reject) {
            DataService.BasePost("Contest/SubmitContestVote?levelCode=" + levelCode + "&vote=" + vote, {}, resolve, reject);
        });
    };
    return DataService;
}());
