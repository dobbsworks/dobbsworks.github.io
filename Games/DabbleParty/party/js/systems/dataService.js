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
            baseUrl = "https://localhost:7121/api/";
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
                            //if (message) UIDialog.Alert(message, "OK");
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
    DataService.GetCurrentGames = function () {
        return new Promise(function (resolve, reject) {
            DataService.BaseGet("Party/GetCurrentGames", resolve, reject);
        });
    };
    DataService.SubmitScore = function (gameId, score, roundNumber) {
        return new Promise(function (resolve, reject) {
            DataService.BasePost("Party/SubmitScore?gameId=" + gameId + "&score=" + score + "&roundNumber=" + roundNumber, {}, resolve, reject);
        });
    };
    DataService.GetGameData = function (gameId) {
        return new Promise(function (resolve, reject) {
            DataService.BaseGet("Party/GetGameData?gameId=" + gameId, resolve, reject);
        });
    };
    DataService.SaveGameData = function (gameData) {
        return new Promise(function (resolve, reject) {
            DataService.BasePost("Party/SaveGameData", gameData, resolve, reject);
        });
    };
    DataService.CreateParty = function (gameData) {
        return new Promise(function (resolve, reject) {
            DataService.BasePost("Party/CreateParty", gameData, resolve, reject);
        });
    };
    DataService.JoinParty = function (gameId, avatarIndex) {
        return new Promise(function (resolve, reject) {
            DataService.BasePost("Party/JoinParty?gameId=" + gameId + "&avatarIndex=" + avatarIndex, {}, resolve, reject);
        });
    };
    return DataService;
}());
