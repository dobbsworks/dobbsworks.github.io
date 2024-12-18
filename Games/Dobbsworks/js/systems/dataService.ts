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
                try {
                    response.text().then(res => {
                        try {
                            let message = JSON.parse(res).message;
                            if (message) UIDialog.Alert(message, "OK");
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
            resolve(new MyLevelsModel([], 0));
            //DataService.BaseGet("Levels/MyLevels", resolve, reject);
        })
    }


    static GetRecentLevels(pageIndex: number): Promise<LevelBrowseResults> {
        return new Promise<LevelBrowseResults>((resolve, reject) => {
            resolve(getLevelsFromDB(pageIndex, (level: LevelDT) => +level.timestamp));
            //DataService.BaseGet("LevelSearch/RecentLevels?pageIndex=" + pageIndex, resolve, reject);
        })
    }

    static GetOldestLevels(pageIndex: number): Promise<LevelBrowseResults> {
        return new Promise<LevelBrowseResults>((resolve, reject) => {
            resolve(getLevelsFromDB(pageIndex, (level: LevelDT) => -+level.timestamp));
            //DataService.BaseGet("LevelSearch/OldestLevels?pageIndex=" + pageIndex, resolve, reject);
        })
    }

    static GetMostLikedLevels(pageIndex: number): Promise<LevelBrowseResults> {
        return new Promise<LevelBrowseResults>((resolve, reject) => {
            resolve(getLevelsFromDB(pageIndex, (level: LevelDT) => level.numberOfLikes));
            //DataService.BaseGet("LevelSearch/MostLikedLevels?pageIndex=" + pageIndex, resolve, reject);
        })
    }

    static GetBestRatedLevels(pageIndex: number): Promise<LevelBrowseResults> {
        return new Promise<LevelBrowseResults>((resolve, reject) => {
            resolve(getLevelsFromDB(pageIndex, (level: LevelDT) => level.numberOfLikes / level.numberOfUniquePlayers));
            //DataService.BaseGet("LevelSearch/BestRatedLevels?pageIndex=" + pageIndex, resolve, reject);
        })
    }

    static GetUndiscoveredLevels(pageIndex: number): Promise<LevelBrowseResults> {
        return new Promise<LevelBrowseResults>((resolve, reject) => {
            resolve(getLevelsFromDB(pageIndex, (level: LevelDT) => -level.numberOfUniquePlayers));
            //DataService.BaseGet("LevelSearch/UndiscoveredLevels?pageIndex=" + pageIndex, resolve, reject);
        })
    }

    static GetMostPlayedLevels(pageIndex: number): Promise<LevelBrowseResults> {
        return new Promise<LevelBrowseResults>((resolve, reject) => {
            resolve(getLevelsFromDB(pageIndex, (level: LevelDT) => level.numberOfUniquePlayers));
            //DataService.BaseGet("LevelSearch/MostPlayedLevels?pageIndex=" + pageIndex, resolve, reject);
        })
    }

    static GetEasiestLevels(pageIndex: number): Promise<LevelBrowseResults> {
        return new Promise<LevelBrowseResults>((resolve, reject) => {
            resolve(getLevelsFromDB(pageIndex, (level: LevelDT) => level.numberOfClears / level.numberOfAttempts));
            //DataService.BaseGet("LevelSearch/EasiestLevels?pageIndex=" + pageIndex, resolve, reject);
        })
    }

    static GetHardestLevels(pageIndex: number): Promise<LevelBrowseResults> {
        return new Promise<LevelBrowseResults>((resolve, reject) => {
            resolve(getLevelsFromDB(pageIndex, (level: LevelDT) => -level.numberOfClears / level.numberOfAttempts));
            //DataService.BaseGet("LevelSearch/HardestLevels?pageIndex=" + pageIndex, resolve, reject);
        })
    }






    static UploadLevel(levelUpload: LevelUploadDT): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            reject("Level uploading is currently unavailable through the browser, levels can be manually submitted via Discord");
            //DataService.BasePost("Levels/UploadLevel", levelUpload, resolve, reject);
        })
    }

    // static UploadLevelAuditLog(levelData: string): Promise<string> {
    //     return new Promise<string>((resolve, reject) => {
    //         let level = new LevelUploadDT ("x",levelData,"x")
    //         DataService.BasePost("Levels/UploadLevelAuditLog", level, resolve, reject);
    //     })
    // }

    static PublishLevel(levelCode: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            reject("Level publishing is currently unavailable through the browser, levels can be manually submitted via Discord");
            //DataService.BasePost(`Levels/PublishLevel?levelCode=${levelCode}`, {}, resolve, reject);
        })
    }

    static LikeLevel(levelCode: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            reject("Level rating is currently unavailable");
            //DataService.BasePost(`Levels/LikeLevel?levelCode=${levelCode}`, {}, resolve, reject);
        })
    }

    static DislikeLevel(levelCode: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            reject("Level rating is currently unavailable");
            //DataService.BasePost(`Levels/DislikeLevel?levelCode=${levelCode}`, {}, resolve, reject);
        })
    }

    static RemoveLevel(levelCode: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            reject("Level management is currently unavailable through the browser");
            //DataService.BaseDelete(`Levels/RemoveLevel?levelCode=${levelCode}`, resolve, reject);
        })
    }

    static LogLevelPlayStarted(levelCode: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            reject();
            //DataService.BasePost("Levels/LogLevelPlayStarted", { levelCode: levelCode }, resolve, reject);
        })
    }

    static LogLevelPlayDone(progress: LevelProgressModel): Promise<LevelAwardsModel> {
        return new Promise<LevelAwardsModel>((resolve, reject) => {
            reject();
            //DataService.BasePost("Levels/LogLevelPlayDone", progress, resolve, reject);
        })
    }

    static UpdateNameAndAvatar(avatarCode: string, newName: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            reject("User profile management is currently unavailable through the browser");
            //DataService.BasePost("Users/UpdateNameAndAvatar?avatarCode=" + avatarCode + "&name=" + newName, {}, resolve, reject);
        })
    }
    
    static GetUserData(): Promise<UserDT> {
        return new Promise<UserDT>((resolve, reject) => {
            resolve(new UserDT(-1, "offline", "", ""));
            //DataService.BaseGet("Users/GetUserData", resolve, reject);
        })
    }

    static LogMarathonRun(difficulty: number, levelsCleared: number, finalFrameCount: number, winnings: number): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            reject("3-Ring runs are currently not being logged");
            // DataService.BasePost("Marathon/LogRun?difficulty=" + difficulty +
            //     "&levelsCleared=" + levelsCleared + "&finalFrameCount=" + finalFrameCount +
            //     "&winnings=" + winnings, {}, resolve, reject);
        })
    }

    static CheckFor3RingUnlock(difficulty: number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            reject()
            //DataService.BasePost("Marathon/Log3RingRun?difficulty=" + difficulty, {}, resolve, reject);
        })
    }

    static GetUserCurrency(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            reject();
            //DataService.BaseGet("Currency/GetCurrency", resolve, reject);
        })
    }

    static RollForUnlock(cost: number): Promise<AvatarUnlockResultDt> {
        return new Promise<AvatarUnlockResultDt>((resolve, reject) => {
            reject();
            //DataService.BasePost("Carnival/RollForUnlock?cost=" + cost, {}, resolve, reject);
        })
    }

    static GetUserStatsByUserId(userId: number): Promise<UserWithStatsDT> {
        return new Promise<UserWithStatsDT>((resolve, reject) => {
            reject();
            //DataService.BaseGet("Users/GetUserStatsByUserId?userId=" + userId, resolve, reject);
        })
    }



    static GetCurrentContest(): Promise<ContestDT> {
        return new Promise<ContestDT>((resolve, reject) => {
            reject();
            //DataService.BaseGet("Contest/GetCurrentContest", resolve, reject);
        })
    }

    static SubmitContestLevel(levelCode: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            reject();
            //DataService.BasePost(`Contest/SubmitContestLevel?levelCode=${levelCode}`, {}, resolve, reject);
        })
    }
    static UnsubmitContestLevel(levelCode: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            reject();
            //DataService.BasePost(`Contest/UnsubmitContestLevel?levelCode=${levelCode}`, {}, resolve, reject);
        })
    }
    static GetContestLevels(pageIndex: number): Promise<LevelBrowseResults> {
        return new Promise<LevelBrowseResults>((resolve, reject) => {
            reject();
            //DataService.BaseGet("LevelSearch/ContestLevels?pageIndex=" + pageIndex, resolve, reject);
        })
    }
    static SubmitContestVote(levelCode: string, vote: number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            reject();
            //DataService.BasePost(`Contest/SubmitContestVote?levelCode=${levelCode}&vote=${vote}`, {}, resolve, reject);
        })
    }


    static MarkLevelAsGlitch(levelCode: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            reject();
            //DataService.BasePost(`Moderation/MarkLevelAsGlitch?levelCode=${levelCode}`, {}, resolve, reject);
        })
    }
    static MarkLevelAsNotGlitch(levelCode: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            reject();
            //DataService.BasePost(`Moderation/MarkLevelAsNotGlitch?levelCode=${levelCode}`, {}, resolve, reject);
        })
    }
}