function CommandRoll(user, args) {
    let rawRollString = args.join('').replace(/\s/g, '').toLowerCase();
    let hasInvalidChars = rawRollString.replace(/[\d,d,+,-]/g, '').length > 0;

    if (rawRollString.indexOf("d") === -1) {
        return 'Include "d" to indicate number of face on each die. Example usages: "!roll d6" or "!roll d20+3" or "!roll 3d8-d6"'
    }

    if (hasInvalidChars) {
        return 'Invalid roll! Example usages: "!roll d6" or "!roll d20+3" or "!roll 3d8-d6"'
    } else {
        rawRollString = rawRollString.replace(/\+/g, ",+").replace(/-/g, ",-");
        if (!rawRollString.startsWith("-") && !rawRollString.startsWith("+")) rawRollString = "+" + rawRollString;
        let rollGroups = rawRollString.split(",");
        let total = 0;
        let breakdowns = [];
        let totalDice = 0;
        for (let rollGroup of rollGroups) {
            if (rollGroup.indexOf("d") === -1) {
                // constant num
                let num = +(rollGroup.slice(1, rollGroup.length));
                //breakdowns.push(num);
                total += rollGroup.startsWith("+") ? num : -num;
            } else {
                let numDice = +(rollGroup.slice(1, rollGroup.indexOf("d")));
                totalDice += numDice;
                if (totalDice > 20) return "That's too many dice...";
                if (rollGroup.indexOf("d") === 1) numDice = 1;
                let numFaces = +(rollGroup.slice(rollGroup.indexOf("d") + 1, rollGroup.length));
                let rolledNums = RollDice(numDice, numFaces);
                let sum = rolledNums.reduce((a, b) => a + b, 0);
                breakdowns.push(rolledNums);
                total += rollGroup.startsWith("+") ? sum : -sum;
            }
        }
        let ret = "You rolled a " + total + "!";
        if (totalDice > 1) ret += " " + breakdowns.map(x => "[" + x.toString() + "]").join(",");
        return ret;
    }
}
function RollDice(n, d) {
    let ret = [];
    for (let i = 0; i < n; i++) ret.push(Math.ceil(Math.random() * d));
    return ret;
}


function IronswornAllowed(user) {
    let allowedUsers = ["dobbsworks", "GameQueued", "DaeSnek", "LurkingTurtleGamer"].map(a => a.toLowerCase());
    let allowed = allowedUsers.indexOf(user.username.toLowerCase()) > -1;
    return allowed;
}
function CommandIronswornRoll(user, args) {
    if (IronswornAllowed(user)) {
        if (!ironSwornWindow) {
            ironSwornWindow = CreateIronswornWindow();
            setTimeout(() => {
                CommandIronswornRoll(user, args);
            }, 2000);
        }
        let val = parseInt(args.join(''));
        if (isNaN(val)) {
            return { success: false, message: "Usage: !ironroll value - example: !ironroll 3" };
        } else {
            if (val > 9) {
                return { success: false, message: "That value is too high!" };
            } else {
                ironSwornWindow.RequestRoll(user.username, val);
                return { success: true };
            }
        }
    } else {
        return { success: false };
    }
}
function CommandIronswornProgressRoll(user, args) {
    let val = parseInt(args.join(''));
    if (isNaN(val)) {
        return { success: false, message: "Usage: !ironprogress value - example: !ironprogress 9" };
    } else {
        if (val > 10) {
            return { success: false, message: "That value is too high!" };
        } else {
            ironSwornWindow.RequestProgressRoll(user.username, val);
            return { success: true };
        }
    }
}
function CommandIronswornReroll(user, args) {
    if (IronswornAllowed(user)) {
        if (!args || args.join('').length === 0) {
            return { success: false, message: "Include which dice to reroll with A B and C. Example: !ironReroll AB to reroll dice 1 & 2" };
        } else {
            ironSwornWindow.RequestReroll(user.username, args.join(''));
            return { success: true };
        }
    } else {
        return { success: false };
    }
}
function CommandIronswornMoves(user, args) {
    if (IronswornAllowed(user)) {
        if (!ironSwornWindow) {
            ironSwornWindow = CreateIronswornWindow();
            setTimeout(() => {
                CommandIronswornMoves(user, args);
            }, 2000);
        }

        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }

        let types = ironswornData.moves.map(a => a.type).filter(onlyUnique);
        if (args.join('').length === 0) {
            let ret = `Get categories with: !moves type - valid types: ${types.join(' ')}`;
            return { success: false, message: ret };
        }

        if (args[0]) {
            let matchingType = ironswornData.moves.filter(a => a.type.toLowerCase() == args[0].toLowerCase());
            if (matchingType.length > 0) {
                let moveNames = matchingType.map(a => a.name);
                let ret = `Moves of type "${args[0]}": ${moveNames.join(', ')}`;
                return { success: false, message: ret };
            }
        }

        let record = ironSwornWindow.FindCard(user.username, args.join(' '));
        if (record) {
            return { success: true, message: `Displaying info for ${record.name}` };
        }
        return { success: false, message: `No card found for "${args.join(' ')}"` };
    } else {
        return { success: false };
    }
}
function CommandIronswornAssets(user, args) {
    if (IronswornAllowed(user)) {
        if (!ironSwornWindow) {
            ironSwornWindow = CreateIronswornWindow();
            setTimeout(() => {
                CommandIronswornAssets(user, args);
            }, 2000);
        }
        ironSwornWindow.FindCard(user.username, args.join(' '));
        return { success: true };
    } else {
        return { success: false };
    }
}

