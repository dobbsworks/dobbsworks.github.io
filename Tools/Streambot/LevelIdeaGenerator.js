var LevelGenerator = {
    styles: [
        {value: "SMB", weight: 1},
        {value: "SMB3", weight: 1},
        {value: "SMW", weight: 1},
        {value: "NSMB", weight: 1},
        {value: "3DW", weight: 1}
    ],
    themes: [
        {value: "Ground", weight: 1, allowed: "style", values:["SMB"]},
        {value: "Underground", weight: 1},
        {value: "Desert", weight: 1},
        {value: "Snow", weight: 1},
        {value: "Ghost House", weight: 1},
        {value: "Underwater", weight: 0.3},
        {value: "Castle", weight: 2},
        {value: "Sky", weight: 1},
        {value: "Forest", weight: 1},
        {value: "Airship", weight: 0.8}
    ],
    times: [
        {value: false, weight: 10},
        {value: true, weight: 1, blockedBy: "style", values:["3DW"]}
    ],
    terrains: [
        {value: "slopes", weight: 1},
        {value: "ice blocks", weight: 1},
        {value: "note blocks", weight: 1},
        {value: "donut blocks", weight: 1},
        {value: "clouds", weight: 1},
        {value: "pipes", weight: 1},
        {value: "mushroom platforms", weight: 1},
        {value: "clear pipes", weight: 1, allowed: "style", values:["3DW"]},
        {value: "spike blocks", weight: 1},
        {value: "turn blocks", weight: 1, allowed: "style", values:["SMW"]},
    ],
    powerups: [
        {value: "the master sword", weight: 1, allowed: "style", values:["SMB"]},
        {value: "the SMB2 mushroom", weight: 1, allowed: "style", values:["SMB"]},
        {value: "a super ball", weight: 1, allowed: "style", values:["SMB"]},
        {value: "a propeller mushroom", weight: 1, allowed: "style", values:["NSMB"]},
        {value: "an acorn", weight: 1, allowed: "style", values:["NSMB"]},
        {value: "a shoe", weight: 1, allowed: "style", values:["SMB","SMB3"]},
        {value: "a super bell", weight: 1, allowed: "style", values:["3DW"]},
        {value: "a super hammer", weight: 1, allowed: "style", values:["3DW"]},
        {value: "a boomerang", weight: 1, allowed: "style", values:["3DW"]},
        {value: "hats", weight: 1, allowed: "style", values:["3DW"]},
        {value: "a leaf", weight: 1, allowed: "style", values:["SMB3"]},
        {value: "a shellmet", weight: 1, blockedBy: "style", values:["3DW"]},
        {value: "a dry bones shell", weight: 1, blockedBy: "style", values:["3DW"]},
        {value: "stars", weight: 0.3},
        {value: "Yoshi", weight: 1, allowed: "style", values:["SMW","NSMB"]},
        {value: "a feather", weight: 1, allowed: "style", values:["SMW"]},
        {value: "a P-balloon", weight: 1, allowed: "style", values:["SMW"]},
    ],
    enemies: [
        {value: "the angry sun", weight: 1, allowed: "isNight", values:[false]},
        {value: "ant troopers", weight: 1, allowed: "style", values:["3DW"]},
        {value: "bloopers", weight: 1},
        {value: "bob-ombs", weight: 1},
        {value: "boos", weight: 1},
        {value: "bullies", weight: 1, allowed: "style", values:["3DW"]},
        {value: "buzzy beetles", weight: 1, blockedBy: "style", values:["3DW"]},
        {value: "chain chomps", weight: 1, blockedBy: "style", values:["3DW"]},
        {value: "cheep cheeps", weight: 1},
        {value: "dry bones", weight: 1},
        {value: "fire bros", weight: 1, allowed: "style", values:["3DW"]},
        {value: "fish bones", weight: 1},
        {value: "galoombas", weight: 1, allowed: "style", values:["3DW"]},
        {value: "goombas", weight: 1, blockedBy: "style", values:["3DW"]},
        {value: "hammer bros", weight: 1},
        {value: "koopa troopas", weight: 1},
        {value: "lakitu", weight: 1, blockedBy: "style", values:["3DW"]},
        {value: "lava bubbles", weight: 1},
        {value: "magikoopas", weight: 1},
        {value: "moles", weight: 1, blockedBy: "style", values:["3DW"]},
        {value: "munchers", weight: 1, blockedBy: "style", values:["3DW"]},
        {value: "piranha creepers", weight: 1, allowed: "style", values:["3DW"]},
        {value: "piranha plants", weight: 1},
        {value: "pokeys", weight: 1, blockedBy: "theme", values:["Snow"]},
        {value: "snow pokeys", weight: 1, allowed: "theme", values:["Snow"]},
        {value: "rocky wrenches", weight: 1, blockedBy: "style", values:["3DW"]},
        {value: "skipsqueaks", weight: 1, allowed: "style", values:["3DW"]},
        {value: "spikes (the enemy)", weight: 1},
        {value: "spike tops", weight: 1, blockedBy: "style", values:["3DW"]},
        {value: "spinies", weight: 1},
        {value: "thwomps", weight: 1},
        {value: "wigglers", weight: 1, blockedBy: "style", values:["3DW"]},
    ],
    gizmos: [
        {value: "! blocks", weight: 1, allowed: "style", values:["3DW"]},
        {value: "claws", weight: 1, blockedBy: "style", values:["3DW"]},
        {value: "clown cars", weight: 1, blockedBy: "style", values:["3DW"]},
        {value: "conveyors", weight: 1},
        {value: "blinking blocks", weight: 1, allowed: "style", values:["3DW"]},
        {value: "bumpers", weight: 1, blockedBy: "style", values:["3DW"]},
        {value: "burners", weight: 1, blockedBy: "style", values:["3DW"]},
        {value: "crates", weight: 1, allowed: "style", values:["3DW"]},
        {value: "fire bars", weight: 1, blockedBy: "style", values:["3DW"]},
        {value: "grinders", weight: 1, blockedBy: "style", values:["3DW"]},
        {value: "icicles", weight: 1},
        {value: "on-off switches", weight: 1},
        {value: "red POWs", weight: 1, allowed: "style", values:["3DW"]},
        {value: "skewers", weight: 1, blockedBy: "style", values:["3DW"]},
        {value: "skull platforms", weight: 1, blockedBy: "style", values:["3DW"]},
        {value: "snake blocks", weight: 1},
        {value: "trampolines", weight: 1},
        {value: "trees", weight: 1, allowed: "style", values:["3DW"]},
        {value: "twisters", weight: 1},
        {value: "vines", weight: 1, blockedBy: "style", values:["3DW"]},
        {value: "a cursed key", weight: 1, allowed: "style", values:["SMB"]},
    ],
    extras: [
        {value: "End it with a big boss fight. ", weight: 1},
        {value: "Make it a traditional level. ", weight: 1},
        {value: "Go all out on aesthetics. ", weight: 1},
        {value: "Do a vertical subworld. ", weight: 1},
        {value: "Add a hidden bonus game room. ", weight: 1},
        {value: "Give it multiple paths. ", weight: 1},
        {value: "Make the timer tight. ", weight: 1},
        {value: "Try out custom autoscroll. ", weight: 1},
        {value: "Try to make it simple enough for new players. ", weight: 1},
        {value: "Add in optional red coins for a true ending. ", weight: 1},
        {value: "Add in three optional big coins (like NSMB's star coins). ", weight: 1},
        {value: "Use rising/falling water/poison. ", weight: 1, allowed: "theme", values:["Forest"]},
        {value: "Use rising/falling lava. ", weight: 1, allowed: "theme", values:["Castle"]},
    ],
    levelIdeaText: [
        "Make a %text% course. ",
        "Try to build a %text% level. ",
        "Go with a %text% stage. ",
        "What about a %text% course? ",
        "Build a %text% stage. ",
    ],
    terrainText: [
        "Use lots of %text% for the structure. ",
        "The ground is mostly %text%. ",
        "Build it with plenty of %text%. ",
    ],
    powerupText: [
        "Let the player use %text%. ",
        "Give the player %text%. ",
        "Hide %text% in ? blocks. ",
        "Require heavy use of %text%. ",
        "Allow the player to grab %text% optionally. ",
        "Spit out %text% from a pipe. ",
    ],
    enemyText: [
        "Fight through %text%. ",
        "Face off against %text%. ",
        "For enemies, use %text%. ",
        "Use %text% as the primary obstacle. ",
    ],

    FilterListByRestrictions: (list, level) => {
        let selectableElements = [];
        for (let el of list) {
            if (!el.blockedBy && !el.allowed) selectableElements.push(el);
            if (el.blockedBy && el.allowed) {
                console.error("Can't use both blockedBy and allowed");
                continue;
            }
            if (el.blockedBy) {
                let currentValue = level[el.blockedBy];
                let elementAllowed = el.values.indexOf(currentValue) == -1;
                if (elementAllowed) selectableElements.push(el);
            } else if (el.allowed) {
                let currentValue = level[el.allowed];
                let elementAllowed = el.values.indexOf(currentValue) > -1;
                if (elementAllowed) selectableElements.push(el);
            }
        }
        return selectableElements;
    },
    GetRandomListValueByWeight: (list, level) => {
        // expects every element to have a value prop and weight prop
        for (let i=0; i<list.length; i++) if (typeof list[i] === "string") list[i] = {weight: 1, value: list[i]};
        let selectableElements = LevelGenerator.FilterListByRestrictions(list, level);
        
        let totalWeight = selectableElements.map(x=>x.weight).reduce((a,b)=>a+b,0);
        let randomWeight = Math.random() * totalWeight;
        let cumulativeWeight = 0;
        for (let el of selectableElements) {
            cumulativeWeight += el.weight;
            if (cumulativeWeight > randomWeight) {
                if (el.value !== undefined) return el.value;
                return el;
            } 
        }
        if (!selectableElements) return "WILDCARD"; // just in case
        if (!selectableElements[0]) return "WILDCARD"; // just in case
        return selectableElements[0].value; // just in case
    },
    RandomFromList: (list) => {
        let index = Math.floor(Math.random() * list.length);
        return list[index];
    },
    GenerateIdea: () => {
        var level = {};
        level.style = LevelGenerator.GetRandomListValueByWeight(LevelGenerator.styles, level);
        level.theme = LevelGenerator.GetRandomListValueByWeight(LevelGenerator.themes, level);
        level.isNight = LevelGenerator.GetRandomListValueByWeight(LevelGenerator.times, level);
    
        let levelBaseText = LevelGenerator.GetRandomListValueByWeight(LevelGenerator.levelIdeaText, level);
        let levelType = `${level.style} ${level.isNight ? "night " : ""}${level.theme.toLowerCase()}`;
        let levelIdea = levelBaseText.replace("%text%", levelType);
        
        if (Math.random() < 0.75) {
            let terrain = LevelGenerator.GetRandomListValueByWeight(LevelGenerator.terrains, level);
            levelIdea += LevelGenerator.RandomFromList(LevelGenerator.terrainText).replace("%text%", terrain);
        }
        if (Math.random() < 0.50) {
            let powerup = LevelGenerator.GetRandomListValueByWeight(LevelGenerator.powerups, level);
            levelIdea += LevelGenerator.RandomFromList(LevelGenerator.powerupText).replace("%text%", powerup);
        }
        
        if (Math.random() < 1.00) {
            let enemy1 = LevelGenerator.GetRandomListValueByWeight(LevelGenerator.enemies, level);
            let enemy2 = LevelGenerator.GetRandomListValueByWeight(LevelGenerator.enemies, level);
            let enemy = enemy1 === enemy2 ? enemy1 : enemy1 + " and " + enemy2;
            levelIdea += LevelGenerator.RandomFromList(LevelGenerator.enemyText).replace("%text%", enemy);
        }
        if (Math.random() < 0.3) {
            let gizmo = LevelGenerator.GetRandomListValueByWeight(LevelGenerator.gizmos, level);
            levelIdea += "Add " + gizmo + ". ";
        } else if (Math.random() < 0.2) {
            let extra = LevelGenerator.GetRandomListValueByWeight(LevelGenerator.extras, level);
            levelIdea += extra; 
        }
        
        return levelIdea;
    }

};
