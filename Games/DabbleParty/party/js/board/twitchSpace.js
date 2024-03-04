"use strict";
var TwitchSpaceAction = /** @class */ (function () {
    function TwitchSpaceAction(title, description, spams, processEvent) {
        this.title = title;
        this.description = description;
        this.spams = spams;
        this.processEvent = processEvent;
    }
    // static SmallCoin = new TwitchSpaceAction("Small Coin Present",
    //     "The player gains 4 to 6 coins", 
    //     ["Coin present ^_^", "be nice, give coins", "lil money"], (p: Player) => {
    //         let coinCount = Random.GetRandInt(4, 6);
    //         if (board) cutsceneService.AddScene(
    //             new BoardCutSceneAddCoins(coinCount, p)
    //         );
    //     });
    TwitchSpaceAction.BigCoin = new TwitchSpaceAction("Big Coin Present", "The player gains 12 to 16 coins", ["LOTTA COINS", "BIG MONEY", "They need MOAR COIN", "Dabbloons", "give em cash", "$$$$$", "Coin present ^_^", "be nice, give coins"], function (p) {
        var coinCount = Random.GetSeededRandInt(12, 16);
        if (board)
            cutsceneService.AddScene(new BoardCutSceneAddCoins(coinCount, p));
    });
    TwitchSpaceAction.LoseHalfCoin = new TwitchSpaceAction("Lose Half Your Coins", "The player loses half of their coins", ["TAKE THEIR COINS", "COINS FOR THE COIN THRONE >:D", "steal their coins hehe", "POOR!!", "half cash lol", "they dont deserve coin"], function (p) {
        var coinCount = -Math.ceil(p.coins / 2);
        if (board)
            cutsceneService.AddScene(new BoardCutSceneAddCoins(coinCount, p));
    });
    TwitchSpaceAction.DiceUpgrade = new TwitchSpaceAction("Dice Upgrade", "The player gets 2 dice upgrades", ["More dice?", "Better dice!", "speedy boi", "chungus dice", "d20 or bust", "I REQUIRE ACCELERATION", "GOTTA GO FAST", "NYOOM DICE"], function (p) {
        if (board)
            cutsceneService.AddScene(new BoardCutSceneChangeDice("up", p, 2));
    });
    TwitchSpaceAction.DiceDowngrade = new TwitchSpaceAction("Dice Downgrade", "The player gets 1 dice downgrade", ["Downgrade dice :)", "too fast, worse dice plz", "slow em down", "SNAIL DICE SNAIL DICE SNAIL DICE", "downgrade", "WE DOWNGRADE WE DANCE"], function (p) {
        if (board)
            cutsceneService.AddScene(new BoardCutSceneChangeDice("down", p, 1));
    });
    TwitchSpaceAction.GoldGearMove = new TwitchSpaceAction("Move Golden Gear", "The Golden Gear is moved to a new location", ["Move the gear", "gear shuffle NOW", "change gear space", "move gear?"], function (p) {
        if (board)
            cutsceneService.AddScene(new BoardCutSceneMoveGear(false));
    });
    return TwitchSpaceAction;
}());
var twitchSpaceLockInTime = 0;
function LockInTwitchSpaceWeights() {
    twitchSpaceLockInTime = +(new Date());
}
function InitializeTwitchSpaceUI() {
    var actions = Object.values(TwitchSpaceAction);
    var container = document.getElementById("twitchSpaceInput");
    for (var _i = 0, actions_1 = actions; _i < actions_1.length; _i++) {
        var action = actions_1[_i];
        var newRow = container.insertRow(-1);
        var titleCell = newRow.insertCell(0);
        titleCell.innerHTML = action.title;
        var inputCell = newRow.insertCell(1);
        var input = document.createElement("input");
        input.value = 1..toString();
        input.type = "number";
        inputCell.appendChild(input);
    }
}
function GetRandomUserName() {
    var prefixes = [
        "Dr", "Professor", "Captain", "Wow", "Crazed", "Stunning",
        "Plastic", "Wooden", "Iron", "Brushed", "Organic",
        "LovelyMiss", "Whimsy", "Perfect", "Basic", "Complex",
        "Cold", "Hot", "Dancing", "Forceful", "Sapphire", "Massive",
        "Mammoth"
    ];
    var nouns = [
        "Chicken", "Horse", "Piggle", "Yufo", "Wallop", "Snail", "Molsc",
        "Wooly", "Bristle", "Prickle", "Crab", "Bee", "Spurpider", "Jelly",
        "Shrubbert", "Snowtem", "Orbbit", "Kaizo"
    ];
    var suffixes = [
        "OfDoom", "WithSunglasses", "ByDay", "WithAHat", "OnFire",
        "Lover", "Hater", "Watcher",
    ];
    var nameType = Random.GetRandIntFrom1ToNum(7);
    var baseName = Random.SeededRandFrom(prefixes) + Random.SeededRandFrom(nouns);
    if (nameType == 1) {
        baseName += Random.SeededRandFrom(suffixes);
    }
    else if (nameType == 2) {
        baseName += Random.GetSeededRandInt(100, 9999).toString();
    }
    else if (nameType == 3) {
        baseName = Random.SeededRandFrom(nouns) + Random.SeededRandFrom(suffixes);
    }
    else if (nameType == 4 || nameType == 5) {
        baseName = Random.SeededRandFrom(prefixes) + "_" + Random.SeededRandFrom(nouns);
    }
    var styleType = Random.GetRandIntFrom1ToNum(3);
    if (styleType == 1) {
        baseName = baseName.toLowerCase();
    }
    baseName = baseName.substring(0, 25);
    return baseName;
}