function CommandIronswornOracle(user, args) {
    let specials = [
        {
            name: "Prompt",
            sources: ["Action", "Theme"],
            result: (vals) => vals[0] + " " + vals[1]
        },
        {
            name: "Settlement",
            sources: ["Prefix", "Suffix"],
            result: (vals) => vals[0] + vals[1]
        },
        {
            name: "Place",
            sources: ["Descriptor", "Location"],
            result: (vals) => vals[0] + " " + vals[1]
        },
        {
            name: "Character",
            sources: ["Names1", "Names2", "Personality", "Role", "Goal"],
            result: (vals) => (Math.random() > 0.5 ? vals[0] : vals[1]) + ", the " + vals[2] + " " + vals[3] + " wanting to " + vals[4]
        }
    ];

    let validOracleNames = ironswornData.oracles.map(a => a.name);
    let validSpecialNames = specials.map(a => a.name);
    let invalidRequestMessage = "Valid options: " + [...validOracleNames, ...validSpecialNames].join(", ");

    if (args.join('').trim().length === 0) {
        return { success: false, message: invalidRequestMessage };
    }

    function RollOracle(oracle) {
        let num = Math.ceil(Math.random() * 100);
        // find first row with val >= rolled number
        let matchingRow = oracle.values.find(a => a.i >= num)
        let val = matchingRow.val;
        return { num: num, val: val };
    }

    function RollSpecial(special) {
        let rolls = [];
        for (let source of special.sources) {
            let oracle = ironswornData.oracles.find(a => a.name == source);
            if (oracle) {
                rolls.push(RollOracle(oracle));
            }
        }

        let result = special.result(rolls.map(a => a.val));
        return { nums: rolls.map(a => a.num), val: result }
    }

    for (let arg of args.filter(a => a.length > 0)) {
        let matchingOracle = ironswornData.oracles.find(s => s.name.toLowerCase().startsWith(arg.toLowerCase()));
        if (matchingOracle) {
            let result = RollOracle(matchingOracle);
            return { success: true, message: `[${result.num}] ${matchingOracle.name}: ${result.val}` };
        }
        let matchingSpecial = specials.find(s => s.name.toLowerCase().startsWith(arg.toLowerCase()));
        if (matchingSpecial) {
            let result = RollSpecial(matchingSpecial);
            return { success: true, message: `[${result.nums.join(',')}] ${matchingSpecial.name}: ${result.val}` };
        }
    }
    return { success: false, message: invalidRequestMessage };
}