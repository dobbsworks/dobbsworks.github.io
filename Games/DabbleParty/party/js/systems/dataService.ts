class DataService {


    static DefaultErrorHandler(error: string): void {
    }


    static BaseCall(urlAction: string,
        method: string,
        body: any,
        onSuccess: (data: any) => void,
        onError: (data: any) => void = DataService.DefaultErrorHandler): void {

        let baseUrl = "https://dabbleworlds1.azurewebsites.net/api/";
        if (window.location.href.indexOf("localhost") > -1) {
            baseUrl = "https://localhost:7121/api/";
        }
        if (window.location.href.startsWith("http://127.0.0.1/") || window.location.href.startsWith("http://127.0.0.1:5500/")) {
            baseUrl = "https://localhost:7121/api/";
        }
        let endpoint = baseUrl + urlAction;
        let init = <RequestInit>{ method: method };
        if (method == "POST") {
            init.body = JSON.stringify(body);
            //init.mode = 'no-cors',
            init.headers = {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            };
        }
        fetch(endpoint, init).then(response => {
            if (response.status && !response.ok) {
                try {
                    response.text().then(res => {
                        try {
                            let message = JSON.parse(res).message;
                            //if (message) UIDialog.Alert(message, "OK");
                        } catch (e) { }
                    })
                } catch (e) { }
                throw new Error("Status " + response.status);
            }
            let raw = response.text();
            return raw;
        }).then(response => {
            if (response.startsWith("[") || response.startsWith("{")) {
                response = JSON.parse(response);
            }
            onSuccess(response);
        }).catch(error => {
            console.error(error);
            (<any>document.getElementById("errorLog")).innerText += error + " \n" + endpoint + " \n" + error.stack;

            onError(error);
        });
    }

    static BaseGet(urlAction: string, onSuccess: (data: any) => void, onError: (data: any) => void = DataService.DefaultErrorHandler): void {
        DataService.BaseCall(urlAction, "GET", null, onSuccess, onError);
    }

    static BasePost(urlAction: string, body: any, onSuccess: (data: any) => void, onError: (data: any) => void = DataService.DefaultErrorHandler): void {
        DataService.BaseCall(urlAction, "POST", body, onSuccess, onError);
    }

    static BaseDelete(urlAction: string, onSuccess: (data: any) => void, onError: (data: any) => void = DataService.DefaultErrorHandler): void {
        DataService.BaseCall(urlAction, "DELETE", null, onSuccess, onError);
    }





    static GetCurrentGames(): Promise<PartyGameDT[]> {
        return new Promise<PartyGameDT[]>((resolve, reject) => {
            DataService.BaseGet("Party/GetCurrentGames", resolve, reject);
        })
    }
    static SubmitScore(gameId: number, score: number, roundNumber: number): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            DataService.BasePost(`Party/SubmitScore?gameId=${gameId}&score=${score}&roundNumber=${roundNumber}`, {}, resolve, reject);
        })
    }
    static GetGameData(gameId: number): Promise<PartyGameDT> {
        return new Promise<PartyGameDT>((resolve, reject) => {
            DataService.BaseGet("Party/GetGameData?gameId=" + gameId, resolve, reject);
        })
    }
    static SaveGameData(gameData: PartyGameDT): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            DataService.BasePost(`Party/SaveGameData`, gameData, resolve, reject);
        })
    }
    static CreateParty(gameData: PartyGameDT): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            DataService.BasePost(`Party/CreateParty`, gameData, resolve, reject);
        })
    }
    static JoinParty(gameId: number, avatarIndex: number): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            DataService.BasePost(`Party/JoinParty?gameId=${gameId}&avatarIndex=${avatarIndex}`, {}, resolve, reject);
        })
    }






    // static GetHardestLevels(pageIndex: number): Promise<LevelBrowseResults> {
    //     return new Promise<LevelBrowseResults>((resolve, reject) => {
    //         DataService.BaseGet("LevelSearch/HardestLevels?pageIndex=" + pageIndex, resolve, reject);
    //     })
    // }

    // static UploadLevel(levelUpload: LevelUploadDT): Promise<string> {
    //     return new Promise<string>((resolve, reject) => {
    //         DataService.BasePost("Levels/UploadLevel", levelUpload, resolve, reject);
    //     })
    // }
}