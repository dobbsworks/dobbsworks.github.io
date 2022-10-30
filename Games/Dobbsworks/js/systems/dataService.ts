class DataService {


    static DefaultErrorHandler(error: string): void {
        // no additional actions, just send to console
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
        if (window.location.href.startsWith("http://127.0.0.1/") ) {
            return;
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




    static SampleSimpleCall(): void {
        DataService.BaseGet("SampleApi/SampleSimpleCall", (data) => {
            console.log(data);
        });
    }

    static SampleSimpleCall2(): void {
        DataService.BaseGet("SampleApi/SampleSimpleCall2/myText", (data) => {
            console.log(data);
        });
    }

    static SamplePOST(): void {
        DataService.BasePost("SampleApi/SamplePost", { Id: 1, DiscordId: "test", Username: "test test" }, (data) => {
            console.log(data);
        });
    }

    static GetMyLevels(): Promise<MyLevelsModel> {
        return new Promise<MyLevelsModel>((resolve, reject) => {
            DataService.BaseGet("Levels/MyLevels", resolve, reject);
        })
    }

    // static GetRecentLevels(): Promise<LevelListing[]> {
    //     return new Promise<LevelListing[]>((resolve, reject) => {
    //         DataService.BaseGet("Levels/RecentLevels", resolve, reject);
    //     })
    // }



    static GetRecentLevels(): Promise<LevelListing[]> {
        return new Promise<LevelListing[]>((resolve, reject) => {
            DataService.BaseGet("LevelSearch/RecentLevels", resolve, reject);
        })
    }

    static GetOldestLevels(): Promise<LevelListing[]> {
        return new Promise<LevelListing[]>((resolve, reject) => {
            DataService.BaseGet("LevelSearch/OldestLevels", resolve, reject);
        })
    }

    static GetMostLikedLevels(): Promise<LevelListing[]> {
        return new Promise<LevelListing[]>((resolve, reject) => {
            DataService.BaseGet("LevelSearch/MostLikedLevels", resolve, reject);
        })
    }

    static GetBestRatedLevels(): Promise<LevelListing[]> {
        return new Promise<LevelListing[]>((resolve, reject) => {
            DataService.BaseGet("LevelSearch/BestRatedLevels", resolve, reject);
        })
    }

    static GetUndiscoveredLevels(): Promise<LevelListing[]> {
        return new Promise<LevelListing[]>((resolve, reject) => {
            DataService.BaseGet("LevelSearch/UndiscoveredLevels", resolve, reject);
        })
    }

    static GetMostPlayedLevels(): Promise<LevelListing[]> {
        return new Promise<LevelListing[]>((resolve, reject) => {
            DataService.BaseGet("LevelSearch/MostPlayedLevels", resolve, reject);
        })
    }

    static GetEasiestLevels(): Promise<LevelListing[]> {
        return new Promise<LevelListing[]>((resolve, reject) => {
            DataService.BaseGet("LevelSearch/EasiestLevels", resolve, reject);
        })
    }

    static GetHardestLevels(): Promise<LevelListing[]> {
        return new Promise<LevelListing[]>((resolve, reject) => {
            DataService.BaseGet("LevelSearch/HardestLevels", resolve, reject);
        })
    }






    static UploadLevel(levelUpload: LevelUploadDT): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            DataService.BasePost("Levels/UploadLevel", levelUpload, resolve, reject);
        })
    }

    static PublishLevel(levelCode: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            DataService.BasePost(`Levels/PublishLevel?levelCode=${levelCode}`, {}, resolve, reject);
        })
    }

    static LikeLevel(levelCode: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            DataService.BasePost(`Levels/LikeLevel?levelCode=${levelCode}`, {}, resolve, reject);
        })
    }

    static DislikeLevel(levelCode: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            DataService.BasePost(`Levels/DislikeLevel?levelCode=${levelCode}`, {}, resolve, reject);
        })
    }

    static RemoveLevel(levelCode: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            DataService.BaseDelete(`Levels/RemoveLevel?levelCode=${levelCode}`, resolve, reject);
        })
    }

    static LogLevelPlayStarted(levelCode: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            DataService.BasePost("Levels/LogLevelPlayStarted", {levelCode: levelCode}, resolve, reject);
        })
    }

    static LogLevelPlayDone(progress: LevelProgressModel): Promise<LevelAwardsModel> {
        return new Promise<LevelAwardsModel>((resolve, reject) => {
            DataService.BasePost("Levels/LogLevelPlayDone", progress, resolve, reject);
        })
    }
        
    static UpdateNameAndAvatar(avatarCode: string, newName: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            DataService.BasePost("Users/UpdateNameAndAvatar?avatarCode=" + avatarCode + "&name=" + newName, {}, resolve, reject);
        })
    }
    
    static GetUserData(): Promise<UserDT> {
        return new Promise<UserDT>((resolve, reject) => {
            DataService.BaseGet("Users/GetUserData", resolve, reject);
        })
    }
}