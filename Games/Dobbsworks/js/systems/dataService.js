"use strict";
var DataService = /** @class */ (function () {
    function DataService() {
    }
    DataService.DefaultErrorHandler = function (error) {
        // no additional actions, just send to console
    };
    DataService.BaseCall = function (urlAction, method, body, onSuccess, onError) {
        if (onError === void 0) { onError = DataService.DefaultErrorHandler; }
        var baseUrl = "https://dabbleworlds1.azurewebsites.net/api/";
        if (window.location.href.indexOf("localhost") > -1) {
            baseUrl = "https://localhost:7121/api/";
        }
        if (window.location.href.startsWith("http://127.0.0.1/")) {
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
    // static GetRecentLevels(): Promise<LevelListing[]> {
    //     return new Promise<LevelListing[]>((resolve, reject) => {
    //         DataService.BaseGet("Levels/RecentLevels", resolve, reject);
    //     })
    // }
    DataService.GetRecentLevels = function () {
        return new Promise(function (resolve, reject) {
            DataService.BaseGet("LevelSearch/RecentLevels", resolve, reject);
        });
    };
    DataService.GetOldestLevels = function () {
        return new Promise(function (resolve, reject) {
            DataService.BaseGet("LevelSearch/OldestLevels", resolve, reject);
        });
    };
    DataService.GetMostLikedLevels = function () {
        return new Promise(function (resolve, reject) {
            DataService.BaseGet("LevelSearch/MostLikedLevels", resolve, reject);
        });
    };
    DataService.GetBestRatedLevels = function () {
        return new Promise(function (resolve, reject) {
            DataService.BaseGet("LevelSearch/BestRatedLevels", resolve, reject);
        });
    };
    DataService.GetUndiscoveredLevels = function () {
        return new Promise(function (resolve, reject) {
            DataService.BaseGet("LevelSearch/UndiscoveredLevels", resolve, reject);
        });
    };
    DataService.GetMostPlayedLevels = function () {
        return new Promise(function (resolve, reject) {
            DataService.BaseGet("LevelSearch/MostPlayedLevels", resolve, reject);
        });
    };
    DataService.GetEasiestLevels = function () {
        return new Promise(function (resolve, reject) {
            DataService.BaseGet("LevelSearch/EasiestLevels", resolve, reject);
        });
    };
    DataService.GetHardestLevels = function () {
        return new Promise(function (resolve, reject) {
            DataService.BaseGet("LevelSearch/HardestLevels", resolve, reject);
        });
    };
    DataService.UploadLevel = function (levelUpload) {
        return new Promise(function (resolve, reject) {
            DataService.BasePost("Levels/UploadLevel", levelUpload, resolve, reject);
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
    return DataService;
}());
